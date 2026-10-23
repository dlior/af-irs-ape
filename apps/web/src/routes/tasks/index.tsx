import type { TaskItem } from "@ape/shared";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToggleTaskMutation } from "@/features/tasks/api/tasks-api";
import { TaskFiltersBar } from "@/features/tasks/components/task-filters-bar";
import { TasksTable } from "@/features/tasks/components/tasks-table";
import { useORPC } from "@/integrations/orpc/react";

const EMPTY_TASKS: TaskItem[] = [];

export const Route = createFileRoute("/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const orpc = useORPC();
  const { data: tasks = EMPTY_TASKS, isLoading } = useQuery(orpc.tasks.list.queryOptions());
  const toggleMutation = useToggleTaskMutation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks Explorer</h1>
          <p className="text-sm text-muted-foreground">
            Filter with Zustand + Immer, sort with TanStack Table v9, and sync via oRPC.
          </p>
        </div>

        <Button asChild size="sm">
          <Link to="/tasks/new">
            <Plus className="size-4" />
            New Task
          </Link>
        </Button>
      </div>

      <TaskFiltersBar />

      <TasksTable
        tasks={tasks}
        isLoading={isLoading}
        onToggleStatus={(id) => toggleMutation.mutate({ id })}
      />
    </div>
  );
}
