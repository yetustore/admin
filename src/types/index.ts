export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  imageUrl: string;
  rating: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  customerName: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Agendado' | 'Em Progresso' | 'Comprado' | 'Cancelado';
  affiliateId?: string;
  createdAt: string;
}

export interface Affiliate {
  id: string;
  name: string;
  totalOrders: number;
  completedOrders: number;
  accumulatedCommission: number;
  paidCommission: number;
}

export interface Commission {
  id: string;
  orderId: string;
  affiliateId: string;
  amount: number;
  status: 'Pendente' | 'Validada' | 'Paga';
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Moderador';
  active: boolean;
  createdAt: string;
}
