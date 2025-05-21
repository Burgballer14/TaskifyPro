
'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadTasksFromLocalStorage } from '@/lib/task-storage';
import type { Task } from '@/types';
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WeeklyTaskItem } from './weekly-task-item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function WeeklyScheduleView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTasks(loadTasksFromLocalStorage());
    setIsLoading(false);
  }, []);

  const daysOfWeek = useMemo(() => {
    return eachDayOfInterval({ start: currentWeekStart, end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }) });
  }, [currentWeekStart]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    daysOfWeek.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), day))
                            .sort((a, b) => a.title.localeCompare(b.title));
      map.set(dateKey, dayTasks);
    });
    return map;
  }, [tasks, daysOfWeek]);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const handleToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };
  
  if (isLoading) {
    return <p className="text-center text-muted-foreground py-8">Loading weekly schedule...</p>;
  }

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
        </div>
        <h3 className="text-lg font-semibold text-foreground text-center flex-grow">
          {format(currentWeekStart, 'MMM dd, yyyy')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
        </h3>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {daysOfWeek.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDay.get(dateKey) || [];
            return (
              <Card 
                key={dateKey} 
                className={cn(
                  "w-72 flex-shrink-0 flex flex-col shadow-md",
                  isToday(day) ? "border-primary border-2" : ""
                )}
              >
                <CardHeader className={cn("pb-2", isToday(day) ? "bg-primary/10" : "bg-muted/50")}>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {format(day, 'EEEE')} {/* Full day name */}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {format(day, 'MMMM do')} {/* Month and day number */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 flex-grow overflow-hidden">
                  {dayTasks.length > 0 ? (
                    <ScrollArea className="h-[250px] sm:h-[300px]"> 
                      <div className="space-y-2 pr-2">
                        {dayTasks.map(task => (
                          <WeeklyTaskItem key={task.id} task={task} />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-muted-foreground">No tasks for this day.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
