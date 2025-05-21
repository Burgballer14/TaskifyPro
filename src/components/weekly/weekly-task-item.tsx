
'use client';

import type { Task } from '@/types';
import { TASK_PRIORITY_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface WeeklyTaskItemProps {
  task: Task;
}

export function WeeklyTaskItem({ task }: WeeklyTaskItemProps) {
  const priorityInfo = TASK_PRIORITY_MAP[task.priority];

  const priorityBarColor =
    task.priority === 'high' ? 'bg-destructive' :
    task.priority === 'medium' ? 'bg-yellow-400 dark:bg-yellow-500' :
    task.priority === 'low' ? 'bg-green-500' :
    'bg-muted';

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-md bg-card/80 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border/70",
      task.status === 'completed' ? 'opacity-70' : ''
    )}>
      <div className={cn("w-1 h-6 rounded-full flex-shrink-0", priorityBarColor)}></div>
      <div className="flex-grow overflow-hidden">
        <p 
          className={cn(
            "text-xs sm:text-sm font-medium text-foreground truncate",
            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
          )} 
          title={task.title}
        >
          {task.title}
        </p>
         {task.category && (
          <p className="text-xs text-muted-foreground/80">{task.category}</p>
        )}
      </div>
    </div>
  );
}
