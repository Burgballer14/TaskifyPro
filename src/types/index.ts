
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: 'general' | 'tasks' | 'store' | 'streak';
  // criteria: () => boolean; // For tracking, to be added later
  // unlockDate?: Date; // To be added later
}
