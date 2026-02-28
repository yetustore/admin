import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireRole } from "@/components/RequireRole";
import { StoreProvider } from "@/contexts/StoreContext";
import AdminLayout from "@/components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Affiliates from "./pages/Affiliates";
import AffiliatePayouts from "./pages/AffiliatePayouts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<AdminLayout />}>
                <Route
                  path="/"
                  element={
                    <RequireRole roles={[
                      'Super Admin',
                      'Admin',
                    ]}>
                      <Dashboard />
                    </RequireRole>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin']}>
                      <Products />
                    </RequireRole>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin']}>
                      <Categories />
                    </RequireRole>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin', 'Entregador']}>
                      <Orders />
                    </RequireRole>
                  }
                />
                <Route
                  path="/affiliates"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin']}>
                      <Affiliates />
                    </RequireRole>
                  }
                />
                <Route
                  path="/affiliates/payouts"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin']}>
                      <AffiliatePayouts />
                    </RequireRole>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireRole roles={['Super Admin', 'Admin']}>
                      <Settings />
                    </RequireRole>
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
