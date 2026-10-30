import { z } from "zod";

export const taskPrioritySchema = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskStatusSchema = z.enum(["todo", "in-progress", "done"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  createdAt: z.string(),
});
export type TaskItem = z.infer<typeof taskItemSchema>;

export const createTaskInputSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  priority: taskPrioritySchema,
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const toggleTaskInputSchema = z.object({
  id: z.string().min(1),
});
export type ToggleTaskInput = z.infer<typeof toggleTaskInputSchema>;
