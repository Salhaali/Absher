import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Brain, CalendarCheck, AlertTriangle } from 'lucide-react'
import { getAISuggestions } from '@/services/ai'
import HeaderBar from '@/components/HeaderBar'

export default function AIAdvisor() {
  const { family } = useAuthStore()
  const [suggestions, setSuggestions] = useState<any[]>([])

  useEffect(() => {
    const run = async () => {
      if (!family?.id) return
      const sgs = await getAISuggestions(family.id)
      setSuggestions(sgs)
    }
    run()
  }, [family?.id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="الذكاء الاصطناعي لاحتياجات العائلة" subtitle="اقتراحات مبنية على البيانات الفعلية" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {suggestions.map((s, idx) => (
            <div key={idx} className="absher-card p-6 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 ml-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 arabic-text">{s.title}</h3>
                <p className="text-gray-700">{s.detail}</p>
                {s.action && (<p className="text-sm text-gray-500 mt-1"><CalendarCheck className="inline h-4 w-4 ml-1"/> {s.action}</p>)}
              </div>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد اقتراحات حالياً</h3>
              <p className="text-gray-600">أضف مواعيد ووثائق ليتم تحليلها</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
