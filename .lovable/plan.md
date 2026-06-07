## Goal
Add a three-counter band directly under the Hero section on the homepage, matching the reference screenshot style (large number on top, small uppercase muted label below, separated by vertical dividers, on a soft banded background).

## Counters
Pulled live from the database (no hardcoding):

1. **Carriers** — total count of carriers (excluding `hidden`)
2. **Available Now** — carriers with `availability_status = 'available'`
3. **Times Rented** — count of bookings with `status IN ('approved','completed')`

Labels are configurable via `site_settings` later if needed, but v1 ships with the above defaults.

## Implementation

**New component:** `src/components/home/StatsCounterSection.tsx`
- Full-width section with `bg-secondary/40` band (matches reference's soft beige strip)
- Container with 3-column grid (`grid-cols-3`), `divide-x divide-border` for vertical separators
- Each cell: centered, large serif number (`text-4xl md:text-5xl font-serif font-bold`) + small uppercase muted label (`text-xs tracking-widest text-muted-foreground mt-2`)
- Subtle count-up animation on mount (simple `requestAnimationFrame` tween, ~800ms ease-out) so numbers animate from 0 to target
- Responsive: stays 3 columns on mobile but reduces number size; no wrap

**Data fetching:** new hook `src/hooks/useHomeStats.ts`
- Single React Query (`['home-stats']`) calling Supabase in parallel:
  - `carriers` count where `availability_status != 'hidden'`
  - `carriers` count where `availability_status = 'available'`
  - `booking_requests` count where `status in ('approved','completed')`
- Uses `head: true, count: 'exact'` for efficiency (no row payloads)
- Note: `booking_requests` SELECT is admin-only per RLS. Will add a `SECURITY DEFINER` SQL function `public.get_home_stats()` returning the three integers so anonymous visitors can read aggregates without exposing PII. Grant EXECUTE to `anon, authenticated`.

**Wire-up:** `src/pages/Index.tsx`
- Insert `<StatsCounterSection />` between `<HeroSection />` and `<BrowseAllCarriersSection />`.

## Technical details

```text
<HeroSection />
<StatsCounterSection />   ← new band, soft secondary bg
<BrowseAllCarriersSection />
<HowItWorksSection />
```

SQL function:
```sql
create or replace function public.get_home_stats()
returns table(carriers_total int, carriers_available int, times_rented int)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from carriers where availability_status <> 'hidden')::int,
    (select count(*) from carriers where availability_status = 'available')::int,
    (select count(*) from booking_requests where status in ('approved','completed'))::int;
$$;
grant execute on function public.get_home_stats() to anon, authenticated;
```

Styling uses existing semantic tokens only (`bg-secondary`, `text-foreground`, `text-muted-foreground`, `border-border`, `font-serif`) — no hardcoded colors.

## Out of scope
- Making labels CMS-editable (can follow up if wanted)
- Icons next to counters (reference has none)
