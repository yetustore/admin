import { Category, Product, Order, Affiliate, Commission, AdminUser } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Eletrônicos', description: 'Dispositivos eletrônicos e gadgets', createdAt: '2024-01-15' },
  { id: 'cat-2', name: 'Vestuário', description: 'Roupas e acessórios de moda', createdAt: '2024-01-15' },
  { id: 'cat-3', name: 'Casa & Decoração', description: 'Produtos para casa e decoração', createdAt: '2024-02-01' },
  { id: 'cat-4', name: 'Alimentação', description: 'Produtos alimentícios e bebidas', createdAt: '2024-02-10' },
  { id: 'cat-5', name: 'Saúde & Beleza', description: 'Produtos de saúde e beleza', createdAt: '2024-03-01' },
];

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'Smartphone Galaxy A54', description: 'Smartphone Samsung Galaxy A54 com câmera de 50MP', price: 185000, currency: 'AOA', categories: ['cat-1'], imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', rating: 4.5, stock: 25, createdAt: '2024-03-01', updatedAt: '2024-03-01' },
  { id: 'prod-2', name: 'Laptop HP Pavilion', description: 'Laptop HP Pavilion 15 polegadas, 8GB RAM', price: 420000, currency: 'AOA', categories: ['cat-1'], imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', rating: 4.2, stock: 12, createdAt: '2024-03-05', updatedAt: '2024-03-05' },
  { id: 'prod-3', name: 'Camiseta Premium', description: 'Camiseta algodão egípcio, corte slim', price: 8500, currency: 'AOA', categories: ['cat-2'], imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', rating: 4.0, stock: 50, createdAt: '2024-03-10', updatedAt: '2024-03-10' },
  { id: 'prod-4', name: 'Sofá Modular 3 Lugares', description: 'Sofá modular tecido premium cinza', price: 350000, currency: 'AOA', categories: ['cat-3'], imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', rating: 4.8, stock: 5, createdAt: '2024-03-12', updatedAt: '2024-03-12' },
  { id: 'prod-5', name: 'Kit Skincare Completo', description: 'Kit com 5 produtos para cuidados com a pele', price: 25000, currency: 'AOA', categories: ['cat-5', 'cat-2'], imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', rating: 4.6, stock: 0, createdAt: '2024-03-15', updatedAt: '2024-03-15' },
  { id: 'prod-6', name: 'Cesta Gourmet', description: 'Cesta com produtos gourmet selecionados', price: 45000, currency: 'AOA', categories: ['cat-4'], imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400', rating: 4.3, stock: 18, createdAt: '2024-03-18', updatedAt: '2024-03-18' },
];

export const mockAffiliates: Affiliate[] = [
  { id: 'aff-1', name: 'João Silva', totalOrders: 15, completedOrders: 10, accumulatedCommission: 75000, paidCommission: 50000 },
  { id: 'aff-2', name: 'Maria Santos', totalOrders: 22, completedOrders: 18, accumulatedCommission: 120000, paidCommission: 90000 },
  { id: 'aff-3', name: 'Pedro Costa', totalOrders: 8, completedOrders: 5, accumulatedCommission: 35000, paidCommission: 20000 },
];

export const mockOrders: Order[] = [
  { id: 'ord-1', productId: 'prod-1', customerName: 'Ana Fernandes', address: 'Rua da Maianga, 45, Luanda', latitude: -8.838, longitude: 13.234, scheduledDate: '2024-04-01', scheduledTime: '10:00', status: 'Comprado', affiliateId: 'aff-1', createdAt: '2024-03-28' },
  { id: 'ord-2', productId: 'prod-2', customerName: 'Carlos Mendes', address: 'Av. 21 de Janeiro, Luanda', latitude: -8.815, longitude: 13.230, scheduledDate: '2024-04-02', scheduledTime: '14:30', status: 'Em Progresso', affiliateId: 'aff-2', createdAt: '2024-03-29' },
  { id: 'ord-3', productId: 'prod-3', customerName: 'Luísa Oliveira', address: 'Bairro Azul, Benguela', latitude: -12.578, longitude: 13.405, scheduledDate: '2024-04-03', scheduledTime: '09:00', status: 'Agendado', createdAt: '2024-03-30' },
  { id: 'ord-4', productId: 'prod-4', customerName: 'Miguel Sousa', address: 'Rua do Comércio, Huambo', latitude: -12.776, longitude: 15.739, scheduledDate: '2024-04-04', scheduledTime: '11:00', status: 'Agendado', affiliateId: 'aff-1', createdAt: '2024-03-31' },
  { id: 'ord-5', productId: 'prod-6', customerName: 'Teresa Dias', address: 'Av. Norton de Matos, Luanda', latitude: -8.830, longitude: 13.245, scheduledDate: '2024-04-05', scheduledTime: '16:00', status: 'Cancelado', affiliateId: 'aff-3', createdAt: '2024-04-01' },
  { id: 'ord-6', productId: 'prod-1', customerName: 'Roberto Alves', address: 'Rua Major Kanhangulo, Luanda', latitude: -8.840, longitude: 13.232, scheduledDate: '2024-04-06', scheduledTime: '10:30', status: 'Comprado', affiliateId: 'aff-2', createdAt: '2024-04-02' },
];

export const mockCommissions: Commission[] = [
  { id: 'com-1', orderId: 'ord-1', affiliateId: 'aff-1', amount: 9250, status: 'Paga' },
  { id: 'com-2', orderId: 'ord-2', affiliateId: 'aff-2', amount: 21000, status: 'Pendente' },
  { id: 'com-3', orderId: 'ord-4', affiliateId: 'aff-1', amount: 17500, status: 'Pendente' },
  { id: 'com-4', orderId: 'ord-5', affiliateId: 'aff-3', amount: 2250, status: 'Pendente' },
  { id: 'com-5', orderId: 'ord-6', affiliateId: 'aff-2', amount: 9250, status: 'Validada' },
];

export const mockAdmins: AdminUser[] = [
  { id: 'adm-1', username: 'admin', name: 'Administrador Principal', email: 'admin@yetustore.ao', role: 'Super Admin', active: true, createdAt: '2024-01-01' },
  { id: 'adm-2', username: 'gestor1', name: 'Maria Santos', email: 'maria@yetustore.ao', role: 'Admin', active: true, createdAt: '2024-02-15' },
  { id: 'adm-3', username: 'mod1', name: 'Pedro Costa', email: 'pedro@yetustore.ao', role: 'Moderador', active: false, createdAt: '2024-03-10' },
];
