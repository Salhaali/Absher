import { supabase } from '@/lib/supabase'

export type Member = {
  id: string
  family_id: string
  user_id?: string
  full_name?: string
  relation_type?: string
  relation_to_family?: string
  marital_status?: string
  age?: number
  education_level?: string
  blood_type?: string
  is_main_member?: boolean
  emergency_contact_phone?: string
}

export type Appointment = {
  id: string
  member_id: string
  type: 'identity' | 'passport' | 'vaccine' | 'medical_insurance'
  title?: string
  due_date?: string
  expiry_date?: string
  status: 'active' | 'expired' | 'upcoming'
  auto_reminder_enabled: boolean
}

export type Alert = {
  id: string
  member_id?: string | null
  appointment_id?: string | null
  type: 'expired_id' | 'expired_passport' | 'upcoming_vaccine' | 'insurance_ending' | 'general_warning'
  message: string
  is_read: boolean
  created_at: string
}

export async function getFamilyMembers(familyId: string) {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', familyId)
  if (error || !data) {
    const resp = await fetch('/api/family-members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ family_id: familyId }) })
    const json = await resp.json()
    return (json.members || []) as Member[]
  }
  return data as Member[]
}

export async function addFamilyMember(familyId: string, payload: Partial<Member>) {
  const { data, error } = await supabase
    .from('family_members')
    .insert([{ ...payload, family_id: familyId }])
    .select('*')
    .single()
  if (error) throw error
  return data as Member
}

export async function getMemberAppointments(memberId: string) {
  const { data, error } = await supabase
    .from('family_appointments')
    .select('*')
    .eq('member_id', memberId)
    .order('due_date', { ascending: true, nullsFirst: true })
  if (error) throw error
  return data as Appointment[]
}

export async function addAppointment(payload: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('family_appointments')
    .insert([payload])
    .select('*')
    .single()
  if (error) throw error
  return data as Appointment
}

export async function getFamilyAppointments(familyId: string) {
  try {
    const idsRes = await supabase.from('family_members').select('id, full_name, relation_type').eq('family_id', familyId)
    const ids = idsRes.data?.map((m:any)=>m.id) || []
    const { data, error } = await supabase.from('family_appointments').select('*').in('member_id', ids)
    if (error) throw error
    return (data || []) as any[]
  } catch {
    const resp = await fetch('/api/family-appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ family_id: familyId }) })
    const json = await resp.json()
    return json.items || []
  }
}

export async function getAlerts(familyId: string) {
  try {
    const memberIds = (await supabase.from('family_members').select('id').eq('family_id', familyId)).data?.map((m: any) => m.id) || []
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .in('member_id', memberIds)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as Alert[]
  } catch {
    const resp = await fetch('/api/alerts-family', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ family_id: familyId }) })
    const json = await resp.json()
    return json.alerts || []
  }
}

export async function markAlertRead(alertId: string) {
  const { error } = await supabase.from('alerts').update({ is_read: true }).eq('id', alertId)
  if (error) throw error
}

export async function getEmergencyCard(familyId: string) {
  try {
    const { data, error } = await supabase
      .from('emergency_card')
      .select('*')
      .eq('family_id', familyId)
      .maybeSingle()
    if (error) throw error
    return data || null
  } catch {
    const resp = await fetch('/api/emergency-card', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ family_id: familyId }) })
    const json = await resp.json()
    return json.card || null
  }
}

export async function upsertEmergencyCard(familyId: string, payload: any) {
  const { data, error } = await supabase
    .from('emergency_card')
    .upsert([{ ...payload, family_id: familyId }], { onConflict: 'family_id' })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function getChildProfile(memberId: string) {
  const { data, error } = await supabase
    .from('child_profile')
    .select('*')
    .eq('member_id', memberId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export async function upsertChildProfile(memberId: string, payload: any) {
  const { data, error } = await supabase
    .from('child_profile')
    .upsert([{ ...payload, member_id: memberId }], { onConflict: 'member_id' })
    .select('*')
    .single()
  if (error) throw error
  return data
}
export async function getFirstFamily() {
  try {
    const { data } = await supabase.from('families').select('*').limit(1)
    return data && data[0] ? data[0] : null
  } catch {
    const resp = await fetch('/api/family-first')
    const json = await resp.json()
    return json.family || null
  }
}
