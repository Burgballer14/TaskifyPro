
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Sparkles, CheckCircle2, Dog, PawPrint, Wallet } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS, checkAndUnlockPointCollectorAchievement } from '@/lib/achievements-data';
import type { Achievement, UnlockedAchievements, UserAchievementStatus } from '@/types';


const SUNSET_THEME_KEY = 'taskifyProSunsetThemeUnlocked';
const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

const SUNSET_THEME_COST = 500; 
const DOGGO_PET_COST = 500;    

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
       // Initial check for point collector achievement on load
      const currentTotalPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
      checkAndUnlockPointCollectorAchievement(currentTotalPoints, unlockAchievement);
    }
    setIsLoading(false);
  }, []);

  const unlockAchievement = (achievementId: string, achievementTitle?: string, pointsToAwardArg?: number, stageNumber?: number, stageTitleSuffix?: string) => {
    if (typeof window === 'undefined') return;
    
    const achievementToUnlock = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievementToUnlock) return;

    // Determine title and points from achievement data if not passed directly (for point_collector)
    const title = achievementTitle || achievementToUnlock.title;
    let pointsToAward = pointsToAwardArg;
    if (pointsToAward === undefined) {
      if (achievementToUnlock.stages && stageNumber !== undefined) {
        const stageData = achievementToUnlock.stages.find(s => s.stage === stageNumber);
        pointsToAward = stageData?.rewardPoints || 0;
      } else {
        pointsToAward = achievementToUnlock.rewardPoints || 0;
      }
    }


    const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
    const currentStatus: UserAchievementStatus = userAchievements[achievementId] || {};
    let newUnlock = false;

    if (achievementToUnlock.stages && stageNumber !== undefined) {
        if(!currentStatus.currentStage || currentStatus.currentStage < stageNumber) {
            currentStatus.currentStage = stageNumber;
            if (!currentStatus.stageUnlockDates) currentStatus.stageUnlockDates = {};
            currentStatus.stageUnlockDates[stageNumber] = new Date().toISOString();
            currentStatus.unlockDate = new Date().toISOString();
            newUnlock = true;
        }
    } else if (!achievementToUnlock.stages) {
        if (!currentStatus.unlocked) {
            currentStatus.unlocked = true;
            currentStatus.unlockDate = new Date().toISOString();
            newUnlock = true;
        }
    }


    if (newUnlock) {
      userAchievements[achievementId] = currentStatus;
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(userAchievements) }));

      let pointsAwardedMessage = "";
      if (pointsToAward && pointsToAward > 0) {
        const currentTotalPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentTotalPoints + pointsToAward;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        setUserPoints(newTotalPoints); 
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${pointsToAward} Points!)`;
         // After awarding points for this achievement, check Point Collector
        checkAndUnlockPointCollectorAchievement(newTotalPoints, unlockAchievement);
      }

      const finalToastTitle = achievementToUnlock.stages && stageTitleSuffix ? `${title} ${stageTitleSuffix}` : title;
      toast({
        title: `🏆 Achievement ${achievementToUnlock.stages ? 'Stage ' : ''}Unlocked!`,
        description: `${finalToastTitle}${pointsAwardedMessage}`,
        variant: "default",
      });
    }
  };

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
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));
    
    localStorage.setItem(SUNSET_THEME_KEY, 'true');
    setIsSunsetUnlocked(true);
    toast({
      title: "Theme Unlocked!",
      description: `Sunset Glow theme is now available. Cost: ${SUNSET_THEME_COST} points.`,
      variant: "default",
    });
    window.dispatchEvent(new StorageEvent('storage', { key: SUNSET_THEME_KEY, newValue: 'true' }));
    
    const styleStarterAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'style_starter');
    if (styleStarterAchievement) {
        unlockAchievement(styleStarterAchievement.id, styleStarterAchievement.title, styleStarterAchievement.rewardPoints);
    }
    // Check Point Collector after points deduction
    checkAndUnlockPointCollectorAchievement(newPoints, unlockAchievement);
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
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));


    localStorage.setItem(DOGGO_PET_UNLOCKED_KEY, 'true');
    setIsDoggoUnlocked(true);
    localStorage.setItem(SELECTED_PET_KEY, 'doggo'); 
    setSelectedPet('doggo');
    toast({
      title: "Pet Unlocked!",
      description: `Doggo is now your companion! Cost: ${DOGGO_PET_COST} points.`,
      variant: "default",
    });
    window.dispatchEvent(new StorageEvent('storage', { key: DOGGO_PET_UNLOCKED_KEY, newValue: 'true' }));
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: 'doggo' }));

    const petPalAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'pet_pal');
    if (petPalAchievement) {
        unlockAchievement(petPalAchievement.id, petPalAchievement.title, petPalAchievement.rewardPoints);
    }
    // Check Point Collector after points deduction
    checkAndUnlockPointCollectorAchievement(newPoints, unlockAchievement);
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
