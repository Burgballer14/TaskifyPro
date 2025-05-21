
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { loadTasksFromLocalStorage } from '@/lib/task-storage'; // Updated import
import type { Task } from '@/types';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TASK_PRIORITY_MAP, TASK_STATUS_MAP } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // For loading state

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage());
    setIsLoading(false);
  }, []);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      const dateKey = format(task.dueDate, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(task);
    });
    return map;
  }, [tasks]);

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDay.get(dateKey) || [];
  }, [selectedDate, tasksByDay]);

  const dayHasTasks = (date: Date): boolean => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return (tasksByDay.get(dateKey)?.length ?? 0) > 0;
  };

  const modifiers = {
    hasTasks: (date: Date) => dayHasTasks(date),
  };

  const modifiersStyles = {
    hasTasks: {
      fontWeight: 'bold',
      color: 'hsl(var(--primary))', // Day number will be primary color if it has tasks
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.28))] w-full items-center justify-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardContent className="p-0">
             <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                day_today: "bg-accent text-accent-foreground",
                // Ensure day_outside text color is distinct if it also hasTasks
                day_outside: "text-muted-foreground/70 aria-selected:bg-accent/50 aria-selected:text-muted-foreground", 
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="shadow-lg h-full flex flex-col">
          <CardHeader>
            <CardTitle>
              Tasks for {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Selected Date'}
            </CardTitle>
            <CardDescription>
              {tasksForSelectedDate.length > 0 
                ? `${tasksForSelectedDate.length} task(s) due on this day.`
                : "No tasks due on this day."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            {tasksForSelectedDate.length > 0 ? (
              <ScrollArea className="h-full pr-3"> 
                <ul className="space-y-3">
                  {tasksForSelectedDate.map(task => {
                    const priorityInfo = TASK_PRIORITY_MAP[task.priority];
                    const statusInfo = TASK_STATUS_MAP[task.status];
                    return (
                      <li key={task.id} className="p-4 rounded-lg border bg-card shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold text-base text-card-foreground mb-2">{task.title}</h4>
                        
                        <div className="flex items-center justify-between text-xs">
                          {/* Priority Badge */}
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium",
                            priorityInfo.color, 
                            priorityInfo.color === 'text-red-500' ? 'bg-red-500/10 dark:bg-red-500/20' :
                            priorityInfo.color === 'text-yellow-500' ? 'bg-yellow-500/10 dark:bg-yellow-500/20' : 
                            'bg-green-500/10 dark:bg-green-500/20'
                          )}>
                            <priorityInfo.icon className={cn("h-3.5 w-3.5")} /> 
                            <span>{priorityInfo.label}</span> 
                          </div>

                          {/* Status Badge */}
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium",
                            statusInfo.color, 
                            task.status === 'completed' ? 'bg-green-500/10 dark:bg-green-500/20' :
                            task.status === 'inProgress' ? 'bg-primary/10 dark:bg-primary/20' :
                            'bg-muted' 
                          )}>
                            <statusInfo.icon className={cn("h-3.5 w-3.5", statusInfo.iconClassName)} /> 
                            <span>{statusInfo.label}</span> 
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a day on the calendar to see tasks.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

