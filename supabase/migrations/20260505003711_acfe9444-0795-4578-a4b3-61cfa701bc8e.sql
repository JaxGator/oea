
-- 1. Fix profiles public email exposure: drop permissive public read policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;

CREATE POLICY "Authenticated users can read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Prevent privilege escalation via self-update of is_admin/is_member/is_approved
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_is_admin boolean;
BEGIN
  SELECT is_admin INTO caller_is_admin FROM public.profiles WHERE id = auth.uid();

  IF COALESCE(caller_is_admin, false) THEN
    RETURN NEW;
  END IF;

  IF NEW.is_admin    IS DISTINCT FROM OLD.is_admin
  OR NEW.is_member   IS DISTINCT FROM OLD.is_member
  OR NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
    RAISE EXCEPTION 'Not allowed to modify privilege fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 3. Restrict Realtime channel subscriptions to authenticated users
DROP POLICY IF EXISTS "Authenticated can use realtime" ON realtime.messages;
CREATE POLICY "Authenticated can use realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);
