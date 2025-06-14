
import { useClientQueries } from './useClientQueries';
import { useClientMutations } from './useClientMutations';

export const useClients = () => {
  const queryResult = useClientQueries();
  const mutationResult = useClientMutations();

  return {
    ...queryResult,
    ...mutationResult
  };
};

// Re-export types for backward compatibility
export type { Client, ClientInsert } from './useClientMutations';
