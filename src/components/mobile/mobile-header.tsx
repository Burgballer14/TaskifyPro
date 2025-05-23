'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wallet } from 'lucide-react';

interface MobileHeaderProps {
  userPoints: number;
  userName?: string;
}

/**
 * Minimal mobile header component
 * Shows only essential information: points and user avatar
 */
export function MobileHeader({ userPoints, userName = "User Name" }: MobileHeaderProps) {
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

      {/* Points and user info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary" data-testid="points-display">
          <Wallet className="h-4 w-4"/>
          <span>{userPoints}</span>
        </div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
          <AvatarFallback>
            {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
