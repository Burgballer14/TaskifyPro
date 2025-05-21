
import type { Achievement } from '@/types';
import { Award, Palette, Flame, Trophy, Star, PawPrint } from 'lucide-react'; // Added Star

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
    description: 'Achieve a 3-day login streak.',
    icon: Flame,
    category: 'streak',
    rewardPoints: 75,
  },
  {
    id: 'point_collector',
    title: 'Point Hoarder',
    description: 'Earn 1000 points (from on-time tasks) in a single week.',
    icon: Star,
    category: 'general',
    rewardPoints: 250,
  },
  {
    id: 'task_master_novice',
    title: 'Task Slayer',
    description: 'Complete 10 tasks.',
    icon: Trophy,
    category: 'tasks',
    rewardPoints: 100,
  },
];

export const ACHIEVEMENTS_STORAGE_KEY = 'taskifyProAchievements';
export const USER_POINTS_BALANCE_KEY = 'taskifyProUserPointsBalance'; // Added for consistency
export const INITIAL_USER_POINTS = 500; // Added for consistency

