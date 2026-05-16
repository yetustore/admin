import { useEffect, useState } from 'react';
import { getAffiliateLinks } from '@/lib/api';
import { AffiliateLink } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link2, MousePointerClick } from 'lucide-react';
import { onSocket } from '@/lib/socket';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/admin/PaginationControls';

const Affiliates = () => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const {
    page,
    setPage,
    currentItems,
    totalPages,
    totalItems,
    startItem,
    endItem,
  } = usePagination(links, 10);

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

      <div className="admin-scroll-surface overflow-hidden">
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
            {currentItems.map(l => (
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
            {currentItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum link encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="px-4 pb-4">
          <PaginationControls
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            startItem={startItem}
            endItem={endItem}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
