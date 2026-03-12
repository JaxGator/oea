
-- Add DELETE policy for admins on admin_notifications
CREATE POLICY "Allow admins to delete notifications"
ON public.admin_notifications FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Add INSERT policy for authenticated admins on admin_notifications
CREATE POLICY "Allow admins to insert notifications"
ON public.admin_notifications FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
