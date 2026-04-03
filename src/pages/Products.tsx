import React, { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Search, Star, X } from 'lucide-react';
import { toast } from 'sonner';

const defaultMediaItem = { type: 'image' as const, url: '' };
const defaultForm = { name: '', description: '', price: '', rating: '4', stock: '', affiliatePercent: '5', selectedCategories: [] as string[], media: [defaultMediaItem] };

const Products = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(defaultForm);

  let filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (filterCat !== 'all') filtered = filtered.filter(p => p.categories.includes(filterCat));
  if (filterStock === 'out') filtered = filtered.filter(p => p.stock === 0);
  else if (filterStock === 'in') filtered = filtered.filter(p => p.stock > 0);

  const openNew = () => { setEditing(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit = (p: Product) => {
    const media = (p.media && p.media.length > 0)
      ? p.media
      : (p.imageUrl ? [{ type: 'image' as const, url: p.imageUrl }] : [defaultMediaItem]);

    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      rating: String(p.rating),
      stock: String(p.stock),
      affiliatePercent: String(p.affiliatePercent ?? 0),
      selectedCategories: [...p.categories],
      media,
    });
    setDialogOpen(true);
  };

  const toggleCategory = (catId: string) => {
    setForm(f => ({
      ...f,
      selectedCategories: f.selectedCategories.includes(catId)
        ? f.selectedCategories.filter(c => c !== catId)
        : [...f.selectedCategories, catId]
    }));
  };

  const updateMedia = (idx: number, patch: { type?: 'image' | 'video'; url?: string }) => {
    setForm(f => {
      const media = f.media.map((m, i) => (i === idx ? { ...m, ...patch } : m));
      return { ...f, media };
    });
  };

  const addMedia = () => setForm(f => ({ ...f, media: [...f.media, { ...defaultMediaItem }] }));
  const removeMedia = (idx: number) => setForm(f => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));

  const cleanMedia = () => {
    return form.media
      .map(m => ({ type: m.type, url: m.url.trim() }))
      .filter(m => m.url);
  };

  const getPrimaryImage = (prod: Product) => {
    const media = (prod.media && prod.media.length > 0)
      ? prod.media
      : (prod.imageUrl ? [{ type: 'image' as const, url: prod.imageUrl }] : []);
    const first = media.find(m => m.type === 'image' && m.url);
    return first?.url || prod.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Preço inválido'); return; }
    const affiliatePercent = Number(form.affiliatePercent);
    if (Number.isNaN(affiliatePercent) || affiliatePercent < 0 || affiliatePercent > 100) {
      toast.error('Percentual de afiliado deve estar entre 0 e 100');
      return;
    }
    if (form.selectedCategories.length === 0) { toast.error('Selecione ao menos uma categoria'); return; }

    const media = cleanMedia();
    const hasImage = media.some(m => m.type === 'image');
    if (!hasImage) { toast.error('Informe ao menos uma foto'); return; }

    const primaryImage = media.find(m => m.type === 'image')?.url || '';
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      currency: 'AOA' as const,
      imageUrl: primaryImage,
      media,
      rating: Number(form.rating),
      stock: Number(form.stock) || 0,
      affiliatePercent,
      categories: form.selectedCategories,
    };

    try {
      if (editing) { await updateProduct(editing.id, data); toast.success('Produto atualizado'); }
      else { await addProduct(data); toast.success('Produto criado'); }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar produto');
    }
  };

  const getCatNames = (ids: string[]) => ids.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ');
  const formatPrice = (v: number) => new Intl.NumberFormat('pt-AO').format(v) + ' AOA';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Novo Produto</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-secondary" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[180px] bg-secondary"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStock} onValueChange={setFilterStock}>
          <SelectTrigger className="w-[160px] bg-secondary"><SelectValue placeholder="Estoque" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo Estoque</SelectItem>
            <SelectItem value="in">Em Estoque</SelectItem>
            <SelectItem value="out">Sem Estoque</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="glass-card overflow-hidden animate-fade-in">
            <div className="h-40 overflow-hidden bg-secondary flex items-center justify-center">
              <img src={getPrimaryImage(p)} alt={p.name} className="w-full h-full object-contain p-2" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{getCatNames(p.categories)}</p>
                </div>
                {p.stock === 0 && <span className="badge-danger">Sem estoque</span>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatPrice(p.price)}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  {p.rating}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Estoque: {p.stock}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={async () => { await deleteProduct(p.id); toast.success('Produto excluído'); }} className="hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">Nenhum produto encontrado</div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary" maxLength={200} /></div>
            <div className="space-y-2"><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary" maxLength={1000} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Preço (AOA)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-secondary" /></div>
              <div className="space-y-2"><Label>Estoque</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="bg-secondary" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Rating</Label><Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} className="bg-secondary" /></div>
            </div>
            <div className="space-y-2">
              <Label>Percentual de Afiliado (%)</Label>
              <Input type="number" min="0" max="100" value={form.affiliatePercent} onChange={e => setForm(f => ({ ...f, affiliatePercent: e.target.value }))} className="bg-secondary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mídias (fotos e vídeos)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMedia}>
                  <Plus className="w-4 h-4 mr-1" />Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {form.media.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Select value={m.type} onValueChange={(v) => updateMedia(idx, { type: v as 'image' | 'video' })}>
                        <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Foto</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-7">
                      <Input
                        value={m.url}
                        onChange={e => updateMedia(idx, { url: e.target.value })}
                        className="bg-secondary"
                        placeholder="https://..."
                        maxLength={500}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedia(idx)}
                        disabled={form.media.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Mínimo: 1 foto. Vídeos devem ser links diretos.</p>
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCategory(c.id)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      form.selectedCategories.includes(c.id)
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
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

export default Products;

