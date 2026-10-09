import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

// App Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Assistant from './pages/Assistant/Assistant';
import Services from './pages/Services/Services';
import ServiceDetails from './pages/Services/ServiceDetails';
import RequestForm from './pages/Services/RequestForm';
import Processing from './pages/Services/Processing';
import SuccessPage from './pages/Services/SuccessPage';
import Activity from './pages/History/Activity';
import RequestDetails from './pages/History/RequestDetails';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Profile/Settings';
import Notifications from './pages/Profile/Notifications';
import Help from './pages/Profile/Help';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Authenticated Routes with Layout */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/assistant" element={<Assistant />} />
          
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetails />} />
          <Route path="/services/:serviceId/request" element={<RequestForm />} />
          <Route path="/services/:serviceId/processing" element={<Processing />} />
          <Route path="/services/:serviceId/success" element={<SuccessPage />} />
          
          <Route path="/activity" element={<Activity />} />
          <Route path="/activity/:id" element={<RequestDetails />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
