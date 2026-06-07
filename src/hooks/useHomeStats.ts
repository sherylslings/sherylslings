import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomeStats {
  carriers_total: number;
  carriers_available: number;
  times_rented: number;
}

export const useHomeStats = () => {
  return useQuery({
    queryKey: ['home-stats'],
    queryFn: async (): Promise<HomeStats> => {
      const { data, error } = await supabase.rpc('get_home_stats');
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return {
        carriers_total: row?.carriers_total ?? 0,
        carriers_available: row?.carriers_available ?? 0,
        times_rented: row?.times_rented ?? 0,
      };
    },
    staleTime: 60_000,
  });
};
