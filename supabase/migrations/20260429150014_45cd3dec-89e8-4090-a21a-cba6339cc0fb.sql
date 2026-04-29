-- Add address column to booking_requests
ALTER TABLE public.booking_requests ADD COLUMN IF NOT EXISTS address TEXT;

-- Update approve_booking RPC to NOT create transactions automatically
CREATE OR REPLACE FUNCTION public.approve_booking_with_transactions(
  p_booking_id uuid,
  p_carrier_id uuid,
  p_customer_name text,
  p_duration text,
  p_start_date date,
  p_rent_amount numeric,
  p_deposit_amount numeric,
  p_return_date date
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE booking_requests SET status = 'approved', updated_at = now() WHERE id = p_booking_id;
  UPDATE carriers SET availability_status = 'rented', next_available_date = p_return_date, updated_at = now() WHERE id = p_carrier_id;
END;
$function$;

-- Update complete_booking RPC to NOT create refund transactions automatically
CREATE OR REPLACE FUNCTION public.complete_booking_with_refund(
  p_booking_id uuid,
  p_carrier_id uuid,
  p_customer_name text,
  p_deposit_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE booking_requests SET status = 'completed', updated_at = now() WHERE id = p_booking_id;
  UPDATE carriers SET availability_status = 'available', next_available_date = NULL, updated_at = now() WHERE id = p_carrier_id;
END;
$function$;

-- Add a function/trigger that auto-marks carrier available when next_available_date passes
-- Since cron isn't easily available, we'll handle this on read in the frontend.
-- But also create a helper RPC admins can call to refresh:
CREATE OR REPLACE FUNCTION public.refresh_carrier_availability()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  UPDATE carriers
  SET availability_status = 'available',
      next_available_date = NULL,
      updated_at = now()
  WHERE availability_status = 'rented'
    AND next_available_date IS NOT NULL
    AND next_available_date <= CURRENT_DATE;
$function$;