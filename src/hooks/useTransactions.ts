import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'deposit_in' | 'deposit_out';
  category: string;
  amount: number;
  description: string | null;
  booking_id: string | null;
  carrier_id: string | null;
  customer_name: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export const useTransactions = (month?: string) => {
  return useQuery({
    queryKey: ['transactions', month],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (month) {
        const start = `${month}-01`;
        const [y, m] = month.split('-').map(Number);
        const end = new Date(y, m, 0).toISOString().split('T')[0];
        query = query.gte('transaction_date', start).lte('transaction_date', end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(tx)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      p_booking_id: string;
      p_carrier_id: string;
      p_customer_name: string;
      p_duration: string;
      p_start_date: string;
      p_rent_amount: number;
      p_deposit_amount: number;
      p_return_date: string;
    }) => {
      const { error } = await supabase.rpc('approve_booking_with_transactions', params);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      p_booking_id: string;
      p_carrier_id: string;
      p_customer_name: string;
      p_deposit_amount: number;
    }) => {
      const { error } = await supabase.rpc('complete_booking_with_refund', params);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
