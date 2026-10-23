import type { TaskItem } from "@ape/shared";
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  type SortingState,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Bookmark, CheckCircle2, Circle } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});

const columnHelper = createColumnHelper<typeof features, TaskItem>();

export interface TasksTableProps {
  tasks: TaskItem[];
  isLoading?: boolean | undefined;
  onToggleStatus: (id: string) => void;
}

export function TasksTable({ tasks, isLoading = false, onToggleStatus }: TasksTableProps) {
  const searchQuery = useTaskUiStore((s) => s.searchQuery);
  const priorityFilter = useTaskUiStore((s) => s.priorityFilter);
  const bookmarkedIds = useTaskUiStore((s) => s.bookmarkedIds);
  const toggleBookmark = useTaskUiStore((s) => s.toggleBookmark);

  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor("status", {
          header: "Done",
          cell: (info) => {
            const isDone = info.getValue() === "done";
            const { id, title } = info.row.original;
            return (
              <button
                type="button"
                aria-label={`Toggle status for ${title}`}
                onClick={() => onToggleStatus(id)}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                {isDone ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <Circle className="size-5" />
                )}
              </button>
            );
          },
        }),
        columnHelper.accessor("title", {
          header: ({ column }) => (
            <button
              type="button"
              className="flex items-center gap-1 font-semibold hover:text-foreground"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Task Title
              <ArrowUpDown className="size-3.5" />
            </button>
          ),
          cell: (info) => {
            const isDone = info.row.original.status === "done";
            return (
              <span className={isDone ? "line-through text-muted-foreground" : "font-medium"}>
                {info.getValue()}
              </span>
            );
          },
        }),
        columnHelper.accessor("priority", {
          header: "Priority",
          cell: (info) => {
            const priority = info.getValue();
            const badgeStyles = {
              high: "bg-red-500/10 text-red-600 border-red-500/20",
              medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
              low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            };
            return (
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase ${badgeStyles[priority]}`}
              >
                {priority}
              </span>
            );
          },
        }),
        columnHelper.display({
          id: "bookmark",
          header: "Pin",
          cell: ({ row }) => {
            const { id, title } = row.original;
            const isBookmarked = bookmarkedIds.includes(id);
            return (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Bookmark ${title}`}
                onClick={() => toggleBookmark(id)}
              >
                <Bookmark
                  className={`size-4 ${isBookmarked ? "fill-amber-400 text-amber-500" : "text-muted-foreground"}`}
                />
              </Button>
            );
          },
        }),
      ]),
    [bookmarkedIds, onToggleStatus, toggleBookmark],
  );

  const table = useTable({
    features,
    data: filteredTasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium">
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                Loading tasks...
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No tasks match the current filters.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/30">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
