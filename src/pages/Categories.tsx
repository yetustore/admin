import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

const Categories = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: '', description: '' }); setDialogOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return; }
    if (editing) {
      updateCategory(editing.id, form);
      toast.success('Categoria atualizada');
    } else {
      addCategory(form);
      toast.success('Categoria criada');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const ok = deleteCategory(id);
    if (!ok) toast.error('Não é possível excluir categoria vinculada a produtos');
    else toast.success('Categoria excluída');
  };

  const getProductCount = (catId: string) => products.filter(p => p.categories.includes(catId)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorias cadastradas</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nova Categoria</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar categorias..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary" />
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Descrição</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{c.description}</TableCell>
                <TableCell><span className="badge-info">{getProductCount(c.id)}</span></TableCell>
                <TableCell className="text-muted-foreground">{c.createdAt}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma categoria encontrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary" maxLength={500} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
