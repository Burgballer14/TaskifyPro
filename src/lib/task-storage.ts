
import type { Task } from '@/types';
import { DUMMY_TASKS } from '@/lib/constants';

const TASKS_STORAGE_KEY = 'taskifyProTasks';

// Helper to ensure date fields are properly revived as Date objects
function reviveTaskDates(task: any): Task {
  return {
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    ...(task.completedAt && { completedAt: new Date(task.completedAt) }),
  };
}

export function saveTasksToLocalStorage(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    try {
      // Dates are automatically converted to ISO strings by JSON.stringify
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }
}

export function loadTasksFromLocalStorage(): Task[] {
  if (typeof window !== 'undefined') {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks) as any[];
        return parsedTasks.map(reviveTaskDates);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      // Fallback to dummy tasks if parsing fails
    }
  }
  // If no tasks in localStorage, or if server-side, or error, initialize with DUMMY_TASKS and save them.
  // Note: saveTasksToLocalStorage will only run if typeof window !== 'undefined'
  saveTasksToLocalStorage(DUMMY_TASKS.map(reviveTaskDates)); // Ensure DUMMY_TASKS also have proper Date objects if loaded fresh
  return DUMMY_TASKS.map(reviveTaskDates);
}
