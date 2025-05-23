'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Palette, Sun, Moon, Sparkles } from 'lucide-react';
import { getDefaultAvatar } from '@/components/ui/avatar-selector';

const USER_NAME_KEY = 'taskifyProUserName';
const USER_AVATAR_KEY = 'taskifyProUserAvatar';

interface MobileHeaderProps {
  userPoints: number;
  userName?: string;
  theme?: 'light' | 'dark' | 'sunset-glow';
  onThemeChange?: (theme: 'light' | 'dark' | 'sunset-glow') => void;
  isSunsetUnlocked?: boolean;
}

/**
 * Mobile header component with theme switcher
 * Shows points, user avatar, and theme selector
 */
export function MobileHeader({ 
  userPoints, 
  userName: propUserName = "User Name",
  theme = 'light',
  onThemeChange,
  isSunsetUnlocked = false
}: MobileHeaderProps) {
  const [userAvatar, setUserAvatar] = useState(getDefaultAvatar());
  const [userName, setUserName] = useState(propUserName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Load user data from localStorage
      const storedUserName = localStorage.getItem(USER_NAME_KEY);
      if (storedUserName) {
        setUserName(storedUserName);
      }

      const storedUserAvatar = localStorage.getItem(USER_AVATAR_KEY);
      if (storedUserAvatar) {
        setUserAvatar(storedUserAvatar);
      }

      // Listen for storage changes to update avatar in real-time
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === USER_AVATAR_KEY && event.newValue) {
          setUserAvatar(event.newValue);
        }
        if (event.key === USER_NAME_KEY && event.newValue) {
          setUserName(event.newValue);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Use prop userName if provided, otherwise use stored userName
  const displayName = propUserName !== "User Name" ? propUserName : userName;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:hidden">
      {/* App logo/title */}
      <div className="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M6 6.75C6 6.33579 6.33579 6 6.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H6.75C6.33579 7.5 6 7.16421 6 6.75Z" fill="currentColor"/>
          <path d="M6 11.75C6 11.3358 6.33579 11 6.75 11H17.25C17.6642 11 18 11.3358 18 11.75C18 12.1642 17.6642 12.5 17.25 12.5H6.75C6.33579 12.5 6 12.1642 6 11.75Z" fill="currentColor"/>
          <path d="M6.75 16C6.33579 16 6 16.3358 6 16.75C6 17.1642 6.33579 17.5 6.75 17.5H13.25C13.6642 17.5 14 17.1642 14 16.75C14 16.3358 13.6642 16 13.25 16H6.75Z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M3 4.75C3 3.09315 4.34315 1.75 6 1.75H18C19.6569 1.75 21 3.09315 21 4.75V19.25C21 20.9069 19.6569 22.25 18 22.25H6C4.34315 22.25 3 20.9069 3 19.25V4.75ZM6 3.25C5.17157 3.25 4.5 3.92157 4.5 4.75V19.25C4.5 20.0784 5.17157 20.75 6 20.75H18C18.8284 20.75 19.5 20.0784 19.5 19.25V4.75C19.5 3.92157 18.8284 3.25 18 3.25H6Z" fill="currentColor"/>
        </svg>
        <h1 className="text-lg font-semibold">Taskify Pro</h1>
      </div>

      {/* Points, theme selector, and user info */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary" data-testid="points-display">
          <Wallet className="h-4 w-4"/>
          <span>{userPoints}</span>
        </div>
        
        {/* Theme Selector */}
        {onThemeChange && (
          <Select value={theme} onValueChange={(value) => onThemeChange(value as 'light' | 'dark' | 'sunset-glow')}>
            <SelectTrigger className="w-8 h-8 p-0 border-none bg-transparent hover:bg-muted">
              <Palette className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Dark
                </div>
              </SelectItem>
              <SelectItem value="sunset-glow" disabled={!isSunsetUnlocked}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Sunset
                  {!isSunsetUnlocked && <span className="text-xs text-muted-foreground/70">(Locked)</span>}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={mounted ? userAvatar : getDefaultAvatar()} alt="User Avatar" />
          <AvatarFallback>
            {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
