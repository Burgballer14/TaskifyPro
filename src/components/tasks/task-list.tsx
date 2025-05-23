
'use client';

import type { Task, UserAchievementStatus, UnlockedAchievements } from '@/types';
import { TaskCard } from './task-card';
import { useState, useMemo, useEffect } from 'react';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '@/lib/task-storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonGrid, TaskCardSkeleton } from '@/components/ui/skeleton-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NewTaskForm, type TaskFormData } from './new-task-form';
import { PlusCircle, Search } from 'lucide-react';
import { ACHIEVEMENTS_STORAGE_KEY, USER_POINTS_BALANCE_KEY, ACHIEVEMENTS_LIST, INITIAL_USER_POINTS, COMPLETED_TASKS_COUNT_KEY, checkAndUnlockPointCollectorAchievement } from '@/lib/achievements-data';
import { useToast } from '@/hooks/use-toast';
import { isAfter, endOfDay, addDays, startOfDay } from 'date-fns'; // Added addDays, startOfDay

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
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setTasks(loadTasksFromLocalStorage());
    if (typeof window !== 'undefined') {
      const storedPoints = localStorage.getItem(USER_POINTS_BALANCE_KEY);
      if (storedPoints === null) {
        localStorage.setItem(USER_POINTS_BALANCE_KEY, INITIAL_USER_POINTS.toString());
      }
      const currentTotalPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
      checkAndUnlockPointCollectorAchievement(currentTotalPoints, unlockAchievement);
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
    // First, memoize the filtering operation
    const filtered = tasks.filter(task => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTermLower) ||
        (task.description && task.description.toLowerCase().includes(searchTermLower)) ||
        (task.category && task.category.toLowerCase().includes(searchTermLower))
      );
    });

    // Then, memoize the sorting operation
    return filtered.sort((a, b) => {
      let valA: any;
      let valB: any;

      // Optimize property access based on sort key
      switch (sortKey) {
        case 'priority':
          valA = priorityOrder[a.priority];
          valB = priorityOrder[b.priority];
          break;
        case 'status':
          valA = statusOrder[a.status];
          valB = statusOrder[b.status];
          break;
        case 'dueDate':
          // Cache the timestamp calculations
          valA = new Date(a.dueDate).getTime();
          valB = new Date(b.dueDate).getTime();
          break;
        default: // 'title'
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
      }

      // Optimize comparison logic
      const compareResult = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortOrder === 'asc' ? compareResult : -compareResult;
    });
  }, [tasks, searchTerm, sortKey, sortOrder, priorityOrder, statusOrder]);

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

  const unlockAchievement = (achievementId: string, achievementTitle: string, pointsToAward: number, stageNumber?: number, stageTitleSuffix?: string) => {
    if (typeof window === 'undefined') return;
    const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};

    const achievement = ACHIEVEMENTS_LIST.find(a => a.id === achievementId);
    if (!achievement) return;

    const currentStatus: UserAchievementStatus = userAchievements[achievementId] || {};
    let newStageUnlocked = false;

    if (achievement.stages && stageNumber !== undefined) {
      if (!currentStatus.currentStage || currentStatus.currentStage < stageNumber) {
        currentStatus.currentStage = stageNumber;
        if (!currentStatus.stageUnlockDates) currentStatus.stageUnlockDates = {};
        currentStatus.stageUnlockDates[stageNumber] = new Date().toISOString();
        currentStatus.unlockDate = new Date().toISOString();
        newStageUnlocked = true;
      }
    } else {
      if (!currentStatus.unlocked) {
        currentStatus.unlocked = true;
        currentStatus.unlockDate = new Date().toISOString();
        newStageUnlocked = true;
      }
    }

    if (newStageUnlocked) {
      userAchievements[achievementId] = currentStatus;
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(userAchievements));
      window.dispatchEvent(new StorageEvent('storage', { key: ACHIEVEMENTS_STORAGE_KEY, newValue: JSON.stringify(userAchievements) }));

      let pointsAwardedMessage = "";
      if (pointsToAward > 0) {
        const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
        const newTotalPoints = currentPoints + pointsToAward;
        localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
        pointsAwardedMessage = ` (+${pointsToAward} Points!)`;
        checkAndUnlockPointCollectorAchievement(newTotalPoints, unlockAchievement);
      }

      const toastTitle = achievement.stages && stageTitleSuffix ? `${achievementTitle} ${stageTitleSuffix}` : achievementTitle;
      toast({
        title: `🏆 Achievement ${achievement.stages ? 'Stage ' : ''}Unlocked!`,
        description: `${toastTitle}${pointsAwardedMessage}`,
        variant: "default",
      });
    }
  };

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || '',
      dueDate: startOfDay(data.dueDate), // Ensure due date is start of day
      priority: data.priority,
      status: 'todo',
      category: data.category || 'General',
      createdAt: new Date(),
      points: assignPoints(data.priority),
      recurrence: data.recurrence || 'none',
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
              dueDate: startOfDay(data.dueDate), // Ensure due date is start of day on edit
              points: assignPoints(data.priority),
              // Keep original createdAt, completedAt, status unless explicitly changed by completion logic
              createdAt: task.createdAt,
              completedAt: task.completedAt,
              status: task.status,
              recurrence: data.recurrence || task.recurrence || 'none',
            }
          : task
      )
    );
    handleCloseDialog();
  };

  const handleCompleteTask = (taskId: string) => {
    const taskToComplete = tasks.find(t => t.id === taskId);
    if (!taskToComplete) return; // Task not found
    // If task is already 'completed' and not recurring, do nothing to prevent re-awarding points.
    if (taskToComplete.status === 'completed' && (!taskToComplete.recurrence || taskToComplete.recurrence === 'none')) return;


    let awardedTaskPoints = 0;
    const completionDate = new Date();
    const taskDueDate = startOfDay(new Date(taskToComplete.dueDate)); // Normalize due date
    const taskCompletedOnTime = !isAfter(startOfDay(completionDate), taskDueDate);


    if (taskToComplete.points && taskCompletedOnTime) {
        awardedTaskPoints = taskToComplete.points;
    }

    let updatedTasks;
    let toastMessage = "";

    if (taskToComplete.recurrence === 'daily') {
      let nextDueDate = addDays(taskDueDate, 1);
      // Ensure next due date is not in the past relative to today
      if (isAfter(startOfDay(new Date()), nextDueDate)) {
        nextDueDate = addDays(startOfDay(new Date()),1);
      }
      updatedTasks = tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              dueDate: nextDueDate,
              status: 'todo' as const,
              completedAt: undefined,
            }
          : task
      );
      toastMessage = `"${taskToComplete.title}" will repeat tomorrow. You earned ${awardedTaskPoints} points.`;
    } else if (taskToComplete.recurrence === 'weekly') {
      let nextDueDate = addDays(taskDueDate, 7);
      // Ensure next due date is not in the past relative to today
       if (isAfter(startOfDay(new Date()), nextDueDate)) {
        nextDueDate = addDays(startOfDay(new Date()), 7 - startOfDay(new Date()).getDay() + taskDueDate.getDay() ); // Align to same day of week in future
        if(isAfter(startOfDay(new Date()), nextDueDate)) nextDueDate = addDays(nextDueDate, 7); // If still past, add another week
      }
      updatedTasks = tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              dueDate: nextDueDate,
              status: 'todo' as const,
              completedAt: undefined,
            }
          : task
      );
      toastMessage = `"${taskToComplete.title}" will repeat next week. You earned ${awardedTaskPoints} points.`;
    } else { // Not recurring or recurrence is 'none'
      updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'completed' as const, completedAt: completionDate }
          : task
      );
      toastMessage = taskCompletedOnTime
        ? `You earned ${awardedTaskPoints} points for "${taskToComplete.title}".`
        : `"${taskToComplete.title}" completed late, no points awarded.`;
    }

    toast({
        title: taskToComplete.recurrence && taskToComplete.recurrence !== 'none' ? "👍 Recurring Task Updated!" : "👍 Task Complete!",
        description: toastMessage,
        variant: "default"
    });

    if (awardedTaskPoints > 0) {
      const currentPoints = parseInt(localStorage.getItem(USER_POINTS_BALANCE_KEY) || INITIAL_USER_POINTS.toString(), 10);
      const newTotalPoints = currentPoints + awardedTaskPoints;
      localStorage.setItem(USER_POINTS_BALANCE_KEY, newTotalPoints.toString());
      window.dispatchEvent(new StorageEvent('storage', { key: USER_POINTS_BALANCE_KEY, newValue: newTotalPoints.toString() }));
      checkAndUnlockPointCollectorAchievement(newTotalPoints, unlockAchievement);
    }

    setTasks(updatedTasks);

    // Count only non-recurring completed tasks for achievements
    const nonRecurringTasksCompletedCount = updatedTasks.filter(
      task => task.status === 'completed' && (!task.recurrence || task.recurrence === 'none')
    ).length;

    // Update completed tasks count in localStorage, used by achievements page
    localStorage.setItem(COMPLETED_TASKS_COUNT_KEY, nonRecurringTasksCompletedCount.toString());
    window.dispatchEvent(new StorageEvent('storage', {key: COMPLETED_TASKS_COUNT_KEY, newValue: nonRecurringTasksCompletedCount.toString()}));


    // "First Task Completed" achievement
    const firstTaskAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'first_task_completed');
    if (firstTaskAchievement && nonRecurringTasksCompletedCount === 1 && (!taskToComplete.recurrence || taskToComplete.recurrence === 'none')) {
       unlockAchievement(firstTaskAchievement.id, firstTaskAchievement.title, firstTaskAchievement.rewardPoints || 0);
    }

    // "Task Slayer" achievement
    const taskSlayerAchievement = ACHIEVEMENTS_LIST.find(a => a.id === 'task_master_novice');
    if (taskSlayerAchievement && taskSlayerAchievement.stages) {
      const storedAchievementsRaw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      let userAchievements: UnlockedAchievements = storedAchievementsRaw ? JSON.parse(storedAchievementsRaw) : {};
      const taskSlayerStatus: UserAchievementStatus = userAchievements[taskSlayerAchievement.id] || { currentStage: 0 };

      for (const stage of taskSlayerAchievement.stages) {
        if ((!taskSlayerStatus.currentStage || taskSlayerStatus.currentStage < stage.stage) && nonRecurringTasksCompletedCount >= stage.criteriaCount) {
          unlockAchievement(taskSlayerAchievement.id, taskSlayerAchievement.title, stage.rewardPoints, stage.stage, stage.titleSuffix);
        }
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-6 pb-24">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full sm:w-[200px]" />
          <Skeleton className="h-10 w-full sm:w-[150px]" />
        </div>
        
        <SkeletonGrid count={6} SkeletonComponent={TaskCardSkeleton} />
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
              recurrence: editingTask.recurrence || 'none',
            } : { recurrence: 'none' }} // Ensure new tasks default recurrence to 'none' in form
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
