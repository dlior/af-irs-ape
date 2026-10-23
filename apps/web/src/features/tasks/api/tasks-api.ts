import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useORPC } from "@/integrations/orpc/react";

export function useCreateTaskMutation() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  return useMutation(
    orpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.tasks.list.queryKey() });
      },
    }),
  );
}

export function useToggleTaskMutation() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  return useMutation(
    orpc.tasks.toggleStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: orpc.tasks.list.queryKey() });
      },
    }),
  );
}
