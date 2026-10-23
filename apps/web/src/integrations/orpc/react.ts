import { type AppContractClient, appContract } from "@ape/contract";
import { createORPCClient } from "@orpc/client";
import { DedupeRequestsPlugin } from "@orpc/client/plugins";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { createTanstackQueryUtils, type RouterUtils } from "@orpc/tanstack-query";
import { createContext, useContext } from "react";

export type ORPCClient = JsonifiedClient<AppContractClient>;
export type ORPCReactUtils = RouterUtils<ORPCClient>;

export function createORPCClientInstance(baseUrl?: string): ORPCClient {
  const origin =
    baseUrl ??
    (typeof window !== "undefined" ? `${window.location.origin}/api` : "http://localhost:3001/api");
  const link = new OpenAPILink(appContract, {
    url: origin,
    plugins: [
      new DedupeRequestsPlugin({
        groups: [
          {
            condition: () => true,
            context: {},
          },
        ],
      }),
    ],
  });
  return createORPCClient<ORPCClient>(link);
}

export function createORPCReactUtils(client: ORPCClient): ORPCReactUtils {
  return createTanstackQueryUtils(client);
}

const ORPCContext = createContext<ORPCReactUtils | null>(null);

export const ORPCProvider = ORPCContext.Provider;

export function useORPC(): ORPCReactUtils {
  const ctx = useContext(ORPCContext);
  if (!ctx) {
    throw new Error("useORPC must be used within an ORPCProvider");
  }
  return ctx;
}
