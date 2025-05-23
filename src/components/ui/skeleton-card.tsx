'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  headerHeight?: number;
  contentLines?: number;
  footerHeight?: number;
}

/**
 * SkeletonCard component for loading states
 * Displays a card with skeleton placeholders for content
 */
export function SkeletonCard({
  className,
  hasHeader = true,
  hasFooter = false,
  headerHeight = 24,
  contentLines = 3,
  footerHeight = 40,
}: SkeletonCardProps) {
  return (
    <Card className={cn("shadow-lg", className)}>
      {hasHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className={`h-${headerHeight} w-1/2`} />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {Array.from({ length: contentLines }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={`h-4 w-${index % 2 === 0 ? 'full' : '4/5'}`} 
          />
        ))}
      </CardContent>
      {hasFooter && (
        <CardFooter>
          <Skeleton className={`h-${footerHeight} w-full`} />
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * TaskCardSkeleton component for task card loading states
 */
export function TaskCardSkeleton() {
  return (
    <SkeletonCard
      hasHeader={true}
      hasFooter={true}
      headerHeight={20}
      contentLines={2}
      footerHeight={10}
      className="h-[200px]"
    />
  );
}

/**
 * AchievementCardSkeleton component for achievement card loading states
 */
export function AchievementCardSkeleton() {
  return (
    <SkeletonCard
      hasHeader={true}
      hasFooter={false}
      headerHeight={16}
      contentLines={3}
      className="h-[180px]"
    />
  );
}

/**
 * AnalyticsCardSkeleton component for analytics card loading states
 */
export function AnalyticsCardSkeleton() {
  return (
    <SkeletonCard
      hasHeader={true}
      hasFooter={false}
      headerHeight={20}
      contentLines={4}
      className="h-[250px]"
    />
  );
}

/**
 * SkeletonGrid component for displaying a grid of skeleton cards
 */
export function SkeletonGrid({
  count = 6,
  SkeletonComponent = TaskCardSkeleton,
  className,
}: {
  count?: number;
  SkeletonComponent?: React.ComponentType;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  );
}
