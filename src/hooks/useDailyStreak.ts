
"use client";

import { useState, useEffect } from 'react';
import { isSameDay, subDays, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS } from '@/lib/achievements-data';
import type { UnlockedAchievements, UserAchievementStatus } from '@/types';

const LAST_LOGIN_KEY = 'taskifyProLastLogin';
const STREAK_COUNT_KEY = 'taskifyProStreakCount';

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const { toast } = useToast();

  const unlockAchievement = (achievementId: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
    
    const achievementToUnlock = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievementToUnlock) return;

    const currentStatus: UserAchievementStatus = userAchievements[achievementId] || {};
    let newUnlock = false;

    // Simplified for single-stage achievements from streak hook
    if (!currentStatus.unlocked) {
        currentStatus.unlocked = true;
        currentStatus.unlockDate = new Date().toISOString();
        newUnlock = true;
    }
    
    if (newUnlock) {
      userAchievements[achievementId] = currentStatus;
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(userAchievements) }));

      let pointsAwardedMessage = "";
      if (achievementToUnlock.rewardPoints && achievementToUnlock.rewardPoints > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + achievementToUnlock.rewardPoints;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${achievementToUnlock.rewardPoints} Points!)`;
      }

      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievementToUnlock.title}${pointsAwardedMessage}`,
        variant: "default",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = startOfDay(new Date());
      const lastLoginDateStr = localStorage.getItem(LAST_LOGIN_KEY);
      const currentStreakStr = localStorage.getItem(STREAK_COUNT_KEY);

      let updatedStreak = 0;

      if (lastLoginDateStr) {
        const lastLoginDate = startOfDay(new Date(lastLoginDateStr));
        const previousStreak = parseInt(currentStreakStr || '0', 10);

        if (isSameDay(lastLoginDate, subDays(today, 1))) {
          updatedStreak = previousStreak + 1;
        } else if (isSameDay(lastLoginDate, today)) {
          updatedStreak = previousStreak > 0 ? previousStreak : 1; 
        } else {
          updatedStreak = 1; 
        }
      } else {
        updatedStreak = 1;
      }

      localStorage.setItem(LAST_LOGIN_KEY, today.toISOString());
      localStorage.setItem(STREAK_COUNT_KEY, updatedStreak.toString());
      setStreak(updatedStreak);

      if (updatedStreak >= 3) { // Assuming 3-day streak for "Consistent Starter"
        unlockAchievement('streak_beginner');
      }
    }
    setIsLoadingStreak(false);
  }, []); 

  return { streak, isLoadingStreak };
}
