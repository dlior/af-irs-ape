import { APP_NAME } from "@ape/shared";
import { Link } from "@tanstack/react-router";
import { Bookmark, CheckSquare, LayoutDashboard, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";

export function AppHeader() {
  const bookmarkedCount = useTaskUiStore((s) => s.bookmarkedIds.length);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              A
            </span>
            <span>{APP_NAME}</span>
          </Link>

          <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-secondary [&.active]:font-medium [&.active]:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Overview
            </Link>
            <Link
              to="/tasks"
              activeOptions={{ exact: true }}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-secondary [&.active]:font-medium [&.active]:text-foreground"
            >
              <CheckSquare className="size-4" />
              Tasks
            </Link>
            <Link
              to="/tasks/new"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-secondary [&.active]:font-medium [&.active]:text-foreground"
            >
              <PlusCircle className="size-4" />
              New Task
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5" data-testid="pinned-count-badge">
            <Bookmark className="size-3 fill-amber-400 text-amber-500" />
            <span>Pinned: {bookmarkedCount}</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
    </div>
  );
}
