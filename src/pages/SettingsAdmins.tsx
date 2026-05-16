import React, { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Shield, Search, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/admin/PaginationControls';

const emptyAdmin = { username: '', name: '', email: '', phone: '', role: 'Admin' as AdminUser['role'], active: true, password: '' };

const SettingsAdmins = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin } = useStore();
  const { toast } = useToast();
  const { user } = useAuth();

  const roleOptions: AdminUser['role'][] = user?.role === 'Super Admin'
    ? ['Super Admin', 'Admin', 'Entregador']
    : user?.role === 'Admin'
      ? ['Entregador']
      : [];

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAdmin);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const optionsToRender = editingId && !roleOptions.includes(form.role)
    ? [form.role, ...roleOptions]
    : roleOptions;

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.toLowerCase().includes(search.toLowerCase())
  );
  const {
    page,
    setPage,
    currentItems,
    totalPages,
    totalItems,
    startItem,
    endItem,
  } = usePagination(filtered, 10);

  useEffect(() => {
    setPage(1);
  }, [search, setPage]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyAdmin,
      role: roleOptions[0] || 'Admin',
    });
    setDialogOpen(true);
  };

  const openEdit = (admin: AdminUser) => {
    setEditingId(admin.id);
    setForm({ username: admin.username, name: admin.name, email: admin.email, phone: admin.phone || '', role: admin.role, active: admin.active, password: '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.username.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast({ title: 'Erro', description: 'Preencha todos os campos obrigatorios.', variant: 'destructive' });
      return;
    }

    if (!editingId && !form.password.trim()) {
      toast({ title: 'Erro', description: 'Defina uma senha para o novo administrador.', variant: 'destructive' });
      return;
    }

    if (user?.role === 'Admin' && form.role !== 'Entregador') {
      toast({ title: 'Permissao negada', description: 'Voce so pode criar ou editar usuarios com papel Entregador.', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        const payload = {
          username: form.username,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          active: form.active,
          ...(form.password.trim() ? { password: form.password.trim() } : {}),
        };
        await updateAdmin(editingId, payload);
        toast({ title: 'Administrador atualizado com sucesso.' });
      } else {
        await addAdmin({
          username: form.username,
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          active: form.active,
          password: form.password.trim(),
        });
        toast({ title: 'Administrador cadastrado com sucesso.' });
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Erro', description: err?.message || 'Falha ao salvar administrador.', variant: 'destructive' });
    }
  };

  const confirmDelete = async () => {
    if (deletingId) {
      const admin = admins.find(a => a.id === deletingId);
      if (admin?.role === 'Super Admin') {
        toast({ title: 'Erro', description: 'Nao e possivel excluir um Super Admin.', variant: 'destructive' });
      } else {
        await deleteAdmin(deletingId);
        toast({ title: 'Administrador removido.' });
      }
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const roleBadge = (role: AdminUser['role']) => {
    const variants: Record<string, string> = {
      'Super Admin': 'bg-primary/20 text-primary border-primary/30',
      'Admin': 'bg-accent/20 text-accent-foreground border-accent/30',
      'Entregador': 'bg-muted text-muted-foreground border-border',
    };
    return <Badge variant="outline" className={variants[role]}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administrador</h1>
        <p className="text-muted-foreground">Gerencie os usuarios administrativos da plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Administradores</CardTitle>
                <CardDescription>Cadastre e gerencie os usuarios administrativos.</CardDescription>
              </div>
            </div>
            <Button onClick={openCreate} size="sm" disabled={roleOptions.length === 0}>
              <Plus className="mr-1 h-4 w-4" /> Novo Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar administrador..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="admin-scroll-surface overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telemovel</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      Nenhum administrador encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map(admin => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.phone}</TableCell>
                      <TableCell>{roleBadge(admin.role)}</TableCell>
                      <TableCell>
                        <Badge variant={admin.active ? 'default' : 'secondary'}>
                          {admin.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(admin.createdAt).toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(admin)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => { setDeletingId(admin.id); setDeleteDialogOpen(true); }}
                            disabled={admin.role === 'Super Admin'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="admin-scroll">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {editingId ? 'Editar Administrador' : 'Novo Administrador'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Atualize os dados do administrador.' : 'Preencha os dados para cadastrar um novo administrador.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label>Nome de usuario *</Label>
                <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="usuario" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Telemovel *</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+244 9xx xxx xxx" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{editingId ? 'Nova senha' : 'Senha *'}</Label>
              <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={editingId ? 'Opcional' : 'Defina uma senha'} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Papel</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => setForm(f => ({ ...f, role: v as AdminUser['role'] }))}
                  disabled={user?.role === 'Admin' && !!editingId}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {optionsToRender.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex h-10 items-center gap-2">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm(f => ({ ...f, active: v }))} />
                  <span className="text-sm text-muted-foreground">{form.active ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingId ? 'Salvar' : 'Cadastrar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="admin-scroll">
          <DialogHeader>
            <DialogTitle>Confirmar exclusao</DialogTitle>
            <DialogDescription>Tem certeza que deseja remover este administrador? Esta acao nao pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsAdmins;
