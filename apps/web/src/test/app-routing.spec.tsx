import type { ApiGreeting, CreateTaskInput, TaskItem } from "@ape/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { useTaskUiStore } from "@/features/tasks/store/use-task-ui-store";
import {
  createORPCClientInstance,
  createORPCReactUtils,
  ORPCProvider,
} from "@/integrations/orpc/react";
import { routeTree } from "@/routeTree.gen";

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "1",
    title: "Configure Vite+ monorepo",
    priority: "high",
    status: "done",
    createdAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Build Tasks feature module",
    priority: "medium",
    status: "todo",
    createdAt: "2026-10-22T11:00:00.000Z",
  },
];

function renderApp(initialEntries: string[] = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const orpcClient = createORPCClientInstance("http://localhost:3001/api");
  const orpc = createORPCReactUtils(orpcClient);

  const history = createMemoryHistory({ initialEntries });
  const appRouter = createRouter({
    routeTree,
    history,
    context: { queryClient, orpc },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ORPCProvider value={orpc}>
        <RouterProvider router={appRouter} />
      </ORPCProvider>
    </QueryClientProvider>,
  );
}

describe("Full Web App Routing + oRPC + Zustand Integration", () => {
  let mockTasks: TaskItem[];

  beforeEach(() => {
    mockTasks = [...INITIAL_TASKS];
    useTaskUiStore.setState({
      searchQuery: "",
      priorityFilter: "all",
      bookmarkedIds: ["1"],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates across Overview -> New Task -> Tasks via oRPC and syncs Zustand state", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const method =
        init?.method ?? (typeof input === "object" && "method" in input ? input.method : "GET");

      if (url.endsWith("/api/greeting") && method === "GET") {
        const result: ApiGreeting = {
          app: "AF-IRS-APE",
          message: "Hello from AF-IRS-APE (api)!",
          timestamp: "2026-10-22T10:00:00.000Z",
        };
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/api/tasks") && method === "GET") {
        return new Response(JSON.stringify(mockTasks), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/api/tasks") && method === "POST") {
        const bodyText =
          typeof init?.body === "string"
            ? init.body
            : typeof input === "object" && "text" in input
              ? await input.text()
              : "{}";
        const payload = JSON.parse(bodyText) as CreateTaskInput;
        const created: TaskItem = {
          id: "3",
          title: payload.title,
          priority: payload.priority,
          status: "todo",
          createdAt: "2026-10-22T12:00:00.000Z",
        };
        mockTasks = [created, ...mockTasks];
        return new Response(JSON.stringify(created), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response("Not Found", { status: 404 });
    });

    renderApp(["/"]);

    // 1. Overview Page loads KPI stats and oRPC greeting
    expect(await screen.findByRole("heading", { name: "Workspace Overview" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("stat-open-tasks")).toHaveTextContent("1");
      expect(screen.getByTestId("stat-completed-tasks")).toHaveTextContent("1");
      expect(screen.getByTestId("stat-pinned-tasks")).toHaveTextContent("1");
    });

    // 2. Navigate to New Task page via top nav
    await user.click(screen.getAllByRole("link", { name: /new task/i })[0]!);
    expect(await screen.findByRole("heading", { name: "Create New Task" })).toBeInTheDocument();

    // 3. Fill & submit TanStack Form -> calls oRPC tasks.create -> redirects to /tasks
    await user.type(screen.getByLabelText("Task Title"), "Add E2E route test");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.click(screen.getByRole("button", { name: /create task/i }));

    // 4. Verify redirect to /tasks and new task rendered in TanStack Table
    expect(await screen.findByRole("heading", { name: "Tasks Explorer" })).toBeInTheDocument();
    expect(await screen.findByText("Add E2E route test")).toBeInTheDocument();

    // 5. Bookmark the new task in the table and verify header badge updates via Zustand
    await user.click(screen.getByRole("button", { name: "Bookmark Add E2E route test" }));
    expect(screen.getByTestId("pinned-count-badge")).toHaveTextContent("Pinned: 2");
  });
});
