
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Sparkles, CheckCircle2, Dog, PawPrint, Wallet } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const SUNSET_THEME_KEY = 'taskifyProSunsetThemeUnlocked';
const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';
const USER_POINTS_BALANCE_KEY = 'taskifyProUserPointsBalance';

const INITIAL_USER_POINTS = 500; // Initial points if none are found
const SUNSET_THEME_COST = 500; // Updated cost
const DOGGO_PET_COST = 500;    // Updated cost

type Pet = 'doggo' | null;

export function ThemeUnlockCard() {
  const [isSunsetUnlocked, setIsSunsetUnlocked] = useState(false);
  const [isDoggoUnlocked, setIsDoggoUnlocked] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet>(null);
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sunsetUnlockedStatus = localStorage.getItem(SUNSET_THEME_KEY) === 'true';
      setIsSunsetUnlocked(sunsetUnlockedStatus);

      const doggoUnlockedStatus = localStorage.getItem(DOGGO_PET_UNLOCKED_KEY) === 'true';
      setIsDoggoUnlocked(doggoUnlockedStatus);

      const storedSelectedPet = localStorage.getItem(SELECTED_PET_KEY) as Pet | null;
      setSelectedPet(storedSelectedPet);

      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      } else {
        localStorage.setItem(USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS.toString());
        setUserPoints(INITIAL_USER_POINTS);
      }
    }
    setIsLoading(false);
  }, []);

  const handleUnlockTheme = () => {
    if (userPoints < SUNSET_THEME_COST) {
      toast({
        title: "Not Enough Points!",
        description: `Sunset Glow theme costs ${SUNSET_THEME_COST} points. You have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - SUNSET_THEME_COST;
    localStorage.setItem(USER_POINTS_BALANCE_KEY, newPoints.toString());
    setUserPoints(newPoints);
    
    localStorage.setItem(SUNSET_THEME_KEY, 'true');
    setIsSunsetUnlocked(true);
    toast({
      title: "Theme Unlocked!",
      description: `Sunset Glow theme is now available. Cost: ${SUNSET_THEME_COST} points.`,
      variant: "default",
    });
    window.dispatchEvent(new StorageEvent('storage', { key: SUNSET_THEME_KEY, newValue: 'true' }));
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));
  };

  const handleUnlockDoggo = () => {
    if (userPoints < DOGGO_PET_COST) {
      toast({
        title: "Not Enough Points!",
        description: `Doggo pet costs ${DOGGO_PET_COST} points. You have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - DOGGO_PET_COST;
    localStorage.setItem(USER_POINTS_BALANCE_KEY, newPoints.toString());
    setUserPoints(newPoints);

    localStorage.setItem(DOGGO_PET_UNLOCKED_KEY, 'true');
    setIsDoggoUnlocked(true);
    localStorage.setItem(SELECTED_PET_KEY, 'doggo'); // Auto-select new pet
    setSelectedPet('doggo');
    toast({
      title: "Pet Unlocked!",
      description: `Doggo is now your companion! Cost: ${DOGGO_PET_COST} points.`,
      variant: "default",
    });
    window.dispatchEvent(new StorageEvent('storage', { key: DOGGO_PET_UNLOCKED_KEY, newValue: 'true' }));
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: 'doggo' }));
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));
  };

  const handleSelectDoggo = () => {
    localStorage.setItem(SELECTED_PET_KEY, 'doggo');
    setSelectedPet('doggo');
    toast({
      title: "Companion Selected!",
      description: "Doggo is now your active companion.",
      variant: "default",
    });
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: 'doggo' }));
  };


  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Personalization Store</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading items and points...</p>
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
            <CardTitle className="text-xl font-semibold">Personalization Store</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-lg font-medium text-primary">
            <Wallet className="h-6 w-6"/>
            <span>{userPoints} Points</span>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Spend your points to unlock new themes and companions!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Theme Section */}
        <div className="p-4 rounded-lg bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-medium text-foreground">Sunset Glow Theme</h4>
            <p className="text-sm text-muted-foreground">
              A warm and vibrant theme inspired by beautiful sunsets. (Cost: {SUNSET_THEME_COST} Points)
            </p>
          </div>
          {isSunsetUnlocked ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium px-4 py-2 rounded-md bg-green-500/10">
              <CheckCircle2 className="h-5 w-5" />
              <span>Unlocked!</span>
            </div>
          ) : (
            <Button 
              onClick={handleUnlockTheme} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={userPoints < SUNSET_THEME_COST}
            >
              Unlock for {SUNSET_THEME_COST} Points
            </Button>
          )}
        </div>

        {/* Pet Companion Section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <PawPrint className="h-7 w-7 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Pet Companions</h3>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Dog className="h-12 w-12 text-primary shrink-0" />
              <div>
                <h4 className="text-lg font-medium text-foreground">Doggo the Friendly Pup</h4>
                <p className="text-sm text-muted-foreground">
                  Your loyal coding companion! (Cost: {DOGGO_PET_COST} Points)
                </p>
              </div>
            </div>
            {isDoggoUnlocked ? (
              selectedPet === 'doggo' ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium px-4 py-2 rounded-md bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Active Companion!</span>
                </div>
              ) : (
                <Button onClick={handleSelectDoggo} className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  Make Doggo Companion
                </Button>
              )
            ) : (
              <Button 
                onClick={handleUnlockDoggo} 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={userPoints < DOGGO_PET_COST}
              >
                Unlock for {DOGGO_PET_COST} Points
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center pt-4">
          Earn more points by completing tasks! More items coming soon!
        </p>
      </CardContent>
    </Card>
  );
}
