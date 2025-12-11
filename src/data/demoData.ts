export const demoFamilyMembers = [
  {
    id: "1",
    full_name: "محمد عبدالله",
    relation_to_family: "أب",
    marital_status: "متزوج",
    age: 45,
    education_level: "جامعي",
    blood_type: "O+",
  },
  {
    id: "2",
    full_name: "ريم محمد",
    relation_to_family: "ابنة",
    marital_status: "طفلة",
    age: 8,
    education_level: "ابتدائي",
    blood_type: "A+",
  },
  {
    id: "3",
    full_name: "سارة محمد",
    relation_to_family: "أم",
    age: 40,
    education_level: "جامعي",
    blood_type: "O+",
  },
]

export const demoAppointments = [
  { id: "1", member_id: "1", type: "identity", title: "تجديد هوية", due_date: "2024-12-15", status: "upcoming" },
  { id: "2", member_id: "1", type: "passport", title: "تجديد جواز", due_date: "2025-01-10", status: "upcoming" },
  { id: "3", member_id: "2", type: "vaccine", title: "تطعيم طفلة", due_date: "2024-12-20", status: "upcoming" },
  { id: "4", member_id: "3", type: "medical_insurance", title: "تأمين طبي", due_date: "2025-02-01", status: "upcoming" },
]

export const demoAlerts = [
  { id: "1", type: "identity_expired", message: "هوية الأب تحتاج تجديد خلال 3 أيام.", is_read: false },
  { id: "2", type: "vaccine_due", message: "تطعيم ريم مستحق الأسبوع القادم.", is_read: false },
]

export const demoEmergencyCard = {
  main_member_name: "محمد عبدالله",
  blood_type: "O+",
  emergency_contact_name: "سارة محمد",
  emergency_contact_phone: "0555555555",
  nearest_ambulance_center_name: "مركز إسعاف العليا",
}

export const demoChildProfile = {
  child_name: "ريم محمد",
  vaccination_notes: "جرعة التطعيم التالية بتاريخ 20 ديسمبر.",
  passport_due: "2025-02-20",
  identity_due: "2026-08-10",
  auto_reminders_enabled: true,
}
