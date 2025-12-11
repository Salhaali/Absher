import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getFamilyMembers, getChildProfile, upsertChildProfile, getFirstFamily } from '@/services/family'
import { supabase } from '@/lib/supabase'
import { demoFamilyMembers, demoChildProfile } from '@/data/demoData'
import { Baby, Calendar, Save } from 'lucide-react'
import HeaderBar from '@/components/HeaderBar'

export default function ChildProfile() {
  const { family } = useAuthStore()
  const [children, setChildren] = useState<any[]>([])
  const [selected, setSelected] = useState<string>('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const run = async () => {
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        const data = demoFamilyMembers as any[]
        console.log('family_members (child) data', data, null)
        const kids = data.filter((m:any)=>['ابن','ابنة'].includes(m.relation_to_family || m.relation_type || ''))
        setChildren(kids)
        if (kids[0]) setSelected(kids[0].id)
        return
      }
      let famId = family?.id
      if (!famId) {
        const fam = await getFirstFamily()
        famId = fam?.id
      }
      if (!famId) return
      const members = await getFamilyMembers(famId)
      const kids = members.filter(m => ['ابن','ابنة'].includes(m.relation_type || m.relation_to_family || ''))
      setChildren(kids)
      if (kids[0]) {
        setSelected(kids[0].id)
      }
    }
    run()
  }, [family?.id])

  useEffect(() => {
    const load = async () => {
      if (!selected) return
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        const p = demoChildProfile as any
        console.log('child_profile data', p, null)
        setProfile({
          vaccination_schedule: { note: p.vaccination_notes },
          passport_renewal_date: p.passport_due,
          id_renewal_date: p.identity_due,
          auto_reminders_enabled: p.auto_reminders_enabled,
        })
        return
      }
      const p = await getChildProfile(selected)
      setProfile(p || { vaccination_schedule: {}, auto_reminders_enabled: true })
    }
    load()
  }, [selected])

  const save = async () => {
    if (!selected) return
    const result = await upsertChildProfile(selected, profile)
    setProfile(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="حساب الطفل الذكي" subtitle="التطعيمات والوثائق للأطفال" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absher-card p-6">
          <div className="flex items-center mb-4">
            <Baby className="h-5 w-5 ml-2 text-green-600" />
            <select className="absher-input" value={selected} onChange={(e)=>setSelected(e.target.value)}>
              {children.map(c=> (<option key={c.id} value={c.id}>{c.full_name || 'طفل'}</option>))}
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">جدول التطعيمات (JSON)</label>
              <textarea className="absher-input h-40" value={JSON.stringify(profile?.vaccination_schedule || {}, null, 2)} onChange={(e)=>{
                try { setProfile({ ...profile, vaccination_schedule: JSON.parse(e.target.value) }) } catch {}
              }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ تجديد الجواز</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                  <input type="date" className="absher-input" value={profile?.passport_renewal_date || ''} onChange={(e)=>setProfile({ ...profile, passport_renewal_date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ تجديد الهوية</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                  <input type="date" className="absher-input" value={profile?.id_renewal_date || ''} onChange={(e)=>setProfile({ ...profile, id_renewal_date: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input id="auto" type="checkbox" className="mr-2" checked={!!profile?.auto_reminders_enabled} onChange={(e)=>setProfile({ ...profile, auto_reminders_enabled: e.target.checked })} />
              <label htmlFor="auto" className="text-sm">تفعيل التذكيرات التلقائية</label>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="absher-button" onClick={save}><Save className="inline h-4 w-4 ml-2"/> حفظ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
