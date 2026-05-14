'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ReactNode } from 'react';

type Role = 'admin' | 'employee' | 'hr' | 'manager';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role | Role[];
}

const homeForRole = (role: Role | undefined) => {
  if (role === 'admin' || role === 'hr') return '/dashboard/admin';
  if (role === 'manager') return '/dashboard/manager';
  return '/dashboard/employee';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAuth();

  const required = requiredRole
    ? Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole]
    : null;
  const hasAccess = !required || (user && required.includes(user.role));

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (required && !required.includes(user.role)) {
      router.push(homeForRole(user.role));
    }
  }, [user, router, required]);

  if (!user) {
    return null;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
