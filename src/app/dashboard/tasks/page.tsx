import { TaskList } from '@/components/tasks/task-list';
import { PageHeader } from '@/components/page-header';

export default function TasksPage() {
  return (
    <>
      <PageHeader 
        title="My Tasks"
        description="View and manage all your tasks in one place."
      />
      <TaskList />
    </>
  );
}
