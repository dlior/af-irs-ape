import { add as addNew } from "@ape/pricing/new";
import { add as addOld } from "@ape/pricing/old";
import { APP_NAME, type TaskItem } from "@ape/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark, CheckCircle2, Clock, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";
import { useORPC } from "@/integrations/orpc/react";

const EMPTY_TASKS: TaskItem[] = [];

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const orpc = useORPC();
  const { data: greeting } = useQuery(orpc.greeting.queryOptions());
  const { data: tasks = EMPTY_TASKS } = useQuery(orpc.tasks.list.queryOptions());
  const bookmarkedIds = useTaskUiStore((s) => s.bookmarkedIds);

  const oldPrice = addOld(100, 50);
  const newPrice = addNew(100, 50, 25);
  // oxlint-disable-next-line no-console
  console.log("[web] @ape/pricing:", { oldPrice, newPrice });

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const openCount = tasks.length - completedCount;
  const pinnedTasks = tasks.filter((t) => bookmarkedIds.includes(t.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspace Overview</h1>
          <p className="text-sm text-muted-foreground">
            Connected via oRPC:{" "}
            <span className="font-medium text-foreground">
              {greeting?.message ?? `${APP_NAME} API (/api)`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/tasks">
              View All Tasks
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/tasks/new">
              <Plus className="size-4" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              <span>Open Tasks</span>
              <Clock className="size-4 text-muted-foreground" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold" data-testid="stat-open-tasks">
              {openCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Fetched via oRPC + TanStack Query
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold" data-testid="stat-completed-tasks">
              {completedCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {tasks.length} total tasks in workspace
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-between">
              <span>Pinned in Zustand</span>
              <Bookmark className="size-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold" data-testid="stat-pinned-tasks">
              {bookmarkedIds.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Client state managed with Zustand + Immer
          </CardContent>
        </Card>
      </div>

      {/* Pinned Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pinned Tasks</CardTitle>
          <CardDescription>
            Tasks bookmarked in the Tasks table persist across routes via Zustand.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pinnedTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks pinned yet. Go to{" "}
              <Link to="/tasks" className="underline underline-offset-4">
                Tasks
              </Link>{" "}
              to pin items.
            </p>
          ) : (
            <ul className="divide-y">
              {pinnedTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium">{task.title}</span>
                  <Badge variant="outline" className="uppercase">
                    {task.priority}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
