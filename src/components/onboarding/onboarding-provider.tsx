'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WelcomeModal } from './welcome-modal';
import { TutorialOverlay } from './tutorial-overlay';
import { useToast } from '@/hooks/use-toast';
import { addTask } from '@/lib/task-storage';
import type { Task } from '@/types';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'highlight' | 'none';
}

interface OnboardingContextType {
  isFirstTime: boolean;
  showWelcome: boolean;
  showTutorial: boolean;
  currentStep: number;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeTutorial: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'taskifyProOnboarding';
const TUTORIAL_TASKS_CREATED_KEY = 'taskifyProTutorialTasksCreated';

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Dashboard',
    description: 'This is your main dashboard where you can see all your tasks, points, and progress. Let\'s start by exploring the navigation.',
    position: 'center',
  },
  {
    id: 'points',
    title: 'Your Points Balance',
    description: 'Here you can see your current points. You earn 10-30 points for completing tasks based on their priority. You can earn up to 150 points daily!',
    targetSelector: '[data-testid="points-display"]',
    position: 'bottom',
  },
  {
    id: 'tasks-nav',
    title: 'Tasks Section',
    description: 'This is where you\'ll manage all your tasks. We\'ve created some sample tasks to get you started.',
    targetSelector: '[href="/dashboard/tasks"]',
    position: 'right',
  },
  {
    id: 'calendar-nav',
    title: 'Calendar View',
    description: 'View your tasks organized by date and plan your schedule effectively.',
    targetSelector: '[href="/dashboard/calendar"]',
    position: 'right',
  },
  {
    id: 'analytics-nav',
    title: 'Analytics Dashboard',
    description: 'Track your productivity with detailed analytics, charts, and progress insights.',
    targetSelector: '[href="/dashboard/analytics"]',
    position: 'right',
  },
  {
    id: 'store-nav',
    title: 'Store & Rewards',
    description: 'Spend your earned points on themes, pets, and customizations. New items unlock as you progress!',
    targetSelector: '[href="/dashboard/store"]',
    position: 'right',
  },
  {
    id: 'complete-task',
    title: 'Try Completing a Task',
    description: 'Go to the Tasks section and try completing one of the sample tasks we created. You\'ll earn your first points!',
    position: 'center',
  },
];

/**
 * Sample tasks to create during onboarding
 */
const SAMPLE_TASKS: Omit<Task, 'id' | 'createdAt'>[] = [
  {
    title: 'Complete this tutorial',
    description: 'Finish the onboarding tutorial to learn how Taskify Pro works',
    priority: 'low',
    status: 'todo',
    category: 'tutorial',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    recurrence: 'none',
  },
  {
    title: 'Create your first real task',
    description: 'Add a personal task to start building your productivity habits',
    priority: 'medium',
    status: 'todo',
    category: 'personal',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    recurrence: 'none',
  },
  {
    title: 'Explore the store',
    description: 'Check out available themes and pets you can unlock with points',
    priority: 'high',
    status: 'todo',
    category: 'tutorial',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    recurrence: 'none',
  },
];

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    
    // Check if user has completed onboarding
    const onboardingData = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!onboardingData) {
      setIsFirstTime(true);
      setShowWelcome(true);
    }
  }, []);

  const createSampleTasks = async () => {
    const tasksCreated = localStorage.getItem(TUTORIAL_TASKS_CREATED_KEY);
    if (tasksCreated) return; // Already created

    try {
      for (const taskData of SAMPLE_TASKS) {
        addTask(taskData);
      }
      
      localStorage.setItem(TUTORIAL_TASKS_CREATED_KEY, 'true');
      
      toast({
        title: "Sample tasks created!",
        description: "We've added some tutorial tasks to help you get started.",
      });
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      toast({
        title: "Error creating sample tasks",
        description: "Don't worry, you can create your own tasks manually.",
        variant: "destructive",
      });
    }
  };

  const startTutorial = async () => {
    setShowWelcome(false);
    await createSampleTasks();
    setShowTutorial(true);
    setCurrentStep(0);
  };

  const skipTutorial = () => {
    setShowWelcome(false);
    setShowTutorial(false);
    markOnboardingComplete();
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    markOnboardingComplete();
    
    toast({
      title: "Tutorial completed! 🎉",
      description: "You're all set to start being productive with Taskify Pro!",
    });
  };

  const markOnboardingComplete = () => {
    const onboardingData = {
      completed: true,
      completedAt: new Date().toISOString(),
      tutorialCompleted: true,
    };
    
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(onboardingData));
    setIsFirstTime(false);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  const contextValue: OnboardingContextType = {
    isFirstTime,
    showWelcome,
    showTutorial,
    currentStep,
    startTutorial,
    skipTutorial,
    nextStep,
    previousStep,
    completeTutorial,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
      
      <WelcomeModal
        isOpen={showWelcome}
        onClose={skipTutorial}
        onStartTutorial={startTutorial}
      />
      
      <TutorialOverlay
        isActive={showTutorial}
        currentStep={TUTORIAL_STEPS[currentStep] || null}
        stepIndex={currentStep}
        totalSteps={TUTORIAL_STEPS.length}
        onNext={nextStep}
        onPrevious={previousStep}
        onSkip={skipTutorial}
        onComplete={completeTutorial}
      />
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
