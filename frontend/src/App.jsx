
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import RegisterPage from './pages/RegisterPage'
import RoutePlaceholder from './pages/RoutePlaceholder'
import ProtectedRoute from './components/ProtectedRoute'

import SuperAdminDashboard from './pages/SuperAdminDashboard'
import SuperAdminCollegesPage from './pages/SuperAdminCollegesPage'
import SuperAdminLayout from './layouts/SuperAdminLayout'
import SuperAdminCollegeDetailsPage from './pages/SuperAdminCollegeDetailsPage'
import SuperAdminSubscriptionsPage from './pages/SuperAdminSubscriptionsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsAndConditionsPage from './pages/TermsAndConditionsPage'
import HelpCenterPage from './pages/HelpCenterPage'
import SuperAdminUsersPage from './pages/SuperAdminUsersPage'
import CookieConsent from '../src/components/cookieConsent'
import SuperAdminActivityLogsPage from './pages/SuperAdminActivityLogsPage'
import SuperAdminSettingsPage from './pages/SuperAdminSettingsPage'
import CollegeAdminLayout from './layouts/CollegeAdminLayout'
import CollegeAdminDashboard from './pages/CollegeAdminDashboard'
import CollegeHostelsPage from './pages/CollegeHostelsPage'
export default function App() {
  
return (
  <BrowserRouter>
    <>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/help" element={<HelpCenterPage />} />

        {/* Public authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register-college" element={<RegisterPage />} />

        <Route
          path="/pending-approval"
          element={
            <RoutePlaceholder
              title="Awaiting approval"
              description="Your college approval workflow will be implemented after backend registration is connected."
            />
          }
        />

        {/* Protected application routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="colleges" element={<SuperAdminCollegesPage />} />
            <Route
              path="colleges/:collegeId"
              element={<SuperAdminCollegeDetailsPage />}
            />
            <Route
              path="subscriptions"
              element={<SuperAdminSubscriptionsPage />}
            />
            <Route path="users" element={<SuperAdminUsersPage />} />

            <Route
              path="activity-logs"
              element={<SuperAdminActivityLogsPage />}
            />

            <Route
              path="settings"
              element={<SuperAdminSettingsPage />}
            />
          </Route>

          <Route path="/college" element={<CollegeAdminLayout />}>
  <Route
    index
    element={<CollegeAdminDashboard />}
  />

  <Route path="hostels" element={<CollegeHostelsPage />} />
  <Route path="staff" element={<RoutePlaceholder title="Staff Management" description="Manage college wardens and staff." />} />
  <Route path="students" element={<RoutePlaceholder title="Students" description="Manage student records." />} />
  <Route path="admissions" element={<RoutePlaceholder title="Admissions" description="Review and approve admission applications." />} />
  <Route path="allocations" element={<RoutePlaceholder title="Room Allocation" description="Manage student room allocations." />} />
  <Route path="fees" element={<RoutePlaceholder title="Fees & Payments" description="Manage fees and payment records." />} />
  <Route path="attendance" element={<RoutePlaceholder title="Attendance & Leave" description="Manage attendance and leave requests." />} />
  <Route path="complaints" element={<RoutePlaceholder title="Complaints" description="Manage student complaints." />} />
  <Route path="mess" element={<RoutePlaceholder title="Mess Management" description="Manage mess operations." />} />
  <Route path="notices" element={<RoutePlaceholder title="Notices" description="Publish college notices." />} />
  <Route path="settings" element={<RoutePlaceholder title="College Settings" description="Configure college preferences." />} />
</Route>

          <Route
            path="/warden/*"
            element={
              <RoutePlaceholder
                title="Warden workspace"
                description="The Warden workspace is not implemented yet."
              />
            }
          />

          <Route
            path="/student/*"
            element={
              <RoutePlaceholder
                title="Student portal"
                description="The student portal is not implemented yet."
              />
            }
          />
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <RoutePlaceholder
              title="Page not found"
              description="The page you're looking for doesn't exist."
            />
          }
        />
      </Routes>

      <CookieConsent />
    </>
  </BrowserRouter>
)

}
