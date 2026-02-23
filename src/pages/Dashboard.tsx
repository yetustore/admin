import React, { useEffect, useState } from 'react';
import { ShoppingCart, Users, DollarSign, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboard } from '@/lib/api';
import { onSocket } from '@/lib/socket';

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </div>
);

const COLORS = ['hsl(160,84%,39%)', 'hsl(217,91%,60%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)'];

const formatAOA = (v: number) => `${(v / 1000).toFixed(0)}k AOA`;
const formatMoney = (v: number) => new Intl.NumberFormat('pt-AO').format(v) + ' AOA';
const Dashboard = () => {
  const [stats, setStats] = useState({
    counts: { categories: 0, products: 0, orders: 0, affiliates: 0 },
    payouts: { totalPaid: 0, totalRequested: 0 },
    revenue: { grossSales: 0, netSales: 0 },
    statusCounts: { agendado: 0, em_progresso: 0, comprado: 0, cancelado: 0 },
    categoryData: [] as { name: string; count: number }[],
  });

  const load = async () => {
    const data = await getDashboard();
    setStats(data);
  };

  useEffect(() => {
    load();
    const offOrders = onSocket('orders.updated', () => load());
    const offCats = onSocket('categories.updated', () => load());
    const offProds = onSocket('products.updated', () => load());
    const offAffs = onSocket('affiliates.updated', () => load());
    return () => {
      offOrders();
      offCats();
      offProds();
      offAffs();
    };
  }, []);

  const statusData = [
    { name: 'Agendado', value: stats.statusCounts.agendado },
    { name: 'Em Progresso', value: stats.statusCounts.em_progresso },
    { name: 'Comprado', value: stats.statusCounts.comprado },
    { name: 'Cancelado', value: stats.statusCounts.cancelado },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Pedidos (Total)" value={stats.counts.orders} />
        <StatCard icon={CheckCircle} label="Pedidos Realizados" value={stats.statusCounts.comprado} />
        <StatCard icon={Users} label="Afiliados" value={stats.counts.affiliates} />
        <StatCard icon={DollarSign} label="Valor Líquido Arrecadado" value={formatMoney(stats.revenue.grossSales)} />
        <StatCard icon={CheckCircle} label="Valor Arrecadado" value={formatMoney(stats.revenue.netSales)} />
        <StatCard icon={DollarSign} label="Saques Solicitados" value={formatMoney(stats.payouts.totalRequested)} />
        <StatCard icon={CheckCircle} label="Saques Pagos" value={formatMoney(stats.payouts.totalPaid)} />
      </div>

      <div className="grid grid-cols-1 gap-4">
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
      </div>
    </div>
  );
};

export default Dashboard;
