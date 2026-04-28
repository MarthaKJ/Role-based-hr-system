'use client';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/context/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const role = user?.role === 'admin' ? 'admin' : 'employee';

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar role={role} />
        <div className="flex flex-1 flex-col overflow-hidden md:ml-0">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="md:p-8 p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
