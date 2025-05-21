
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { AchievementCard } from '@/components/achievements/achievement-card';
import { ACHIEVEMENTS_LIST, ACHIEVEMENTS_STORAGE_KEY, COMPLETED_TASKS_COUNT_KEY, USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS } from '@/lib/achievements-data';
import type { Achievement, UnlockedAchievements, UserAchievementStatus } from '@/types';
import { Loader2 } from 'lucide-react';

export default function AchievementsPage() {
  const [userAchievements, setUserAchievements] = useState<UnlockedAchievements>({});
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load achievements status
      const storedData = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedData) {
        try {
          setUserAchievements(JSON.parse(storedData));
        } catch (e) {
          console.error("Error parsing achievements from localStorage", e);
          localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({}));
        }
      } else {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({}));
      }

      // Load completed tasks count for progress display
      const storedTasksCount = localStorage.getItem(COMPLETED_TASKS_COUNT_KEY);
      setCompletedTasksCount(storedTasksCount ? parseInt(storedTasksCount, 10) : 0);

      // Load current user points for 'point_collector' progress display
      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      setCurrentUserPoints(storedUserPoints ? parseInt(storedUserPoints, 10) : INITIAL_USER_POINTS);
    }
    setIsLoading(false);
  }, []);
  
   useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACHIEVEMENTS_STORAGE_KEY && event.newValue) {
        try {
          setUserAchievements(JSON.parse(event.newValue));
        } catch (e) {
          console.error("Error parsing achievements from storage event", e);
        }
      }
      if (event.key === COMPLETED_TASKS_COUNT_KEY && event.newValue) {
        setCompletedTasksCount(parseInt(event.newValue, 10));
      }
      if (event.key === USER_POINTS_BALANCE_KEY && event.newValue) {
        setCurrentUserPoints(parseInt(event.newValue, 10));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  if (isLoading) {
    return (
      <>
        <PageHeader
          title="My Achievements"
          description="Track your progress and milestones in Taskify Pro!"
        />
        <div className="flex h-[calc(100vh-theme(spacing.48))] w-full items-center justify-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="My Achievements"
        description="Track your progress and milestones in Taskify Pro!"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACHIEVEMENTS_LIST.map((achievement) => {
          const status: UserAchievementStatus = userAchievements[achievement.id] || { unlocked: false, currentStage: 0 };
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              status={status}
              completedTasksCount={achievement.category === 'tasks' ? completedTasksCount : undefined}
              currentUserPoints={achievement.id === 'point_collector' ? currentUserPoints : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
