import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type PriorityFilter, useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";

const PRIORITIES: readonly PriorityFilter[] = ["all", "high", "medium", "low"];

export function TaskFiltersBar() {
  const searchQuery = useTaskUiStore((s) => s.searchQuery);
  const priorityFilter = useTaskUiStore((s) => s.priorityFilter);
  const setSearchQuery = useTaskUiStore((s) => s.setSearchQuery);
  const setPriorityFilter = useTaskUiStore((s) => s.setPriorityFilter);
  const resetFilters = useTaskUiStore((s) => s.resetFilters);

  const hasActiveFilters = searchQuery !== "" || priorityFilter !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          type="search"
          aria-label="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title..."
          className="max-w-xs"
        />
        <div className="flex items-center gap-1" role="group" aria-label="Filter by priority">
          {PRIORITIES.map((p) => (
            <Button
              key={p}
              type="button"
              variant={priorityFilter === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPriorityFilter(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="size-3.5" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
