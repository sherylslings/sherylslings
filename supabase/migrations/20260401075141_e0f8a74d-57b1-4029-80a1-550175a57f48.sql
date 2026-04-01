
-- Transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'deposit_in', 'deposit_out');

-- Transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type public.transaction_type NOT NULL,
  category TEXT NOT NULL DEFAULT 'rental',
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES public.booking_requests(id) ON DELETE SET NULL,
  carrier_id UUID REFERENCES public.carriers(id) ON DELETE SET NULL,
  customer_name TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view transactions" ON public.transactions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert transactions" ON public.transactions
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update transactions" ON public.transactions
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete transactions" ON public.transactions
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Atomic booking approval RPC: updates booking, carrier, and creates transactions
CREATE OR REPLACE FUNCTION public.approve_booking_with_transactions(
  p_booking_id UUID,
  p_carrier_id UUID,
  p_customer_name TEXT,
  p_duration TEXT,
  p_start_date DATE,
  p_rent_amount NUMERIC,
  p_deposit_amount NUMERIC,
  p_return_date DATE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update booking status
  UPDATE booking_requests SET status = 'approved', updated_at = now() WHERE id = p_booking_id;
  
  -- Update carrier availability
  UPDATE carriers SET availability_status = 'rented', next_available_date = p_return_date, updated_at = now() WHERE id = p_carrier_id;
  
  -- Create rental income transaction
  INSERT INTO transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
  VALUES ('income', 'rental', p_rent_amount, p_duration || ' rental', p_booking_id, p_carrier_id, p_customer_name, p_start_date);
  
  -- Create deposit received transaction
  INSERT INTO transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
  VALUES ('deposit_in', 'deposit', p_deposit_amount, 'Refundable deposit received', p_booking_id, p_carrier_id, p_customer_name, p_start_date);
END;
$$;

-- Atomic booking completion RPC: marks returned and creates deposit refund
CREATE OR REPLACE FUNCTION public.complete_booking_with_refund(
  p_booking_id UUID,
  p_carrier_id UUID,
  p_customer_name TEXT,
  p_deposit_amount NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update booking status
  UPDATE booking_requests SET status = 'completed', updated_at = now() WHERE id = p_booking_id;
  
  -- Mark carrier available
  UPDATE carriers SET availability_status = 'available', next_available_date = NULL, updated_at = now() WHERE id = p_carrier_id;
  
  -- Create deposit refund transaction
  INSERT INTO transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
  VALUES ('deposit_out', 'deposit', p_deposit_amount, 'Deposit refunded on return', p_booking_id, p_carrier_id, p_customer_name, CURRENT_DATE);
END;
$$;
