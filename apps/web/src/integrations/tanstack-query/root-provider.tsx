import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import {
  createORPCClientInstance,
  createORPCReactUtils,
  type ORPCClient,
  ORPCProvider,
  type ORPCReactUtils,
} from "@/integrations/orpc/react";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        retry: 1,
      },
    },
  });

  const orpcClient = createORPCClientInstance();
  const orpc = createORPCReactUtils(orpcClient);

  return {
    queryClient,
    orpcClient,
    orpc,
  };
}

export function Provider({
  children,
  queryClient,
  orpc,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  orpcClient?: ORPCClient;
  orpc: ORPCReactUtils;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ORPCProvider value={orpc}>{children}</ORPCProvider>
    </QueryClientProvider>
  );
}
