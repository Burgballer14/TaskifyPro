
'use client';

import type { Task } from '@/types';
import { TASK_PRIORITY_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface WeeklyTaskItemProps {
  task: Task;
}

export function WeeklyTaskItem({ task }: WeeklyTaskItemProps) {
  const priorityInfo = TASK_PRIORITY_MAP[task.priority];

  const priorityBorderClass =
    task.priority === 'high' ? 'bg-destructive' :
    task.priority === 'medium' ? 'bg-yellow-400 dark:bg-yellow-500' :
    task.priority === 'low' ? 'bg-green-500' :
    'bg-muted';

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-md bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={cn("w-1.5 h-8 rounded-full", priorityBorderClass)}></div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-foreground truncate" title={task.title}>
          {task.title}
        </p>
         {task.category && (
          <p className="text-xs text-muted-foreground">{task.category}</p>
        )}
      </div>
    </div>
  );
}
