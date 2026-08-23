# Buy Now (direct purchase) flow

Add a "Buy Now" button next to "Request Booking" on the carrier detail page, with its own purchase form, payment QR step, and admin notification.

## What the buyer sees

1. On a carrier page, two buttons side by side: **Request Booking** and **Buy Now**.
2. **Buy Now** opens a form with no rental or refund wording:
   - Full name, phone, full address, pincode
   - Buyout summary: carrier name + buyout price (no deposit, no rent lines)
   - Shipping note: charges extra as per actuals (approx. Rs.200-400, based on location)
   - Checkbox: agree to terms & conditions
   - Button: **Show QR Code for Payment** (disabled until all fields are valid)
3. After clicking, the same dialog switches to the payment step:
   - Payment QR image (uploaded by admin in settings)
   - Amount payable shown above the QR
   - Under the QR: "Shipping charges will be as per actuals and will be shared at the time of shipping (approx. Rs.200-400, based on location)"
   - Button: **Payment Made**
4. Clicking **Payment Made** records the purchase, sends the Telegram notification, marks the carrier **Sold Out**, and shows a confirmation message.

## Admin side

- **Settings → Payments**: upload/enter a payment QR image (shown in the buyer flow). If no QR is set, the Buy Now button is hidden so buyers never hit a dead end.
- **New "Purchases" view** in the admin area: buyer contact, address, carrier, amount, payment-claimed status, date; ability to mark a purchase verified or cancelled.
- On "Payment Made", an **income transaction** (category `sale`) is created in the accounting module so it appears in the P&L and transaction list.

## Technical notes

**Database (one migration)**
- New table `public.purchases`: `carrier_id`, `customer_name`, `phone`, `pincode`, `address`, `amount`, `status` (`payment_claimed` / `verified` / `cancelled`), `agreed_to_terms`, timestamps + updated_at trigger.
- GRANTs: `INSERT` for `anon`+`authenticated`, `SELECT/UPDATE/DELETE` for `authenticated`, `ALL` for `service_role`. RLS: anyone may insert (blind insert, same pattern as bookings); only admins (`has_role`) may read/update/delete — protects buyer PII.
- New RPC `record_purchase_paid(p_purchase_id, p_carrier_id, p_amount, p_customer_name)` (security definer): sets purchase status, marks carrier `sold-out`, and inserts the income transaction atomically. This lets the anonymous buyer trigger the carrier update without granting public write access to `carriers`.
- Add `payment_qr_url` column to `site_settings`.
- Storage: create a public `site-assets` bucket for the QR upload (if not already present).

**Frontend**
- `src/components/carrier/BuyNowModal.tsx` — two-step dialog (details → QR), reuses shadcn form patterns from `BookingModal`, keeps scroll-safe dialog sizing.
- `src/pages/CarrierDetailPage.tsx` — add the Buy Now button beside Request Booking; both disabled when the carrier is already sold out.
- `src/hooks/usePurchases.ts` — create purchase, call `record_purchase_paid`, admin list/update queries.
- `src/pages/admin/AdminPurchases.tsx` + route and nav entry in `AdminDashboard`.
- `src/pages/admin/AdminSettings.tsx` + `src/lib/siteSettings.ts` — QR image field.

**Notifications**
- New edge function `notify-new-purchase` (CORS, `verify_jwt = false`), modeled on `notify-new-booking`: loads purchase + carrier + settings, sends a Telegram message with buyer details and amount, honours the existing Telegram/email toggles. Invoked fire-and-forget from the "Payment Made" click so a notification failure never blocks the buyer.
