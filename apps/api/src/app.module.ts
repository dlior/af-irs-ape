import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ORPCModule } from "@orpc/nest";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { DatabaseModule } from "./db/database.module.js";
import { DocsController } from "./docs/docs.controller.js";
import { HealthController } from "./health/health.controller.js";
import { TasksModule } from "./tasks/tasks.module.js";

function resolveWebDistPath(): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(currentDir, "../../web/dist"),
    resolve(currentDir, "../../../apps/web/dist"),
    resolve(process.cwd(), "apps/web/dist"),
    resolve(process.cwd(), "../web/dist"),
  ];
  return candidates.find((p) => existsSync(join(p, "index.html"))) ?? candidates[0]!;
}

@Module({
  imports: [
    ORPCModule.forRoot({}),
    DatabaseModule,
    TasksModule,
    ServeStaticModule.forRoot({
      rootPath: resolveWebDistPath(),
      exclude: /^\/(api|docs)(\/|$)/,
    }),
  ],
  controllers: [HealthController, DocsController],
})
export class AppModule {}
