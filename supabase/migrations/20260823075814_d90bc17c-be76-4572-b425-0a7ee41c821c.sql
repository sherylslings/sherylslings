REVOKE EXECUTE ON FUNCTION public.record_purchase_paid(uuid, uuid, numeric, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.record_purchase_paid(uuid, uuid, numeric, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.record_purchase_paid(uuid, uuid, numeric, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.record_purchase_paid(uuid, uuid, numeric, text) TO service_role;