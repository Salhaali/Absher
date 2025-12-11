import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    national_id: "",
    date_of_birth: "",
    gender: "",
    role: "عضو",
    password: "",
    confirmPassword: "",
    family_name: "",
    city: "",
    region: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (formData.password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(
        {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          national_id: formData.national_id,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          role: formData.role,
        },
        formData.password,
        {
          family_name: formData.family_name,
          city: formData.city,
          region: formData.region,
        }
      );
      navigate("/dashboard");
    } catch (error) {
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-800 arabic-text mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-sm text-green-600">
            Welcome to Absher Family
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 1 ? 'bg-green-600 text-white' : 'bg-green-200 text-green-600'
              }`}>
                1
              </div>
              <div className="w-12 h-1 bg-green-200"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 2 ? 'bg-green-600 text-white' : 'bg-green-200 text-green-600'
              }`}>
                2
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={step === 1 ? handleFirstStepSubmit : handleSubmit}>
          <div className="absher-card p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الجوال
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أدخل رقم الجوال"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="national_id" className="block text-sm font-medium text-gray-700 mb-1">
                      رقم الهوية
                    </label>
                    <input
                      id="national_id"
                      name="national_id"
                      type="text"
                      value={formData.national_id}
                      onChange={handleInputChange}
                      className="absher-input"
                      placeholder="أدخل رقم الهوية"
                    />
                  </div>

                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الميلاد
                    </label>
                    <input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="absher-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      الجنس
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="absher-input"
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أدخل كلمة المرور"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أعد إدخال كلمة المرور"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="absher-button w-full flex justify-center py-3 px-4 text-lg font-medium"
                  >
                    التالي
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="family_name" className="block text-sm font-medium text-gray-700 mb-1">
                      اسم العائلة
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="family_name"
                        name="family_name"
                        type="text"
                        required
                        value={formData.family_name}
                        onChange={handleInputChange}
                        className="absher-input pr-10"
                        placeholder="أدخل اسم العائلة"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      المدينة
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="absher-input"
                      placeholder="أدخل اسم المدينة"
                    />
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      المنطقة
                    </label>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="absher-input"
                      placeholder="أدخل اسم المنطقة"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      دورك في العائلة
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="absher-input"
                    >
                      <option value="عضو">عضو</option>
                      <option value="أب">أب</option>
                      <option value="أم">أم</option>
                      <option value="ابن">ابن</option>
                      <option value="ابنة">ابنة</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 absher-button py-3 px-4 text-lg font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري الإنشاء...
                      </div>
                    ) : (
                      'إنشاء الحساب'
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-500 font-medium"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
