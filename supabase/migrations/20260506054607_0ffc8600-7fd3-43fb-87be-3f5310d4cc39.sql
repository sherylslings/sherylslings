ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS admin_notification_email text,
  ADD COLUMN IF NOT EXISTS admin_telegram_chat_id text,
  ADD COLUMN IF NOT EXISTS notifications_enabled_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notifications_enabled_telegram boolean NOT NULL DEFAULT true;