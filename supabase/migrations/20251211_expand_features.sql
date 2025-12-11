-- Extend family_members with richer fields
ALTER TABLE family_members
  ADD COLUMN IF NOT EXISTS relation_to_family VARCHAR(20),
  ADD COLUMN IF NOT EXISTS marital_status VARCHAR(20),
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS education_level VARCHAR(50),
  ADD COLUMN IF NOT EXISTS blood_type VARCHAR(5),
  ADD COLUMN IF NOT EXISTS is_main_member BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);

-- Create family_appointments table
CREATE TABLE IF NOT EXISTS family_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('identity','passport','vaccine','medical_insurance')),
  title TEXT,
  due_date DATE,
  expiry_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active','expired','upcoming')),
  auto_reminder_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_family_appointments_member_id ON family_appointments(member_id);
CREATE INDEX IF NOT EXISTS idx_family_appointments_type ON family_appointments(type);
CREATE INDEX IF NOT EXISTS idx_family_appointments_status ON family_appointments(status);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NULL REFERENCES family_members(id) ON DELETE SET NULL,
  appointment_id UUID NULL REFERENCES family_appointments(id) ON DELETE SET NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('expired_id','expired_passport','upcoming_vaccine','insurance_ending','general_warning')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_member_id ON alerts(member_id);
CREATE INDEX IF NOT EXISTS idx_alerts_appointment_id ON alerts(appointment_id);

-- Create emergency_card table
CREATE TABLE IF NOT EXISTS emergency_card (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  main_member_id UUID NULL REFERENCES family_members(id) ON DELETE SET NULL,
  main_member_name TEXT,
  blood_type VARCHAR(5),
  emergency_contact_name TEXT,
  emergency_contact_phone VARCHAR(20),
  nearest_ambulance_center_name TEXT,
  nearest_ambulance_center_location_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_emergency_card_family_id ON emergency_card(family_id);

-- Create child_profile table
CREATE TABLE IF NOT EXISTS child_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  vaccination_schedule JSONB,
  passport_renewal_date DATE,
  id_renewal_date DATE,
  auto_reminders_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_child_profile_member_id ON child_profile(member_id);

-- Enable RLS and policies
ALTER TABLE family_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_card ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profile ENABLE ROW LEVEL SECURITY;

-- Policies: only members of the same family can read relevant rows
CREATE POLICY "قراءة مواعيد الأسرة" ON family_appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members fm_self
      JOIN family_members fm_row ON fm_row.id = family_appointments.member_id
      WHERE fm_self.user_id = auth.uid() AND fm_self.family_id = fm_row.family_id
    )
  );

CREATE POLICY "إضافة مواعيد" ON family_appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM families f
      JOIN family_members fm ON fm.family_id = f.id AND fm.id = member_id
      WHERE f.main_contact_user_id = auth.uid()
    )
  );

CREATE POLICY "قراءة التنبيهات" ON alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members fm_self
      LEFT JOIN family_members fm_row ON fm_row.id = alerts.member_id
      LEFT JOIN family_appointments fa ON fa.id = alerts.appointment_id
      WHERE fm_self.user_id = auth.uid() AND (
        fm_row.family_id = fm_self.family_id OR fa.member_id IN (
          SELECT id FROM family_members WHERE family_id = fm_self.family_id
        )
      )
    )
  );

CREATE POLICY "قراءة بطاقة الطوارئ" ON emergency_card
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.user_id = auth.uid() AND fm.family_id = emergency_card.family_id
    )
  );

CREATE POLICY "قراءة حساب الطفل" ON child_profile
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM family_members fm_self
      JOIN family_members fm_child ON fm_child.id = child_profile.member_id
      WHERE fm_self.user_id = auth.uid() AND fm_self.family_id = fm_child.family_id
    )
  );

GRANT SELECT ON family_appointments, alerts, emergency_card, child_profile TO authenticated;
GRANT INSERT ON family_appointments, alerts TO authenticated;
