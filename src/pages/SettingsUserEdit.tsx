import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserRound, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getPlatformUserById, getPlatformUserWallet, updatePlatformUser } from '@/lib/api';
import { PlatformUser, PlatformUserWallet } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/admin/PaginationControls';

type UserForm = Pick<
  PlatformUser,
  'name' | 'email' | 'phone' | 'emailVerified' | 'phoneVerified' | 'bankAccountName' | 'bankName' | 'bankIban'
>;

const emptyForm: UserForm = {
  name: '',
  email: '',
  phone: '',
  emailVerified: false,
  phoneVerified: false,
  bankAccountName: '',
  bankName: '',
  bankIban: '',
};

const SettingsUserEdit = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [wallet, setWallet] = useState<PlatformUserWallet | null>(null);
  const {
    page: earningsPage,
    setPage: setEarningsPage,
    currentItems: pagedEarnings,
    totalPages: earningsTotalPages,
    totalItems: earningsTotalItems,
    startItem: earningsStartItem,
    endItem: earningsEndItem,
  } = usePagination(wallet?.earningsByOrder || [], 6);
  const {
    page: payoutsPage,
    setPage: setPayoutsPage,
    currentItems: pagedPayouts,
    totalPages: payoutsTotalPages,
    totalItems: payoutsTotalItems,
    startItem: payoutsStartItem,
    endItem: payoutsEndItem,
  } = usePagination(wallet?.payouts || [], 6);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await getPlatformUserById(id);
        setUser(data);
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          emailVerified: data.emailVerified,
          phoneVerified: data.phoneVerified,
          bankAccountName: data.bankAccountName,
          bankName: data.bankName,
          bankIban: data.bankIban,
        });
      } catch (err: any) {
        toast({ title: 'Erro', description: err?.message || 'Falha ao carregar usuario.', variant: 'destructive' });
        navigate('/settings/usuarios');
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [id, navigate, toast]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: 'Erro', description: 'Nome e email sao obrigatorios.', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      const updated = await updatePlatformUser(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        emailVerified: form.emailVerified,
        phoneVerified: form.phoneVerified,
        bankAccountName: form.bankAccountName.trim(),
        bankName: form.bankName.trim(),
        bankIban: form.bankIban.trim(),
      });
      setUser(updated);
      setForm({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        emailVerified: updated.emailVerified,
        phoneVerified: updated.phoneVerified,
        bankAccountName: updated.bankAccountName,
        bankName: updated.bankName,
        bankIban: updated.bankIban,
      });
      toast({ title: 'Usuario atualizado com sucesso.' });
    } catch (err: any) {
      toast({ title: 'Erro', description: err?.message || 'Falha ao atualizar usuario.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenWallet = async () => {
    try {
      setWalletOpen(true);
      setWalletLoading(true);
      const data = await getPlatformUserWallet(id);
      setWallet(data);
      setEarningsPage(1);
      setPayoutsPage(1);
    } catch (err: any) {
      toast({ title: 'Erro', description: err?.message || 'Falha ao carregar carteira do usuario.', variant: 'destructive' });
      setWalletOpen(false);
    } finally {
      setWalletLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Editar usuario</h1>
        <p className="text-muted-foreground">Carregando dados do usuario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar usuario</h1>
          <p className="text-muted-foreground">Atualize os dados do usuario da plataforma cliente.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/settings/usuarios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>
                Conta criada em {user ? new Date(user.createdAt).toLocaleString('pt-BR') : '-'} via {user?.provider === 'google' ? 'Google' : 'cadastro local'}.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Ultima atualizacao</Label>
              <Input value={user ? new Date(user.updatedAt).toLocaleString('pt-BR') : '-'} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Email verificado</p>
                  <p className="text-sm text-muted-foreground">Controle o estado de verificacao do email.</p>
                </div>
                <Switch checked={form.emailVerified} onCheckedChange={(value) => setForm((current) => ({ ...current, emailVerified: value }))} />
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Telefone verificado</p>
                  <p className="text-sm text-muted-foreground">Controle o estado de verificacao do telefone.</p>
                </div>
                <Switch checked={form.phoneVerified} onCheckedChange={(value) => setForm((current) => ({ ...current, phoneVerified: value }))} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Dados bancarios</h2>
              <p className="text-sm text-muted-foreground">Informacoes usadas para pagamentos e saques.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome da conta</Label>
                <Input value={form.bankAccountName} onChange={(e) => setForm((current) => ({ ...current, bankAccountName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Banco</Label>
                <Input value={form.bankName} onChange={(e) => setForm((current) => ({ ...current, bankName: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>IBAN</Label>
              <Input value={form.bankIban} onChange={(e) => setForm((current) => ({ ...current, bankIban: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleOpenWallet}>
              <Wallet className="mr-2 h-4 w-4" />
              Ver carteira
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent className="admin-scroll max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Carteira do usuario
            </DialogTitle>
            <DialogDescription>
              Veja os ganhos, saldo disponivel e historico financeiro deste usuario.
            </DialogDescription>
          </DialogHeader>

          {walletLoading ? (
            <p className="text-sm text-muted-foreground">Carregando carteira...</p>
          ) : wallet ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total ganho</CardDescription>
                    <CardTitle>{wallet.totalEarned.toLocaleString('pt-BR')} AOA</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total levantado</CardDescription>
                    <CardTitle>{wallet.totalWithdrawn.toLocaleString('pt-BR')} AOA</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Saques pendentes</CardDescription>
                    <CardTitle>{wallet.pendingWithdrawals.toLocaleString('pt-BR')} AOA</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Saldo disponivel</CardDescription>
                    <CardTitle>{wallet.available.toLocaleString('pt-BR')} AOA</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Dados bancarios</CardTitle>
                  <CardDescription>Limites atuais de saque: minimo {wallet.minWithdraw.toLocaleString('pt-BR')} AOA e maximo {wallet.maxWithdraw.toLocaleString('pt-BR')} AOA.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome da conta</p>
                    <p className="font-medium">{wallet.bank.accountName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">{wallet.bank.bankName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">IBAN</p>
                    <p className="font-medium">{wallet.bank.iban || '-'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ganhos por encomenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="admin-scroll-surface overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Encomenda</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Ganho</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Agendamento</TableHead>
                          <TableHead>Criado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedEarnings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
                              Este usuario ainda nao tem ganhos registrados.
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedEarnings.map((entry) => (
                            <TableRow key={entry.orderId}>
                              <TableCell className="font-medium">{entry.orderId}</TableCell>
                              <TableCell>{entry.totalAmount.toLocaleString('pt-BR')} AOA</TableCell>
                              <TableCell>{entry.commission.toLocaleString('pt-BR')} AOA</TableCell>
                              <TableCell>
                                <Badge variant="outline">{entry.status}</Badge>
                              </TableCell>
                              <TableCell>{entry.scheduledDate} {entry.scheduledTime}</TableCell>
                              <TableCell>{new Date(entry.createdAt).toLocaleString('pt-BR')}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <div className="px-4 pb-4">
                      <PaginationControls
                        page={earningsPage}
                        totalPages={earningsTotalPages}
                        totalItems={earningsTotalItems}
                        startItem={earningsStartItem}
                        endItem={earningsEndItem}
                        onPageChange={setEarningsPage}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historico de saques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="admin-scroll-surface overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedPayouts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                              Nenhum saque encontrado para este usuario.
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedPayouts.map((payout) => (
                            <TableRow key={payout.id}>
                              <TableCell>{payout.amount.toLocaleString('pt-BR')} AOA</TableCell>
                              <TableCell>
                                <Badge variant={payout.status === 'paid' ? 'default' : payout.status === 'requested' ? 'secondary' : 'outline'}>
                                  {payout.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(payout.createdAt).toLocaleString('pt-BR')}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <div className="px-4 pb-4">
                      <PaginationControls
                        page={payoutsPage}
                        totalPages={payoutsTotalPages}
                        totalItems={payoutsTotalItems}
                        startItem={payoutsStartItem}
                        endItem={payoutsEndItem}
                        onPageChange={setPayoutsPage}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsUserEdit;
