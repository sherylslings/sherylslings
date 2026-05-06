## Goal
Notify the site admin instantly whenever a customer submits a booking request — using only free channels.

## Approach
Send **two** notifications in parallel on every new booking:
1. **Email** to an admin address (via Lovable's built-in email infrastructure — no external API key needed).
2. **Telegram** message to the admin (via a free Telegram bot — one-time setup).

Both fire from a single new edge function `notify-new-booking`, called from `BookingModal.tsx` right after the booking insert succeeds. This keeps the existing booking flow untouched if notifications ever fail.

---

## Step 1 — Add admin notification settings to the CMS
Extend the `site_settings` table (and `SiteSettings` type) with:
- `admin_notification_email` (text) — where booking emails go
- `admin_telegram_chat_id` (text) — Telegram chat ID to DM
- `notifications_enabled_email` (bool, default true)
- `notifications_enabled_telegram` (bool, default false)

Expose these as editable fields in `AdminSettings.tsx` under a new "Notifications" section, with helper text explaining how to get the Telegram chat ID.

## Step 2 — Set up email infrastructure
Use Lovable's built-in email system:
- Configure sender domain (one-time setup dialog you'll complete).
- Scaffold the email queue + transactional email function.
- Create a `new-booking-notification` React Email template showing: customer name, phone, address, pincode, carrier, start date, duration, total payable.

If you don't yet own a domain, the email step can be deferred and only Telegram will fire — the system will gracefully skip email until the domain is ready.

## Step 3 — Set up Telegram bot (one-time, by you)
I'll give you exact instructions:
1. Open Telegram → message **@BotFather** → `/newbot` → get a **bot token**.
2. Message your new bot once (say "hi") so it can DM you.
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your **chat ID**.
4. Paste the bot token as a project secret (`TELEGRAM_BOT_TOKEN`) and the chat ID into Admin Settings.

No connector or paid account required — Telegram Bot API is fully free and unlimited for personal use.

## Step 4 — Create `notify-new-booking` edge function
A single function that:
- Reads booking details + site settings.
- If `notifications_enabled_email` and admin email set → invokes `send-transactional-email` with the new template.
- If `notifications_enabled_telegram` and chat ID set → calls Telegram Bot API directly (`https://api.telegram.org/bot<token>/sendMessage`) using the `TELEGRAM_BOT_TOKEN` secret. No connector gateway needed since this is a free public API.
- Errors in one channel don't block the other; all failures are logged but never thrown to the client.

`verify_jwt = false` so anonymous booking submissions can trigger it.

## Step 5 — Wire trigger in `BookingModal.tsx`
After the existing `useCreateBookingRequest` succeeds, fire-and-forget invoke `notify-new-booking` with the booking ID. The customer-facing success toast is unaffected by notification outcome.

---

## Technical details
- **Files created**: `supabase/functions/notify-new-booking/index.ts`, `supabase/functions/_shared/transactional-email-templates/new-booking-notification.tsx`, migration adding the 4 settings columns.
- **Files edited**: `src/lib/siteSettings.ts`, `src/pages/admin/AdminSettings.tsx`, `src/components/carrier/BookingModal.tsx`, `supabase/functions/_shared/transactional-email-templates/registry.ts`, `supabase/config.toml`.
- **Secret added**: `TELEGRAM_BOT_TOKEN` (you'll paste it when prompted).
- **No paid services. No external accounts beyond a free Telegram bot.**

## What I need from you to start
1. Confirm you want **both Email + Telegram** (or only one).
2. The admin email address that should receive booking alerts.
3. Confirm you can do the 2-minute @BotFather setup for Telegram (I'll walk you through it).
