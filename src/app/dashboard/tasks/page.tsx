
import { TaskList } from '@/components/tasks/task-list';
import { PageHeader } from '@/components/page-header';
import { PetCompanionDisplay } from '@/components/tasks/pet-companion-display';

export default function TasksPage() {
  return (
    <>
      <PageHeader 
        title="My Tasks"
        description="View and manage all your tasks in one place."
      />
      <TaskList />
      <PetCompanionDisplay />
    </>
  );
}
