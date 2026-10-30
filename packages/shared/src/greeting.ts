import { z } from "zod";

import { APP_NAME } from "./constants.js";

export const apiGreetingSchema = z.object({
  app: z.string(),
  message: z.string(),
  timestamp: z.string(),
});
export type ApiGreeting = z.infer<typeof apiGreetingSchema>;

export function createGreeting(target: string): ApiGreeting {
  return {
    app: APP_NAME,
    message: `Hello from ${APP_NAME} (${target})!`,
    timestamp: new Date().toISOString(),
  };
}
