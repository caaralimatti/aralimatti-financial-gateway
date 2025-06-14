
-- First, add super_admin to the user_role enum (this needs to be in its own transaction)
ALTER TYPE user_role ADD VALUE 'super_admin';
