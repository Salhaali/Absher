const { createClient } = require('@supabase/supabase-js')

module.exports = async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      res.statusCode = 500
      return res.end(JSON.stringify({ error: 'Supabase service role not configured' }))
    }
    const supabase = createClient(url, key)

    let body = ''
    for await (const chunk of req) body += chunk
    const payload = body ? JSON.parse(body) : {}
    const { member_id, type, date, time, external_booking_link } = payload
    if (!member_id || !type || !date) {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'member_id, type, date are required' }))
    }

    const { data: appt, error: apptErr } = await supabase
      .from('family_appointments')
      .insert([{ member_id, type, title: 'حجز موعد', due_date: date, status: 'booked', appointment_time: time || '20:00', external_booking_link }])
      .select('*')
      .single()
    if (apptErr) throw apptErr

    const message = `تم حجز موعد لعضو ${member_id} بتاريخ ${date}${time ? ' الساعة ' + time : ''}.`
    const { error: alertErr } = await supabase
      .from('alerts')
      .insert([{ member_id, appointment_id: appt.id, type: 'appointment_booked', message }])
    if (alertErr) throw alertErr

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ appointment: appt }))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: String(e) }))
  }
}
