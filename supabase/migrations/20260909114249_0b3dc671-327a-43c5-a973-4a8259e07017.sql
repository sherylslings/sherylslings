REVOKE ALL ON FUNCTION public.start_rental(uuid, uuid, text, date, date, text, numeric, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_rental(uuid, uuid, date, date, text, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_booking_sold(uuid, uuid, text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_rental(uuid, uuid, text, date, date, text, numeric, numeric) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_rental(uuid, uuid, date, date, text, numeric) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.mark_booking_sold(uuid, uuid, text, numeric) TO authenticated, service_role;