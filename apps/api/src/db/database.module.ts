import { DrizzleModule } from "@nestjs/drizzle";
import Database from "better-sqlite3";
import { type BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import * as schema from "./schema.js";

export type AppDatabase = BetterSQLite3Database<typeof schema>;

const INITIAL_SEED: Array<typeof schema.tasksTable.$inferInsert> = [
  {
    id: "1",
    title: "Configure Vite+ monorepo with Oxlint & Oxfmt",
    priority: "high",
    status: "done",
    createdAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Connect TanStack Query + Table + Form to NestJS API",
    priority: "high",
    status: "in-progress",
    createdAt: "2026-10-22T11:00:00.000Z",
  },
  {
    id: "3",
    title: "Persist tasks in SQLite with @nestjs/drizzle & better-sqlite3",
    priority: "medium",
    status: "todo",
    createdAt: "2026-10-22T12:00:00.000Z",
  },
];

export function createSqliteDatabase(dbPath?: string): AppDatabase {
  const resolvedPath =
    dbPath ??
    process.env["DATABASE_URL"] ??
    (process.env["VITEST"] ? ":memory:" : resolve(process.cwd(), "data/ape.sqlite"));

  if (resolvedPath !== ":memory:") {
    mkdirSync(dirname(resolvedPath), { recursive: true });
  }

  const sqlite = new Database(resolvedPath);
  sqlite.pragma("journal_mode = WAL");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const db = drizzle(sqlite, { schema });

  const existing = db.select().from(schema.tasksTable).limit(1).all();
  if (existing.length === 0) {
    db.insert(schema.tasksTable).values(INITIAL_SEED).run();
  }

  return db;
}

export const DatabaseModule = DrizzleModule.forRootAsync({
  useFactory: () => ({
    db: createSqliteDatabase(),
  }),
});
