
-- Update the handle_new_user function to properly handle super_admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        CASE 
            WHEN NEW.raw_user_meta_data->>'role' = 'super_admin' THEN 'super_admin'::public.user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::public.user_role
            WHEN NEW.raw_user_meta_data->>'role' = 'staff' THEN 'staff'::public.user_role
            ELSE 'client'::public.user_role
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't prevent user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$function$;

-- Also, let's make sure to update an existing user to super_admin if you created one manually
-- Replace 'your-email@example.com' with the actual email of the account you created
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'godmode@gmail.com';
