
import type { Achievement } from '@/types';
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
    title: 'Consistent Starter', // Base Title
    description: 'Log in on consecutive days to build your streak.', // Base Description
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
    title: 'Point Hoarder', // Base Title
    description: 'Rack up points by completing tasks on time within a single week.', // Base Description
    icon: Star,
    category: 'general',
    stages: [
      { stage: 1, titleSuffix: 'Bronze', criteriaCount: 1000, rewardPoints: 100, description: "Earn 1000 points from on-time tasks in a single week." },
      { stage: 2, titleSuffix: 'Silver', criteriaCount: 2500, rewardPoints: 150, description: "Collect 2500 points in a week to show your dedication." },
      { stage: 3, titleSuffix: 'Gold', criteriaCount: 5000, rewardPoints: 250, description: "Master the art of productivity by earning 5000 points in one week!" },
    ],
  },
  {
    id: 'task_master_novice',
    title: 'Task Slayer', // Base Title
    description: 'Demonstrate your dedication by completing multiple tasks.', // Base Description
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
export const COMPLETED_TASKS_COUNT_KEY = 'taskifyProCompletedTasksCount'; // For tracking Task Slayer

