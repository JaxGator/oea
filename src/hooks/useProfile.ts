import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import type { Profile } from '@/types/auth';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      const data = await handleQueryResult(result);
      return data as Profile;
    },
    enabled: !!userId
  });
}