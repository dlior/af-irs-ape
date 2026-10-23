import { describe, expect, it } from "vite-plus/test";

import { appContract } from "./index.js";

describe("@ape/contract", () => {
  it("defines valid oRPC routes and schemas for greeting and tasks", () => {
    expect(appContract.greeting["~orpc"].route).toMatchObject({
      method: "GET",
      path: "/greeting",
    });
    expect(appContract.tasks.list["~orpc"].route).toMatchObject({
      method: "GET",
      path: "/tasks",
    });
    expect(appContract.tasks.create["~orpc"].route).toMatchObject({
      method: "POST",
      path: "/tasks",
    });
    expect(appContract.tasks.toggleStatus["~orpc"].route).toMatchObject({
      method: "PATCH",
      path: "/tasks/{id}/toggle-status",
    });
  });
});
