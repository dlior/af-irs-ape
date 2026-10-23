import type { CreateTaskInput } from "@ape/shared";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";

import { TaskForm } from "@/features/tasks/components/task-form";

describe("TaskForm (TanStack Form)", () => {
  it("validates minimum title length and submits valid payload", async () => {
    const user = userEvent.setup();
    const onSubmitTask = vi.fn<(input: CreateTaskInput) => void>();

    render(<TaskForm onSubmitTask={onSubmitTask} />);

    const titleInput = screen.getByLabelText("Task Title");
    const prioritySelect = screen.getByLabelText("Priority");
    const submitButton = screen.getByRole("button", { name: /create task/i });

    // Type a short invalid title (< 3 chars)
    await user.type(titleInput, "ab");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Title must be at least 3 characters",
    );
    expect(submitButton).toBeDisabled();

    // Complete valid title and select high priority
    await user.clear(titleInput);
    await user.type(titleInput, "Ship production monorepo");
    await user.selectOptions(prioritySelect, "high");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(submitButton).toBeEnabled();

    await user.click(submitButton);

    expect(onSubmitTask).toHaveBeenCalledWith({
      title: "Ship production monorepo",
      priority: "high",
    });
  });
});
