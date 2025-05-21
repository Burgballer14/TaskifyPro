import type { Task } from '@/types';
import {
  Circle,
  Loader2,
  CheckCircle2,
  ArrowDownNarrowWide,
  Minus,
  ArrowUpNarrowWide,
  type LucideIcon,
} from 'lucide-react';

export const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups for the new landing page, focusing on UX and modern design trends.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'inProgress',
    priority: 'high',
    category: 'Design',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '2',
    title: 'Develop API for user authentication',
    description: 'Implement OAuth 2.0 for user sign-up and login functionality.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'todo',
    priority: 'high',
    category: 'Development',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: '3',
    title: 'Write blog post about Q3 achievements',
    description: 'Summarize key achievements from the third quarter and outline goals for Q4.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'todo',
    priority: 'medium',
    category: 'Marketing',
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Client meeting for project feedback',
    description: 'Discuss project progress and gather feedback from the client.',
    dueDate: new Date(new Date().setDate(new Date().getDate() -1)),
    status: 'completed',
    priority: 'high',
    category: 'Meetings',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    completedAt: new Date(new Date().setDate(new Date().getDate() -1)),
  },
  {
    id: '5',
    title: 'Update project dependencies',
    description: 'Review and update all project dependencies to their latest stable versions.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    status: 'todo',
    priority: 'low',
    category: 'Development',
    createdAt: new Date(),
  },
  {
    id: '6',
    title: 'Plan team building activity',
    description: 'Organize a fun and engaging team building activity for next month.',
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: 'inProgress',
    priority: 'medium',
    category: 'HR',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '7',
    title: 'Review quarterly budget',
    description: 'Analyze the quarterly budget report and prepare for the next quarter planning.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'todo',
    priority: 'high',
    category: 'Finance',
    createdAt: new Date(new Date().setDate(new Date().getDate() -1)),
  },
  {
    id: '8',
    title: 'User testing for new feature',
    description: 'Conduct user testing sessions for the newly developed feature and gather insights.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    status: 'todo',
    priority: 'medium',
    category: 'UX Research',
    createdAt: new Date(),
  },
];

export const TASK_STATUS_MAP: Record<
  Task['status'],
  { label: string; icon: LucideIcon; color: string; iconClassName?: string }
> = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground' },
  inProgress: { label: 'In Progress', icon: Loader2, color: 'text-primary', iconClassName: 'animate-spin' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-green-500' },
};

export const TASK_PRIORITY_MAP: Record<
  Task['priority'],
  { label: string; icon: LucideIcon; color: string }
> = {
  low: { label: 'Low', icon: ArrowDownNarrowWide, color: 'text-green-500' },
  medium: { label: 'Medium', icon: Minus, color: 'text-yellow-500' },
  high: { label: 'High', icon: ArrowUpNarrowWide, color: 'text-red-500' },
};
