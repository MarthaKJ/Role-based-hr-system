import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" />
      <div className="flex flex-1 flex-col overflow-hidden md:ml-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="md:p-8 p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
