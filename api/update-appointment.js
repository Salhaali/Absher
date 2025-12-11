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
    const { appointment_id, updates } = payload
    if (!appointment_id || !updates) {
      res.statusCode = 400
      return res.end(JSON.stringify({ error: 'appointment_id and updates are required' }))
    }

    const { data, error } = await supabase
      .from('family_appointments')
      .update(updates)
      .eq('id', appointment_id)
      .select('*')
      .single()
    if (error) throw error

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ appointment: data }))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: String(e) }))
  }
}
