'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Store, Calendar, BarChart3 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

/**
 * Welcome modal for first-time users
 * Introduces the app and starts the tutorial flow
 */
export function WelcomeModal({ isOpen, onClose, onStartTutorial }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-t-lg">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Flame className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Welcome to Taskify Pro!
            </DialogTitle>
            <p className="text-muted-foreground text-base">
              Your journey to productivity mastery starts here. Let's get you set up with everything you need to succeed.
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center space-y-2">
                <Trophy className="h-6 w-6 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">Earn Points</h3>
                <p className="text-xs text-muted-foreground">
                  Complete tasks to earn up to 150 points daily
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 text-center space-y-2">
                <Store className="h-6 w-6 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">Unlock Rewards</h3>
                <p className="text-xs text-muted-foreground">
                  Spend points on themes, pets, and customizations
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 text-center space-y-2">
                <Calendar className="h-6 w-6 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">Stay Organized</h3>
                <p className="text-xs text-muted-foreground">
                  Track tasks with calendar and weekly views
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 text-center space-y-2">
                <BarChart3 className="h-6 w-6 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">Track Progress</h3>
                <p className="text-xs text-muted-foreground">
                  View analytics and build daily streaks
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">🎯 Quick Tutorial</h4>
            <p className="text-sm text-muted-foreground mb-3">
              We'll create some sample tasks to help you get started and show you around the app.
            </p>
            <div className="text-xs text-muted-foreground">
              ⏱️ Takes about 2 minutes
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Skip for now
            </Button>
            <Button 
              onClick={onStartTutorial}
              className="flex-1"
            >
              Start Tutorial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
