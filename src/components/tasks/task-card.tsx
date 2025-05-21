import type { Task } from '@/types';
import { TASK_STATUS_MAP, TASK_PRIORITY_MAP } from '@/lib/constants';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const statusInfo = TASK_STATUS_MAP[task.status];
  const priorityInfo = TASK_PRIORITY_MAP[task.priority];

  return (
    <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium", 
                           priorityInfo.color === 'text-red-500' ? 'bg-red-500/10' :
                           priorityInfo.color === 'text-yellow-500' ? 'bg-yellow-500/10' :
                           'bg-green-500/10'
                           )}>
          <priorityInfo.icon className={cn("h-3.5 w-3.5", priorityInfo.color)} />
          <span className={priorityInfo.color}>{priorityInfo.label}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
        {task.description}
      </p>
      <div className="border-t border-border/50 pt-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TagIcon className="h-3.5 w-3.5" />
            <span>{task.category}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <statusInfo.icon className={cn("h-4 w-4", statusInfo.color, statusInfo.iconClassName)} />
          <span className={cn("text-xs font-medium", statusInfo.color)}>{statusInfo.label}</span>
        </div>
      </div>
    </div>
  );
}
