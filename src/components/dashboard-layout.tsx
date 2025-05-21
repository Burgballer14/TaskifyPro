"use client"

import * as React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarTitle,
} from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Get current year for footer
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);
  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M6 6.75C6 6.33579 6.33579 6 6.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H6.75C6.33579 7.5 6 7.16421 6 6.75Z" fill="currentColor"/>
                <path d="M6 11.75C6 11.3358 6.33579 11 6.75 11H17.25C17.6642 11 18 11.3358 18 11.75C18 12.1642 17.6642 12.5 17.25 12.5H6.75C6.33579 12.5 6 12.1642 6 11.75Z" fill="currentColor"/>
                <path d="M6.75 16C6.33579 16 6 16.3358 6 16.75C6 17.1642 6.33579 17.5 6.75 17.5H13.25C13.6642 17.5 14 17.1642 14 16.75C14 16.3358 13.6642 16 13.25 16H6.75Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M3 4.75C3 3.09315 4.34315 1.75 6 1.75H18C19.6569 1.75 21 3.09315 21 4.75V19.25C21 20.9069 19.6569 22.25 18 22.25H6C4.34315 22.25 3 20.9069 3 19.25V4.75ZM6 3.25C5.17157 3.25 4.5 3.92157 4.5 4.75V19.25C4.5 20.0784 5.17157 20.75 6 20.75H18C18.8284 20.75 19.5 20.0784 19.5 19.25V4.75C19.5 3.92157 18.8284 3.25 18 3.25H6Z" fill="currentColor"/>
             </svg>
            <SidebarTitle className="text-xl font-semibold">Taskify Pro</SidebarTitle>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-2 text-sm">
              <Settings className="h-4 w-4" /> Settings
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-sm">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground text-center">
            {currentYear !== null ? `© ${currentYear} Taskify Pro` : 'Loading year...'}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
           <SidebarTrigger className="md:hidden" /> {/* Mobile toggle */}
           <div className="flex items-center gap-2 ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar" />
              <AvatarFallback>TP</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">User Name</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
