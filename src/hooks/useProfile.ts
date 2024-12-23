import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import type { TablesRow } from '@/utils/supabase-helpers';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      return handleQueryResult(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
      ) as Promise<TablesRow<'profiles'>>;
    },
    enabled: !!userId
  });
}