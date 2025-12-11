export async function proposeSlot() {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = (1 - day + 7) % 7
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (diffToMonday || 7), 20, 0, 0)
  const date = next.toISOString().slice(0, 10)
  const time = `${String(next.getHours()).padStart(2,'0')}:00`
  return { date, time }
}

export async function bookAppointment(member_id: string, type: string, date?: string, time?: string, external_booking_link?: string) {
  const slot = (!date || !time) ? await proposeSlot() : { date, time }
  const resp = await fetch('/api/book-appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ member_id, type, date: slot.date, time: slot.time, external_booking_link })
  })
  return await resp.json()
}

export async function updateAppointment(appointment_id: string, updates: any) {
  const resp = await fetch('/api/update-appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointment_id, updates })
  })
  return await resp.json()
}
