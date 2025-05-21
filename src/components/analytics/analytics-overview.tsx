
import { DailySummaryCard } from './daily-summary-card';
import { WeeklyProgressCard } from './weekly-progress-card';
import { AnalyticsStatsRow } from './analytics-stats-row'; // Import the new stats row
import type { DailySummaryOutput } from '@/ai/flows/daily-summary-flow';

interface AnalyticsOverviewProps {
  userName: string;
  summaryOutput: DailySummaryOutput;
  dailyScore: number;
  dailyPointCap: number; // New prop
  pointsThisWeek: number;
  weeklyPointGoal: number;
  totalActiveTasks: number;
  tasksCompletedThisWeekCount: number;
  overdueTasksCount: number;
}

export function AnalyticsOverview({ 
  userName, 
  summaryOutput, 
  dailyScore,
  dailyPointCap, // Destructure new prop
  pointsThisWeek,
  weeklyPointGoal,
  totalActiveTasks,
  tasksCompletedThisWeekCount,
  overdueTasksCount
}: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      <AnalyticsStatsRow
        totalActiveTasks={totalActiveTasks}
        tasksCompletedThisWeekCount={tasksCompletedThisWeekCount}
        overdueTasksCount={overdueTasksCount}
        pointsThisWeek={pointsThisWeek}
      />
      <DailySummaryCard 
        userName={userName}
        summaryOutput={summaryOutput}
        dailyScore={dailyScore}
        dailyPointCap={dailyPointCap} // Pass to DailySummaryCard
      />
      <WeeklyProgressCard 
        currentPoints={pointsThisWeek}
        goalPoints={weeklyPointGoal}
      />
      {/* The old chart grid has been removed */}
    </div>
  );
}
