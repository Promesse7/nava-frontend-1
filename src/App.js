import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/features/ProtectedRoute';
import { UserDashboard, AdminDashboard } from './Components/pages/DashboardOld';
import AuthForm from './Components/auth/Authentication';
import HomePage from './Components/pages/LandingPage';
import { AuthProvider } from './Components/auth/AuthContext';
import UserProfile from './Components/auth/ProfilePage';
import Dashboard from './Components/pages/Dashboard';
import BusSchedule from './Components/features/BusSchedule';
import BusList from './Components/search/BusList';
import FleetManagement from './Components/search/FleetManagement';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm />} />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard />
            } 
          />

         <Route 
            path="/profile" 
            element={
             
                <UserProfile />
            } 
          />
           
        
           
        <Route 
            path="/bus-entry" 
            element={
              <ProtectedRoute requiredRole="admin">
                <FleetManagement />
              </ProtectedRoute>
            } 
          />
        <Route 
            path="/bus-list" 
            element={
              <ProtectedRoute requiredRole="admin">
                <BusList />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;