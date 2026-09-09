# Bookings: accept, start rental, extend, mark sold

## What changes for customers

The booking form no longer asks for a preferred start date. Visitors give their details, pick weekly / biweekly / monthly, agree to terms and submit. You decide the actual dates.

## What changes for you (Bookings page)

Each request moves through clear steps, with buttons in the Actions column:

1. **Pending** — Accept or Decline. Accepting marks the carrier as Rented on the website (no dates yet, no money recorded).
2. **Accepted** — "Start Rental" opens a small box: rental start date, duration (Weekly / Monthly), and the return date (pre-filled from start + duration, editable). Saving starts the rental and records the money.
3. **On rent** — "Edit Rental" lets you change the start date, duration or return date at any time (extend or shorten). The public "available from" date and the rent entry update to match.
4. **On rent** — "Mark Returned" frees the carrier and refunds the deposit, as it does today.
5. **Any request** — "Mark Sold" asks you for the final sale amount, records it as sale income, and sets the carrier to Sold Out.

## Money recorded

- Starting a rental: rent as income, plus the deposit recorded as money held.
- Marking returned: deposit refund recorded (existing behaviour).
- Mark Sold: the amount you enter, recorded as sale income.
- Editing a started rental updates the rent entry instead of adding a duplicate.

Accepting a request records nothing — money only appears once a rental actually starts.

## Technical notes

Database (one migration):
- `booking_requests.start_date` becomes nullable; add `rental_start_date date`, `rental_end_date date`, `rental_duration text`.
- Status check constraint extended to `pending, approved, on_rent, completed, cancelled, sold`.
- New RPCs (security definer, `search_path = public`):
  - `start_rental(p_booking_id, p_carrier_id, p_customer_name, p_start_date, p_end_date, p_duration, p_rent_amount, p_deposit_amount)` — sets booking to `on_rent` with the rental fields, sets carrier `rented` + `next_available_date = p_end_date`, inserts `income/rental` and `deposit_in/deposit` transactions linked via `booking_id` / `carrier_id`.
  - `update_rental(p_booking_id, p_carrier_id, p_start_date, p_end_date, p_duration, p_rent_amount)` — updates rental fields, carrier `next_available_date`, and updates the existing `income/rental` transaction for that booking (inserts if absent).
  - `mark_booking_sold(p_booking_id, p_carrier_id, p_customer_name, p_amount)` — booking to `sold`, carrier to `sold-out` with `next_available_date = NULL`, inserts `income/sale` transaction.
- `approve_booking_with_transactions` is left in place but the accept action switches to a plain status update (`approved`) plus carrier `rented` with no date and no transactions.
- `complete_booking_with_refund` keeps its current deposit-refund behaviour and is reused for Mark Returned.

Frontend:
- `src/components/carrier/BookingModal.tsx`: drop the date picker, `start_date` field and its schema entry; keep the duration select and summary.
- `src/lib/types.ts`: `BookingRequest.start_date` nullable, new rental fields, widened status union.
- `src/hooks/useTransactions.ts`: add `useStartRental`, `useUpdateRental`, `useMarkSold` hooks invalidating `booking-requests`, `carriers`, `transactions`.
- New `src/components/admin/StartRentalModal.tsx` (start + edit modes, prefilled dates, rent derived from carrier weekly/monthly rates) and `src/components/admin/MarkSoldModal.tsx` (amount prefilled with buyout price).
- `src/pages/admin/AdminBookings.tsx`: status-driven action buttons, rental dates column, new badge colours for `on_rent` and `sold`.
- Booking notification edge function keeps working; it will show "date to be confirmed" when no start date is present.
