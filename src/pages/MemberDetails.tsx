import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getMemberAppointments, Member, Appointment } from '@/services/family'
import { supabase } from '@/lib/supabase'
import { User, Calendar, Heart, GraduationCap, Droplets } from 'lucide-react'
import HeaderBar from '@/components/HeaderBar'

export default function MemberDetails() {
  const { memberId } = useParams()
  const [member, setMember] = useState<Member | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const run = async () => {
      if (!memberId) return
      const { data: m } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', memberId)
        .single()
      setMember(m as Member)
      const aps = await getMemberAppointments(memberId)
      setAppointments(aps)
    }
    run()
  }, [memberId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="بيانات الفرد" subtitle="التفاصيل والمواعيد" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="absher-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 arabic-text mb-4 flex items-center">
              <User className="h-5 w-5 ml-2 text-green-600" />
              المعلومات الأساسية
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium">الاسم:</span> {member?.full_name || '—'}</p>
              <p><span className="font-medium">صلة القرابة:</span> {member?.relation_type || member?.relation_to_family || '—'}</p>
              <p><span className="font-medium">الحالة الاجتماعية:</span> {member?.marital_status || '—'}</p>
              <p><span className="font-medium">العمر:</span> {member?.age ?? '—'}</p>
              <p><span className="font-medium">المستوى التعليمي:</span> {member?.education_level || '—'} <GraduationCap className="inline h-4 w-4 ml-1 text-gray-400" /></p>
              <p><span className="font-medium">فصيلة الدم:</span> {member?.blood_type || '—'} <Droplets className="inline h-4 w-4 ml-1 text-red-400" /></p>
            </div>
          </div>

          <div className="absher-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 arabic-text mb-4 flex items-center">
              <Heart className="h-5 w-5 ml-2 text-green-600" />
              مواعيد ووثائق الفرد
            </h2>
            <div className="space-y-3">
              {appointments.map(a => (
                <div key={a.id} className="border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 ml-2 text-green-600" />
                    <div>
                      <p className="font-medium">{a.title || a.type}</p>
                      <p className="text-sm text-gray-500">التاريخ: {a.due_date || a.expiry_date || '—'} | الحالة: {a.status}</p>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-gray-600">لا توجد مواعيد مسجلة لهذا الفرد.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
