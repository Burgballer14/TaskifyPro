
"use client";

import { useState, useEffect } from 'react';
import { isSameDay, subDays, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS, checkAndUnlockPointCollectorAchievement } from '@/lib/achievements-data';
import type { UnlockedAchievements, UserAchievementStatus, Achievement } from '@/types';

const LAST_LOGIN_KEY = 'taskifyProLastLogin';
const STREAK_COUNT_KEY = 'taskifyProStreakCount';

export function useDailyStreak() {
  const [streak, setStreak] = useState(0);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);
  const { toast } = useToast();

  const unlockAchievement = (achievementId: string, achievementTitle: string, pointsToAward: number, stageNumber?: number, stageTitleSuffix?: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
    
    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievement) return;

    const currentStatus: UserAchievementStatus = userAchievements[achievementId] || {};
    let newStageUnlocked = false;

    if (achievement.stages && stageNumber !== undefined) { 
      if (!currentStatus.currentStage || currentStatus.currentStage < stageNumber) {
        currentStatus.currentStage = stageNumber;
        if (!currentStatus.stageUnlockDates) currentStatus.stageUnlockDates = {};
        currentStatus.stageUnlockDates[stageNumber] = new Date().toISOString();
        currentStatus.unlockDate = new Date().toISOString(); 
        newStageUnlocked = true;
      }
    } else if (!achievement.stages) { 
      if (!currentStatus.unlocked) {
        currentStatus.unlocked = true;
        currentStatus.unlockDate = new Date().toISOString();
        newStageUnlocked = true;
      }
    }
    
    if (newStageUnlocked) {
      userAchievements[achievementId] = currentStatus;
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(userAchievements) }));

      let pointsAwardedMessage = "";
      if (pointsToAward > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + pointsToAward;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${pointsToAward} Points!)`;
        // After awarding points for this achievement, check Point Collector
        checkAndUnlockPointCollectorAchievement(newTotalPoints, unlockAchievement);
      }

      const toastTitle = achievement.stages && stageTitleSuffix ? `${achievementTitle} ${stageTitleSuffix}` : achievementTitle;
      toast({
        title: `🏆 Achievement ${achievement.stages ? 'Stage ' : ''}Unlocked!`,
        description: `${toastTitle}${pointsAwardedMessage}`,
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

      const streakAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'streak_beginner');
      if (streakAchievement && streakAchievement.stages) {
        const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
        const streakStatus: UserAchievementStatus = userAchievements[streakAchievement.id] || { currentStage: 0 };

        for (const stage of streakAchievement.stages) {
          if ((!streakStatus.currentStage || streakStatus.currentStage < stage.stage) && updatedStreak >= stage.criteriaCount) {
            unlockAchievement(streakAchievement.id, streakAchievement.title, stage.rewardPoints, stage.stage, stage.titleSuffix);
          }
        }
      }
       // Initial check for point collector achievement on load
       const currentTotalPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
       checkAndUnlockPointCollectorAchievement(currentTotalPoints, unlockAchievement);
    }
    setIsLoadingStreak(false);
  }, [toast]);

  return { streak, isLoadingStreak };
}
