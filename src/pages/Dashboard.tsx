import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Users, Calendar, Bell, Settings, User, Home } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, family } = useAuthStore();

  const services = [
    {
      id: 1,
      title: "أفراد العائلة",
      titleEn: "Family Members",
      description: "عرض وإدارة أفراد العائلة",
      descriptionEn: "View and manage family members",
      icon: Users,
      color: "bg-blue-500",
      path: "/family-members",
    },
    {
      id: 2,
      title: "المواعيد",
      titleEn: "Appointments",
      description: "إدارة المواعيد العائلية",
      descriptionEn: "Manage family appointments",
      icon: Calendar,
      color: "bg-purple-500",
      path: "/appointments",
    },
    {
      id: 5,
      title: "إدارة العائلة",
      titleEn: "Family Management",
      description: "إدارة بيانات العائلة",
      descriptionEn: "Manage family information",
      icon: Settings,
      color: "bg-red-500",
      path: "/family-management",
    },
    
    {
      id: 7,
      title: "بطاقة الطوارئ",
      titleEn: "Emergency Card",
      description: "وصول سريع لمعلومات الطوارئ",
      descriptionEn: "Quick access to emergency info",
      icon: Settings,
      color: "bg-red-600",
      path: "/emergency",
    },
    {
      id: 8,
      title: "مساعد العائلة الذكي",
      titleEn: "AI Advisor",
      description: "اقتراحات وتجديدات مبنية على البيانات",
      descriptionEn: "AI suggestions based on real data",
      icon: Settings,
      color: "bg-indigo-600",
      path: "/assistant",
    },
    {
      id: 9,
      title: "حساب الطفل الذكي",
      titleEn: "Child Smart Account",
      description: "إدارة تطعيمات ووثائق الأطفال",
      descriptionEn: "Manage kids vaccinations & docs",
      icon: Settings,
      color: "bg-teal-600",
      path: "/child",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <HeaderBar title="لوحة التحكم" subtitle="مرحباً بك في عائلة ابشر" />

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 arabic-text mb-2">
            مرحباً {user?.full_name}!
          </h2>
          <p className="text-gray-600">
            {family ? `عائلة ${family.family_name}` : " "}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="absher-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">أفراد العائلة</h3>
            <p className="text-2xl font-bold text-blue-600">8</p>
          </div>
          <div className="absher-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">المواعيد</h3>
            <p className="text-2xl font-bold text-purple-600">3</p>
          </div>
          <div className="absher-card p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">التنبيهات</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigate(service.path)}
                className="absher-card p-6 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800 arabic-text">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500">{service.titleEn}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-sm text-gray-500">{service.descriptionEn}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
