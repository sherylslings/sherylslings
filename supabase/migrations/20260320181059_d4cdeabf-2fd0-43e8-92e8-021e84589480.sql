
ALTER TABLE public.carriers DROP CONSTRAINT carriers_category_check;
ALTER TABLE public.carriers ADD CONSTRAINT carriers_category_check CHECK (category IN ('ring-slings', 'wraps', 'buckle-carriers', 'onbuhimo', 'meh-dai'));
