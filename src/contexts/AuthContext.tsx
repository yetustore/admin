import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const saved = sessionStorage.getItem('yetu_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      const u = { username };
      setUser(u);
      sessionStorage.setItem('yetu_admin', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('yetu_admin');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
