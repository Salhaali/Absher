// Vercel serverless function: Generate AI suggestions based on real appointments
/** @type {import('http').IncomingMessage} */
/** @type {import('http').ServerResponse} */
module.exports = async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_PUBLIC || process.env.OPENAI_API_KEY_SECRET
    if (!apiKey) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'OPENAI_API_KEY missing' }))
    }

    let body = ''
    for await (const chunk of req) body += chunk
    const payload = body ? JSON.parse(body) : {}
    const { appointments = [] } = payload

    const today = new Date().toISOString().slice(0, 10)
    const prompt = `أنت مساعد ذكي للأسرة. لديك قائمة مواعيد/وثائق فعلية بالتنسيق JSON.
أعد اقتراحات عملية قصيرة باللغة العربية فقط، بصيغة JSON مصفوفة بعنوان title و detail و action.
اعتبر اليوم ${today}. ضع اقتراحات للتطعيم في أوقات غير مزدحمة (صباح الثلاثاء أو مساء الخميس)، والتنبيه لتجديد الهوية/الجواز/التأمين.
المدخلات: ${JSON.stringify(appointments).slice(0, 8000)}`

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'انت مساعد لإدارة الأسرة. أعد استجابات بصيغة JSON فقط.' },
          { role: 'user', content: prompt },
        ],
      }),
    })
    const data = await resp.json()
    const text = data?.choices?.[0]?.message?.content || '[]'
    let suggestions
    try { suggestions = JSON.parse(text) } catch { suggestions = [{ title: 'اقتراحات عامة', detail: 'تحقق من المواعيد', action: 'حجز موعد قريب' }] }

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ suggestions }))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: String(err) }))
  }
}
