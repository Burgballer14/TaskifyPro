import { CalendarView } from '@/components/calendar/calendar-view';
import { PageHeader } from '@/components/page-header';

export default function CalendarPage() {
  return (
    <>
      <PageHeader 
        title="Task Calendar"
        description="Visualize your tasks and deadlines on a monthly calendar."
      />
      <CalendarView />
    </>
  );
}
