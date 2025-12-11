-- Seed demo data for ABSHER family app

-- Create a demo family
INSERT INTO families (id, family_name, city, region, main_contact_user_id)
VALUES (gen_random_uuid(), 'عائلة العبدالله', 'الرياض', 'منطقة الرياض', NULL)
ON CONFLICT DO NOTHING;

-- Pick the created family id
WITH f AS (
  SELECT id FROM families WHERE family_name = 'عائلة العبدالله' LIMIT 1
)
-- Create users
INSERT INTO users (id, email, full_name, role, family_id)
SELECT gen_random_uuid(), 'father@example.com', 'خالد العبدالله', 'أب', f.id FROM f
ON CONFLICT DO NOTHING;

WITH f AS (
  SELECT id FROM families WHERE family_name = 'عائلة العبدالله' LIMIT 1
)
INSERT INTO users (id, email, full_name, role, family_id)
SELECT gen_random_uuid(), 'سارة@example.com', 'سارة العبدالله', 'أم', f.id FROM f
ON CONFLICT DO NOTHING;

WITH f AS (
  SELECT id FROM families WHERE family_name = 'عائلة العبدالله' LIMIT 1
)
INSERT INTO users (id, email, full_name, role, family_id)
SELECT gen_random_uuid(), 'son@example.com', 'فهد العبدالله', 'ابن', f.id FROM f
ON CONFLICT DO NOTHING;

WITH f AS (
  SELECT id FROM families WHERE family_name = 'عائلة العبدالله' LIMIT 1
)
INSERT INTO users (id, email, full_name, role, family_id)
SELECT gen_random_uuid(), 'daughter@example.com', 'ليان العبدالله', 'ابنة', f.id FROM f
ON CONFLICT DO NOTHING;

-- Link family_members
WITH f AS (SELECT id FROM families WHERE family_name = 'عائلة العبدالله' LIMIT 1),
u AS (SELECT id, full_name, role FROM users WHERE family_id IN (SELECT id FROM f))
INSERT INTO family_members (id, family_id, user_id, relation_type, relation_to_family, marital_status, education_level, blood_type)
SELECT gen_random_uuid(), (SELECT id FROM f), id, role, role, 'متزوج', 'جامعي', 'O+' FROM u
ON CONFLICT DO NOTHING;

-- Create appointments (identity/passport/vaccine/insurance)
WITH ms AS (SELECT id AS member_id, relation_type FROM family_members WHERE family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1))
INSERT INTO family_appointments (id, member_id, type, title, due_date, expiry_date, status, auto_reminder_enabled)
SELECT gen_random_uuid(), member_id, 'identity', 'تجديد هوية', CURRENT_DATE + INTERVAL '10 day', CURRENT_DATE + INTERVAL '40 day', 'upcoming', true FROM ms WHERE relation_type IN ('أب','أم')
ON CONFLICT DO NOTHING;

WITH ms AS (SELECT id AS member_id, relation_type FROM family_members WHERE family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1))
INSERT INTO family_appointments (id, member_id, type, title, due_date, expiry_date, status, auto_reminder_enabled)
SELECT gen_random_uuid(), member_id, 'passport', 'تجديد جواز', CURRENT_DATE + INTERVAL '5 day', CURRENT_DATE + INTERVAL '20 day', 'upcoming', true FROM ms WHERE relation_type IN ('ابن','ابنة')
ON CONFLICT DO NOTHING;

WITH ms AS (SELECT id AS member_id, relation_type FROM family_members WHERE family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1))
INSERT INTO family_appointments (id, member_id, type, title, due_date, status, auto_reminder_enabled)
SELECT gen_random_uuid(), member_id, 'vaccine', 'تطعيم', CURRENT_DATE + INTERVAL '7 day', 'upcoming', true FROM ms WHERE relation_type IN ('ابن','ابنة')
ON CONFLICT DO NOTHING;

WITH ms AS (SELECT id AS member_id, relation_type FROM family_members WHERE family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1))
INSERT INTO family_appointments (id, member_id, type, title, expiry_date, status, auto_reminder_enabled)
SELECT gen_random_uuid(), member_id, 'medical_insurance', 'تأمين طبي', CURRENT_DATE + INTERVAL '25 day', 'upcoming', true FROM ms WHERE relation_type IN ('أب','أم')
ON CONFLICT DO NOTHING;

-- Create sample alerts
WITH fm AS (SELECT id AS member_id FROM family_members WHERE family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1) LIMIT 1)
INSERT INTO alerts (id, member_id, type, message)
SELECT gen_random_uuid(), member_id, 'general_warning', 'تنبيه تجريبي: راجع مواعيد الأسرة هذا الشهر' FROM fm
ON CONFLICT DO NOTHING;

-- Emergency card
INSERT INTO emergency_card (family_id, main_member_name, blood_type, emergency_contact_name, emergency_contact_phone, nearest_ambulance_center_name)
SELECT f.id, 'خالد العبدالله', 'O+', 'سارة', '0500000000', 'مركز إسعاف الملز'
FROM families f
WHERE f.family_name='عائلة العبدالله'
AND NOT EXISTS (SELECT 1 FROM emergency_card ec WHERE ec.family_id = f.id);

-- Child profile (for one child)
WITH child AS (SELECT id FROM family_members WHERE relation_type IN ('ابن','ابنة') AND family_id = (SELECT id FROM families WHERE family_name='عائلة العبدالله' LIMIT 1) LIMIT 1)
INSERT INTO child_profile (member_id, vaccination_schedule, passport_renewal_date, id_renewal_date, auto_reminders_enabled)
SELECT id, '{"DTP":"2025-01-10","MMR":"2025-02-15"}', CURRENT_DATE + INTERVAL '180 day', CURRENT_DATE + INTERVAL '365 day', true FROM child
WHERE NOT EXISTS (SELECT 1 FROM child_profile cp WHERE cp.member_id = (SELECT id FROM child));
