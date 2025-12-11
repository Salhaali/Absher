import { useAuthStore } from "@/store/authStore";
import { User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getFamilyMembers, Member, getFirstFamily } from "@/services/family";
import { supabase } from "@/lib/supabase";
import { demoFamilyMembers } from "@/data/demoData";
import { useNavigate } from "react-router-dom";
import HeaderBar from "@/components/HeaderBar";

export default function FamilyMembers() {
  const { family } = useAuthStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const demo = import.meta.env.VITE_DEMO_MODE === 'true'
        if (demo) {
          setMembers(demoFamilyMembers as any)
          console.log('family_members data', demoFamilyMembers, null)
          return
        }
        let famId = family?.id
        if (!famId) {
          const fam = await getFirstFamily()
          famId = fam?.id
        }
        if (famId) {
          const data = await getFamilyMembers(famId);
          setMembers(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [family?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <HeaderBar title="أفراد العائلة" subtitle={family?.family_name || "عائلتي"} />

      {/* Family Members Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="absher-card p-6 text-center hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(`/member/${member.id}`)}
            >
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full mx-auto bg-green-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 arabic-text mb-1">
                {member.full_name || 'عضو'}
              </h3>
              <p className="text-sm text-green-600 font-medium mb-2">
                {member.relation_type || member.relation_to_family || ''}
              </p>
              <p className="text-xs text-gray-500">
                {member.education_level || ''}
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors duration-200">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
        {!loading && members.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">لا يوجد أفراد</h3>
            <p className="text-gray-600">أضف أول فرد لعائلتك</p>
          </div>
        )}
      </div>
    </div>
  );
}
