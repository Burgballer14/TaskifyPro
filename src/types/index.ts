
import type { LucideIcon } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'todo' | 'inProgress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  completedAt?: Date;
  points?: number;
}

export interface AchievementStage {
  stage: number;
  titleSuffix: string; // e.g., "I", "II", "Master"
  criteriaCount: number; // e.g., 10 tasks, 25 tasks
  rewardPoints: number;
  description?: string; // Optional: stage-specific description
}

export interface Achievement {
  id: string;
  title: string; // Base title, e.g., "Task Slayer"
  description: string; // Base description
  icon: LucideIcon;
  category: 'general' | 'tasks' | 'store' | 'streak';
  rewardPoints?: number; // For single-stage achievements or as a base if needed
  stages?: AchievementStage[]; // If present, achievement is multi-stage
}

// Stored in localStorage
export interface UserAchievementStatus {
  currentStage?: number; // For multi-stage achievements, indicates highest unlocked stage
  unlocked?: boolean; // For single-stage achievements
  unlockDate?: string; // Date of unlocking the highest stage or single stage
  stageUnlockDates?: { [stage: number]: string }; // Dates for each stage unlock
}

export interface UnlockedAchievements {
  [achievementId: string]: UserAchievementStatus;
}
