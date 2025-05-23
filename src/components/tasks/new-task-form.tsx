
"use client";

import type * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const taskFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Priority is required.",
  }),
  category: z.string().optional(),
  recurrence: z.enum(["none", "daily", "weekly"]).optional().default("none"), // Added recurrence
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

interface NewTaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onDialogClose: () => void;
  initialData?: Partial<TaskFormData>;
  isEditing?: boolean;
}

export function NewTaskForm({ onSubmit, onDialogClose, initialData = {}, isEditing = false }: NewTaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      dueDate: initialData.dueDate,
      priority: initialData.priority || "medium",
      category: initialData.category || "",
      recurrence: initialData.recurrence || "none", // Default recurrence
    },
  });

  useEffect(() => {
    form.reset({
      title: initialData.title || "",
      description: initialData.description || "",
      dueDate: initialData.dueDate,
      priority: initialData.priority || "medium",
      category: initialData.category || "",
      recurrence: initialData.recurrence || "none",
    });
  }, [initialData, form.reset, form]);


  function handleFormSubmit(data: TaskFormData) {
    onSubmit(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Plan team retreat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add more details about the task..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        !isEditing && date < new Date(new Date().setHours(0,0,0,0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Work, Personal" {...field} />
              </FormControl>
              <FormDescription>
                Assign a category to help organize your tasks.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurrence</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "none"}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recurrence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set how often this task should repeat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onDialogClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? (
              <Edit3 className="mr-2 h-4 w-4" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {isEditing ? 'Update Task' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
