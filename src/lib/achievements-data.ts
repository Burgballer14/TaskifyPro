
import type { Achievement } from '@/types';
import { Award, Palette, Flame, Trophy, Zap, Star } from 'lucide-react';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_task_completed',
    title: 'First Step Taken',
    description: 'Complete your very first task.',
    icon: Award,
    category: 'tasks',
  },
  {
    id: 'style_starter',
    title: 'A Splash of Color',
    description: 'Unlock your first theme from the store.',
    icon: Palette,
    category: 'store',
  },
  {
    id: 'pet_pal',
    title: 'Furry Friend',
    description: 'Unlock your first pet companion.',
    icon: Flame, // Using Flame for Doggo as per previous context, can be PawPrint too
    category: 'store',
  },
  {
    id: 'streak_beginner',
    title: 'Consistent Starter',
    description: 'Achieve a 3-day login streak.',
    icon: Zap, // Using Zap for streak, could be Flame too
    category: 'streak',
  },
  {
    id: 'point_collector',
    title: 'Point Hoarder',
    description: 'Earn 1000 points in a single week.',
    icon: Star,
    category: 'general',
  },
  {
    id: 'task_master_novice',
    title: 'Task Slayer',
    description: 'Complete 10 tasks.',
    icon: Trophy,
    category: 'tasks',
  },
];

export const ACHIEVEMENTS_STORAGE_KEY = 'taskifyProAchievements';
