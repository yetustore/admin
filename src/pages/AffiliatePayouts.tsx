import React, { useEffect, useState } from 'react';
import { getAffiliatePayouts, updateAffiliatePayoutStatus } from '@/lib/api';
import { AffiliatePayout } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { onSocket } from '@/lib/socket';
import { Check, X } from 'lucide-react';

const statusLabel: Record<AffiliatePayout['status'], { label: string; className: string }> = {
  requested: { label: 'Solicitado', className: 'badge-warning' },
  paid: { label: 'Pago', className: 'badge-success' },
  denied: { label: 'Negado', className: 'badge-danger' },
};

const AffiliatePayouts = () => {
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = async () => {
    const data = await getAffiliatePayouts();
    setPayouts(data);
  };

  useEffect(() => {
    load();
    const off = onSocket('affiliates.updated', () => load());
    return () => off();
  }, []);

  const updateStatus = async (id: string, status: AffiliatePayout['status']) => {
    setLoadingId(id);
    try {
      await updateAffiliatePayoutStatus(id, status);
      await load();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos de Saque</h1>
        <p className="text-sm text-muted-foreground">Aprove ou negue solicitações de saque</p>
      </div>

      <div className="glass-card overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead>IBAN</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data do Pedido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Opções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.affiliateName || ''}</TableCell>
                <TableCell className="text-muted-foreground">{p.phone || '-'}</TableCell>
                <TableCell className="text-muted-foreground">{p.bankName || ''}</TableCell>
                <TableCell className="text-muted-foreground">{p.iban || ''}</TableCell>
                <TableCell>{new Intl.NumberFormat('pt-AO').format(p.amount)} AOA</TableCell>
                <TableCell>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <span className={statusLabel[p.status].className}>{statusLabel[p.status].label}</span>
                </TableCell>
                <TableCell>
                  {p.status === 'requested' ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => updateStatus(p.id, 'paid')}
                        disabled={loadingId === p.id}
                      >
                        <Check className="h-4 w-4 mr-1" /> Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8"
                        onClick={() => updateStatus(p.id, 'denied')}
                        disabled={loadingId === p.id}
                      >
                        <X className="h-4 w-4 mr-1" /> Negar
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem ações</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {payouts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum pedido de saque encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AffiliatePayouts;
