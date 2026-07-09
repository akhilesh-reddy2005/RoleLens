import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { PageTransition } from "./components/shared/PageTransition";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import AnalysisResultPage from "./pages/AnalysisResult";
import SkillGap from "./pages/SkillGap";
import CareerRoadmap from "./pages/CareerRoadmap";
import History from "./pages/History";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Jobs from "./pages/Jobs";
import JobInsights from "./pages/JobInsights";
import NotFound from "./pages/NotFound";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="analysis" element={<AnalysisResultPage />} />
            <Route path="skill-gap" element={<SkillGap />} />
            <Route path="roadmap" element={<CareerRoadmap />} />
            <Route path="history" element={<History />} />
            <Route path="report" element={<Report />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/insights" element={<JobInsights />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRoutes />
    </AuthProvider>
  );
}
