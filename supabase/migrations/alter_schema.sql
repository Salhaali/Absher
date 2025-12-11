-- Alter users.password_hash to be nullable since Supabase Auth stores hashes internally
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Families: allow authenticated users to create families and set themselves as main_contact_user_id
CREATE POLICY "إنشاء عائلة" ON families
  FOR INSERT WITH CHECK (auth.uid() = main_contact_user_id);

-- Optional: allow reading the newly inserted family by its admin immediately
CREATE POLICY "قراءة العائلة للمدير بعد الإنشاء" ON families
  FOR SELECT USING (main_contact_user_id = auth.uid());

-- Ensure authenticated role can INSERT into families (RLS policy governs access)
GRANT INSERT ON families TO authenticated;
