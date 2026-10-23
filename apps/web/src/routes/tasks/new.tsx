import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTaskMutation } from "@/features/tasks/api/tasks-api";
import { TaskForm } from "@/features/tasks/components/task-form";

export const Route = createFileRoute("/tasks/new")({
  component: NewTaskPage,
});

function NewTaskPage() {
  const navigate = useNavigate();
  const createTaskMutation = useCreateTaskMutation();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link to="/tasks">
            <ArrowLeft className="size-4" />
            Back to Tasks
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-sm text-muted-foreground">
          Validated with TanStack Form and persisted via NestJS POST /api/tasks.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Enter a descriptive title and choose a priority level.</CardDescription>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmitTask={async (input) => {
              await createTaskMutation.mutateAsync(input);
              await navigate({ to: "/tasks" });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
