import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { Order } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, MapPin, Package, Phone, User } from 'lucide-react';

const statusStyles: Record<Order['status'], string> = {
  agendado: 'badge-info',
  em_progresso: 'badge-warning',
  comprado: 'badge-success',
  cancelado: 'badge-danger',
};

const statusLabel: Record<Order['status'], string> = {
  agendado: 'Agendado',
  em_progresso: 'Em Progresso',
  comprado: 'Comprado',
  cancelado: 'Cancelado',
};

const formatPrice = (v?: number) => {
  if (typeof v !== 'number') return '-';
  return new Intl.NumberFormat('pt-AO').format(v) + ' AOA';
};

const formatOrderNumber = (id: string) => `#${id.slice(-4)}`;

const buildMapSrc = (order: Order) => {
  if (order.latitude != null && order.longitude != null) {
    return `https://www.google.com/maps?q=${order.latitude},${order.longitude}&z=16&output=embed`;
  }
  const address = encodeURIComponent(order.address || '');
  return `https://www.google.com/maps?q=${address}&z=16&output=embed`;
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useStore();

  const order = React.useMemo(() => orders.find(o => o.id === id) || null, [orders, id]);

  if (!order) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="glass-card p-8 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Pedido nao encontrado.</p>
        </div>
      </div>
    );
  }

  const allStatuses: Order['status'][] = ['agendado', 'em_progresso', 'comprado', 'cancelado'];
  const mapSrc = buildMapSrc(order);
  const productImage = order.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
  const productName = order.product?.name || order.productId;
  const productPrice = order.product?.price;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedido</h1>
          <p className="text-sm text-muted-foreground">Numero do pedido: {formatOrderNumber(order.id)}</p>
        </div>
        <span className={statusStyles[order.status]}>{statusLabel[order.status]}</span>
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={productImage} alt={productName} className="h-20 w-20 rounded-lg object-cover" />
            <div>
              <p className="text-xs text-muted-foreground">Produto</p>
              <p className="font-semibold">{productName}</p>
              <p className="text-sm text-muted-foreground">Preço: {formatPrice(productPrice)}</p>
            </div>
          </div>
          <div className="min-w-[200px]">
            <p className="text-xs text-muted-foreground mb-1">Alterar Status</p>
            <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v as Order['status'])}>
              <SelectTrigger className="w-full h-9 text-sm bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allStatuses.map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-5 space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Informações do Cliente</h2>
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="text-sm">{order.customerName || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm">{order.customerPhone || '-'}</p>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-muted-foreground pt-2">Agendamento</h2>
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Data</p>
              <p className="text-sm">{order.scheduledDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Hora</p>
              <p className="text-sm">{order.scheduledTime}</p>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-muted-foreground pt-2">Endereço</h2>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Local do agendamento</p>
              <p className="text-sm">{order.address}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Mapa</h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Mapa do agendamento"
              src={mapSrc}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
