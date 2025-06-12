
-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority TEXT NOT NULL DEFAULT 'Normal'
);

-- Add constraint to ensure valid target_audience values
ALTER TABLE public.announcements 
ADD CONSTRAINT announcements_target_audience_check 
CHECK (target_audience IN ('all', 'staff_portal', 'client_portal'));

-- Add constraint to ensure valid priority values
ALTER TABLE public.announcements 
ADD CONSTRAINT announcements_priority_check 
CHECK (priority IN ('High', 'Normal', 'Low'));

-- Enable Row Level Security
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Admin Policy: Full access for admins
CREATE POLICY "Admins can manage all announcements" 
ON public.announcements 
FOR ALL 
USING (is_current_user_admin());

-- Staff Policy: Read access for active, published, non-expired announcements targeting staff or all
CREATE POLICY "Staff can view relevant announcements" 
ON public.announcements 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'staff'
  AND is_active = true 
  AND published_at <= now() 
  AND (expires_at IS NULL OR expires_at > now())
  AND target_audience IN ('all', 'staff_portal')
);

-- Client Policy: Read access for active, published, non-expired announcements targeting clients or all
CREATE POLICY "Clients can view relevant announcements" 
ON public.announcements 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'client'
  AND is_active = true 
  AND published_at <= now() 
  AND (expires_at IS NULL OR expires_at > now())
  AND target_audience IN ('all', 'client_portal')
);
