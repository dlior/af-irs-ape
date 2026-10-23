import { add as addNew } from "@ape/pricing/new";
import { add as addOld } from "@ape/pricing/old";
import { type ApiGreeting, type CreateTaskInput, createGreeting, type TaskItem } from "@ape/shared";
import { Injectable } from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { desc, eq } from "drizzle-orm";

import type { AppDatabase } from "../db/database.module.js";
import { tasksTable } from "../db/schema.js";

@Injectable()
export class TasksService {
  constructor(@InjectDrizzle() private readonly db: AppDatabase) {}

  getGreeting(): ApiGreeting {
    const oldTotal = addOld(100, 50);
    const newTotal = addNew(100, 50, 25);
    // oxlint-disable-next-line no-console
    console.log("[api] @ape/pricing:", { oldTotal, newTotal });
    return createGreeting("api");
  }

  getTasks(): TaskItem[] {
    return this.db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt)).all();
  }

  createTask(input: CreateTaskInput): TaskItem {
    const newTask: TaskItem = {
      id: String(Date.now()),
      title: input.title,
      priority: input.priority,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    this.db.insert(tasksTable).values(newTask).run();
    return newTask;
  }

  toggleTaskStatus(id: string): TaskItem | undefined {
    const existing = this.db.select().from(tasksTable).where(eq(tasksTable.id, id)).get();
    if (!existing) {
      return undefined;
    }

    const nextStatus = existing.status === "done" ? "todo" : "done";
    this.db.update(tasksTable).set({ status: nextStatus }).where(eq(tasksTable.id, id)).run();

    return {
      ...existing,
      status: nextStatus,
    };
  }
}
