
-- Add portal maintenance mode setting to system_settings
INSERT INTO public.system_settings (key, value, description, created_at, updated_at)
VALUES (
  'is_portal_active',
  'true',
  'Controls whether the client/staff portal is active or in maintenance mode',
  now(),
  now()
) ON CONFLICT (key) DO NOTHING;
