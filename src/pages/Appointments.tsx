import { Calendar, Clock, MapPin, User, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFamilyAppointments, getFirstFamily } from "@/services/family";
import { supabase } from "@/lib/supabase";
import HeaderBar from "@/components/HeaderBar";
import { demoAppointments } from "@/data/demoData";

export default function Appointments() {
  const { family } = useAuthStore();
  const [items, setItems] = useState<any[]>([]);
  const [type, setType] = useState<string>("all");

  useEffect(() => {
    const run = async () => {
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        setItems(demoAppointments as any)
        console.log('appointments data', demoAppointments, null)
        return
      }
      let famId = family?.id
      if (!famId) {
        const fam = await getFirstFamily()
        famId = fam?.id
      }
      if (!famId) return;
      try {
        const data = await getFamilyAppointments(famId);
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [family?.id]);

  const filtered = useMemo(() => {
    if (type === "all") return items;
    return items.filter((i) => i.type === type);
  }, [items, type]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "family":
        return "bg-blue-100 text-blue-800";
      case "medical":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="المواعيد" subtitle="إدارة المواعيد العائلية" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-end mb-4">
          <Filter className="h-4 w-4 text-gray-500 ml-2" />
          <select className="absher-input w-48" value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="all">الكل</option>
            <option value="identity">الهوية</option>
            <option value="passport">الجواز</option>
            <option value="vaccine">التطعيم</option>
            <option value="medical_insurance">التأمين</option>
          </select>
        </div>
        <div className="space-y-4">
          {filtered.map((appointment) => (
            <div key={appointment.id} className="absher-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-green-600 ml-2" />
                    <h3 className="text-lg font-semibold text-gray-800 arabic-text">
                      {appointment.title || appointment.type}
                    </h3>
                    <span className={`mr-3 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                      {appointment.type === "identity" && "هوية"}
                      {appointment.type === "passport" && "جواز"}
                      {appointment.type === "vaccine" && "تطعيم"}
                      {appointment.type === "medical_insurance" && "تأمين"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 ml-2" />
                      <div>
                        <p className="font-medium">{appointment.due_date || appointment.expiry_date || "—"}</p>
                        <p>{appointment.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                      <p>—</p>
                    </div>

                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 ml-2" />
                      <p>{appointment.member?.full_name || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition-colors duration-200">
                    تعديل
                  </button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors duration-200">
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد مواعيد</h3>
            <p className="text-gray-600">أضف أول موعد لك</p>
            <button className="absher-button mt-4">
              إضافة موعد
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
