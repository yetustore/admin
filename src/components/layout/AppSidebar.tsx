import React from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Home,
  Box,
  Tag,
  ShoppingCart,
  Users,
  Settings,
  DollarSign,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAffiliatePath = location.pathname.startsWith("/affiliates");
  const { isMobile, openMobile, toggleSidebar } = useSidebar();

  // build navigation links based on role
  const isEntregador = user?.role === 'Entregador';

  const maybeClose = () => {
    if (isMobile && openMobile) toggleSidebar();
  };

  return (
    <Sidebar collapsible="icon" className="w-64">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-14 border-b border-border">
          <span className="text-lg font-bold">YetuStore</span>
        </div>
        <nav className="flex flex-col flex-1 px-2 py-4 space-y-1">
          {/* orders always available */}
          <NavLink
            to="/orders"
            onClick={maybeClose}
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
            activeClassName="bg-accent/50"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Orders
          </NavLink>

          {/* other areas only for admin/super */}
          {!isEntregador && (
            <>
              <NavLink
                to="/"
                onClick={maybeClose}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent/50"
              >
                <Home className="w-5 h-5 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/products"
                onClick={maybeClose}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent/50"
              >
                <Box className="w-5 h-5 mr-2" />
                Products
              </NavLink>
              <NavLink
                to="/categories"
                onClick={maybeClose}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent/50"
              >
                <Tag className="w-5 h-5 mr-2" />
                Categories
              </NavLink>

              {/* affiliates submenu */}
              <Accordion type="single" collapsible value={isAffiliatePath ? "affiliates" : undefined} className="w-full">
                <AccordionItem value="affiliates">
                  <AccordionTrigger className="px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
                    <span className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Afiliados
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pl-6">
                    <NavLink
                      to="/affiliates"
                      onClick={maybeClose}
                      className="flex items-center px-2 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-accent/50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Lista
                    </NavLink>
                    <NavLink
                      to="/affiliates/payouts"
                      onClick={maybeClose}
                      className="flex items-center px-2 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                      activeClassName="bg-accent/50"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pedidos de Saque
                    </NavLink>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <NavLink
                to="/settings"
                onClick={maybeClose}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent/50"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </Sidebar>
  );
};
