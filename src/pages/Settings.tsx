import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
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

const emptyAdmin = { username: '', name: '', email: '', role: 'Admin' as AdminUser['role'], active: true };

const Settings = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAdmin);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyAdmin);
    setDialogOpen(true);
  };

  const openEdit = (admin: AdminUser) => {
    setEditingId(admin.id);
    setForm({ username: admin.username, name: admin.name, email: admin.email, role: admin.role, active: admin.active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.username.trim() || !form.name.trim() || !form.email.trim()) {
      toast({ title: 'Erro', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }
    if (editingId) {
      updateAdmin(editingId, form);
      toast({ title: 'Administrador atualizado com sucesso.' });
    } else {
      addAdmin(form);
      toast({ title: 'Administrador cadastrado com sucesso.' });
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (deletingId) {
      const admin = admins.find(a => a.id === deletingId);
      if (admin?.role === 'Super Admin') {
        toast({ title: 'Erro', description: 'Não é possível excluir um Super Admin.', variant: 'destructive' });
      } else {
        deleteAdmin(deletingId);
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
      'Moderador': 'bg-muted text-muted-foreground border-border',
    };
    return <Badge variant="outline" className={variants[role]}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie os administradores e configurações da plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Administradores</CardTitle>
                <CardDescription>Cadastre e gerencie os usuários administrativos.</CardDescription>
              </div>
            </div>
            <Button onClick={openCreate} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Novo Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar administrador..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum administrador encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(admin => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.username}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{roleBadge(admin.role)}</TableCell>
                      <TableCell>
                        <Badge variant={admin.active ? 'default' : 'secondary'}>
                          {admin.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.createdAt}</TableCell>
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
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome completo *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label>Nome de usuário *</Label>
                <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="usuario" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Papel</Label>
                <Select value={form.role} onValueChange={(v) => setForm(f => ({ ...f, role: v as AdminUser['role'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Moderador">Moderador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-10">
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

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>Tem certeza que deseja remover este administrador? Esta ação não pode ser desfeita.</DialogDescription>
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

export default Settings;
