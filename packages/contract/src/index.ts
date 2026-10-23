import {
  apiGreetingSchema,
  createTaskInputSchema,
  taskItemSchema,
  toggleTaskInputSchema,
} from "@ape/shared";
import { type ContractRouterClient, oc, populateContractRouterPaths } from "@orpc/contract";
import { z } from "zod";

export const appContract = populateContractRouterPaths({
  greeting: oc.route({ method: "GET", path: "/greeting" }).output(apiGreetingSchema),
  tasks: {
    list: oc.route({ method: "GET", path: "/tasks" }).output(z.array(taskItemSchema)),
    create: oc
      .route({ method: "POST", path: "/tasks" })
      .input(createTaskInputSchema)
      .output(taskItemSchema),
    toggleStatus: oc
      .route({ method: "PATCH", path: "/tasks/{id}/toggle-status" })
      .input(toggleTaskInputSchema)
      .output(taskItemSchema.nullable()),
  },
});

export type AppContract = typeof appContract;
export type AppContractClient = ContractRouterClient<AppContract>;
