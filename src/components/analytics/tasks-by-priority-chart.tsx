'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DUMMY_TASKS, TASK_PRIORITY_MAP } from '@/lib/constants';
import type { Task } from '@/types';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  count: {
    label: 'Tasks',
  },
  low: {
    label: TASK_PRIORITY_MAP.low.label,
    color: 'hsl(var(--chart-5))', // Using a chart color
  },
  medium: {
    label: TASK_PRIORITY_MAP.medium.label,
    color: 'hsl(var(--chart-4))', // Using a chart color
  },
  high: {
    label: TASK_PRIORITY_MAP.high.label,
    color: 'hsl(var(--destructive))', // Using destructive color for high priority
  },
} satisfies ChartConfig;

export function TasksByPriorityChart() {
  const data = Object.entries(
    DUMMY_TASKS.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<Task['priority'], number>)
  ).map(([priority, count]) => ({
    priority: TASK_PRIORITY_MAP[priority as Task['priority']].label,
    count,
    fill: chartConfig[priority as keyof typeof chartConfig]?.color || 'hsl(var(--foreground))'
  }));
  
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <YAxis dataKey="priority" type="category" tickLine={false} axisLine={false} tickMargin={8} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8}/>
          <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
