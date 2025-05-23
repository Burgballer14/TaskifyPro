'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export interface AvatarOption {
  id: string;
  src: string;
  name: string;
  category: 'People' | 'Places' | 'Things';
}

export const avatarOptions: AvatarOption[] = [
  // People - Balanced Male/Female
  { id: 'person1', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4', name: 'Alex', category: 'People' },
  { id: 'person2', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede', name: 'Emma', category: 'People' },
  { id: 'person3', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan&backgroundColor=d1d4f9', name: 'Jordan', category: 'People' },
  { id: 'person4', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=ffd93d', name: 'Maya', category: 'People' },
  { id: 'person5', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=ffb3ba', name: 'Sam', category: 'People' },
  { id: 'person6', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=bae1ff', name: 'Luna', category: 'People' },
  { id: 'person7', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey&backgroundColor=a8e6cf', name: 'Casey', category: 'People' },
  { id: 'person8', src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley&backgroundColor=ffc3a0', name: 'Riley', category: 'People' },
  
  // Places
  { id: 'place1', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Mountain&backgroundColor=87ceeb', name: 'Mountain', category: 'Places' },
  { id: 'place2', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Ocean&backgroundColor=4682b4', name: 'Ocean', category: 'Places' },
  { id: 'place3', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Forest&backgroundColor=228b22', name: 'Forest', category: 'Places' },
  { id: 'place4', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Desert&backgroundColor=daa520', name: 'Desert', category: 'Places' },
  { id: 'place5', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=City&backgroundColor=696969', name: 'City', category: 'Places' },
  { id: 'place6', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Beach&backgroundColor=f0e68c', name: 'Beach', category: 'Places' },
  { id: 'place7', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Garden&backgroundColor=90ee90', name: 'Garden', category: 'Places' },
  { id: 'place8', src: 'https://api.dicebear.com/7.x/shapes/svg?seed=Space&backgroundColor=191970', name: 'Space', category: 'Places' },
  
  // Things
  { id: 'thing1', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Coffee&backgroundColor=8b4513', name: 'Coffee', category: 'Things' },
  { id: 'thing2', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Book&backgroundColor=deb887', name: 'Book', category: 'Things' },
  { id: 'thing3', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Music&backgroundColor=da70d6', name: 'Music', category: 'Things' },
  { id: 'thing4', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Camera&backgroundColor=ff6347', name: 'Camera', category: 'Things' },
  { id: 'thing5', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Rocket&backgroundColor=ff4500', name: 'Rocket', category: 'Things' },
  { id: 'thing6', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Heart&backgroundColor=ff69b4', name: 'Heart', category: 'Things' },
  { id: 'thing7', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Star&backgroundColor=ffd700', name: 'Star', category: 'Things' },
  { id: 'thing8', src: 'https://api.dicebear.com/7.x/icons/svg?seed=Diamond&backgroundColor=e6e6fa', name: 'Diamond', category: 'Things' },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatarSrc: string) => void;
  onClose: () => void;
}

export function AvatarSelector({ selectedAvatar, onAvatarSelect, onClose }: AvatarSelectorProps) {
  // Group avatars by category
  const peopleAvatars = avatarOptions.filter(avatar => avatar.category === 'People');
  const placesAvatars = avatarOptions.filter(avatar => avatar.category === 'Places');
  const thingsAvatars = avatarOptions.filter(avatar => avatar.category === 'Things');

  const handleAvatarClick = (avatarSrc: string) => {
    onAvatarSelect(avatarSrc);
  };

  const renderAvatarGrid = (avatars: AvatarOption[], categoryName: string) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{categoryName}</h4>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => handleAvatarClick(avatar.src)}
            className={`relative rounded-full p-1 transition-all hover:scale-105 ${
              selectedAvatar === avatar.src 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2'
            }`}
            title={avatar.name}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatar.src} alt={avatar.name} />
              <AvatarFallback>{avatar.name[0]}</AvatarFallback>
            </Avatar>
            {selectedAvatar === avatar.src && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Label>Choose Your Avatar</Label>
      
      {/* People Section */}
      {renderAvatarGrid(peopleAvatars, 'People')}

      {/* Places Section */}
      {renderAvatarGrid(placesAvatars, 'Places')}

      {/* Things Section */}
      {renderAvatarGrid(thingsAvatars, 'Things')}

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClose}
        className="w-full"
      >
        Done
      </Button>
    </div>
  );
}

// Helper function to get the default avatar
export function getDefaultAvatar(): string {
  return avatarOptions[0].src;
}

// Helper function to find avatar by src
export function findAvatarBySource(src: string): AvatarOption | undefined {
  return avatarOptions.find(avatar => avatar.src === src);
}
