'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Edit3, 
  Trophy, 
  Target, 
  Calendar,
  Flame,
  Wallet,
  Dog,
  Cat,
  Bird,
  Fish,
  CheckCircle2
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useDailyStreak } from '@/hooks/useDailyStreak';
import { loadTasksFromLocalStorage } from '@/lib/task-storage';
import { USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS, ACHIEVEMENTS_STORAGE_KEY } from '@/lib/achievements-data';
import type { Task, UnlockedAchievements } from '@/types';

const USER_NAME_KEY = 'taskifyProUserName';
const SELECTED_PET_KEY = 'taskifyProSelectedPet';

const petIcons = {
  doggo: Dog,
  kitto: Cat,
  birby: Bird,
  fishy: Fish,
};

export default function ProfilePage() {
  const [userName, setUserName] = useState('User Name');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<UnlockedAchievements>({});
  const [mounted, setMounted] = useState(false);
  
  const { streak } = useDailyStreak();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Load user data
      const storedUserName = localStorage.getItem(USER_NAME_KEY);
      if (storedUserName) {
        setUserName(storedUserName);
      }

      const storedUserPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedUserPoints !== null) {
        setUserPoints(parseInt(storedUserPoints, 10));
      }

      const storedSelectedPet = localStorage.getItem(SELECTED_PET_KEY);
      setSelectedPet(storedSelectedPet);

      const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        setAchievements(JSON.parse(storedAchievements));
      }

      // Load tasks for stats
      const loadedTasks = loadTasksFromLocalStorage();
      setTasks(loadedTasks);

      // Listen for storage changes
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === USER_POINTS_BALANCE_KEY && event.newValue !== null) {
          setUserPoints(parseInt(event.newValue, 10));
        }
        if (event.key === SELECTED_PET_KEY) {
          setSelectedPet(event.newValue);
        }
        if (event.key === ACHIEVEMENTS_STORAGE_KEY && event.newValue) {
          setAchievements(JSON.parse(event.newValue));
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem(USER_NAME_KEY, tempName.trim());
      toast({
        title: "Profile Updated",
        description: "Your name has been saved successfully.",
        variant: "default",
      });
    }
    setIsEditingName(false);
    setTempName('');
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setTempName('');
  };

  const startEditing = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  if (!mounted) {
    return (
      <>
        <PageHeader 
          title="Profile"
          description="Manage your account and view your productivity stats"
        />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const achievementCount = Object.keys(achievements).length;

  // Get pet info
  const PetIcon = selectedPet ? petIcons[selectedPet as keyof typeof petIcons] : null;
  const petName = selectedPet ? selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1) : null;

  return (
    <>
      <PageHeader 
        title="Profile"
        description="Manage your account and view your productivity stats"
      />
      
      <div className="space-y-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" />
                <AvatarFallback className="text-lg">
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {isEditingName ? (
                  <div className="space-y-2">
                    <Label htmlFor="userName">Display Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="userName"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSaveName}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold">{userName}</h2>
                      <Button size="sm" variant="ghost" onClick={startEditing}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Taskify Pro User since {new Date().getFullYear()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Pet Companion */}
            {selectedPet && PetIcon && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <PetIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Current Companion</p>
                  <p className="text-sm text-muted-foreground">{petName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Productivity Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{userPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-orange-500">{streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">{achievementCount}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Task Completion Rate</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/dashboard/achievements">
                <Trophy className="h-4 w-4 mr-2" />
                View All Achievements
              </a>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/dashboard/store">
                <Wallet className="h-4 w-4 mr-2" />
                Visit Store
              </a>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/dashboard/analytics">
                <Calendar className="h-4 w-4 mr-2" />
                View Analytics
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
