'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar/calendar-view';
import { PageHeader } from '@/components/page-header';
import { WeeklyScheduleView } from '@/components/weekly/weekly-schedule-view';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function CalendarPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <>
        <PageHeader
          title="Task Calendar & Weekly Schedule"
          description="Visualize your tasks and deadlines."
        />
        <div className="flex h-[calc(100vh-theme(spacing.28))] w-full items-center justify-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Task Calendar & Weekly Schedule"
        description="Visualize your tasks, deadlines, and weekly plan."
      />
      <CalendarView />
      <Separator className="my-8" />
      <h2 className="text-2xl font-semibold tracking-tight mb-4">
        Weekly Overview
      </h2>
      <WeeklyScheduleView />
    </>
  );
}
