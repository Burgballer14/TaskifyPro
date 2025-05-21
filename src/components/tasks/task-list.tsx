'use client';

import type { Task } from '@/types';
import { TaskCard } from './task-card';
import { useState, useMemo } from 'react';
import { DUMMY_TASKS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type SortKey = 'dueDate' | 'priority' | 'status' | 'title';
type SortOrder = 'asc' | 'desc';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const priorityOrder: Record<Task['priority'], number> = { high: 0, medium: 1, low: 2 };
  const statusOrder: Record<Task['status'], number> = { todo: 0, inProgress: 1, completed: 2 };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
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
            <SelectItem value="status-asc">Status (A-Z)</SelectItem>
            <SelectItem value="status-desc">Status (Z-A)</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
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
