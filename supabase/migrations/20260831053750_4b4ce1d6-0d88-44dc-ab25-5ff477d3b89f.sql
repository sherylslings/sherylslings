ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS social_image_url text,
  ADD COLUMN IF NOT EXISTS site_url text;