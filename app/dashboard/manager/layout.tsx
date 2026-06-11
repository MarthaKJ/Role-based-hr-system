'use client';

import { ProtectedRoute } from '@/components/protected-route';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="manager">{children}</ProtectedRoute>;
}
