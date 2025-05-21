
'use client';

import type { Task } from '@/types';
import { TaskCard } from './task-card';
import { useState, useMemo, useEffect } from 'react';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '@/lib/task-storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NewTaskForm, type TaskFormData } from './new-task-form';
import { PlusCircle, Search } from 'lucide-react';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS } from '@/lib/achievements-data';
import { useToast } from '@/hooks/use-toast';
import { isAfter, endOfDay } from 'date-fns';

type SortKey = 'dueDate' | 'priority' | 'status' | 'title';
type SortOrder = 'asc' | 'desc';

const assignPoints = (priority: Task['priority']): number => {
  switch (priority) {
    case 'high':
      return 30;
    case 'medium':
      return 20;
    case 'low':
      return 10;
    default:
      return 0;
  }
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [userPoints, setUserPoints] = useState(INITIAL_USER_POINTS); // For reflecting point changes from achievements
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setTasks(loadTasksFromLocalStorage());
    if (typeof window !== 'undefined') {
      const storedPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedPoints) {
        setUserPoints(parseInt(storedPoints, 10));
      } else {
        localStorage.setItem(USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      saveTasksToLocalStorage(tasks);
    }
  }, [tasks, isMounted]);

  const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 };
  const statusOrder: Record<Task['status'], number> = { todo: 0, inProgress: 1, completed: 2 };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.category && task.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortKey === 'priority') {
        valA = priorityOrder[a.priority];
        valB = priorityOrder[b.priority];
      } else if (sortKey === 'status') {
        valA = statusOrder[a.status];
        valB = statusOrder[b.status];
      } else if (sortKey === 'dueDate') {
        valA = new Date(a.dueDate).getTime(); 
        valB = new Date(b.dueDate).getTime();
      } else { 
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, searchTerm, sortKey, sortOrder]);

  const handleSortChange = (value: string) => {
    const [key, order] = value.split('-') as [SortKey, SortOrder];
    setSortKey(key);
    setSortOrder(order);
  };

  const handleOpenCreateDialog = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleOpenEditDialog = (taskId: string) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setIsTaskFormOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const unlockAchievement = (achievementId: string, achievementTitle: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let achievements = storedAchievements ? JSON.parse(storedAchievements) : {};
    
    if (!achievements[achievementId] || !achievements[achievementId].unlocked) {
      achievements[achievementId] = { unlocked: true, unlockDate: new Date().toISOString() };
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(achievements) }));

      const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
      let pointsAwardedMessage = "";
      if (achievement && achievement.rewardPoints && achievement.rewardPoints > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + achievement.rewardPoints;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        setUserPoints(newTotalPoints); // Update local state for header
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${achievement.rewardPoints} Points!)`;
      }

      toast({
        title: "🏆 Achievement Unlocked!",
        description: `${achievementTitle}${pointsAwardedMessage}`,
        variant: "default",
      });
    }
  };

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      dueDate: data.dueDate,
      priority: data.priority,
      status: 'todo',
      category: data.category || 'General',
      createdAt: new Date(),
      points: assignPoints(data.priority),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    handleCloseDialog();
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (!editingTask) return;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask.id
          ? { 
              ...task, 
              ...data, 
              points: assignPoints(data.priority), 
              createdAt: task.createdAt, 
              completedAt: task.completedAt,
              status: task.status 
            }
          : task
      )
    );
    handleCloseDialog();
  };

  const handleCompleteTask = (taskId: string) => {
    const tasksBeforeUpdate = [...tasks];
    const updatedTasks = tasksBeforeUpdate.map(task =>
      task.id === taskId
        ? { ...task, status: 'completed' as const, completedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);

    const taskJustCompleted = updatedTasks.find(t => t.id === taskId);

    // Award points for completing the task on time
    if (taskJustCompleted && taskJustCompleted.status === 'completed' && taskJustCompleted.points && taskJustCompleted.completedAt) {
      const dueDate = new Date(taskJustCompleted.dueDate);
      const completedAt = new Date(taskJustCompleted.completedAt);
      
      const onTime = !isAfter(completedAt, endOfDay(dueDate));

      if (onTime) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + taskJustCompleted.points;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        setUserPoints(newTotalPoints); // Update local state
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        toast({
          title: "👍 Task Complete!",
          description: `You earned ${taskJustCompleted.points} points.`,
          variant: "default"
        });
      } else {
        toast({
          title: "👍 Task Complete!",
          description: "Completed late, no points awarded for this task.",
          variant: "default"
        });
      }
    }

    // Check for "First Task Completed" achievement
    if (taskJustCompleted && taskJustCompleted.status === 'completed') {
      // The unlockAchievement function itself will check if it's already unlocked.
      unlockAchievement('first_task_completed', 'First Step Taken');
    }
    
    // Check for "Task Slayer" achievement (10 tasks completed)
    const totalCompletedTasksNow = updatedTasks.filter(task => task.status === 'completed').length;
    if (totalCompletedTasksNow >= 10) {
      unlockAchievement('task_master_novice', 'Task Slayer');
    }
  };
  
  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.48))] w-full items-center justify-center p-6">
        <PlusCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={`${sortKey}-${sortOrder}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate-asc">Due Date (Asc)</SelectItem>
            <SelectItem value="dueDate-desc">Due Date (Desc)</SelectItem>
            <SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
            <SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
            <SelectItem value="status-asc">Status (To Do first)</SelectItem>
            <SelectItem value="status-desc">Status (Completed first)</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <Button className="w-full sm:w-auto" onClick={handleOpenCreateDialog}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Task
        </Button>
      </div>

      <Dialog open={isTaskFormOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setIsTaskFormOpen(true);}}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <NewTaskForm 
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask} 
            onDialogClose={handleCloseDialog}
            initialData={editingTask ? {
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
              priority: editingTask.priority,
              category: editingTask.category,
            } : {}}
            isEditing={!!editingTask}
          />
        </DialogContent>
      </Dialog>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onCompleteTask={handleCompleteTask} 
              onEditTask={handleOpenEditDialog}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No tasks found.</p>
          {searchTerm && <p className="text-sm text-muted-foreground">Try adjusting your search or sort criteria.</p>}
        </div>
      )}
    </div>
  );
}
