import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/pages/Home";
import Ticket from "./Components/features/TicketView";
import PaymentForm from "./Components/features/PaymentForm";
import AdminDashboard from "./Components/admin/Dashboard"; 
import Login from "./Components/auth/LoginForm";
import Register from "./Components/auth/RegisterForm";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("auth"); // Replace with real auth logic
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path="/ticket" element={<ProtectedRoute element={<Ticket />} />} />
          <Route path="/payment" element={<ProtectedRoute element={<PaymentForm />} />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
