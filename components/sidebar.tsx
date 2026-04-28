'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Calendar,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState } from 'react';
import { currentUser } from '@/lib/mock-data';

const employeeNavItems = [
  { label: 'Dashboard', href: '/dashboard/employee', icon: Home },
  { label: 'Payslips', href: '/dashboard/employee/payslips', icon: FileText },
  { label: 'Leave', href: '/dashboard/employee/leave', icon: Calendar },
  { label: 'Payment Requests', href: '/dashboard/employee/payment-requests', icon: CreditCard },
];

const adminNavItems = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: Home },
  { label: 'Employees', href: '/dashboard/admin/employees', icon: Users },
  { label: 'Payslips', href: '/dashboard/admin/payslips', icon: FileText },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

interface SidebarProps {
  role?: 'employee' | 'admin';
}

export function Sidebar({ role = 'employee' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = role === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card p-2 text-foreground md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-sidebar transition-transform duration-300 ease-in-out md:relative md:z-auto md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border px-6 py-6">
            <h1 className="text-2xl font-bold text-primary">IDRC</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              {role === 'admin' ? 'Admin' : 'Employee'} Portal
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border px-4 py-4">
            <p className="text-xs text-muted-foreground">{currentUser.employeeId}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
