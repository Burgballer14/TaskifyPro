import type { Task } from '@/types';
import { DUMMY_TASKS } from '@/lib/constants';

export const TASKS_STORAGE_KEY = 'taskifyProTasks';

/**
 * Helper to ensure date fields are properly revived as Date objects
 * @param task Task object with string dates
 * @returns Task object with proper Date objects
 */
export function reviveTaskDates(task: any): Task {
  return {
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    ...(task.completedAt && { completedAt: new Date(task.completedAt) }),
  };
}

/**
 * Save tasks to localStorage with error handling
 * @param tasks Array of tasks to save
 */
export function saveTasksToLocalStorage(tasks: Task[]): void {
  if (typeof window !== 'undefined') {
    try {
      // Dates are automatically converted to ISO strings by JSON.stringify
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: TASKS_STORAGE_KEY,
          newValue: JSON.stringify(tasks),
        })
      );
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
      // Handle quota exceeded errors
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn("LocalStorage quota exceeded. Consider implementing data cleanup or compression.");
      }
    }
  }
}

/**
 * Load tasks from localStorage with fallback to dummy tasks
 * @returns Array of tasks with proper Date objects
 */
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
      // Log more specific error information
      if (error instanceof SyntaxError) {
        console.warn("Invalid JSON in localStorage. Resetting to default tasks.");
      }
    }
  }
  
  // If no tasks in localStorage, or if server-side, or error, initialize with DUMMY_TASKS and save them.
  const defaultTasks = DUMMY_TASKS.map(reviveTaskDates);
  
  // Note: saveTasksToLocalStorage will only run if typeof window !== 'undefined'
  saveTasksToLocalStorage(defaultTasks);
  
  return defaultTasks;
}

/**
 * Add a new task to localStorage
 * @param taskData Task data without id, createdAt, and updatedAt
 * @returns The created task with generated id and timestamps
 */
export function addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
  const currentTasks = loadTasksFromLocalStorage();
  
  const newTask: Task = {
    ...taskData,
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    dueDate: typeof taskData.dueDate === 'string' ? new Date(taskData.dueDate) : taskData.dueDate,
  };
  
  const updatedTasks = [...currentTasks, newTask];
  saveTasksToLocalStorage(updatedTasks);
  
  return newTask;
}

/**
 * Update an existing task in localStorage
 * @param taskId ID of the task to update
 * @param updates Partial task data to update
 * @returns The updated task or null if not found
 */
export function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
  const currentTasks = loadTasksFromLocalStorage();
  const taskIndex = currentTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const updatedTask: Task = {
    ...currentTasks[taskIndex],
    ...updates,
    dueDate: updates.dueDate 
      ? (typeof updates.dueDate === 'string' ? new Date(updates.dueDate) : updates.dueDate)
      : currentTasks[taskIndex].dueDate,
  };
  
  const updatedTasks = [...currentTasks];
  updatedTasks[taskIndex] = updatedTask;
  
  saveTasksToLocalStorage(updatedTasks);
  
  return updatedTask;
}

/**
 * Delete a task from localStorage
 * @param taskId ID of the task to delete
 * @returns True if task was deleted, false if not found
 */
export function deleteTask(taskId: string): boolean {
  const currentTasks = loadTasksFromLocalStorage();
  const filteredTasks = currentTasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length === currentTasks.length) {
    return false; // Task not found
  }
  
  saveTasksToLocalStorage(filteredTasks);
  return true;
}

/**
 * Clear all tasks from localStorage (useful for testing or reset functionality)
 */
export function clearTasksFromLocalStorage(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(TASKS_STORAGE_KEY);
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: TASKS_STORAGE_KEY,
          newValue: null,
        })
      );
    } catch (error) {
      console.error("Error clearing tasks from localStorage:", error);
    }
  }
}
