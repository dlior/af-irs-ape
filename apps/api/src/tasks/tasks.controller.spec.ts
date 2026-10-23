import { Test, TestingModule } from "@nestjs/testing";
import { call } from "@orpc/server";

import { DatabaseModule } from "../db/database.module.js";
import { TasksController } from "./tasks.controller.js";
import { TasksModule } from "./tasks.module.js";

describe("TasksController (oRPC @Implement + @nestjs/drizzle SQLite)", () => {
  let tasksController: TasksController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TasksModule],
    }).compile();

    await app.init();
    tasksController = app.get<TasksController>(TasksController);
  });

  it("executes oRPC greeting and persists task procedures in SQLite via @InjectDrizzle()", async () => {
    const greeting = await call(tasksController.greeting(), undefined);
    expect(greeting.app).toBe("AF-IRS-APE");
    expect(greeting.message).toBe("Hello from AF-IRS-APE (api)!");

    const initialTasks = await call(tasksController.tasks().list, undefined);
    expect(initialTasks.length).toBeGreaterThanOrEqual(3);

    const created = await call(tasksController.tasks().create, {
      title: "Verify NestJS oRPC Controller",
      priority: "high",
    });
    expect(created.title).toBe("Verify NestJS oRPC Controller");
    expect(created.status).toBe("todo");

    const updatedTasks = await call(tasksController.tasks().list, undefined);
    expect(updatedTasks.some((t) => t.id === created.id)).toBe(true);

    const toggled = await call(tasksController.tasks().toggleStatus, { id: created.id });
    expect(toggled?.status).toBe("done");
  });
});
