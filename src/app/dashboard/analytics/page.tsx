
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { PageHeader } from '@/components/page-header';
import { DUMMY_TASKS } from '@/lib/constants';
import type { Task } from '@/types';
import { generateDailySummary, type DailySummaryInput, type DailySummaryOutput } from '@/ai/flows/daily-summary-flow';
import { isSameDay, startOfToday } from 'date-fns';

function isDateToday(date: Date | undefined): boolean {
  if (!date) return false;
  return isSameDay(date, startOfToday());
}

export default async function AnalyticsPage() {
  const userName = "User"; // Hardcoded for now

  const tasksCompletedToday = DUMMY_TASKS.filter(
    (task) => task.status === 'completed' && isDateToday(task.completedAt)
  );

  const tasksOpenToday = DUMMY_TASKS.filter(
    (task) => task.status !== 'completed' && isDateToday(task.dueDate)
  );

  const dailyScore = tasksCompletedToday.length * 10;

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
      <AnalyticsOverview 
        userName={userName}
        summaryOutput={summaryOutput}
        dailyScore={dailyScore}
      />
    </>
  );
}
