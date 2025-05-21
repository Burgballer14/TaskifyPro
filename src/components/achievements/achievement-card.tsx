
'use client';

import type { Achievement, UserAchievementStatus, AchievementStage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock, Star } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  status: UserAchievementStatus;
  completedTasksCount?: number;
  currentUserPoints?: number; // For progress on point_collector
}

export function AchievementCard({ achievement, status, completedTasksCount = 0, currentUserPoints = 0 }: AchievementCardProps) {
  const IconComponent = achievement.icon;
  const isMultiStage = !!achievement.stages && achievement.stages.length > 0;
  
  let currentStageNumber = 0;
  let nextStage: AchievementStage | undefined = undefined;
  let displayTitle = achievement.title;
  let displayDescription = achievement.description;
  let progressValue = 0;
  let progressMax = 0;
  let progressLabel = "tasks"; // Default progress label
  let isFullyCompleted = false;
  let isUnlockedOverall = false;

  if (isMultiStage) {
    currentStageNumber = status.currentStage || 0;
    isUnlockedOverall = currentStageNumber > 0;
    const currentStageData = achievement.stages!.find(s => s.stage === currentStageNumber);
    
    if (currentStageNumber > 0 && currentStageData) {
      displayTitle = `${achievement.title} ${currentStageData.titleSuffix}`;
      displayDescription = currentStageData.description || achievement.description;
    }

    if (currentStageNumber < achievement.stages!.length) {
      nextStage = achievement.stages!.find(s => s.stage === currentStageNumber + 1);
      if (nextStage) {
        if (currentStageNumber === 0) {
             displayDescription = nextStage.description || achievement.description;
        }
        
        if (achievement.category === 'tasks' && completedTasksCount !== undefined) {
          progressValue = completedTasksCount;
          progressMax = nextStage.criteriaCount;
          progressLabel = "tasks";
        } else if (achievement.id === 'point_collector' && currentUserPoints !== undefined) {
          progressValue = currentUserPoints;
          progressMax = nextStage.criteriaCount;
          progressLabel = "points";
        }
      }
    } else {
      isFullyCompleted = true;
    }
  } else {
    isUnlockedOverall = !!status.unlocked;
    if (isUnlockedOverall) {
        isFullyCompleted = true;
    }
  }

  const cardBorderColor = () => {
    if (!isUnlockedOverall) return "border-border/50";
    if (isMultiStage) {
      if (currentStageNumber === 1) return "border-yellow-600/70 dark:border-yellow-500/70"; 
      if (currentStageNumber === 2) return "border-slate-400/70 dark:border-slate-300/70"; 
      if (currentStageNumber >= 3) return "border-amber-400/70 dark:border-amber-300/70"; 
    }
    return "border-green-500/50";
  };

  return (
    <Card 
      className={cn(
        "shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between h-full",
        isUnlockedOverall ? "bg-card" : "bg-card/60 opacity-80 grayscale-[30%]",
        cardBorderColor(),
        "border-2" 
      )}
    >
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <IconComponent 
                className={cn(
                  "h-10 w-10", 
                  isUnlockedOverall ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <div>
                <CardTitle className={cn("text-lg", isUnlockedOverall ? "text-foreground" : "text-muted-foreground")}>
                  {displayTitle}
                </CardTitle>
                <CardDescription className={cn("text-xs pt-1", isUnlockedOverall ? "text-muted-foreground" : "text-muted-foreground/80")}>
                  Category: {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                </CardDescription>
              </div>
            </div>
            {isFullyCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
            ) : isUnlockedOverall ? (
              <Star className="h-6 w-6 text-yellow-400 shrink-0" />
            ) : (
              <Lock className="h-6 w-6 text-muted-foreground shrink-0" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <p className={cn("text-sm leading-relaxed", isUnlockedOverall ? "text-foreground/90" : "text-muted-foreground/90")}>
            {displayDescription}
          </p>
          
          {isMultiStage && !isFullyCompleted && nextStage && (
            <div className="pt-1">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Next: {achievement.title} {nextStage.titleSuffix} (Reward: {nextStage.rewardPoints} pts)
              </p>
              {(achievement.category === 'tasks' || achievement.id === 'point_collector') && progressMax > 0 && (
                 <>
                    <Progress value={(progressValue / progressMax) * 100} className="h-2"/>
                    <p className="text-xs text-muted-foreground text-right">{progressValue}/{progressMax} {progressLabel}</p>
                 </>
              )}
               {achievement.category !== 'tasks' && achievement.id !== 'point_collector' && (
                <p className="text-xs text-muted-foreground">Criteria: {nextStage.description || `Achieve stage ${nextStage.stage}`}</p>
               )}
            </div>
          )}

          {isUnlockedOverall && status.unlockDate && (
            <p className="text-xs text-green-600 dark:text-green-400">
              {isMultiStage && currentStageData ? `Stage ${currentStageData.stage} u` : 'U'}nlocked on: {new Date(status.unlockDate).toLocaleDateString()}
            </p>
          )}
          {!isUnlockedOverall && (
             <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              {isMultiStage && nextStage ? `Work towards Stage ${nextStage.stage}!` : "Keep going to unlock!"}
            </p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
