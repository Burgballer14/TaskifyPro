'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DUMMY_TASKS, TASK_STATUS_MAP } from '@/lib/constants';
import type { Task } from '@/types';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Tasks',
  },
  todo: {
    label: TASK_STATUS_MAP.todo.label,
    color: 'hsl(var(--muted-foreground))',
  },
  inProgress: {
    label: TASK_STATUS_MAP.inProgress.label,
    color: 'hsl(var(--primary))',
  },
  completed: {
    label: TASK_STATUS_MAP.completed.label,
    color: 'hsl(var(--chart-2))', // Using chart-2 for completed, could be green
  },
} satisfies ChartConfig;


export function TasksByStatusChart() {
  const data = Object.entries(
    DUMMY_TASKS.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Task['status'], number>)
  ).map(([status, count]) => ({
    status: TASK_STATUS_MAP[status as Task['status']].label,
    count,
    fill: chartConfig[status as keyof typeof chartConfig]?.color || 'hsl(var(--foreground))'
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8}/>
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
