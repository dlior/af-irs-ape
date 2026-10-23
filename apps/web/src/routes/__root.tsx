import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AppShell } from "@/components/layout/app-shell";
import type { ORPCReactUtils } from "@/integrations/orpc/react";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";

export interface MyRouterContext {
  queryClient: QueryClient;
  orpc: ORPCReactUtils;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AppShell>
      <Outlet />
      <TanStackQueryDevtools />
      <TanStackRouterDevtools position="bottom-right" />
    </AppShell>
  ),
});
