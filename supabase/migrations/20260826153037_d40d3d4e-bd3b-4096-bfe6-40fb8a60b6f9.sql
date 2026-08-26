ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS place text,
  ADD COLUMN IF NOT EXISTS difficulty text,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS organizer text;

UPDATE public.events
SET slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 4)
WHERE slug IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON public.events (slug);

UPDATE public.events SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END;