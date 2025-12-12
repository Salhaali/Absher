import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import FamilyMembers from "@/pages/FamilyMembers";
import MemberDetails from "@/pages/MemberDetails";
import Profile from "@/pages/Profile";
import FamilyManagement from "@/pages/FamilyManagement";
import Appointments from "@/pages/Appointments";
import Notifications from "@/pages/Notifications";
import EmergencyCard from "@/pages/EmergencyCard";
import AIAdvisor from "@/pages/AIAdvisor";
import FamilyAssistant from "@/pages/FamilyAssistant";
import ChildProfile from "@/pages/ChildProfile";

// 🚫 في وضع الديمو ما نبي حماية دخول، فـ ما نستخدم ProtectedRoute

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 👈 الصفحة الرئيسية ترجع Home مثل ما كانت أول */}
        <Route path="/" element={<Home />} />

        {/* /login يرجع للرئيسية في وضع الديمو */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* تتركينها لو حابة تستعرضي صفحة التسجيل مستقبلاً */}
        <Route path="/register" element={<Register />} />

        {/* بقية الصفحات مفتوحة مباشرة بدون تسجيل دخول */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/family-members" element={<FamilyMembers />} />
        <Route path="/member/:memberId" element={<MemberDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/family-management" element={<FamilyManagement />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/emergency" element={<EmergencyCard />} />
        <Route path="/ai" element={<AIAdvisor />} />
        <Route path="/assistant" element={<FamilyAssistant />} />
        <Route path="/child" element={<ChildProfile />} />

        {/* أي مسار غلط رجّعيه للرئيسية (اختياري) */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}
