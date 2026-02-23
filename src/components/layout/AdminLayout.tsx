import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">AdminYetuStore</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.username}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
