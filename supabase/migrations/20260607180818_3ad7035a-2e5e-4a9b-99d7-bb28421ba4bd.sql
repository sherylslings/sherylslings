create or replace function public.get_home_stats()
returns table(carriers_total int, carriers_available int, times_rented int)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from carriers where availability_status <> 'hidden')::int,
    (select count(*) from carriers where availability_status = 'available')::int,
    (select count(*) from booking_requests where status in ('approved','completed'))::int;
$$;
grant execute on function public.get_home_stats() to anon, authenticated;