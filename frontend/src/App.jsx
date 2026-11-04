
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
              element={
                <RoutePlaceholder
                  title="Activity logs"
                  description="Platform activity auditing will be implemented here."
                />
              }
            />

            <Route
              path="settings"
              element={
                <RoutePlaceholder
                  title="Settings"
                  description="Super Admin platform settings will be implemented here."
                />
              }
            />
          </Route>

          <Route
            path="/college/*"
            element={
              <RoutePlaceholder
                title="College workspace"
                description="The college workspace is not implemented yet."
              />
            }
          />

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
