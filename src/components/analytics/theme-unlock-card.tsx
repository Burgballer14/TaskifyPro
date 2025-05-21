
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const SUNSET_THEME_KEY = 'taskifyProSunsetThemeUnlocked';
const SUNSET_THEME_COST = 100; // Mock cost

export function ThemeUnlockCard() {
  const [isSunsetUnlocked, setIsSunsetUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlockedStatus = localStorage.getItem(SUNSET_THEME_KEY);
      setIsSunsetUnlocked(unlockedStatus === 'true');
    }
    setIsLoading(false);
  }, []);

  const handleUnlockTheme = () => {
    // In a real app, you would check points and deduct them here.
    // For now, we just unlock it.
    localStorage.setItem(SUNSET_THEME_KEY, 'true');
    setIsSunsetUnlocked(true);
    toast({
      title: "Theme Unlocked!",
      description: "You can now select the 'Sunset Glow' theme in the header.",
      variant: "default",
    });
    // Force a re-render or state update in DashboardLayout if it doesn't pick up localStorage change automatically
    // This can be done by triggering a custom event or using a global state manager.
    // For simplicity, we'll rely on the user manually selecting the theme after unlock.
    // A page refresh would also make the theme available in the dropdown.
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Theme Store</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading themes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-accent/30 bg-gradient-to-br from-accent/10 via-background to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Paintbrush className="h-7 w-7 text-accent" />
            <CardTitle className="text-xl font-semibold">Theme Store</CardTitle>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-400" />
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Unlock new visual themes to personalize your dashboard!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-medium text-foreground">Sunset Glow Theme</h4>
            <p className="text-sm text-muted-foreground">
              A warm and vibrant theme inspired by beautiful sunsets.
            </p>
          </div>
          {isSunsetUnlocked ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium px-4 py-2 rounded-md bg-green-500/10">
              <CheckCircle2 className="h-5 w-5" />
              <span>Unlocked!</span>
            </div>
          ) : (
            <Button onClick={handleUnlockTheme} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Unlock for {SUNSET_THEME_COST} Points
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          (Point deduction and more themes coming soon!)
        </p>
      </CardContent>
    </Card>
  );
}
