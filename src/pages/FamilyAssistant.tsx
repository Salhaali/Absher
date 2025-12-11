import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import HeaderBar from '@/components/HeaderBar'
import { getFamilyAppointments, getFamilyMembers, getFirstFamily } from '@/services/family'
import { bookAppointment, updateAppointment } from '@/services/assistant'
import { demoFamilyMembers, demoAppointments } from '@/data/demoData'
import { Calendar, Check, X, Edit } from 'lucide-react'

export default function FamilyAssistant() {
  const { family } = useAuthStore()
  const [members, setMembers] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        setMembers(demoFamilyMembers as any)
        setItems(demoAppointments as any)
        return
      }
      let famId = family?.id
      if (!famId) {
        const fam = await getFirstFamily()
        famId = fam?.id
      }
      if (!famId) return
      const ms = await getFamilyMembers(famId)
      setMembers(ms)
      const aps = await getFamilyAppointments(famId)
      setItems(aps)
    }
    run()
  }, [family?.id])

  const risky = useMemo(() => {
    const today = new Date()
    const daysTo = (d?: string) => d ? Math.ceil((new Date(d).getTime() - today.getTime())/(1000*60*60*24)) : 9999
    return items.filter(i => {
      const dd = i.due_date || i.expiry_date
      const n = daysTo(dd)
      return i.status !== 'booked' && (n <= 30 || i.status === 'expired')
    })
  }, [items])

  const requestAutoBooking = async () => {
    const demo = import.meta.env.VITE_DEMO_MODE === 'true'
    if (demo) {
      const booked = risky.map(i => ({ ...i, status: 'booked', appointment_time: '20:00' }))
      setItems(prev => prev.map(p => booked.find(b=>b.id===p.id) || p))
      setLog(l => [ 'تم حجز مواعيد تجريبية بواسطة مساعد العائلة (Mock).', ...l ])
      return
    }
    for (const i of risky) {
      const r = await bookAppointment(i.member_id, i.type)
      if (r.appointment) {
        setLog(l => [ `مساعد العائلة حجز موعد لـ ${i.member?.full_name || 'فرد'} ${r.appointment.due_date} ${r.appointment.appointment_time}`, ...l ])
      }
    }
    if (family?.id) {
      const aps = await getFamilyAppointments(family.id)
      setItems(aps)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="مساعد العائلة" subtitle="حجز المواعيد وإدارتها تلقائياً" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absher-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 arabic-text">المهام السريعة</h2>
            <div className="flex space-x-2">
              <button className="absher-button" onClick={requestAutoBooking}>احجز التجديدات القادمة</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="absher-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 arabic-text mb-4">حالات تحتاج حجز</h3>
            <div className="space-y-3">
              {risky.map(i => (
                <div key={i.id} className="border rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-green-600 ml-2" />
                    <div>
                      <p className="font-medium">{i.type}</p>
                      <p className="text-sm text-gray-500">{i.member?.full_name || '—'} | {i.due_date || i.expiry_date || '—'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200" onClick={async()=>{ const r = await bookAppointment(i.member_id, i.type); if (r.appointment) setItems(items.map(x=>x.id===i.id? r.appointment : x)) }}>احجز</button>
                  </div>
                </div>
              ))}
              {risky.length === 0 && <p className="text-gray-600">لا توجد حالات تتطلب حجز خلال 30 يوم.</p>}
            </div>
          </div>

          <div className="absher-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 arabic-text mb-4">سجل مساعد العائلة</h3>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              {log.map((l, idx)=>(<li key={idx}>{l}</li>))}
              {log.length === 0 && (<li>لا توجد مهام مسجلة بعد.</li>)}
            </ul>
          </div>
        </div>

        <div className="absher-card p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 arabic-text mb-4">المواعيد المحجوزة</h3>
          <div className="space-y-3">
            {items.filter(x=>x.status==='booked').map(a => (
              <div key={a.id} className="border rounded-lg p-3">
                <p className="font-medium">مساعد العائلة حجز لك موعد {a.type} لـ {a.member?.full_name || 'فرد'} يوم {a.due_date} {a.appointment_time || ''}.</p>
                <div className="mt-2 flex space-x-2">
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 flex items-center" onClick={async()=>{ if (import.meta.env.VITE_DEMO_MODE === 'true') { setItems(prev=>prev.map(p=>p.id===a.id? { ...p, status: 'active' }: p)) } else { await updateAppointment(a.id, { status: 'active' }); const aps = await getFamilyAppointments(family!.id); setItems(aps) } }}><Check className="h-4 w-4 ml-1"/> تأكيد الموعد</button>
                  <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200 flex items-center" onClick={async()=>{ if (import.meta.env.VITE_DEMO_MODE === 'true') { setItems(prev=>prev.map(p=>p.id===a.id? { ...p, appointment_time: '18:00' }: p)) } else { const next = await updateAppointment(a.id, { due_date: a.due_date, appointment_time: '18:00' }); const aps = await getFamilyAppointments(family!.id); setItems(aps) } }}><Edit className="h-4 w-4 ml-1"/> تعديل الموعد</button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 flex items-center" onClick={async()=>{ if (import.meta.env.VITE_DEMO_MODE === 'true') { setItems(prev=>prev.map(p=>p.id===a.id? { ...p, status: 'upcoming' }: p)) } else { await updateAppointment(a.id, { status: 'upcoming' }); const aps = await getFamilyAppointments(family!.id); setItems(aps) } }}><X className="h-4 w-4 ml-1"/> إلغاء الموعد</button>
                </div>
              </div>
            ))}
            {items.filter(x=>x.status==='booked').length === 0 && <p className="text-gray-600">لا توجد مواعيد محجوزة.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
