"use client";

import { useState, useEffect } from 'react';
import { Dog, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion, getAnimationClasses } from '@/hooks/useReducedMotion';

const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

type Pet = 'doggo' | null;

export function PetCompanionDisplay() {
  const [isDoggoUnlocked, setIsDoggoUnlocked] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updatePetStatus = () => {
      const doggoUnlocked = localStorage.getItem(DOGGO_PET_UNLOCKED_KEY) === 'true';
      const currentSelectedPet = localStorage.getItem(SELECTED_PET_KEY) as Pet | null;
      
      setIsDoggoUnlocked(doggoUnlocked);
      setSelectedPet(currentSelectedPet);

      if (doggoUnlocked && currentSelectedPet === 'doggo') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(true); // Reset to expanded if Doggo becomes invisible
      }
    };

    updatePetStatus(); // Initial check

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === DOGGO_PET_UNLOCKED_KEY || event.key === SELECTED_PET_KEY) {
        updatePetStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed right-6 z-[60] rounded-xl shadow-2xl",
        "bg-card/80 backdrop-blur-md border border-border/50",
        "flex flex-col items-center text-center transform transition-all duration-300 ease-out",
        // Responsive bottom positioning to avoid mobile nav overlap
        "bottom-24 md:bottom-6", // Higher on mobile (96px from bottom), normal on desktop (24px)
        isExpanded ? "w-48 p-4" : "w-auto p-2.5", // Adjusted padding for collapsed
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      {isExpanded ? (
        <div
          onClick={toggleExpansion}
          className="cursor-pointer w-full flex flex-col items-center"
          role="button"
          tabIndex={0}
          aria-label="Collapse Doggo companion"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpansion(); }}
        >
          <Dog 
            className={cn(
              "h-20 w-20 text-primary mb-2",
              getAnimationClasses(
                "animate-bounce [animation-duration:2s]", 
                "transform-none", 
                prefersReducedMotion
              )
            )} 
            aria-label="Doggo pet companion"
          />
          <p className="text-sm font-semibold text-foreground">Doggo is cheering you on!</p>
          <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
        </div>
      ) : (
        <div
          onClick={toggleExpansion}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label="Expand Doggo companion"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpansion(); }}
        >
          <Home className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
