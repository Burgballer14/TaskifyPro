
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Trophy } from "lucide-react";
import type { DailySummaryOutput } from "@/ai/flows/daily-summary-flow";

interface DailySummaryCardProps {
  userName: string;
  summaryOutput: DailySummaryOutput;
  dailyScore: number;
}

export function DailySummaryCard({ userName, summaryOutput, dailyScore }: DailySummaryCardProps) {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary/10 via-background to-background border-primary/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            {userName}'s Daily Digest
          </CardTitle>
          <Sparkles className="h-8 w-8 text-accent animate-pulse" />
        </div>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Your personalized AI-powered summary and score for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground/90 leading-relaxed text-base">
          {summaryOutput.personalizedSummary}
        </p>
        <div className="p-6 rounded-lg bg-primary/10 backdrop-blur-sm shadow-md border border-primary/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-7 w-7 text-yellow-400" />
            <h3 className="text-xl font-semibold text-primary">
              {summaryOutput.dailyScoreBlurb}
            </h3>
          </div>
          <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {dailyScore}
          </p>
          <p className="text-xs text-muted-foreground mt-1">points earned today!</p>
        </div>
      </CardContent>
    </Card>
  );
}
