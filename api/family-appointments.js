const { createClient } = require('@supabase/supabase-js')
module.exports = async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = createClient(url, key)
    let body = ''
    for await (const chunk of req) body += chunk
    const { family_id } = body ? JSON.parse(body) : {}
    const { data: memberIds } = await supabase.from('family_members').select('id, full_name, relation_type').eq('family_id', family_id)
    const ids = (memberIds || []).map(m => m.id)
    const { data } = await supabase.from('family_appointments').select('*').in('member_id', ids)
    const enriched = (data || []).map(a => ({ ...a, member: (memberIds || []).find(m => m.id === a.member_id) }))
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ items: enriched }))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: String(e) }))
  }
}
