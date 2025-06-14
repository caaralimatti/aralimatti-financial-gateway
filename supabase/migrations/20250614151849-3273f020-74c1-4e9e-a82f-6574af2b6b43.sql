
-- Add new columns for MCA and TDS/TCS tax applicability
ALTER TABLE public.clients 
ADD COLUMN mca_applicable boolean DEFAULT false,
ADD COLUMN tds_tcs_applicable boolean DEFAULT false;
