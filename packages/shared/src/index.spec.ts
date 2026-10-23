import { describe, expect, it } from "vite-plus/test";

import { APP_NAME, createGreeting, createTaskInputSchema } from "./index.js";

describe("shared utilities & schemas", () => {
  it("creates a greeting with APP_NAME", () => {
    const greeting = createGreeting("test");
    expect(greeting.app).toBe(APP_NAME);
    expect(greeting.message).toBe("Hello from AF-IRS-APE (test)!");
  });

  it("validates CreateTaskInput with Zod schema", () => {
    expect(createTaskInputSchema.safeParse({ title: "ab", priority: "high" }).success).toBe(false);
    expect(createTaskInputSchema.safeParse({ title: "Valid task", priority: "high" }).success).toBe(
      true,
    );
  });
});
