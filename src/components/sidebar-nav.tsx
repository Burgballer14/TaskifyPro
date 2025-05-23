'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListChecks, CalendarDays, Trophy, Store, User } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'tasks', href: '/dashboard/tasks', label: 'Tasks', icon: ListChecks },
  { id: 'calendar', href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'achievements', href: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
  { id: 'store', href: '/dashboard/store', label: 'Store', icon: Store },
  { id: 'profile', href: '/dashboard/profile', label: 'Profile', icon: User },
];

interface SidebarNavProps {
  hasNewStoreItems?: boolean;
}

export function SidebarNav({ hasNewStoreItems }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const isStoreAndHasNew = item.id === 'store' && hasNewStoreItems;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={cn(
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              tooltip={{children: item.label, className: "bg-card text-card-foreground border-border"}}
            >
              <Link href={item.href} className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {isStoreAndHasNew && (
                  <span 
                    className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" 
                    aria-label="New items in store"
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
