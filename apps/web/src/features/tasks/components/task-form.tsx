import { type CreateTaskInput, createTaskInputSchema, type TaskPriority } from "@ape/shared";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface TaskFormProps {
  onSubmitTask: (input: CreateTaskInput) => Promise<void> | void;
  submitLabel?: string | undefined;
}

export function TaskForm({ onSubmitTask, submitLabel = "Create Task" }: TaskFormProps) {
  const form = useForm({
    defaultValues: {
      title: "",
      priority: "medium" as TaskPriority,
    },
    validators: {
      onChange: createTaskInputSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmitTask(value);
      form.reset();
    },
  });

  return (
    <form
      aria-label="Create task form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="title">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title-input" className="text-sm font-medium">
              Task Title
            </label>
            <Input
              id="task-title-input"
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="e.g. Implement shared Zod validation schemas"
            />
            {field.state.meta.errors.length > 0 ? (
              <p role="alert" className="text-xs text-destructive">
                {field.state.meta.errors
                  .map((err) => (typeof err === "string" ? err : err?.message))
                  .join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="priority">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-priority-select" className="text-sm font-medium">
              Priority
            </label>
            <select
              id="task-priority-select"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as TaskPriority)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex justify-end">
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              <Plus className="size-4" />
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}
