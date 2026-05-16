export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type ProductMedia = {
  type: 'image' | 'video';
  url: string;
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  categories: string[];
  imageUrl: string;
  media?: ProductMedia[];
  rating: number;
  stock: number;
  affiliatePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: Product;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'agendado' | 'em_progresso' | 'comprado' | 'cancelado';
  affiliateId?: string;
  affiliateCode?: string;
  affiliateName?: string;
  createdAt: string;
  product?: Product;
  items: OrderItem[];
  totalAmount: number;
}

export interface AffiliateOrderSummary {
  id: string;
  status: 'agendado' | 'em_progresso' | 'comprado' | 'cancelado';
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  userId: string;
  productId: string;
  code: string;
  url: string;
  clicks: number;
  ordersCount: number;
  createdAt: string;
  affiliateName?: string;
  product?: Product;
  orders?: AffiliateOrderSummary[];
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


export interface AffiliatePayout {
  id: string;
  userId: string;
  amount: number;
  status: 'requested' | 'paid' | 'denied';
  createdAt: string;
  affiliateName?: string;
  bankName?: string;
  iban?: string;
  accountName?: string;
  phone?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Admin' | 'Entregador';
  active: boolean;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  provider: 'local' | 'google';
  emailVerified: boolean;
  phoneVerified: boolean;
  bankAccountName: string;
  bankName: string;
  bankIban: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformUserWalletOrder {
  orderId: string;
  totalAmount: number;
  commission: number;
  status: 'agendado' | 'em_progresso' | 'comprado' | 'cancelado';
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
}

export interface PlatformUserWalletPayout {
  id: string;
  amount: number;
  status: 'requested' | 'paid' | 'denied';
  createdAt: string;
}

export interface PlatformUserWallet {
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawals: number;
  available: number;
  minWithdraw: number;
  maxWithdraw: number;
  bank: {
    accountName: string;
    bankName: string;
    iban: string;
  };
  payouts: PlatformUserWalletPayout[];
  earningsByOrder: PlatformUserWalletOrder[];
}
