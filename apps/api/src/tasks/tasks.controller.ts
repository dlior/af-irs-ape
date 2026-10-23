import { appContract } from "@ape/contract";
import { Controller } from "@nestjs/common";
import { Implement, implement } from "@orpc/nest";

import { TasksService } from "./tasks.service.js";

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Implement(appContract.greeting)
  greeting() {
    return implement(appContract.greeting).handler(() => {
      return this.tasksService.getGreeting();
    });
  }

  @Implement(appContract.tasks)
  tasks() {
    return {
      list: implement(appContract.tasks.list).handler(() => {
        return this.tasksService.getTasks();
      }),
      create: implement(appContract.tasks.create).handler(({ input }) => {
        return this.tasksService.createTask(input);
      }),
      toggleStatus: implement(appContract.tasks.toggleStatus).handler(({ input }) => {
        return this.tasksService.toggleTaskStatus(input.id) ?? null;
      }),
    };
  }
}
