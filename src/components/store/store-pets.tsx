'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Bird, Fish, CheckCircle2, Lock, PawPrint } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS } from '@/lib/achievements-data';

const DOGGO_PET_UNLOCKED_KEY = 'taskifyProDoggoPetUnlocked';
const KITTO_PET_UNLOCKED_KEY = 'taskifyProKittoPetUnlocked';
const BIRBY_PET_UNLOCKED_KEY = 'taskifyProBirbyPetUnlocked';
const FISHY_PET_UNLOCKED_KEY = 'taskifyProFishyPetUnlocked';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

interface Pet {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
  unlockKey: string;
  comingSoon?: boolean;
}

const pets: Pet[] = [
  {
    id: 'doggo',
    name: 'Doggo',
    description: 'Your loyal coding companion who celebrates every completed task!',
    cost: 500,
    icon: Dog,
    unlockKey: DOGGO_PET_UNLOCKED_KEY,
  },
  {
    id: 'kitto',
    name: 'Kitto',
    description: 'A curious cat who purrs when you finish your work on time',
    cost: 750,
    icon: Cat,
    unlockKey: KITTO_PET_UNLOCKED_KEY,
    comingSoon: true,
  },
  {
    id: 'birby',
    name: 'Birby',
    description: 'A cheerful bird that chirps motivational messages',
    cost: 1000,
    icon: Bird,
    unlockKey: BIRBY_PET_UNLOCKED_KEY,
    comingSoon: true,
  },
  {
    id: 'fishy',
    name: 'Fishy',
    description: 'A zen fish that helps you stay calm and focused',
    cost: 1250,
    icon: Fish,
    unlockKey: FISHY_PET_UNLOCKED_KEY,
    comingSoon: true,
  },
];

export function StorePets() {
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [unlockedPets, setUnlockedPets] = useState<Set<string>>(new Set());
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      }

      const unlocked = new Set<string>();
      if (localStorage.getItem(DOGGO_PET_UNLOCKED_KEY) === 'true') {
        unlocked.add('doggo');
      }
      if (localStorage.getItem(KITTO_PET_UNLOCKED_KEY) === 'true') {
        unlocked.add('kitto');
      }
      if (localStorage.getItem(BIRBY_PET_UNLOCKED_KEY) === 'true') {
        unlocked.add('birby');
      }
      if (localStorage.getItem(FISHY_PET_UNLOCKED_KEY) === 'true') {
        unlocked.add('fishy');
      }
      setUnlockedPets(unlocked);

      const storedSelectedPet = localStorage.getItem(SELECTED_PET_KEY);
      setSelectedPet(storedSelectedPet);
    }
  }, []);

  const handleUnlockPet = (pet: Pet) => {
    if (pet.comingSoon) {
      toast({
        title: "Coming Soon!",
        description: `${pet.name} will be available in a future update.`,
        variant: "default",
      });
      return;
    }

    if (userPoints < pet.cost) {
      toast({
        title: "Not Enough Points!",
        description: `${pet.name} costs ${pet.cost} points. You have ${userPoints}.`,
        variant: "destructive",
      });
      return;
    }

    const newPoints = userPoints - pet.cost;
    localStorage.setItem(USER_POINTS_BALANCE_KEY, newPoints.toString());
    setUserPoints(newPoints);
    window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newPoints.toString() }));
    
    localStorage.setItem(pet.unlockKey, 'true');
    setUnlockedPets(prev => new Set([...prev, pet.id]));
    
    // Auto-select the newly unlocked pet
    localStorage.setItem(SELECTED_PET_KEY, pet.id);
    setSelectedPet(pet.id);
    
    toast({
      title: "Pet Unlocked!",
      description: `${pet.name} is now your companion and will appear in your task view!`,
      variant: "default",
    });
    
    window.dispatchEvent(new StorageEvent('storage', { key: pet.unlockKey, newValue: 'true' }));
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: pet.id }));
  };

  const handleSelectPet = (petId: string) => {
    localStorage.setItem(SELECTED_PET_KEY, petId);
    setSelectedPet(petId);
    
    const pet = pets.find(p => p.id === petId);
    toast({
      title: "Companion Selected!",
      description: `${pet?.name} is now your active companion.`,
      variant: "default",
    });
    
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: petId }));
  };

  const handleDeselectPet = () => {
    localStorage.removeItem(SELECTED_PET_KEY);
    setSelectedPet(null);
    
    toast({
      title: "Companion Deselected",
      description: "No pet companion is currently active.",
      variant: "default",
    });
    
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_PET_KEY, newValue: null }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PawPrint className="h-5 w-5" />
          Pet Companions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => {
            const isUnlocked = unlockedPets.has(pet.id);
            const isSelected = selectedPet === pet.id;
            const Icon = pet.icon;

            return (
              <div
                key={pet.id}
                className={`relative p-4 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-card hover:shadow-md'
                }`}
              >
                {pet.comingSoon && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Coming Soon
                  </Badge>
                )}
                
                {isSelected && (
                  <Badge variant="default" className="absolute top-2 right-2 text-xs">
                    Active
                  </Badge>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{pet.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">{pet.cost} Points</Badge>
                      
                      {isUnlocked ? (
                        <div className="flex gap-2">
                          {isSelected ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleDeselectPet}
                              className="text-xs"
                            >
                              Deselect
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleSelectPet(pet.id)}
                              className="text-xs"
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleUnlockPet(pet)}
                          disabled={userPoints < pet.cost || pet.comingSoon}
                          className="text-xs"
                        >
                          {pet.comingSoon ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Soon
                            </>
                          ) : (
                            `Unlock`
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedPet === null && unlockedPets.size > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              No companion selected. Choose a pet to accompany you on your productivity journey!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
