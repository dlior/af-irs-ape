import type { TaskItem } from "@ape/shared";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { TaskFiltersBar } from "@/features/tasks/components/task-filters-bar";
import { TasksTable } from "@/features/tasks/components/tasks-table";
import { useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";

const SAMPLE_TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Setup Vite+ Monorepo",
    priority: "high",
    status: "done",
    createdAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Write production UI tests",
    priority: "medium",
    status: "todo",
    createdAt: "2026-10-22T11:00:00.000Z",
  },
  {
    id: "3",
    title: "Polish documentation",
    priority: "low",
    status: "todo",
    createdAt: "2026-10-22T12:00:00.000Z",
  },
];

describe("TasksTable + TaskFiltersBar (Zustand + TanStack Table)", () => {
  beforeEach(() => {
    useTaskUiStore.setState({
      searchQuery: "",
      priorityFilter: "all",
      bookmarkedIds: ["1"],
    });
  });

  it("renders tasks and filters them via Zustand search and priority controls", async () => {
    const user = userEvent.setup();
    const onToggleStatus = vi.fn<(id: string) => void>();

    render(
      <div>
        <TaskFiltersBar />
        <TasksTable tasks={SAMPLE_TASKS} onToggleStatus={onToggleStatus} />
      </div>,
    );

    // Initially all 3 tasks are visible
    expect(screen.getByText("Setup Vite+ Monorepo")).toBeInTheDocument();
    expect(screen.getByText("Write production UI tests")).toBeInTheDocument();
    expect(screen.getByText("Polish documentation")).toBeInTheDocument();

    // Filter by priority = "high"
    await user.click(screen.getByRole("button", { name: "high" }));
    expect(screen.getByText("Setup Vite+ Monorepo")).toBeInTheDocument();
    expect(screen.queryByText("Write production UI tests")).not.toBeInTheDocument();

    // Reset filters
    await user.click(screen.getByRole("button", { name: /reset filters/i }));
    expect(screen.getByText("Write production UI tests")).toBeInTheDocument();

    // Filter by search input
    const searchInput = screen.getByRole("searchbox", { name: "Search tasks" });
    await user.type(searchInput, "documentation");
    expect(screen.getByText("Polish documentation")).toBeInTheDocument();
    expect(screen.queryByText("Setup Vite+ Monorepo")).not.toBeInTheDocument();
  });

  it("sorts rows by title, toggles status, and updates Zustand bookmarks", async () => {
    const user = userEvent.setup();
    const onToggleStatus = vi.fn<(id: string) => void>();

    render(<TasksTable tasks={SAMPLE_TASKS} onToggleStatus={onToggleStatus} />);

    // Toggle task completion
    await user.click(
      screen.getByRole("button", { name: "Toggle status for Setup Vite+ Monorepo" }),
    );
    expect(onToggleStatus).toHaveBeenCalledWith("1");

    // Toggle bookmark in Zustand store
    expect(useTaskUiStore.getState().bookmarkedIds).toEqual(["1"]);
    await user.click(screen.getByRole("button", { name: "Bookmark Write production UI tests" }));
    expect(useTaskUiStore.getState().bookmarkedIds).toEqual(["1", "2"]);
  });
});
