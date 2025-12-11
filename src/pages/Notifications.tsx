import { Bell, Calendar, User, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getAlerts, markAlertRead, addAppointment, getFirstFamily } from "@/services/family";
import { supabase } from "@/lib/supabase";
import { demoAlerts } from "@/data/demoData";
import HeaderBar from "@/components/HeaderBar";

export default function Notifications() {
  const { family } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    const run = async () => {
      const demo = import.meta.env.VITE_DEMO_MODE === 'true'
      if (demo) {
        setNotifications(demoAlerts as any)
        console.log('alerts data', demoAlerts, null)
        return
      }
      let famId = family?.id
      if (!famId) {
        const fam = await getFirstFamily()
        famId = fam?.id
      }
      if (!famId) return;
      try {
        const data = await getAlerts(famId);
        setNotifications(data);
      } catch (e) {
        console.error(e);
      }
    };
    run();
  }, [family?.id]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5" />;
      case "appointment_booked":
        return <Calendar className="h-5 w-5" />;
      case "warning":
        return <AlertCircle className="h-5 w-5" />;
      case "success":
        return <Bell className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "appointment_booked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="التنبيهات" subtitle="إدارة الإشعارات والتنبيهات" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`absher-card p-6 border-l-4 ${getTypeColor(notification.type)} ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${getTypeColor(notification.type)} mr-4`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 arabic-text">
                      {notification.type}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{notification.date}</span>
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700">{notification.message}</p>
                  <div className="mt-3 flex space-x-2">
                    {!notification.is_read && (
                      <button
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200"
                        onClick={async()=>{ await markAlertRead(notification.id); setNotifications((prev)=>prev.map(n=>n.id===notification.id?{...n,is_read:true}:n)); }}
                      >تحديد كمقروء</button>
                    )}
                    {['expired_id','expired_passport','insurance_ending','upcoming_vaccine'].includes(notification.type) && (
                      <button
                        className="bg-white border border-green-600 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-50"
                        onClick={async()=>{
                          if (!notification.member_id) return;
                          const today = new Date();
                          await addAppointment({ member_id: notification.member_id, type: notification.type.includes('vaccine')?'vaccine':(notification.type.includes('passport')?'passport':(notification.type.includes('insurance')?'medical_insurance':'identity')), status: 'upcoming', title: 'حجز موعد' , due_date: today.toISOString().slice(0,10), auto_reminder_enabled: true });
                        }}
                      >حجز موعد</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد تنبيهات</h3>
            <p className="text-gray-600">سيتم إعلامك عند وجود تنبيهات جديدة</p>
          </div>
        )}
      </div>
    </div>
  );
}
