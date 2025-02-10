import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/pages/Home";
import Ticket from "./Components/features/TicketView";
import PaymentForm from "./Components/features/PaymentForm";
import AdminDashboard from "./Components/admin/Dashboard"; // Admin component
// import AdminLogin from "./Components/admin/AdminLogin"; 
// import NotFound from "./Components/pages/NotFound"; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public/User Routes */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
         
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/ticket" element={<Ticket />} />
          <Route path="/payment" element={<PaymentForm />} />
          {/* Catch-all for undefined routes */}
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;
