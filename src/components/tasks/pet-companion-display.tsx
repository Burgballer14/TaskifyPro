
"use client";

import { useState, useEffect } from 'react';
import { Dog } from 'lucide-react';
import { cn } from '@/lib/utils';

const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

type Pet = 'doggo' | null;

export function PetCompanionDisplay() {
  const [isDoggoUnlocked, setIsDoggoUnlocked] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl",
        "bg-card/80 backdrop-blur-md border border-border/50",
        "flex flex-col items-center text-center w-48 transform transition-all duration-300 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <Dog className="h-20 w-20 text-primary mb-2 animate-bounce [animation-duration:2s]" />
      <p className="text-sm font-semibold text-foreground">Doggo is cheering you on!</p>
      <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
    </div>
  );
}
