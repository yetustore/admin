import React from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DollarSign, ShoppingCart, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Affiliates = () => {
  const { affiliates, commissions, orders, products, updateCommissionStatus } = useStore();

  const formatAOA = (v: number) => new Intl.NumberFormat('pt-AO').format(v) + ' AOA';

  const getAffiliateCommissions = (affId: string) => commissions.filter(c => c.affiliateId === affId);

  const handlePayCommission = (commissionId: string) => {
    updateCommissionStatus(commissionId, 'Paga');
    toast.success('Comissão marcada como paga');
  };

  const statusClass: Record<string, string> = {
    'Pendente': 'badge-warning',
    'Validada': 'badge-info',
    'Paga': 'badge-success',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Afiliados & Comissões</h1>
        <p className="text-sm text-muted-foreground">{affiliates.length} afiliados ativos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {affiliates.map(aff => {
          const affCommissions = getAffiliateCommissions(aff.id);
          const pending = affCommissions.filter(c => c.status !== 'Paga').reduce((s, c) => s + c.amount, 0);
          return (
            <div key={aff.id} className="glass-card p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{aff.name}</h3>
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShoppingCart className="w-3.5 h-3.5" />Total Pedidos</div>
                  <p className="text-xl font-bold mt-1">{aff.totalOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle className="w-3.5 h-3.5" />Concluídos</div>
                  <p className="text-xl font-bold mt-1">{aff.completedOrders}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="w-3.5 h-3.5" />Acumulado</div>
                  <p className="text-sm font-bold mt-1">{formatAOA(aff.accumulatedCommission)}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="w-3.5 h-3.5" />Pago</div>
                  <p className="text-sm font-bold mt-1 text-primary">{formatAOA(aff.paidCommission)}</p>
                </div>
              </div>

              {affCommissions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2">Comissões</h4>
                  <div className="space-y-2">
                    {affCommissions.map(c => {
                      const order = orders.find(o => o.id === c.orderId);
                      const prod = order ? products.find(p => p.id === order.productId) : null;
                      return (
                        <div key={c.id} className="flex items-center justify-between p-2 rounded bg-background/50 text-sm">
                          <div>
                            <span className="text-foreground">{prod?.name || c.orderId}</span>
                            <span className="ml-2 text-muted-foreground">{formatAOA(c.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={statusClass[c.status]}>{c.status}</span>
                            {c.status === 'Validada' && (
                              <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => handlePayCommission(c.id)}>
                                Pagar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Todas as Comissões</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Afiliado</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map(c => {
              const aff = affiliates.find(a => a.id === c.affiliateId);
              const order = orders.find(o => o.id === c.orderId);
              const prod = order ? products.find(p => p.id === order.productId) : null;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{aff?.name}</TableCell>
                  <TableCell className="text-muted-foreground">{prod?.name || c.orderId}</TableCell>
                  <TableCell>{formatAOA(c.amount)}</TableCell>
                  <TableCell><span className={statusClass[c.status]}>{c.status}</span></TableCell>
                  <TableCell className="text-right">
                    {c.status === 'Validada' && (
                      <Button size="sm" variant="outline" onClick={() => handlePayCommission(c.id)}>Marcar como Paga</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Affiliates;
