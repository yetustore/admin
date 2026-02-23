import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Category, Product, Order, Affiliate, Commission, AdminUser } from '@/types';
import { mockCategories, mockProducts, mockOrders, mockAffiliates, mockCommissions, mockAdmins } from '@/data/mock';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  orders: Order[];
  affiliates: Affiliate[];
  commissions: Commission[];
  admins: AdminUser[];
  addCategory: (cat: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => boolean;
  addProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateCommissionStatus: (id: string, status: Commission['status']) => void;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateAdmin: (id: string, data: Partial<AdminUser>) => void;
  deleteAdmin: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

let nextId = 100;
const genId = (prefix: string) => `${prefix}-${nextId++}`;

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates);
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);

  const addCategory = useCallback((cat: Omit<Category, 'id' | 'createdAt'>) => {
    setCategories(prev => [...prev, { ...cat, id: genId('cat'), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const deleteCategory = useCallback((id: string): boolean => {
    const hasProducts = products.some(p => p.categories.includes(id));
    if (hasProducts) return false;
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  }, [products]);

  const addProduct = useCallback((prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    setProducts(prev => [...prev, { ...prod, id: genId('prod'), createdAt: now, updatedAt: now }]);
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updated = { ...o, status };
      // Auto-validate commission when order is "Comprado"
      if (status === 'Comprado' && o.affiliateId) {
        setCommissions(cs => cs.map(c => c.orderId === id ? { ...c, status: 'Validada' as const } : c));
        setAffiliates(affs => affs.map(a => {
          if (a.id !== o.affiliateId) return a;
          return { ...a, completedOrders: a.completedOrders + 1 };
        }));
      }
      return updated;
    }));
  }, []);

  const updateCommissionStatus = useCallback((id: string, status: Commission['status']) => {
    setCommissions(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, status } : c);
      if (status === 'Paga') {
        const commission = prev.find(c => c.id === id);
        if (commission) {
          setAffiliates(affs => affs.map(a => {
            if (a.id !== commission.affiliateId) return a;
            return { ...a, paidCommission: a.paidCommission + commission.amount };
          }));
        }
      }
      return updated;
    });
  }, []);

  const addAdmin = useCallback((admin: Omit<AdminUser, 'id' | 'createdAt'>) => {
    setAdmins(prev => [...prev, { ...admin, id: genId('adm'), createdAt: new Date().toISOString().split('T')[0] }]);
  }, []);

  const updateAdmin = useCallback((id: string, data: Partial<AdminUser>) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);

  const deleteAdmin = useCallback((id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <StoreContext.Provider value={{
      categories, products, orders, affiliates, commissions, admins,
      addCategory, updateCategory, deleteCategory,
      addProduct, updateProduct, deleteProduct,
      updateOrderStatus, updateCommissionStatus,
      addAdmin, updateAdmin, deleteAdmin,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
