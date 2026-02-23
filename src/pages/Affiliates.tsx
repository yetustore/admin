import React, { useEffect, useState } from 'react';
import { getAffiliateLinks } from '@/lib/api';
import { AffiliateLink } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link2, MousePointerClick } from 'lucide-react';
import { onSocket } from '@/lib/socket';

const statusLabel: Record<string, string> = {
  agendado: 'Agendado',
  em_progresso: 'Em Progresso',
  comprado: 'Comprado',
  cancelado: 'Cancelado',
};

const Affiliates = () => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);

  const load = async () => {
    const data = await getAffiliateLinks();
    setLinks(data);
  };

  useEffect(() => {
    load();
    const off = onSocket('affiliates.updated', () => load());
    return () => off();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Afiliados</h1>
        <p className="text-sm text-muted-foreground">{links.length} links gerados</p>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Afiliado</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.affiliateName || ''}</TableCell>
                <TableCell>{l.product?.name || l.productId}</TableCell>
                <TableCell className="text-muted-foreground">{l.code}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MousePointerClick className="h-3.5 w-3.5" /> {l.clicks}
                  </span>
                </TableCell>
                <TableCell>{l.ordersCount}</TableCell>
                <TableCell>
                  <a href={l.url} target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
                    <Link2 className="h-3.5 w-3.5" /> Abrir
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum link encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        {links.map(l => (
          <div key={l.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{l.product?.name}</p>
                <p className="text-xs text-muted-foreground">Afiliado: {l.affiliateName || ''} - {l.code}</p>
              </div>
              <div className="text-xs text-muted-foreground">{l.ordersCount} pedidos</div>
            </div>
            {l.orders && l.orders.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Pedidos via este link:</p>
                {l.orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                    <span className="text-foreground">#{order.id.slice(-4)}</span>
                    <span className="text-xs text-muted-foreground">{order.scheduledDate} {order.scheduledTime}</span>
                    <span className="text-xs font-medium">{statusLabel[order.status]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Affiliates;
