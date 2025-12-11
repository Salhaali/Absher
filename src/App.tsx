import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  // Demo: disable auth bootstrap and loading gate for public access.

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FamilyMembers />} />
        <Route path="/login" element={<Navigate to="/family-members" replace />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family-members"
          element={
            <ProtectedRoute>
              <FamilyMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/:memberId"
          element={
            <ProtectedRoute>
              <MemberDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/family-management"
          element={
            <ProtectedRoute>
              <FamilyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <EmergencyCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <AIAdvisor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <FamilyAssistant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/child"
          element={
            <ProtectedRoute>
              <ChildProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
