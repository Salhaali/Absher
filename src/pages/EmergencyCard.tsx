import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getEmergencyCard, upsertEmergencyCard, getFirstFamily } from '@/services/family'
import { supabase } from '@/lib/supabase'
import { demoEmergencyCard } from '@/data/demoData'
import { User, Phone, Droplets, MapPin } from 'lucide-react'
import HeaderBar from '@/components/HeaderBar'

export default function EmergencyCard() {
  const { family } = useAuthStore()
  const [card, setCard] = useState<any>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const run = async () => {
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        setCard(demoEmergencyCard)
        console.log('emergency_card data', demoEmergencyCard, null)
        return
      }
      let famId = family?.id
      if (!famId) {
        const fam = await getFirstFamily()
        famId = fam?.id
      }
      if (!famId) return
      const c = await getEmergencyCard(famId)
      setCard(c)
    }
    run()
  }, [family?.id])

  const save = async () => {
    const fam = family || await getFirstFamily()
    if (!fam?.id) return
    const updated = await upsertEmergencyCard(fam.id, card || {})
    setCard(updated)
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="بطاقة الوصول السريع للطوارئ" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absher-card p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-5 w-5 ml-2 text-green-600" />
              <input className="absher-input" placeholder="اسم الفرد الأساسي" value={card?.main_member_name || ''} onChange={e=>setCard({...card, main_member_name: e.target.value})} />
            </div>
            <div className="flex items-center">
              <Droplets className="h-5 w-5 ml-2 text-red-500" />
              <input className="absher-input" placeholder="فصيلة الدم" value={card?.blood_type || ''} onChange={e=>setCard({...card, blood_type: e.target.value})} />
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 ml-2 text-green-600" />
              <input className="absher-input" placeholder="جهة اتصال للطوارئ" value={card?.emergency_contact_name || ''} onChange={e=>setCard({...card, emergency_contact_name: e.target.value})} />
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 ml-2 text-green-600" />
              <input className="absher-input" placeholder="رقم جهة الاتصال" value={card?.emergency_contact_phone || ''} onChange={e=>setCard({...card, emergency_contact_phone: e.target.value})} />
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 ml-2 text-green-600" />
              <input className="absher-input" placeholder="أقرب مركز إسعاف" value={card?.nearest_ambulance_center_name || ''} onChange={e=>setCard({...card, nearest_ambulance_center_name: e.target.value})} />
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 ml-2 text-green-600" />
              <input className="absher-input" placeholder="رابط الموقع" value={card?.nearest_ambulance_center_location_link || ''} onChange={e=>setCard({...card, nearest_ambulance_center_location_link: e.target.value})} />
            </div>
          </div>
          <div className="mt-6 text-center">
            <button className="absher-button" onClick={save}>حفظ البطاقة</button>
          </div>
        </div>
      </div>
    </div>
  )
}
