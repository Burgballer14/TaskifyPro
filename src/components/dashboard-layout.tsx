
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
import { LogOut, Settings, Flame, Sun, Moon, Palette, Sparkles, Dog, PawPrint } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useDailyStreak } from "@/hooks/useDailyStreak";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const THEME_KEY = 'taskifyProTheme';
const SUNSET_THEME_UNLOCKED_KEY = 'taskifyProSunsetThemeUnlocked';
const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

type Theme = 'light' | 'dark' | 'sunset-glow';
type Pet = 'doggo' | null;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);
  const { streak, isLoadingStreak } = useDailyStreak();
  const [theme, setTheme] = React.useState<Theme>('light');
  const [isSunsetUnlocked, setIsSunsetUnlocked] = React.useState(false);
  // These states are kept in case other global UI elements depend on pet status later
  const [isDoggoUnlocked, setIsDoggoUnlocked] = React.useState(false);
  const [selectedPet, setSelectedPet] = React.useState<Pet>(null);
  const [mounted, setMounted] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());

    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const sunsetUnlockedStatus = localStorage.getItem(SUNSET_THEME_UNLOCKED_KEY) === 'true';
    setIsSunsetUnlocked(sunsetUnlockedStatus);

    const doggoUnlockedStatus = localStorage.getItem(DOGGO_PET_UNLOCKED_KEY) === 'true';
    setIsDoggoUnlocked(doggoUnlockedStatus);
    const storedSelectedPet = localStorage.getItem(SELECTED_PET_KEY) as Pet | null;
    
    if (doggoUnlockedStatus && storedSelectedPet) {
      setSelectedPet(storedSelectedPet);
    } else if (doggoUnlockedStatus && !storedSelectedPet) {
      setSelectedPet('doggo');
      localStorage.setItem(SELECTED_PET_KEY, 'doggo');
    } else {
      setSelectedPet(null);
    }


    if (storedTheme) {
      if (storedTheme === 'sunset-glow' && !sunsetUnlockedStatus) {
        setTheme('light'); 
        localStorage.setItem(THEME_KEY, 'light');
      } else {
        setTheme(storedTheme);
      }
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.remove('dark', 'sunset-glow');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'sunset-glow') {
      if (isSunsetUnlocked) {
        document.documentElement.classList.add('sunset-glow');
      } else {
        setTheme('light'); 
        document.documentElement.classList.remove('dark', 'sunset-glow');
        localStorage.setItem(THEME_KEY, 'light');
        return;
      }
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, isSunsetUnlocked, mounted]);
  
  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SUNSET_THEME_UNLOCKED_KEY) {
        const sunsetUnlockedStatus = event.newValue === 'true';
        setIsSunsetUnlocked(sunsetUnlockedStatus);
      }
      if (event.key === DOGGO_PET_UNLOCKED_KEY) {
        const doggoUnlockedStatus = event.newValue === 'true';
        setIsDoggoUnlocked(doggoUnlockedStatus);
      }
      if (event.key === SELECTED_PET_KEY) {
        setSelectedPet(event.newValue as Pet | null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Check on mount
    const initialSunsetUnlocked = localStorage.getItem(SUNSET_THEME_UNLOCKED_KEY) === 'true';
    if (initialSunsetUnlocked !== isSunsetUnlocked) setIsSunsetUnlocked(initialSunsetUnlocked);
    
    const initialDoggoUnlocked = localStorage.getItem(DOGGO_PET_UNLOCKED_KEY) === 'true';
    if (initialDoggoUnlocked !== isDoggoUnlocked) setIsDoggoUnlocked(initialDoggoUnlocked);

    const initialSelectedPet = localStorage.getItem(SELECTED_PET_KEY) as Pet | null;
    if (initialSelectedPet !== selectedPet) setSelectedPet(initialSelectedPet);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isSunsetUnlocked, isDoggoUnlocked, selectedPet]);


  const handleThemeChange = (newTheme: Theme) => {
    if (newTheme === 'sunset-glow' && !isSunsetUnlocked) {
       toast({
        title: "Theme Locked",
        description: "Unlock the 'Sunset Glow' theme from the Analytics page.",
        variant: "destructive",
      });
      return;
    }
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Flame className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
           {/* Pet Assistant Display Area has been REMOVED from here */}
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
            {isLoadingStreak ? (
              <span className="text-xs">Loading streak...</span>
            ) : streak > 0 ? (
              <div className="flex items-center justify-center gap-1.5 mb-2 text-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span>{streak} Day Streak!</span>
              </div>
            ) : null}
            {currentYear !== null ? `© ${currentYear} Taskify Pro` : 'Loading year...'}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
           <SidebarTrigger className="md:hidden" /> {/* Mobile toggle */}
           <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <Select value={theme} onValueChange={(value) => handleThemeChange(value as Theme)}>
                <SelectTrigger className="w-[130px] h-9 text-xs">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
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
                      <Sparkles className="h-4 w-4" /> Sunset Glow
                      {!isSunsetUnlocked && <span className="text-xs text-muted-foreground/70">(Locked)</span>}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
