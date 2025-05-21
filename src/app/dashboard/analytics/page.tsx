
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { PageHeader } from '@/components/page-header';
import { DUMMY_TASKS } from '@/lib/constants';
import type { Task } from '@/types';
import { generateDailySummary, type DailySummaryInput, type DailySummaryOutput } from '@/ai/flows/daily-summary-flow';
import { isSameDay, startOfToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { ThemeUnlockCard } from '@/components/analytics/theme-unlock-card'; // Import the new card

function isDateToday(date: Date | undefined): boolean {
  if (!date) return false;
  return isSameDay(date, startOfToday());
}

const WEEKLY_POINT_GOAL = 150; // Hardcoded weekly goal

export default async function AnalyticsPage() {
  const userName = "User"; // Hardcoded for now

  const tasksCompletedToday = DUMMY_TASKS.filter(
    (task) => task.status === 'completed' && isDateToday(task.completedAt)
  );

  const tasksOpenToday = DUMMY_TASKS.filter(
    (task) => task.status !== 'completed' && isDateToday(task.dueDate)
  );

  const dailyScore = tasksCompletedToday.reduce((sum, task) => sum + (task.points || 0), 0);

  // Calculate weekly progress
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const tasksCompletedThisWeek = DUMMY_TASKS.filter(
    (task) =>
      task.status === 'completed' &&
      task.completedAt &&
      isWithinInterval(task.completedAt, { start: weekStart, end: weekEnd })
  );
  const pointsThisWeek = tasksCompletedThisWeek.reduce((sum, task) => sum + (task.points || 0), 0);


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
    // Fallback data in case of AI flow error
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
      <div className="space-y-8"> {/* Added space-y for better separation */}
        <AnalyticsOverview 
          userName={userName}
          summaryOutput={summaryOutput}
          dailyScore={dailyScore}
          pointsThisWeek={pointsThisWeek}
          weeklyPointGoal={WEEKLY_POINT_GOAL}
        />
        <ThemeUnlockCard /> {/* Add the new theme unlock card here */}
      </div>
    </>
  );
}
