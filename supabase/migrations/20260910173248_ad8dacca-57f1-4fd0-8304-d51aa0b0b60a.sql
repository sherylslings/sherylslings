ALTER TABLE public.carriers
  ADD COLUMN IF NOT EXISTS purchase_cost NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchased_from TEXT;

COMMENT ON COLUMN public.carriers.purchase_cost IS 'Cost at which the admin bought the carrier';
COMMENT ON COLUMN public.carriers.purchased_from IS 'Source/vendor from which the carrier was purchased';