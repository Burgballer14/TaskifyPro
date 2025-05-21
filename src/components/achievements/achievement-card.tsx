
'use client';

import type { Achievement } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, Lock } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockDate?: Date; // Optional: To display when it was unlocked
}

export function AchievementCard({ achievement, isUnlocked, unlockDate }: AchievementCardProps) {
  const IconComponent = achievement.icon;

  return (
    <Card 
      className={cn(
        "shadow-lg transition-all duration-300 transform hover:-translate-y-0.5",
        isUnlocked ? "bg-card border-green-500/50" : "bg-card/60 border-border/50 opacity-70 grayscale-[50%]"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <IconComponent 
              className={cn(
                "h-10 w-10", 
                isUnlocked ? "text-primary" : "text-muted-foreground"
              )} 
            />
            <div>
              <CardTitle className={cn("text-lg", isUnlocked ? "text-foreground" : "text-muted-foreground")}>
                {achievement.title}
              </CardTitle>
              <CardDescription className={cn("text-xs pt-1", isUnlocked ? "text-muted-foreground" : "text-muted-foreground/80")}>
                Category: {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
              </CardDescription>
            </div>
          </div>
          {isUnlocked ? (
            <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
          ) : (
            <Lock className="h-6 w-6 text-muted-foreground shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className={cn("text-sm leading-relaxed", isUnlocked ? "text-foreground/90" : "text-muted-foreground/90")}>
          {achievement.description}
        </p>
        {isUnlocked && unlockDate && (
          <p className="text-xs text-green-600 dark:text-green-400">
            Unlocked on: {unlockDate.toLocaleDateString()}
          </p>
        )}
        {!isUnlocked && (
           <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Keep going to unlock!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
