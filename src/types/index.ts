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
}
