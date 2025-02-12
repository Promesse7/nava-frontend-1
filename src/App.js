import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/features/ProtectedRoute';
import { UserDashboard, AdminDashboard } from './Components/pages/Dashboard';
import AuthForm from './Components/auth/Authentication';
import { AuthProvider } from './Components/auth/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthForm />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="common user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;