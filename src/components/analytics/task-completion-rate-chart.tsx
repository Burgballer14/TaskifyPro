'use client';

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { DUMMY_TASKS, TASK_STATUS_MAP } from '@/lib/constants';
import type { Task } from '@/types';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const completedTasks = DUMMY_TASKS.filter(task => task.status === 'completed').length;
const pendingTasks = DUMMY_TASKS.length - completedTasks;

const chartData = [
  { name: TASK_STATUS_MAP.completed.label, value: completedTasks, fill: 'hsl(var(--chart-2))' }, // Greenish
  { name: 'Pending', value: pendingTasks, fill: 'hsl(var(--primary))' }, // Primary color
];

const chartConfig = {
  tasks: {
    label: 'Tasks',
  },
  [TASK_STATUS_MAP.completed.label]: {
    label: TASK_STATUS_MAP.completed.label,
    color: 'hsl(var(--chart-2))',
  },
  Pending: {
    label: 'Pending',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export function TaskCompletionRateChart() {
  if (DUMMY_TASKS.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No task data available for completion rate.</p>;
  }
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-square">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
           <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
