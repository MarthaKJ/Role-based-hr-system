'use client';

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Notifications } from '@/components/notifications';

export function Header() {
  const { user, logout, updateAvatar, removeAvatar } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB.');
      return;
    }
    await updateAvatar(file);
    e.target.value = '';
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-primary">IDRC</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Notifications />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors">
              <Avatar className="h-10 w-10">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold dark:bg-blue-950 dark:text-blue-300">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'admin' ? 'HR Admin' : user.designation}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2"
              onSelect={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              {user.avatarUrl ? 'Change Photo' : 'Upload Photo'}
            </DropdownMenuItem>
            {user.avatarUrl && (
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onSelect={() => removeAvatar()}
              >
                <Trash2 size={16} />
                Remove Photo
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex cursor-pointer items-center gap-2">
                <Settings size={16} />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
