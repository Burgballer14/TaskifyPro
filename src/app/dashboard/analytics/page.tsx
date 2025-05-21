
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { PageHeader } from '@/components/page-header';
import { DUMMY_TASKS } from '@/lib/constants';
import type { Task } from '@/types';
import { generateDailySummary, type DailySummaryInput, type DailySummaryOutput } from '@/ai/flows/daily-summary-flow';
import { isSameDay, startOfToday, startOfWeek, endOfWeek, isWithinInterval, isBefore } from 'date-fns';
import { ThemeUnlockCard } from '@/components/analytics/theme-unlock-card';

function isDateToday(date: Date | undefined): boolean {
  if (!date) return false;
  return isSameDay(date, startOfToday());
}

const WEEKLY_POINT_GOAL = 150; // Hardcoded weekly goal

export default async function AnalyticsPage() {
  const userName = "User"; // Hardcoded for now
  const today = startOfToday();

  const tasksCompletedToday = DUMMY_TASKS.filter(
    (task) => task.status === 'completed' && isDateToday(task.completedAt)
  );

  const tasksOpenToday = DUMMY_TASKS.filter(
    (task) => task.status !== 'completed' && isDateToday(task.dueDate)
  );

  const dailyScore = tasksCompletedToday.reduce((sum, task) => sum + (task.points || 0), 0);

  // Calculate weekly progress
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const tasksCompletedThisWeek = DUMMY_TASKS.filter(
    (task) =>
      task.status === 'completed' &&
      task.completedAt &&
      isWithinInterval(task.completedAt, { start: weekStart, end: weekEnd })
  );
  const pointsThisWeek = tasksCompletedThisWeek.reduce((sum, task) => sum + (task.points || 0), 0);

  // Calculate stats for the new row
  const totalActiveTasks = DUMMY_TASKS.filter(task => task.status === 'todo' || task.status === 'inProgress').length;
  
  const overdueTasksCount = DUMMY_TASKS.filter(
    task => task.status !== 'completed' && isBefore(task.dueDate, today)
  ).length;

  const summaryInput: DailySummaryInput = {
    userName,
    tasksCompletedToday: tasksCompletedToday.length,
    tasksOpenToday: tasksOpenToday.length,
  };

  let summaryOutput: DailySummaryOutput;
  try {
    summaryOutput = await generateDailySummary(summaryInput);
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    summaryOutput = {
      personalizedSummary: `Welcome, ${userName}! Have a productive day and remember to check your tasks.`,
      dailyScoreBlurb: "Today's Score",
    };
  }

  return (
    <>
      <PageHeader 
        title="Task Analytics"
        description="Gain insights into your productivity and task management with a personalized touch."
      />
      <AnalyticsOverview 
        userName={userName}
        summaryOutput={summaryOutput}
        dailyScore={dailyScore}
        pointsThisWeek={pointsThisWeek}
        weeklyPointGoal={WEEKLY_POINT_GOAL}
        totalActiveTasks={totalActiveTasks}
        tasksCompletedThisWeekCount={tasksCompletedThisWeek.length}
        overdueTasksCount={overdueTasksCount}
      />
      <div className="mt-8"> {/* Added margin top for separation */}
        <ThemeUnlockCard />
      </div>
    </>
  );
}
