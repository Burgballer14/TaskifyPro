
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, CheckCircle2, AlertOctagon, Star, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

function StatCardItem({ title, value, icon, description, className }: StatCardProps) {
  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}


interface AnalyticsStatsRowProps {
  totalActiveTasks: number;
  tasksCompletedThisWeekCount: number;
  overdueTasksCount: number;
  pointsThisWeek: number;
}

export function AnalyticsStatsRow({
  totalActiveTasks,
  tasksCompletedThisWeekCount,
  overdueTasksCount,
  pointsThisWeek,
}: AnalyticsStatsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCardItem
        title="Active Tasks"
        value={totalActiveTasks}
        icon={<Activity className="h-5 w-5 text-primary" />}
        description="To Do & In Progress"
      />
      <StatCardItem
        title="Completed This Week"
        value={tasksCompletedThisWeekCount}
        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        description="Tasks finished"
      />
      <StatCardItem
        title="Overdue Tasks"
        value={overdueTasksCount}
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        description="Require attention"
      />
      <StatCardItem
        title="Points This Week"
        value={pointsThisWeek}
        icon={<Star className="h-5 w-5 text-yellow-400" />}
        description="Weekly score"
      />
    </div>
  );
}
