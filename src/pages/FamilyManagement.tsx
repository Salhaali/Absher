import { useAuthStore } from "@/store/authStore";
import { Settings, Users, Edit, Save } from "lucide-react";
import HeaderBar from "@/components/HeaderBar";
import { useState } from "react";

export default function FamilyManagement() {
  const { user, family } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [familyData, setFamilyData] = useState({
    family_name: family?.family_name || "",
    city: family?.city || "",
    region: family?.region || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFamilyData({
      ...familyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log("Saving family data:", familyData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="إدارة العائلة" subtitle="إدارة بيانات العائلة" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absher-card p-8">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-green-600 ml-3" />
            <h2 className="text-2xl font-semibold text-gray-800 arabic-text">
              بيانات العائلة
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="family_name" className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العائلة
                </label>
                <input
                  id="family_name"
                  name="family_name"
                  type="text"
                  value={familyData.family_name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`absher-input ${!isEditing ? 'bg-gray-100' : ''}`}
                  placeholder="أدخل اسم العائلة"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={familyData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`absher-input ${!isEditing ? 'bg-gray-100' : ''}`}
                  placeholder="أدخل اسم المدينة"
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة
                </label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  value={familyData.region}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`absher-input ${!isEditing ? 'bg-gray-100' : ''}`}
                  placeholder="أدخل اسم المنطقة"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="absher-button"
                >
                  حفظ التغييرات
                </button>
              </div>
            )}
          </form>

          {/* Family Members Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-green-600 ml-3" />
              <h2 className="text-2xl font-semibold text-gray-800 arabic-text">
                أفراد العائلة
              </h2>
            </div>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">يمكنك إضافة وإدارة أفراد العائلة من هنا</p>
              <button className="absher-button mt-4">
                إضافة فرد جديد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
