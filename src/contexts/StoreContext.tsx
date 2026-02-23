import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Category, Product, Order, Affiliate, Commission, AdminUser } from '@/types';
import {
  getCategories,
  getProducts,
  getAdminOrders,
  updateAdminOrderStatus,
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  getAdmins,
  createAdmin as apiCreateAdmin,
  updateAdmin as apiUpdateAdmin,
  deleteAdmin as apiDeleteAdmin,
} from '@/lib/api';
import { onSocket } from '@/lib/socket';

interface StoreContextType {
  categories: Category[];
  products: Product[];
  orders: Order[];
  affiliates: Affiliate[];
  commissions: Commission[];
  admins: AdminUser[];
  addCategory: (cat: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, cat: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<boolean>;
  addProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, prod: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateCommissionStatus: (id: string, status: Commission['status']) => void;
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  updateAdmin: (id: string, data: Partial<AdminUser> & { password?: string }) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const loadAll = async () => {
    const [cats, prods, ords, adminList] = await Promise.all([
      getCategories(),
      getProducts(),
      getAdminOrders(),
      getAdmins(),
    ]);
    setCategories(cats);
    setProducts(prods);
    setOrders(ords);
    setAdmins(adminList);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadAll();
      } catch (err) {
        console.error('Failed to load catalog', err);
      }
    };
    init();

    const offCats = onSocket('categories.updated', () => loadAll());
    const offProds = onSocket('products.updated', () => loadAll());
    const offOrders = onSocket('orders.updated', () => loadAll());
    return () => {
      offCats();
      offProds();
      offOrders();
    };
  }, []);

  const addCategory = useCallback(async (cat: Omit<Category, 'id' | 'createdAt'>) => {
    const created = await apiCreateCategory(cat);
    setCategories(prev => [created, ...prev]);
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    const updated = await apiUpdateCategory(id, data);
    setCategories(prev => prev.map(c => c.id === id ? updated : c));
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    const hasProducts = products.some(p => p.categories.includes(id));
    if (hasProducts) return false;
    await apiDeleteCategory(id);
    setCategories(prev => prev.filter(c => c.id !== id));
    return true;
  }, [products]);

  const addProduct = useCallback(async (prod: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = await apiCreateProduct(prod);
    setProducts(prev => [created, ...prev]);
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const updated = await apiUpdateProduct(id, data);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await apiDeleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: Order['status']) => {
    const updated = await updateAdminOrderStatus(id, status);
    setOrders(prev => prev.map(o => o.id === id ? updated : o));
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

  const addAdmin = useCallback(async (admin: Omit<AdminUser, 'id' | 'createdAt'> & { password: string }) => {
    const created = await apiCreateAdmin(admin);
    setAdmins(prev => [created, ...prev]);
  }, []);

  const updateAdmin = useCallback(async (id: string, data: Partial<AdminUser> & { password?: string }) => {
    const updated = await apiUpdateAdmin(id, data);
    setAdmins(prev => prev.map(a => a.id === id ? updated : a));
  }, []);

  const deleteAdmin = useCallback(async (id: string) => {
    await apiDeleteAdmin(id);
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
