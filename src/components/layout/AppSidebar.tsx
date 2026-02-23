import React from 'react';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Produtos', url: '/products', icon: Package },
  { title: 'Categorias', url: '/categories', icon: FolderTree },
  { title: 'Pedidos', url: '/orders', icon: ShoppingCart },
  { title: 'Afiliados', url: '/affiliates', icon: Users },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold tracking-tight text-primary">YetuStore</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <NavLink to={item.url} end activeClassName="bg-primary/10 text-primary">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
