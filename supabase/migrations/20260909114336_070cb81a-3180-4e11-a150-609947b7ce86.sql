CREATE OR REPLACE FUNCTION public.start_rental(
  p_booking_id uuid,
  p_carrier_id uuid,
  p_customer_name text,
  p_start_date date,
  p_end_date date,
  p_duration text,
  p_rent_amount numeric,
  p_deposit_amount numeric
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.booking_requests
  SET status = 'on_rent',
      rental_start_date = p_start_date,
      rental_end_date = p_end_date,
      rental_duration = p_duration,
      updated_at = now()
  WHERE id = p_booking_id;

  UPDATE public.carriers
  SET availability_status = 'rented',
      next_available_date = p_end_date,
      updated_at = now()
  WHERE id = p_carrier_id;

  INSERT INTO public.transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
  VALUES ('income', 'rental', p_rent_amount,
          'Rental (' || p_duration || ') - ' || p_customer_name,
          p_booking_id, p_carrier_id, p_customer_name, p_start_date);

  IF p_deposit_amount > 0 THEN
    INSERT INTO public.transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
    VALUES ('deposit_in', 'deposit', p_deposit_amount,
            'Deposit received - ' || p_customer_name,
            p_booking_id, p_carrier_id, p_customer_name, p_start_date);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_rental(
  p_booking_id uuid,
  p_carrier_id uuid,
  p_start_date date,
  p_end_date date,
  p_duration text,
  p_rent_amount numeric
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_tx_id uuid;
  v_customer text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.booking_requests
  SET rental_start_date = p_start_date,
      rental_end_date = p_end_date,
      rental_duration = p_duration,
      updated_at = now()
  WHERE id = p_booking_id
  RETURNING customer_name INTO v_customer;

  UPDATE public.carriers
  SET next_available_date = p_end_date,
      updated_at = now()
  WHERE id = p_carrier_id
    AND availability_status = 'rented';

  SELECT id INTO v_tx_id
  FROM public.transactions
  WHERE booking_id = p_booking_id AND type = 'income' AND category = 'rental'
  ORDER BY created_at
  LIMIT 1;

  IF v_tx_id IS NULL THEN
    INSERT INTO public.transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
    VALUES ('income', 'rental', p_rent_amount,
            'Rental (' || p_duration || ') - ' || coalesce(v_customer, ''),
            p_booking_id, p_carrier_id, v_customer, p_start_date);
  ELSE
    UPDATE public.transactions
    SET amount = p_rent_amount,
        description = 'Rental (' || p_duration || ') - ' || coalesce(v_customer, ''),
        transaction_date = p_start_date,
        updated_at = now()
    WHERE id = v_tx_id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_booking_sold(
  p_booking_id uuid,
  p_carrier_id uuid,
  p_customer_name text,
  p_amount numeric
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.booking_requests
  SET status = 'sold', updated_at = now()
  WHERE id = p_booking_id;

  UPDATE public.carriers
  SET availability_status = 'sold-out',
      next_available_date = NULL,
      updated_at = now()
  WHERE id = p_carrier_id;

  INSERT INTO public.transactions (type, category, amount, description, booking_id, carrier_id, customer_name, transaction_date)
  VALUES ('income', 'sale', p_amount,
          'Sale - ' || p_customer_name,
          p_booking_id, p_carrier_id, p_customer_name, CURRENT_DATE);
END;
$$;