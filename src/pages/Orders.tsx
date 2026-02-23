import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Order } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MapPin, Calendar, Clock } from 'lucide-react';

const statusStyles: Record<Order['status'], string> = {
  'Agendado': 'badge-info',
  'Em Progresso': 'badge-warning',
  'Comprado': 'badge-success',
  'Cancelado': 'badge-danger',
};

const Orders = () => {
  const { orders, products, affiliates, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAffiliate, setFilterAffiliate] = useState('all');

  let filtered = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase()) ||
    products.find(p => p.id === o.productId)?.name.toLowerCase().includes(search.toLowerCase())
  );
  if (filterStatus !== 'all') filtered = filtered.filter(o => o.status === filterStatus);
  if (filterAffiliate !== 'all') filtered = filtered.filter(o => o.affiliateId === filterAffiliate);

  const getProduct = (id: string) => products.find(p => p.id === id);
  const getAffiliate = (id?: string) => id ? affiliates.find(a => a.id === id) : null;

  const allStatuses: Order['status'][] = ['Agendado', 'Em Progresso', 'Comprado', 'Cancelado'];

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
            {allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAffiliate} onValueChange={setFilterAffiliate}>
          <SelectTrigger className="w-[170px] bg-secondary"><SelectValue placeholder="Afiliado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Afiliados</SelectItem>
            {affiliates.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden lg:table-cell">Agendamento</TableHead>
              <TableHead className="hidden md:table-cell">Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Afiliado</TableHead>
              <TableHead>Alterar Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(o => {
              const prod = getProduct(o.productId);
              const aff = getAffiliate(o.affiliateId);
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{prod?.name || o.productId}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
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
                  <TableCell><span className={statusStyles[o.status]}>{o.status}</span></TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{aff?.name || '—'}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as Order['status'])}>
                      <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
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
