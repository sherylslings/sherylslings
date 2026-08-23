import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Purchase {
  id: string;
  carrier_id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  amount: number;
  status: 'payment_claimed' | 'verified' | 'cancelled';
  agreed_to_terms: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseInput {
  carrier_id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  amount: number;
  agreed_to_terms: boolean;
}

export const usePurchases = () => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Purchase[];
    },
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PurchaseInput) => {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          carrier_id: input.carrier_id,
          customer_name: input.customer_name,
          phone: input.phone,
          address: input.address,
          pincode: input.pincode,
          amount: input.amount,
          agreed_to_terms: input.agreed_to_terms,
          status: 'payment_claimed',
        })
        .select()
        .single();
      if (error) throw error;
      return data as Purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Purchase> & { id: string }) => {
      const { data, error } = await supabase
        .from('purchases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
  });
};

export const useRecordPurchasePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (purchaseId: string) => {
      const { data, error } = await supabase.functions.invoke('record-purchase-paid', {
        body: { purchaseId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
