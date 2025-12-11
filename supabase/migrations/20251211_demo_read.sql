-- Demo read policies to allow showing seeded data without authentication

-- Families
CREATE POLICY "عرض تجريبي - قراءة العائلات" ON families
  FOR SELECT USING (true);

-- Family members
CREATE POLICY "عرض تجريبي - قراءة أفراد" ON family_members
  FOR SELECT USING (true);

-- Appointments
GRANT SELECT ON family_appointments TO anon;
CREATE POLICY "عرض تجريبي - قراءة المواعيد" ON family_appointments
  FOR SELECT USING (true);

-- Alerts
GRANT SELECT ON alerts TO anon;
CREATE POLICY "عرض تجريبي - قراءة التنبيهات" ON alerts
  FOR SELECT USING (true);

-- Emergency card
GRANT SELECT ON emergency_card TO anon;
CREATE POLICY "عرض تجريبي - قراءة بطاقة" ON emergency_card
  FOR SELECT USING (true);

-- Child profile
GRANT SELECT ON child_profile TO anon;
CREATE POLICY "عرض تجريبي - قراءة الطفل" ON child_profile
  FOR SELECT USING (true);

