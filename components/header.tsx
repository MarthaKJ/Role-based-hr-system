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
import { Bell, LogOut, Settings, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

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
    <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-primary">IDRC</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100">
              <Avatar className="h-10 w-10 bg-blue-200">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-blue-200 text-blue-800 font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
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
