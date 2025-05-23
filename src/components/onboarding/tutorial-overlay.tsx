'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'highlight' | 'none';
}

interface TutorialOverlayProps {
  isActive: boolean;
  currentStep: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

/**
 * Tutorial overlay component that guides users through the interface
 * Shows contextual tips and highlights specific elements
 */
export function TutorialOverlay({
  isActive,
  currentStep,
  stepIndex,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
}: TutorialOverlayProps) {
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!isActive || !currentStep?.targetSelector) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(currentStep.targetSelector) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      // Calculate overlay position based on target element
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top = 0;
      let left = 0;
      
      switch (currentStep.position) {
        case 'top':
          top = rect.top + scrollTop - 10;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft + rect.width / 2;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - 10;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 10;
          break;
        case 'center':
          top = window.innerHeight / 2 + scrollTop;
          left = window.innerWidth / 2 + scrollLeft;
          break;
      }
      
      setOverlayPosition({ top, left });
      
      // Add highlight class to target element
      element.classList.add('tutorial-highlight');
      
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      // Remove highlight class when step changes
      if (element) {
        element.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep, isActive]);

  if (!isActive || !currentStep) {
    return null;
  }

  const isLastStep = stepIndex === totalSteps - 1;
  const isFirstStep = stepIndex === 0;

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 tutorial-overlay" />
      
      {/* Tutorial card */}
      <div
        className={cn(
          "fixed z-50 w-80 max-w-[90vw] max-h-[80vh] overflow-y-auto",
          // On mobile, always center the tutorial card
          "md:block",
          currentStep.position === 'center' && "transform -translate-x-1/2 -translate-y-1/2",
          currentStep.position === 'top' && "md:transform md:-translate-x-1/2 md:-translate-y-full",
          currentStep.position === 'bottom' && "md:transform md:-translate-x-1/2",
          currentStep.position === 'left' && "md:transform md:-translate-x-full md:-translate-y-1/2",
          currentStep.position === 'right' && "md:transform md:-translate-y-1/2",
          // Mobile positioning - always centered
          "md:static md:transform-none left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:left-auto md:top-auto"
        )}
        style={{
          top: window.innerWidth >= 768 ? overlayPosition.top : '50%',
          left: window.innerWidth >= 768 ? overlayPosition.left : '50%',
        }}
      >
        <Card className="shadow-xl border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentStep.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Step {stepIndex + 1} of {totalSteps}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
            
            {/* Progress indicator */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={isFirstStep}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                >
                  Skip Tutorial
                </Button>
                
                <Button
                  size="sm"
                  onClick={isLastStep ? onComplete : onNext}
                  className="flex items-center gap-1"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                  {!isLastStep && <ArrowRight className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Custom styles for tutorial highlighting */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(var(--primary), 0.3), 0 0 20px rgba(var(--primary), 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .tutorial-overlay {
          pointer-events: auto;
        }
        
        .tutorial-highlight {
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
