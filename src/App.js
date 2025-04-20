import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/features/ProtectedRoute';
import AuthForm from './components/auth/Authentication';
import HomePage from './components/pages/LandingPage';
import { AuthProvider } from './components/auth/AuthContext';
import UserProfile from './components/auth/ProfilePage';
import Dashboard from './components/pages/Dashboard';
import BusList from './components/search/BusList';
import FleetManagement from './components/search/FleetManagement';
import TripTracker from './components/pages/DashboardAssets/TripTracker';
import TourGuide from './components/pages/TourGuide';
import AccessibleTicketBooking from './components/pages/Voice_booking';
import Layout from './components/layout/Layout';

// Add the Layout component as a wrapper for pages that should have the curved navigation
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes without curved navigation */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm />} />
          
          {/* Main dashboard with curved navigation */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          
          {/* Routes with Layout wrapper for curved navigation */}
          <Route
            path="/disabled"
            element={
              <Layout>
                <AccessibleTicketBooking />
              </Layout>
            }
          />
          
          <Route
            path="/profile"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
          
          <Route
            path="/trip"
            element={
              <Layout>
                <TripTracker />
              </Layout>
            }
          />
          
          {/* Routes for admins with curved navigation */}
          <Route
            path="/bus-entry"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout isAdmin={true}>
                  <FleetManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/bus-list"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout isAdmin={true}>
                  <BusList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Additional routes to match the curved navigation items */}
          <Route
            path="/overview"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          
          <Route
            path="/my-bookings"
            element={
              <Layout>
                <TripTracker />
              </Layout>
            }
          />
          
          <Route
            path="/book-ride"
            element={
              <Layout>
                <AccessibleTicketBooking />
              </Layout>
            }
          />
          
          <Route
            path="/payment-methods"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          
          <Route
            path="/fleet"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout isAdmin={true}>
                  <FleetManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/bookings"
            element={
              <Layout isAdmin={true}>
                <TripTracker />
              </Layout>
            }
          />
          
          <Route
            path="/user-profile"
            element={
              <Layout>
                <UserProfile />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;