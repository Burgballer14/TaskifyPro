'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { StoreThemes } from '@/components/store/store-themes';
import { StorePets } from '@/components/store/store-pets';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Sparkles } from "lucide-react";
import { USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS } from '@/lib/achievements-data';

export default function StorePage() {
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      }

      // Listen for points changes
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === USER_POINTS_BALANCE_KEY && event.newValue !== null) {
          setUserPoints(parseInt(event.newValue, 10));
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  if (!mounted) {
    return (
      <>
        <PageHeader 
          title="Personalization Store"
          description="Unlock new themes, pets, and customizations with your earned points!"
        />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Loading store...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Personalization Store"
        description="Unlock new themes, pets, and customizations with your earned points!"
      />
      
      {/* Points Balance Card */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span>Your Points Balance</span>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Sparkles className="h-6 w-6" />
              <span>{userPoints}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Earn points by completing tasks on time! Daily cap: 150 points, Weekly cap: 1,050 points.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Themes Section */}
        <StoreThemes />
        
        {/* Pets Section */}
        <StorePets />
        
        {/* Coming Soon Teaser */}
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">More Items Coming Soon!</h3>
            <p className="text-sm text-muted-foreground">
              We're working on exciting new themes, pets, and customization options. 
              Keep completing tasks to earn points for future releases!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
