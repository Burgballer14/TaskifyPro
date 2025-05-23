'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Sparkles, Palette, CheckCircle2, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS } from '@/lib/achievements-data';

const SUNSET_THEME_KEY = 'taskifyProSunsetThemeUnlocked';
const OCEAN_THEME_KEY = 'taskifyProOceanThemeUnlocked';
const FOREST_THEME_KEY = 'taskifyProForestThemeUnlocked';

interface Theme {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
  preview: string;
  unlockKey: string;
  comingSoon?: boolean;
}

const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean and bright interface for daytime productivity',
    cost: 0,
    icon: Sun,
    preview: 'bg-gradient-to-br from-slate-50 to-white',
    unlockKey: '',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes for late-night task management',
    cost: 0,
    icon: Moon,
    preview: 'bg-gradient-to-br from-slate-900 to-slate-800',
    unlockKey: '',
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm oranges and purples inspired by beautiful sunsets',
    cost: 500,
    icon: Sparkles,
    preview: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    unlockKey: SUNSET_THEME_KEY,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blues and teals for a calming workspace',
    cost: 750,
    icon: Palette,
    preview: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600',
    unlockKey: OCEAN_THEME_KEY,
    comingSoon: true,
  },
  {
    id: 'forest-zen',
    name: 'Forest Zen',
    description: 'Natural greens for a peaceful, focused environment',
    cost: 1000,
    icon: Palette,
    preview: 'bg-gradient-to-br from-green-400 via-emerald-500 to-forest-600',
    unlockKey: FOREST_THEME_KEY,
    comingSoon: true,
  },
];

export function StoreThemes() {
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [unlockedThemes, setUnlockedThemes] = useState<Set<string>>(new Set(['light', 'dark']));
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      }

      const unlocked = new Set(['light', 'dark']);
      if (localStorage.getItem(SUNSET_THEME_KEY) === 'true') {
        unlocked.add('sunset-glow');
      }
      if (localStorage.getItem(OCEAN_THEME_KEY) === 'true') {
        unlocked.add('ocean-breeze');
      }
      if (localStorage.getItem(FOREST_THEME_KEY) === 'true') {
        unlocked.add('forest-zen');
      }
      setUnlockedThemes(unlocked);
    }
  }, []);

  const handleUnlockTheme = (theme: Theme) => {
    if (theme.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${theme.name} will be available in a future update.`,
        variant: "default",
      });
      return;
    }

    if (userPoints < theme.cost) {
      toast({
        title: "Not Enough Points!",
        description: `${theme.name} costs ${theme.cost} points. You have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - theme.cost;
    localStorage.setItem(USER_POINTS_BALANCE_KEY, newPoints.toString());
    setUserPoints(newPoints);
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));
    
    localStorage.setItem(theme.unlockKey, 'true');
    setUnlockedThemes(prev => new Set([...prev, theme.id]));
    
    toast({
      title: "Theme Unlocked!",
      description: `${theme.name} is now available in your theme selector.`,
      variant: "default",
    });
    
    window.dispatchEvent(new StorageEvent('storage', { key: theme.unlockKey, newValue: 'true' }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Themes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const isUnlocked = unlockedThemes.has(theme.id);
            const isFree = theme.cost === 0;
            const Icon = theme.icon;

            return (
              <div
                key={theme.id}
                className="relative p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                {theme.comingSoon && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Coming Soon
                  </Badge>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${theme.preview} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {isFree ? (
                          <Badge variant="outline" className="text-xs">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">{theme.cost} Points</Badge>
                        )}
                      </div>
                      
                      {isUnlocked ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Unlocked</span>
                        </div>
                      ) : isFree ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Available</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleUnlockTheme(theme)}
                          disabled={userPoints < theme.cost || theme.comingSoon}
                          className="text-xs"
                        >
                          {theme.comingSoon ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Soon
                            </>
                          ) : (
                            `Unlock`
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
