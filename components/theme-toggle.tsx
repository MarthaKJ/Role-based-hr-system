'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Toggle theme"
          className="relative rounded-full p-2 hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
        >
          {mounted ? (
            <>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </>
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => setTheme('light')}
          className={`flex cursor-pointer items-center gap-2 ${theme === 'light' ? 'font-medium' : ''}`}
        >
          <Sun size={16} />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme('dark')}
          className={`flex cursor-pointer items-center gap-2 ${theme === 'dark' ? 'font-medium' : ''}`}
        >
          <Moon size={16} />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => setTheme('system')}
          className={`flex cursor-pointer items-center gap-2 ${theme === 'system' ? 'font-medium' : ''}`}
        >
          <Monitor size={16} />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
