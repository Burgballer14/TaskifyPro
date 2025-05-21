'use client';

import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DUMMY_TASKS } from '@/lib/constants';
import type { Task } from '@/types';
import { format, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TASK_PRIORITY_MAP, TASK_STATUS_MAP } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    DUMMY_TASKS.forEach(task => {
      const dateKey = format(task.dueDate, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(task);
    });
    return map;
  }, []);

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
      color: 'hsl(var(--primary))',
      textDecoration: 'underline',
      textUnderlineOffset: '0.2em',
    }
  };
  

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
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card className="shadow-lg h-full">
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
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <ScrollArea className="h-[300px] pr-3"> {/* Adjust height as needed */}
                <ul className="space-y-3">
                  {tasksForSelectedDate.map(task => {
                    const priorityInfo = TASK_PRIORITY_MAP[task.priority];
                    const statusInfo = TASK_STATUS_MAP[task.status];
                    return (
                      <li key={task.id} className="p-3 rounded-md border bg-background/50 hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium text-sm text-foreground">{task.title}</h4>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <Badge variant={
                            task.priority === 'high' ? 'destructive' : 
                            task.priority === 'medium' ? 'secondary' : 'outline'
                          } className={cn(
                            priorityInfo.color === 'text-red-500' ? 'border-red-500/50 text-red-600' :
                            priorityInfo.color === 'text-yellow-500' ? 'border-yellow-500/50 text-yellow-600' :
                            'border-green-500/50 text-green-600'
                          )}>
                            <priorityInfo.icon className={cn("h-3 w-3 mr-1", priorityInfo.color)} />
                            {priorityInfo.label}
                          </Badge>
                           <div className="flex items-center gap-1">
                            <statusInfo.icon className={cn("h-3 w-3", statusInfo.color, statusInfo.iconClassName)} />
                            <span className={cn("text-xs", statusInfo.color)}>{statusInfo.label}</span>
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
