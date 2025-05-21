
'use client'; 

import { useState, useEffect } from 'react';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { PageHeader } from '@/components/page-header';
import { loadTasksFromLocalStorage } from '@/lib/task-storage';
import type { Task, UnlockedAchievements, UserAchievementStatus } from '@/types';
import { generateDailySummary, type DailySummaryInput, type DailySummaryOutput } from '@/ai/flows/daily-summary-flow';
import { isSameDay, startOfToday, startOfWeek, endOfWeek, isWithinInterval, isBefore, endOfDay } from 'date-fns';
import { ThemeUnlockCard } from '@/components/analytics/theme-unlock-card';
import { Loader2 } from 'lucide-react';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS } from '@/lib/achievements-data';
import { useToast } from '@/hooks/use-toast';

function isDateToday(date: Date | undefined): boolean {
  if (!date) return false;
  return isSameDay(date, startOfToday());
}

const WEEKLY_POINT_GOAL = 1050; 
const DAILY_POINT_CAP = 150;   

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryOutput, setSummaryOutput] = useState<DailySummaryOutput>({
    personalizedSummary: "Loading your personalized summary...",
    dailyScoreBlurb: "Daily Score",
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { toast } = useToast();

  const unlockAchievement = (achievementId: string, achievementTitle: string, pointsToAward: number, stageNumber?: number, stageTitleSuffix?: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
    
    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievement) return;

    const currentStatus: UserAchievementStatus = userAchievements[achievementId] || {};
    let newStageUnlocked = false;

    if (achievement.stages && stageNumber !== undefined) { 
      if (!currentStatus.currentStage || currentStatus.currentStage < stageNumber) {
        currentStatus.currentStage = stageNumber;
        if (!currentStatus.stageUnlockDates) currentStatus.stageUnlockDates = {};
        currentStatus.stageUnlockDates[stageNumber] = new Date().toISOString();
        currentStatus.unlockDate = new Date().toISOString(); 
        newStageUnlocked = true;
      }
    } else if (!achievement.stages) { // Single-stage achievement
      if (!currentStatus.unlocked) {
        currentStatus.unlocked = true;
        currentStatus.unlockDate = new Date().toISOString();
        newStageUnlocked = true;
      }
    }
    
    if (newStageUnlocked) {
      userAchievements[achievementId] = currentStatus;
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(userAchievements) }));

      let pointsAwardedMessage = "";
      if (pointsToAward > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + pointsToAward;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${pointsToAward} Points!)`;
      }

      const toastTitle = achievement.stages && stageTitleSuffix ? `${achievementTitle} ${stageTitleSuffix}` : achievementTitle;
      toast({
        title: `🏆 Achievement ${achievement.stages ? 'Stage ' : ''}Unlocked!`,
        description: `${toastTitle}${pointsAwardedMessage}`,
        variant: "default",
      });
    }
  };

  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading || !tasks.length) { 
      if (!isLoading && !tasks.length) { 
        setAnalyticsData({
          userName: "User",
          dailyScore: 0,
          pointsThisWeek: 0,
          totalActiveTasks: 0,
          tasksCompletedThisWeekCount: 0,
          overdueTasksCount: 0,
        });
        setSummaryOutput({
            personalizedSummary: `Welcome, User! Ready to start your day? Add some tasks!`,
            dailyScoreBlurb: "Today's Score",
        });
      }
      return;
    }

    const userName = "User"; 
    const today = startOfToday();

    const tasksCompletedTodayList = tasks.filter(
      (task) => task.status === 'completed' && task.completedAt && isSameDay(new Date(task.completedAt), today)
    );

    const calculatedDailyScore = tasksCompletedTodayList.reduce((sum, task) => {
      const completedOnTime = task.completedAt && task.dueDate && 
                             (isBefore(new Date(task.completedAt), endOfDay(new Date(task.dueDate))) || isSameDay(new Date(task.completedAt), new Date(task.dueDate)));
      const awardedPoints = completedOnTime ? (task.points || 0) : 0;
      return sum + awardedPoints;
    }, 0);
    const dailyScore = Math.min(calculatedDailyScore, DAILY_POINT_CAP); 

    const tasksOpenToday = tasks.filter(
      (task) => task.status !== 'completed' && task.dueDate && isSameDay(new Date(task.dueDate), today)
    );

    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const tasksCompletedThisWeekList = tasks.filter(
      (task) =>
        task.status === 'completed' &&
        task.completedAt &&
        isWithinInterval(new Date(task.completedAt), { start: weekStart, end: weekEnd })
    );

    const calculatedPointsThisWeek = tasksCompletedThisWeekList.reduce((sum, task) => {
      const completedOnTime = task.completedAt && task.dueDate && 
                             (isBefore(new Date(task.completedAt), endOfDay(new Date(task.dueDate))) || isSameDay(new Date(task.completedAt), new Date(task.dueDate)));
      const awardedPoints = completedOnTime ? (task.points || 0) : 0;
      return sum + awardedPoints;
    }, 0);
    const pointsThisWeek = Math.min(calculatedPointsThisWeek, WEEKLY_POINT_GOAL); 

    const totalActiveTasks = tasks.filter(task => task.status === 'todo' || task.status === 'inProgress').length;
    
    const overdueTasksCount = tasks.filter(
      task => task.status !== 'completed' && task.dueDate && isBefore(new Date(task.dueDate), today)
    ).length;

    setAnalyticsData({
      userName,
      dailyScore,
      pointsThisWeek,
      totalActiveTasks,
      tasksCompletedThisWeekCount: tasksCompletedThisWeekList.length,
      overdueTasksCount,
    });

    const pointCollectorAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'point_collector');
    if (pointCollectorAchievement && pointCollectorAchievement.stages) {
      const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
      const pointCollectorStatus: UserAchievementStatus = userAchievements[pointCollectorAchievement.id] || { currentStage: 0 };

      for (const stage of pointCollectorAchievement.stages) {
        if ((!pointCollectorStatus.currentStage || pointCollectorStatus.currentStage < stage.stage) && pointsThisWeek >= stage.criteriaCount) {
          unlockAchievement(pointCollectorAchievement.id, pointCollectorAchievement.title, stage.rewardPoints, stage.stage, stage.titleSuffix);
        }
      }
    }


    const summaryInput: DailySummaryInput = {
      userName,
      tasksCompletedToday: tasksCompletedTodayList.length,
      tasksOpenToday: tasksOpenToday.length,
    };

    generateDailySummary(summaryInput)
      .then(setSummaryOutput)
      .catch(error => {
        console.error("Error fetching daily summary:", error);
        setSummaryOutput({
          personalizedSummary: `Welcome, ${userName}! Have a productive day and remember to check your tasks.`,
          dailyScoreBlurb: "Today's Score",
        });
      });

  }, [tasks, isLoading, toast]); 

  if (isLoading || !analyticsData) {
    return (
      <>
        <PageHeader 
          title="Task Analytics"
          description="Gain insights into your productivity and task management with a personalized touch."
        />
        <div className="flex h-[calc(100vh-theme(spacing.48))] w-full items-center justify-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Task Analytics"
        description="Gain insights into your productivity and task management with a personalized touch."
      />
      <AnalyticsOverview 
        userName={analyticsData.userName}
        summaryOutput={summaryOutput}
        dailyScore={analyticsData.dailyScore}
        dailyPointCap={DAILY_POINT_CAP} 
        pointsThisWeek={analyticsData.pointsThisWeek}
        weeklyPointGoal={WEEKLY_POINT_GOAL}
        totalActiveTasks={analyticsData.totalActiveTasks}
        tasksCompletedThisWeekCount={analyticsData.tasksCompletedThisWeekCount}
        overdueTasksCount={analyticsData.overdueTasksCount}
      />
      <div className="mt-8">
        <ThemeUnlockCard />
      </div>
    </>
  );
}

