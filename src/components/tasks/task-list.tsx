
'use client';

import type { Task } from '@/types';
import { TaskCard } from './task-card';
import { useState, useMemo } from 'react';
import { DUMMY_TASKS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NewTaskForm, type TaskFormData } from './new-task-form';
import { PlusCircle, Search } from 'lucide-react';

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
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

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
        valA = a.dueDate.getTime();
        valB = b.dueDate.getTime();
      } else { // title
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

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(), // Simple ID generation
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
    setIsNewTaskDialogOpen(false);
  };

  return (
    <div className="space-y-6">
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
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Task</DialogTitle>
            </DialogHeader>
            <NewTaskForm 
              onSubmit={handleCreateTask} 
              onDialogClose={() => setIsNewTaskDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
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
