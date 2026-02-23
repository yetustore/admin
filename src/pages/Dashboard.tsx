import React from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Package, FolderTree, ShoppingCart, Users, DollarSign, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </div>
);

const COLORS = ['hsl(160,84%,39%)', 'hsl(217,91%,60%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)'];

const Dashboard = () => {
  const { products, categories, orders, affiliates, commissions } = useStore();

  const totalAccumulated = affiliates.reduce((s, a) => s + a.accumulatedCommission, 0);
  const totalPaid = affiliates.reduce((s, a) => s + a.paidCommission, 0);

  const statusData = [
    { name: 'Agendado', value: orders.filter(o => o.status === 'Agendado').length },
    { name: 'Em Progresso', value: orders.filter(o => o.status === 'Em Progresso').length },
    { name: 'Comprado', value: orders.filter(o => o.status === 'Comprado').length },
    { name: 'Cancelado', value: orders.filter(o => o.status === 'Cancelado').length },
  ];

  const categoryData = categories.map(c => ({
    name: c.name.length > 10 ? c.name.slice(0, 10) + '…' : c.name,
    produtos: products.filter(p => p.categories.includes(c.id)).length,
  }));

  const formatAOA = (v: number) => `${(v / 1000).toFixed(0)}k AOA`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Package} label="Produtos" value={products.length} />
        <StatCard icon={FolderTree} label="Categorias" value={categories.length} />
        <StatCard icon={ShoppingCart} label="Pedidos" value={orders.length} />
        <StatCard icon={Users} label="Afiliados" value={affiliates.length} />
        <StatCard icon={DollarSign} label="Comissões Acum." value={formatAOA(totalAccumulated)} />
        <StatCard icon={CheckCircle} label="Comissões Pagas" value={formatAOA(totalPaid)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Pedidos por Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(222,44%,8%)', border: '1px solid hsl(215,25%,16%)', borderRadius: '8px', color: 'hsl(210,40%,96%)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Produtos por Categoria</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(215,20%,55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(222,44%,8%)', border: '1px solid hsl(215,25%,16%)', borderRadius: '8px', color: 'hsl(210,40%,96%)' }} />
              <Bar dataKey="produtos" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
