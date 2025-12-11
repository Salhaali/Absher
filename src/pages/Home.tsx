import { useNavigate } from "react-router-dom";
import { Users, Calendar, Bell, Shield, Heart, Home as HomeIcon, Brain } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "إدارة الأفراد",
      titleEn: "Family Members",
      description: "إدارة بيانات جميع أفراد العائلة في مكان واحد",
      descriptionEn: "Manage all family members data in one place",
    },
    {
      icon: Calendar,
      title: "المواعيد",
      titleEn: "Appointments",
      description: "تنظيم وإدارة المواعيد العائلية",
      descriptionEn: "Organize and manage family appointments",
    },
    {
      icon: Bell,
      title: "التنبيهات",
      titleEn: "Notifications",
      description: "تلقي تنبيهات مهمة للعائلة",
      descriptionEn: "Receive important family notifications",
    },
    {
      icon: Shield,
      title: "الخصوصية",
      titleEn: "Privacy",
      description: "حماية بياناتك وبيانات عائلتك",
      descriptionEn: "Protect your and your family's data",
    },
    {
      icon: Brain,
      title: "الذكاء التوكيلي",
      titleEn: "Agentic AI",
      description: "مساعد العائلة يحجز ويُدير المواعيد تلقائيًا ويصدر تنبيهات مبكرة",
      descriptionEn: "Family Assistant auto‑books and manages appointments with proactive alerts",
    },
  ];

  return (
    <div className="min-h-screen">
      <HeaderBar title="عائلة ابشر" subtitle="" transparent />
      {/* Hero Section */}
      <section className="absher-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white arabic-text mb-6">
              عائلة ابشر
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-4">
              Absher Family
            </p>
            <p className="text-lg md:text-xl text-green-200 max-w-3xl mx-auto mb-8">
              نظام إلكتروني متكامل لإدارة شؤون الأسر وربط الأفراد بعوائلهم
            </p>
            <p className="text-base md:text-lg text-green-100 max-w-2xl mx-auto mb-12">
              A comprehensive electronic system for managing family affairs and connecting individuals with their families
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center"
              >
                <HomeIcon className="h-5 w-5 ml-2" />
                عرض الخدمات
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 arabic-text mb-4">
              مميزات عائلة ابشر
            </h2>
            <p className="text-xl text-gray-600">
              Absher Family Features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="absher-card p-8 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 arabic-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{feature.titleEn}</p>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <p className="text-sm text-gray-500">{feature.descriptionEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 absher-gradient-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-white arabic-text mb-6">
            ابدأ رحلتك مع عائلة ابشر اليوم
          </h2>
          <p className="text-xl text-green-100 mb-8">
            انضم إلى آلاف العائلات التي تثق في عائلة ابشر لإدارة شؤونها
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-colors duration-200"
            >
              عرض الخدمات
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold arabic-text mb-4">عائلة ابشر</h3>
            <p className="text-gray-300 mb-4">Absher Family</p>
            <p className="text-gray-400">
              نظام إدارة العائلات الحديث والموثوق
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
