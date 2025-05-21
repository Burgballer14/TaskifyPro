
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface WeeklyProgressCardProps {
  currentPoints: number;
  goalPoints: number;
  className?: string;
}

export function WeeklyProgressCard({ currentPoints, goalPoints, className }: WeeklyProgressCardProps) {
  const progressPercentage = goalPoints > 0 ? (currentPoints / goalPoints) * 100 : 0;

  return (
    <Card className={`shadow-lg border-accent/30 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-accent" />
            <CardTitle className="text-2xl font-bold text-foreground">
              Weekly Goal Progress
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          See how you're tracking towards your weekly point target!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-lg text-foreground">
            You've earned <span className="font-bold text-primary">{currentPoints}</span> out of <span className="font-bold">{goalPoints}</span> points this week.
          </p>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <p className="text-sm text-muted-foreground text-center">
          {progressPercentage >= 100 
            ? "🎉 Amazing! You've hit your weekly goal! 🎉" 
            : "Keep pushing, you're doing great!"}
        </p>
      </CardContent>
    </Card>
  );
}
