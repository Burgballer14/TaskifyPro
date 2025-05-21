
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { AchievementCard } from '@/components/achievements/achievement-card';
import { ACHIEVEMENTS_LIST, ACHIEVEMENTS_STORAGE_KEY } from '@/lib/achievements-data';
import type { Achievement } from '@/types';
import { Loader2 } from 'lucide-react';

interface UnlockedAchievements {
  [achievementId: string]: { unlocked: boolean; unlockDate?: string };
}

export default function AchievementsPage() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievements>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedData) {
        try {
          setUnlockedAchievements(JSON.parse(storedData));
        } catch (e) {
          console.error("Error parsing achievements from localStorage", e);
          // Initialize if parsing fails
          localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({}));
        }
      } else {
        // Initialize if not present
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify({}));
      }
    }
    setIsLoading(false);
  }, []);
  
  // Listen for storage changes to update UI dynamically if an achievement is unlocked elsewhere
   useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ACHIEVEMENTS_STORAGE_KEY && event.newValue) {
        try {
          setUnlockedAchievements(JSON.parse(event.newValue));
        } catch (e) {
          console.error("Error parsing achievements from storage event", e);
        }
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
          const status = unlockedAchievements[achievement.id] || { unlocked: false };
          return (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isUnlocked={status.unlocked}
              unlockDate={status.unlockDate ? new Date(status.unlockDate) : undefined}
            />
          );
        })}
      </div>
    </>
  );
}
