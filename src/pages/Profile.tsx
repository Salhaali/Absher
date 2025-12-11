import { useAuthStore } from "@/store/authStore";
import { User, Mail, Phone, Calendar, MapPin, Edit, Users } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";

export default function Profile() {
  const { user, family } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="الملف الشخصي" subtitle="معلوماتك الشخصية" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="absher-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 arabic-text mb-4 flex items-center">
              <User className="h-5 w-5 ml-2 text-green-600" />
              المعلومات الشخصية
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">الاسم الكامل</p>
                  <p className="font-medium">{user?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">رقم الجوال</p>
                  <p className="font-medium">{user?.phone_number || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                  <p className="font-medium">{user?.date_of_birth || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">الجنس</p>
                  <p className="font-medium">{user?.gender || "غير محدد"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="absher-card p-6">
            <h2 className="text-xl font-semibold text-gray-800 arabic-text mb-4 flex items-center">
              <MapPin className="h-5 w-5 ml-2 text-green-600" />
              معلومات العائلة
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">اسم العائلة</p>
                  <p className="font-medium">{family?.family_name || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المدينة</p>
                  <p className="font-medium">{family?.city || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">المنطقة</p>
                  <p className="font-medium">{family?.region || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 ml-3 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">دورك في العائلة</p>
                  <p className="font-medium">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
