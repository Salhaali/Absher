import { getFamilyAppointments } from '@/services/family'

export async function getAISuggestions(familyId: string) {
  try {
    const items = await getFamilyAppointments(familyId)
    if (import.meta.env.DEV) {
      // Local fallback: heuristic suggestions
      const today = new Date()
      const soon = (d?: string) => d ? (new Date(d).getTime() - today.getTime())/(1000*60*60*24) < 14 : false
      const expired = (d?: string) => d ? new Date(d) < today : false
      const suggestions: any[] = []
      items.forEach(i => {
        if (i.type === 'vaccine' && soon(i.due_date)) {
          suggestions.push({ title: 'موعد تطعيم قريب', detail: `التطعيم لـ ${i.member?.full_name || 'فرد'} قريب خلال أسبوعين`, action: 'اقترح صباح الثلاثاء أو مساء الخميس' })
        }
        if (i.type === 'passport' && (soon(i.expiry_date) || expired(i.expiry_date))) {
          suggestions.push({ title: 'جواز منتهي/قريب الانتهاء', detail: `جواز ${i.member?.full_name || 'فرد'} يحتاج تجديد`, action: 'ابدأ مهمة تجديد الآن' })
        }
        if (i.type === 'identity' && (soon(i.expiry_date) || expired(i.expiry_date))) {
          suggestions.push({ title: 'هوية منتهية/قريبة', detail: `هوية ${i.member?.full_name || 'فرد'} تحتاج تجديد`, action: 'حجز موعد الأحوال' })
        }
        if (i.type === 'medical_insurance' && soon(i.expiry_date)) {
          suggestions.push({ title: 'تأمين طبي سينتهي', detail: `تأمين ${i.member?.full_name || 'فرد'} سينتهي قريباً`, action: 'استعراض باقات التجديد' })
        }
      })
      return suggestions
    }

    const resp = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointments: items }),
    })
    const data = await resp.json()
    return data.suggestions || []
  } catch (e) {
    console.error(e)
    return []
  }
}
