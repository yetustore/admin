import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const modules = [
  {
    title: 'Administrador',
    description: 'Gerencie administradores, papeis e acessos internos da operacao.',
    to: '/settings/administradores',
    icon: Shield,
  },
  {
    title: 'Usuarios',
    description: 'Consulte todos os usuarios do YetuStore Client Portal e edite os seus dados.',
    to: '/settings/usuarios',
    icon: Users,
  },
];

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Escolha um submodulo para gerenciar a plataforma.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.to} className="border-border/70 transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={module.to}>
                    Abrir submodulo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
