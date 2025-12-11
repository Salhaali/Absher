-- Extend alert types and appointment status, add appointment time and external link
ALTER TABLE alerts DROP CONSTRAINT IF EXISTS alerts_type_check;
ALTER TABLE alerts ADD CONSTRAINT alerts_type_check CHECK (type IN (
  'expired_id','expired_passport','upcoming_vaccine','insurance_ending','general_warning','appointment_booked','appointment_cancelled'
));

ALTER TABLE family_appointments DROP CONSTRAINT IF EXISTS family_appointments_status_check;
ALTER TABLE family_appointments ADD CONSTRAINT family_appointments_status_check CHECK (status IN ('active','expired','upcoming','booked'));

ALTER TABLE family_appointments ADD COLUMN IF NOT EXISTS appointment_time TIME;
ALTER TABLE family_appointments ADD COLUMN IF NOT EXISTS external_booking_link TEXT;
