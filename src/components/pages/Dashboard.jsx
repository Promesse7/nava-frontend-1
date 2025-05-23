import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Loader from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Home, Users, Car, Calendar, CreditCard, HelpCircle, Mic, User, Settings, LogOut } from 'lucide-react';

// Admin dashboard components
import FleetManagement from "../search/FleetManagement";
import DashboardHome from "./DashboardAssets/DashboardHome";
import Welcome from "./DashboardAssets/Welcome";
import BookingManagement from "../admin/BookingManagement";
import Payment from "./DashboardAssets/PaymentDashboard";
import DriverManagement from "./DashboardAssets/DriverManagament";
import DashboardOld from "./Voice_booking";
import OverviewAdmin from "./OverviewAdmin";
import OverviewUser from "./OverviewUser";

// User dashboard components
import MyBookings from "./DashboardAssets/MyBookings";
import PaymentMethods from "./DashboardAssets/PaymentTransctions";
import BookRide from "./DashboardAssets/BookRide";
import SupportHelpCenter from "./DashboardAssets/SupportHelpCenter";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("welcome");
  const navigate = useNavigate();

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [isCompactView, setIsCompactView] = useState(false);

  // Check if screen is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          // Set default active tab based on user role
          setActiveTab(userSnap.data().role === "admin" ? "dashboard" : "overview");
        } else {
          console.log("No user data found");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  // Tab definitions with Lucide icons
  const adminTabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "driver", label: "Drivers", icon: <Users size={20} /> },
    { id: "fleet", label: "Fleet", icon: <Car size={20} /> },
    { id: "bookedCar", label: "Bookings", icon: <Calendar size={20} /> },
    { id: "payment", label: "Payments", icon: <CreditCard size={20} /> },
    { id: "customer", label: "Customers", icon: <Users size={20} /> },
    { id: "report", label: "Voice", icon: <Mic size={20} /> },
  ];

  const userTabs = [
    { id: "overview", label: "Home", icon: <Home size={20} /> },
    { id: "my-bookings", label: "Bookings", icon: <Calendar size={20} /> },
    { id: "book-ride", label: "Book", icon: <Car size={20} /> },
    { id: "payment-methods", label: "Payments", icon: <CreditCard size={20} /> },
    { id: "support", label: "Support", icon: <HelpCircle size={20} /> },
    { id: "voice-chat", label: "Voice", icon: <Mic size={20} /> },
  ];

  const renderContent = () => {
    if (!userData) return <Welcome />;

    if (userData.role === "admin") {
      switch (activeTab) {
        case "dashboard": return <DashboardHome />;
        case "fleet": return <FleetManagement />;
        case "driver": return <DriverManagement />;
        case "bookedCar": return <BookingManagement />;
        case "payment": return <Payment />;
        case "customer": return <OverviewAdmin />;
        case "report": return <DashboardOld />;
        default: return <Welcome />;
      }
    } else {
      switch (activeTab) {
        case "overview": return <OverviewUser />;
        case "my-bookings": return <MyBookings />;
        case "book-ride": return <BookRide />;
        case "payment-methods": return <PaymentMethods />;
        case "support": return <SupportHelpCenter />;
        case "voice-chat": return <DashboardOld />;
        default: return <Welcome />;
      }
    }
  };

  if (loading || !userData) return <Loader />;

  const tabs = userData.role === "admin" ? adminTabs : userTabs;
  const activeTabName = tabs.find(tab => tab.id === activeTab)?.label || "Dashboard";

  return (
    <div className="h-screen rounded-lg bg-gray-900 flex flex-col overflow-hidden text-white">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Content */}
        <main className="flex-1 overflow-y-hidden">
          <div className="p-2 md:p-4 ">
            <div className="bg-gray-800 rounded-lg shadow-sm p-2 md:p-4 min-h-[calc(100vh-6rem)] text-white">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
      
    
    </div>
  );
};

export default Dashboard;
