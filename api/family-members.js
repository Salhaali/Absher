const { createClient } = require('@supabase/supabase-js')
module.exports = async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = createClient(url, key)
    let body = ''
    for await (const chunk of req) body += chunk
    const { family_id } = body ? JSON.parse(body) : {}
    const { data, error } = await supabase.from('family_members').select('*').eq('family_id', family_id)
    if (error) throw error
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ members: data }))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: String(e) }))
  }
}
