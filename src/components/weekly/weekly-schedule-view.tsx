
'use client';

import { useState, useEffect, useMemo } from 'react';
import { loadTasksFromLocalStorage } from '@/lib/task-storage';
import type { Task } from '@/types';
import { format, startOfWeek, addDays, eachDayOfInterval, isSameDay, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WeeklyTaskItem } from './weekly-task-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card'; // Keep Card for day columns

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
                            .sort((a, b) => a.title.localeCompare(b.title)); // Basic sort
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {daysOfWeek.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDay.get(dateKey) || [];
          return (
            <Card key={dateKey} className="flex flex-col shadow-sm">
              <div className="p-3 border-b text-center bg-muted/50">
                <p className="text-sm font-medium text-foreground">{format(day, 'EEE')}</p>
                <p className="text-2xl font-bold text-primary">{format(day, 'd')}</p>
              </div>
              <CardContent className="p-2 flex-grow overflow-hidden">
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
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
