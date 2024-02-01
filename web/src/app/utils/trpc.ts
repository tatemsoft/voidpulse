import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@voidpulse/api";
import { QueryClient } from "@tanstack/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const links = [
  httpBatchLink({
    url: `http://localhost:4000/trpc`,
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  }),
];

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      queryClient,
      links,
    };
  },
  ssr: false,
});

export const trpcServer = createTRPCProxyClient<AppRouter>({
  links,
});
