import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function dashboardBase(pathname: string | null | undefined): string {
  if (!pathname) return '/dashboard/employee';
  if (pathname.startsWith('/dashboard/manager')) return '/dashboard/manager';
  if (pathname.startsWith('/dashboard/admin')) return '/dashboard/admin';
  return '/dashboard/employee';
}
