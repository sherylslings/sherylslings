CREATE TABLE public.purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  carrier_id uuid NOT NULL REFERENCES public.carriers(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  pincode text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'payment_claimed'::text,
  agreed_to_terms boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT purchases_status_check CHECK (status IN ('payment_claimed', 'verified', 'cancelled'))
);

GRANT INSERT ON public.purchases TO anon;
GRANT INSERT ON public.purchases TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create purchases" ON public.purchases FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage purchases" ON public.purchases FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS payment_qr_url text;

CREATE OR REPLACE FUNCTION public.record_purchase_paid(
  p_purchase_id uuid,
  p_carrier_id uuid,
  p_amount numeric,
  p_customer_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.purchases
  SET status = 'verified', updated_at = now()
  WHERE id = p_purchase_id;

  UPDATE public.carriers
  SET availability_status = 'sold-out', next_available_date = NULL, updated_at = now()
  WHERE id = p_carrier_id;

  INSERT INTO public.transactions (
    type,
    category,
    amount,
    description,
    carrier_id,
    customer_name,
    transaction_date
  )
  VALUES (
    'income',
    'sale',
    p_amount,
    'Buy Now purchase - ' || p_customer_name,
    p_carrier_id,
    p_customer_name,
    CURRENT_DATE
  );
END;
$$;

CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();