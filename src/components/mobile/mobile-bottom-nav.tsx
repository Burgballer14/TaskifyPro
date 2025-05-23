'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  CheckSquare, 
  Calendar, 
  Trophy, 
  Store, 
  User,
  Badge
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
}

interface MobileBottomNavProps {
  hasNewStoreItems?: boolean;
}

/**
 * Mobile bottom navigation component
 * Replaces sidebar navigation on mobile devices
 */
export function MobileBottomNav({ hasNewStoreItems = false }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: '/dashboard/tasks',
      label: 'Tasks',
      icon: CheckSquare,
    },
    {
      href: '/dashboard/calendar',
      label: 'Calendar',
      icon: Calendar,
    },
    {
      href: '/dashboard/achievements',
      label: 'Achievements',
      icon: Trophy,
    },
    {
      href: '/dashboard/store',
      label: 'Store',
      icon: Store,
      badge: hasNewStoreItems,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-0 flex-1 px-2 py-2 text-xs font-medium transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                "active:scale-95 transition-transform duration-150",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={{ minHeight: '48px' }} // Ensure minimum touch target size
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "h-5 w-5 mb-1",
                    isActive && "text-primary"
                  )} 
                />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
                )}
              </div>
              <span 
                className={cn(
                  "truncate max-w-full",
                  isActive && "text-primary"
                )}
              >
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
