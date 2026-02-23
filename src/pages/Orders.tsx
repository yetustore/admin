import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Order } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';

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

const Orders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  let filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    (o.customerPhone || '').includes(search.toLowerCase()) ||
    o.product?.name?.toLowerCase().includes(search.toLowerCase())
  );
  if (filterStatus !== 'all') filtered = filtered.filter(o => o.status === filterStatus);

  const allStatuses: Order['status'][] = ['agendado', 'em_progresso', 'comprado', 'cancelado'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">{orders.length} pedidos registrados</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por cliente ou produto..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[170px] bg-secondary"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            {allStatuses.map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">Agendamento</TableHead>
              <TableHead className="hidden md:table-cell">Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Alterar Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(o => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.product?.name || o.productId}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{o.customerPhone || '-'}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-3.5 h-3.5" />{o.scheduledDate}
                    <Clock className="w-3.5 h-3.5 ml-2" />{o.scheduledTime}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[200px]">{o.address}</span>
                  </div>
                </TableCell>
                <TableCell><span className={statusStyles[o.status]}>{statusLabel[o.status]}</span></TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as Order['status'])}>
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allStatuses.map(s => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nenhum pedido encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
