
import type { Task } from '@/types';
import { TASK_STATUS_MAP, TASK_PRIORITY_MAP } from '@/lib/constants';
import { CalendarIcon, TagIcon, Award, CheckSquare, Pencil, Repeat } from 'lucide-react'; // Added Repeat
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
}

export function TaskCard({ task, onCompleteTask, onEditTask }: TaskCardProps) {
  const statusInfo = TASK_STATUS_MAP[task.status];
  const priorityInfo = TASK_PRIORITY_MAP[task.priority];

  const priorityBorderClass =
    task.priority === 'high' ? 'border-t-destructive' :
    task.priority === 'medium' ? 'border-t-yellow-400 dark:border-t-yellow-500' :
    task.priority === 'low' ? 'border-t-green-400 dark:border-t-green-500' :
    'border-t-transparent';

  const descriptionElement = (
    <p className="text-sm text-muted-foreground mb-4 h-10 overflow-hidden">
      {task.description || "No description."}
    </p>
  );

  return (
    <div className={cn(
      "bg-card text-card-foreground bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-0.5 flex flex-col justify-between",
      "border-t-[5px]",
      priorityBorderClass
    )}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
          <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                             priorityInfo.color === 'text-red-500' ? 'bg-red-500/10 dark:bg-red-500/20' :
                             priorityInfo.color === 'text-yellow-500' ? 'bg-yellow-400/20 dark:bg-yellow-500/20' :
                             'bg-green-500/10 dark:bg-green-500/20'
                             )}>
            <priorityInfo.icon className={cn("h-3.5 w-3.5", priorityInfo.color)} />
            <span className={priorityInfo.color}>{priorityInfo.label}</span>
          </div>
        </div>

        {task.description && task.description.trim() !== "" ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                {descriptionElement}
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-xs break-words">
                <p className="text-sm">{task.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          descriptionElement
        )}

        <div className="border-t border-border/50 pt-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
            </div>
            {task.recurrence && task.recurrence !== 'none' && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-default">
                      <Repeat className="h-3 w-3" />
                      <span>
                        {task.recurrence === 'daily' && 'Daily'}
                        {task.recurrence === 'weekly' && 'Weekly'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>This task repeats {task.recurrence}.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
           <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
            {task.category && (
              <div className="flex items-center gap-1.5">
                <TagIcon className="h-3.5 w-3.5" />
                <span>{task.category}</span>
              </div>
            )}
            {task.points && (
              <div className="flex items-center gap-1.5 text-yellow-500">
                <Award className="h-3.5 w-3.5" />
                <span>{task.points} points</span>
              </div>
            )}
          </div>


          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-3",
            statusInfo.color,
            task.status === 'completed' ? 'bg-green-500/10 dark:bg-green-500/20' :
            task.status === 'inProgress' ? 'bg-primary/10 dark:bg-primary/20' :
            'bg-muted'
          )}>
            <statusInfo.icon className={cn("h-3.5 w-3.5", statusInfo.iconClassName)} />
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {task.status !== 'completed' && (
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEditTask(task.id)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onCompleteTask(task.id)}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Complete
          </Button>
        </div>
      )}
      {task.status === 'completed' && task.recurrence && task.recurrence !== 'none' && (
         <p className="text-xs text-muted-foreground mt-2 text-center">This recurring task will reset to 'To Do' for its next due date.</p>
      )}
    </div>
  );
}
