import { ChartCard } from './chart-card';
import { TasksByStatusChart } from './tasks-by-status-chart';
import { TasksByPriorityChart } from './tasks-by-priority-chart';
import { TaskCompletionRateChart } from './task-completion-rate-chart';

export function AnalyticsOverview() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <ChartCard 
        title="Task Completion Rate" 
        description="Overall progress of task completion."
        className="xl:col-span-1"
        contentClassName="flex justify-center"
      >
        <TaskCompletionRateChart />
      </ChartCard>
      <ChartCard 
        title="Tasks by Status" 
        description="Distribution of tasks based on their current status."
        className="lg:col-span-1 xl:col-span-1"
      >
        <TasksByStatusChart />
      </ChartCard>
      <ChartCard 
        title="Tasks by Priority" 
        description="How tasks are prioritized across the board."
        className="lg:col-span-2 xl:col-span-1"
      >
        <TasksByPriorityChart />
      </ChartCard>
    </div>
  );
}
