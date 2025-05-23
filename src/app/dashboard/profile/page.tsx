'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AvatarSelector, getDefaultAvatar } from "@/components/ui/avatar-selector";
import { 
  User, 
  Edit3, 
  Trophy, 
  Target, 
  Calendar,
  Flame,
  Wallet,
  Dog,
  Cat,
  Bird,
  Fish,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Loader2,
  Camera
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useDailyStreak } from '@/hooks/useDailyStreak';
import { loadTasksFromLocalStorage } from '@/lib/task-storage';
import { USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS, ACHIEVEMENTS_STORAGE_KEY } from '@/lib/achievements-data';
import { generateDailySummary, type DailySummaryInput, type DailySummaryOutput } from '@/ai/flows/daily-summary-flow';
import { isSameDay, startOfToday, startOfWeek, endOfWeek, isWithinInterval, isBefore, endOfDay } from 'date-fns';
import type { Task, UnlockedAchievements } from '@/types';

const USER_NAME_KEY = 'taskifyProUserName';
const USER_AVATAR_KEY = 'taskifyProUserAvatar';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';
const WEEKLY_POINT_GOAL = 1050; 
const DAILY_POINT_CAP = 150;

const petIcons = {
  doggo: Dog,
  kitto: Cat,
  birby: Bird,
  fishy: Fish,
};

export default function ProfilePage() {
  const [userName, setUserName] = useState('User Name');
  const [userAvatar, setUserAvatar] = useState(getDefaultAvatar());
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [tempName, setTempName] = useState('');
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<UnlockedAchievements>({});
  const [mounted, setMounted] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [summaryOutput, setSummaryOutput] = useState<DailySummaryOutput>({
    personalizedSummary: "Loading your personalized summary...",
    dailyScoreBlurb: "Loading...",
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  const { streak } = useDailyStreak();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Load user data
      const storedUserName = localStorage.getItem(USER_NAME_KEY);
      if (storedUserName) {
        setUserName(storedUserName);
      }

      const storedUserAvatar = localStorage.getItem(USER_AVATAR_KEY);
      if (storedUserAvatar) {
        setUserAvatar(storedUserAvatar);
      }

      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      }

      const storedSelectedPet = localStorage.getItem(SELECTED_PET_KEY);
      setSelectedPet(storedSelectedPet);

      const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }

      // Load tasks for stats
      const loadedTasks = loadTasksFromLocalStorage();
      setTasks(loadedTasks);

      // Listen for storage changes
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === USER_POINTS_BALANCE_KEY && event.newValue !== null) {
          setUserPoints(parseInt(event.newValue, 10));
        }
        if (event.key === SELECTED_PET_KEY) {
          setSelectedPet(event.newValue);
        }
        if (event.key === ACHIEVEMENTS_STORAGE_KEY && event.newValue) {
          setAchievements(JSON.parse(event.newValue));
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Analytics calculation effect
  useEffect(() => {
    if (!mounted) return;

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
          personalizedSummary: `Welcome, ${userName}! Have a productive day. (AI fallback)`,
          dailyScoreBlurb: "Today's Score",
        });
      })
      .finally(() => setIsLoadingAnalytics(false));

  }, [tasks, mounted, userName]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem(USER_NAME_KEY, tempName.trim());
      toast({
        title: "Profile Updated",
        description: "Your name has been saved successfully.",
        variant: "default",
      });
    }
    setIsEditingName(false);
    setTempName('');
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setTempName('');
  };

  const startEditing = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleAvatarSelect = (avatarSrc: string) => {
    setUserAvatar(avatarSrc);
    localStorage.setItem(USER_AVATAR_KEY, avatarSrc);
    setIsEditingAvatar(false);
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been changed successfully.",
      variant: "default",
    });
  };

  if (!mounted) {
    return (
      <>
        <PageHeader 
          title="Profile"
          description="Manage your account and view your productivity stats"
        />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const achievementCount = Object.keys(achievements).length;

  // Get pet info
  const PetIcon = selectedPet ? petIcons[selectedPet as keyof typeof petIcons] : null;
  const petName = selectedPet ? selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1) : null;

  return (
    <>
      <PageHeader 
        title="Profile"
        description="Manage your account and view your productivity insights"
      />
      
      <div className="space-y-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userAvatar} alt="User Avatar" />
                  <AvatarFallback className="text-lg">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                {isEditingName ? (
                  <div className="space-y-2">
                    <Label htmlFor="userName">Display Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="userName"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSaveName}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{userName}</h2>
                      <Button size="sm" variant="ghost" onClick={startEditing}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Taskify Pro User since {new Date().getFullYear()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Selection */}
            {isEditingAvatar && (
              <AvatarSelector
                selectedAvatar={userAvatar}
                onAvatarSelect={handleAvatarSelect}
                onClose={() => setIsEditingAvatar(false)}
              />
            )}

            {/* Current Pet Companion */}
            {selectedPet && PetIcon && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <PetIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Current Companion</p>
                  <p className="text-sm text-muted-foreground">{petName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Summary Card */}
        {analyticsData && (
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-muted-foreground">Generating your personalized summary...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">{summaryOutput.personalizedSummary}</p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm font-medium">{summaryOutput.dailyScoreBlurb}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{analyticsData.dailyScore}</span>
                      <span className="text-sm text-muted-foreground">/ {DAILY_POINT_CAP}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Analytics Stats Row */}
        {analyticsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.totalActiveTasks}</p>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{analyticsData.tasksCompletedThisWeekCount}</p>
                <p className="text-sm text-muted-foreground">Completed This Week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-600">{analyticsData.overdueTasksCount}</p>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{analyticsData.pointsThisWeek}</p>
                <p className="text-sm text-muted-foreground">Points This Week</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Weekly Progress Card */}
        {analyticsData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Points Goal</span>
                  <span className="text-sm text-muted-foreground">
                    {analyticsData.pointsThisWeek} / {WEEKLY_POINT_GOAL}
                  </span>
                </div>
                <Progress 
                  value={(analyticsData.pointsThisWeek / WEEKLY_POINT_GOAL) * 100} 
                  className="h-3"
                />
                <p className="text-xs text-muted-foreground">
                  {analyticsData.pointsThisWeek >= WEEKLY_POINT_GOAL 
                    ? "🎉 Congratulations! You've reached your weekly goal!" 
                    : `${WEEKLY_POINT_GOAL - analyticsData.pointsThisWeek} points remaining to reach your weekly goal.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Overall Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{userPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-orange-500">{streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">{achievementCount}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Task Completion Rate</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
