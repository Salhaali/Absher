const { createClient } = require('@supabase/supabase-js')
module.exports = async (req, res) => {
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = createClient(url, key)
    const { data: fam } = await supabase.from('families').select('*').limit(1)
    const family = fam && fam[0] ? fam[0] : null
    let members = []
    if (family) {
      const { data: ms } = await supabase.from('family_members').select('*').eq('family_id', family.id)
      members = ms || []
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ family, members }))
  } catch (e) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: String(e) }))
  }
}
