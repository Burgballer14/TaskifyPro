
import type { Achievement, UnlockedAchievements, UserAchievementStatus } from '@/types';
import { Award, Palette, Flame, Trophy, Star, PawPrint } from 'lucide-react';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_task_completed',
    title: 'First Step Taken',
    description: 'Complete your very first task.',
    icon: Award,
    category: 'tasks',
    rewardPoints: 50,
  },
  {
    id: 'style_starter',
    title: 'A Splash of Color',
    description: 'Unlock your first theme from the store.',
    icon: Palette,
    category: 'store',
    rewardPoints: 100,
  },
  {
    id: 'pet_pal',
    title: 'Furry Friend',
    description: 'Unlock your first pet companion.',
    icon: PawPrint,
    category: 'store',
    rewardPoints: 100,
  },
  {
    id: 'streak_beginner',
    title: 'Consistent Starter',
    description: 'Log in on consecutive days to build your streak.',
    icon: Flame,
    category: 'streak',
    stages: [
      { stage: 1, titleSuffix: 'I', criteriaCount: 3, rewardPoints: 75, description: "Achieve a 3-day login streak." },
      { stage: 2, titleSuffix: 'II', criteriaCount: 7, rewardPoints: 125, description: "Keep it going for a 7-day login streak!" },
      { stage: 3, titleSuffix: 'III', criteriaCount: 14, rewardPoints: 200, description: "Impressive! A 14-day login streak!" },
    ],
  },
  {
    id: 'point_collector',
    title: 'Point Accumulator', // Changed title for clarity
    description: 'Accumulate points by completing tasks and earning achievements.', // Updated base description
    icon: Star,
    category: 'general', // Keep as general or 'points'
    stages: [
      { stage: 1, titleSuffix: 'Bronze', criteriaCount: 1000, rewardPoints: 100, description: "Collect a total of 1000 points." },
      { stage: 2, titleSuffix: 'Silver', criteriaCount: 2500, rewardPoints: 150, description: "Reach a total of 2500 points." },
      { stage: 3, titleSuffix: 'Gold', criteriaCount: 5000, rewardPoints: 250, description: "Amass a grand total of 5000 points!" },
    ],
  },
  {
    id: 'task_master_novice',
    title: 'Task Slayer',
    description: 'Demonstrate your dedication by completing multiple tasks.',
    icon: Trophy,
    category: 'tasks',
    stages: [
      { stage: 1, titleSuffix: 'I', criteriaCount: 10, rewardPoints: 100, description: "Complete 10 tasks to prove your mettle." },
      { stage: 2, titleSuffix: 'II', criteriaCount: 25, rewardPoints: 150, description: "Complete 25 tasks and show true commitment." },
      { stage: 3, titleSuffix: 'III', criteriaCount: 50, rewardPoints: 250, description: "Complete 50 tasks to become a Task Slayer Master!" },
    ],
  },
];

export const ACHIEVEMENTS_STORAGE_KEY = 'taskifyProAchievements';
export const USER_POINTS_BALANCE_KEY = 'taskifyProUserPointsBalance';
export const INITIAL_USER_POINTS = 500;
export const COMPLETED_TASKS_COUNT_KEY = 'taskifyProCompletedTasksCount';


// Helper function to check and unlock stages for the Point Collector achievement
export function checkAndUnlockPointCollectorAchievement(
  currentTotalPoints: number,
  // The unlockAchievement function specific to the calling file's context
  unlockAchievementFunction: (achievementId: string, achievementTitle: string, pointsToAward: number, stageNumber?: number, stageTitleSuffix?: string) => void
) {
  if (typeof window === 'undefined') return;

  const pointCollectorAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'point_collector');
  if (!pointCollectorAchievement || !pointCollectorAchievement.stages) return;

  const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
  let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
  const pointCollectorStatus: UserAchievementStatus = userAchievements[pointCollectorAchievement.id] || { currentStage: 0 };

  for (const stage of pointCollectorAchievement.stages) {
    if ((!pointCollectorStatus.currentStage || pointCollectorStatus.currentStage < stage.stage) && currentTotalPoints >= stage.criteriaCount) {
      // Call the passed-in unlockAchievement function to handle the actual unlocking and toast
      unlockAchievementFunction(
        pointCollectorAchievement.id,
        pointCollectorAchievement.title,
        stage.rewardPoints,
        stage.stage,
        stage.titleSuffix
      );
      // After unlocking a stage, update status for the next iteration if needed (though unlockAchievement should handle this)
      const updatedStoredAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      userAchievements = updatedStoredAchievementsRaw ? JSON.parse(updatedStoredAchievementsRaw) : {};
      pointCollectorStatus.currentStage = userAchievements[pointCollectorAchievement.id]?.currentStage || pointCollectorStatus.currentStage;

    }
  }
}
