import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse, User } from '../types';
import { authApi } from '../api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: { username: string; password: string; email: string; phone: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: { email?: string; phone?: string; password?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tm_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await authApi.login({ username, password });
      const auth = data as AuthResponse;
      setUser(auth.user);
      localStorage.setItem('tm_user', JSON.stringify(auth.user));
      localStorage.setItem('tm_token', auth.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { username: string; password: string; email: string; phone: string }) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(payload);
      const auth = data as AuthResponse;
      setUser(auth.user);
      localStorage.setItem('tm_user', JSON.stringify(auth.user));
      localStorage.setItem('tm_token', auth.token);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: { email?: string; phone?: string; password?: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await authApi.editUser(user.id, payload);
      setUser(data);
      localStorage.setItem('tm_user', JSON.stringify(data));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tm_user');
    localStorage.removeItem('tm_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};