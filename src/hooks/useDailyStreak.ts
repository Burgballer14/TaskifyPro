
"use client";

import { useState, useEffect } from 'react';
import { isSameDay, subDays, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS } from '@/lib/achievements-data';

const LAST_LOGIN_KEY = 'taskifyProLastLogin';
const STREAK_COUNT_KEY = 'taskifyProStreakCount';

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const { toast } = useToast();

  const unlockAchievement = (achievementId: string, achievementTitle: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let achievements = storedAchievements ? JSON.parse(storedAchievements) : {};
    
    if (!achievements[achievementId] || !achievements[achievementId].unlocked) {
      achievements[achievementId] = { unlocked: true, unlockDate: new Date().toISOString() };
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(achievements) }));

      const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
      let pointsAwardedMessage = "";
      if (achievement && achievement.rewardPoints && achievement.rewardPoints > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + achievement.rewardPoints;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${achievement.rewardPoints} Points!)`;
      }

      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievementTitle}${pointsAwardedMessage}`,
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

      if (updatedStreak >= 3) {
        unlockAchievement('streak_beginner', 'Consistent Starter');
      }
    }
    setIsLoadingStreak(false);
  }, []); 

  return { streak, isLoadingStreak };
}
