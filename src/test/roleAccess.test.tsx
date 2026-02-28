import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { AdminUser } from '@/types';
import { AppSidebar } from '@/components/layout/AppSidebar';

function renderWithUser(user: AdminUser | null) {
  const value = {
    isAuthenticated: !!user,
    isLoading: false,
    user,
    login: async () => ({
      id: 'dummy',
      username: 'dummy',
      name: 'Dummy',
      email: 'dummy@example.com',
      role: 'Admin' as AdminUser['role'],
      active: true,
      createdAt: new Date().toISOString(),
    }),
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <AppSidebar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

describe('role-based sidebar navigation', () => {
  it('only shows orders link for entregador', () => {
    const user: AdminUser = {
      id: '1',
      username: 'joe',
      name: 'Joe',
      email: 'joe@example.com',
      role: 'Entregador',
      active: true,
      createdAt: new Date().toISOString(),
    };
    renderWithUser(user);

    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/settings/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/products/i)).not.toBeInTheDocument();
  });

  it('shows all links for admin', () => {
    const user: AdminUser = {
      id: '2',
      username: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'Admin',
      active: true,
      createdAt: new Date().toISOString(),
    };
    renderWithUser(user);

    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });
});
