
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
    <div className={cn(
      "flex items-center gap-3 p-2.5 rounded-lg bg-card shadow hover:shadow-lg transition-shadow duration-200",
      task.status === 'completed' ? 'opacity-60' : ''
    )}>
      <div className={cn("w-1.5 h-10 rounded-full flex-shrink-0", priorityBorderClass)}></div>
      <div className="flex-grow overflow-hidden">
        <p 
          className={cn(
            "text-sm font-medium text-foreground truncate",
            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
          )} 
          title={task.title}
        >
          {task.title}
        </p>
         {task.category && (
          <p className="text-xs text-muted-foreground">{task.category}</p>
        )}
      </div>
    </div>
  );
}
