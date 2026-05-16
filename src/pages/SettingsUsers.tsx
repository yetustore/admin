import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, SquarePen, Users } from 'lucide-react';
import { getPlatformUsers } from '@/lib/api';
import { PlatformUser } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/admin/PaginationControls';

const SettingsUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const {
    page,
    setPage,
    currentItems,
    totalPages,
    totalItems,
    startItem,
    endItem,
  } = usePagination(users, 10);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        const data = await getPlatformUsers(search);
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setFilteredTotal(data.filteredTotal || 0);
      } catch (err: any) {
        toast({ title: 'Erro', description: err?.message || 'Falha ao carregar usuarios.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search, toast]);

  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  const summaryText = useMemo(() => {
    if (search.trim()) return `${filteredTotal} encontrado(s)`;
    return `${total} usuario(s) na plataforma`;
  }, [filteredTotal, search, total]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">Veja, filtre e edite os usuarios do YetuStore Client Portal.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Usuarios da plataforma</CardTitle>
                <CardDescription>Use o filtro para localizar rapidamente qualquer conta.</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit px-3 py-1 text-sm">
              {summaryText}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nome, email ou telefone..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-scroll-surface overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Acao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      Carregando usuarios...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      Nenhum usuario encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.provider === 'google' ? 'Google' : 'Local'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                          {user.emailVerified ? 'Verificado' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.phoneVerified ? 'default' : 'secondary'}>
                          {user.phoneVerified ? 'Verificado' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/settings/usuarios/${user.id}`)}>
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
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
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsUsers;
