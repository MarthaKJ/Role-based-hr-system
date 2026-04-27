'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockEmployees } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAvatar: (file: File) => Promise<void>;
  removeAvatar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock authentication - find user by email
      const foundUser = mockEmployees.find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        throw new Error('User not found');
      }

      // In a real app, you'd validate password against backend
      // For now, any password works for demo purposes
      setUser(foundUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateAvatar = useCallback(async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    setUser((prev) => (prev ? { ...prev, avatarUrl: dataUrl } : prev));
  }, []);

  const removeAvatar = useCallback(() => {
    setUser((prev) => (prev ? { ...prev, avatarUrl: undefined } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateAvatar, removeAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
