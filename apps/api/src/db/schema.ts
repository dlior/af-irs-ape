import type { TaskPriority, TaskStatus } from "@ape/shared";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  priority: text("priority").$type<TaskPriority>().notNull(),
  status: text("status").$type<TaskStatus>().notNull(),
  createdAt: text("created_at").notNull(),
});

export type TaskRow = typeof tasksTable.$inferSelect;
export type NewTaskRow = typeof tasksTable.$inferInsert;
