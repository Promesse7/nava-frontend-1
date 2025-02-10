import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/pages/Home";
import AdminDashboard from "./Components/admin/AdminDashboard"; // Admin component
import AdminLogin from "./Components/admin/AdminLogin"; // Admin login page
import NotFound from "./Components/pages/NotFound"; // 404 page (optional)

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public/User Routes */}
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
