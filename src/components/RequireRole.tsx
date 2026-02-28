import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '@/types';

interface RequireRoleProps {
  roles: AdminUser['role'][];
  children: JSX.Element;
  redirectTo?: string;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ roles, children, redirectTo = '/orders' }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // while we're still fetching user info, don't render anything
  if (isLoading) {
    return null;
  }

  if (!user) {
    // fallback to login if somehow unauthenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
