import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import Loader from "../common/LoadingSpinner";
import { auth, db } from "../../firebase"; // Ensure this is correctly imported
import { getDoc } from "firebase/firestore";
import { getIdTokenResult, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

//Displaying Admin dashboards
import FleetManagement from "../search/FleetManagement";
import DashboardHome from "./DashboardAssets/DashboardHome";
import Welcome from "./DashboardAssets/Welcome";
import BookingManagement from "../admin/BookingManagement";
import Payment from "./DashboardAssets/PaymentDashboard";
import CustomerManagement from "./DashboardAssets/CustomerDashboard";
import DriverManagement from "./DashboardAssets/DriverManagament";
import ReportsLogsDashboard from "./DashboardAssets/ReportsLogs";
import DashboardOld from "./DashboardOld"
import OverviewAdmin from "./OverviewAdmin";
import OverviewUser from "./OverviewUser"

// Displaying Common user dashboards
import Overview from "./DashboardAssets/Overview";
import MyBookings from "./DashboardAssets/MyBookings";
import PaymentMethods from "./DashboardAssets/PaymentTransctions";
// import Messages from './DashboardAssets/Messages';
import RoutesPricing from "./DashboardAssets/RoutesPricing";
import BookRide from "./DashboardAssets/BookRide";
import SupportHelpCenter from "./DashboardAssets/SupportHelpCenter";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    totalBookings: null,
    revenue: null,
    activeBookings: null,
    cancelledBookings: null,
    peakBookingHours: null,
    userActivity: null,
    availableCars: null,
    bookedCars: null,
    maintenanceAlerts: null,
    paymentStatus: null,
    customerFeedback: null,
    recentTransactions: null,
  });
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState("welcome");
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  

  // Check if screen is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get current logged-in user
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid); // Reference to user document
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "dashboard"));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        const updatedData = { ...formData };
        Object.keys(updatedData).forEach((key) => {
          updatedData[key] = data[key] || null;
        });
        setDashboardData(updatedData);
        setShowForm(Object.values(updatedData).some((value) => value === null));
      } else {
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch admin data

    const fetchAdminData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users")); // Assuming users collection holds the admin's data
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "admin") {
            setAdminData(data);
          }
        });
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "dashboard", "dashboardData"), formData);
      setDashboardData(formData);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating dashboard data:", error);
    }
  };

  const handleFetchData = () => {
    fetchDashboardData(); // Trigger the function to load the data
  };


  const adminTabs = [
    {
      id: "driver",
      label: "Driver Management",
      icon: "M5 16v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M12 10a4 4 0 1 0-8 0 4 4 0 0 0 8 0M20 21h-4M8 21H4M12 18h0",
    },
    {
      id: "fleet",
      label: "Fleet Management",
      icon: "M3 13h18M5 13V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M5 17h2m10 0h2M3 13h2m14 0h2M6 17a1 1 0 1 1 2 0m8 0a1 1 0 1 1-2 0",
    },
    {
      id: "payment",
      label: "Payment & Transactions",
      icon: "M3 10h18M5 6h14M5 14h14M8 18h8M12 14v4",
    },
    {
      id: "bookedCar",
      label: "Bookings Management",
      icon: "M3 10h18M5 6h14M5 14h14M8 18h8M12 14v4",
    },
    {
      id: "customer",
      label: "Customer Management",
      icon: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0M20 8v6M23 11h-6",
    },
    {
      id: "report",
      label: "Reports & Logs",
      icon: "M7 8h10M7 12h10M7 16h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
    },
    {
      id: "message",
      label: "Messages",
      icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
    },
  ];

  const userTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "M3 3h18M3 9h18M3 15h18M3 21h18",
    },
    {
      id: "my-bookings",
      label: "My Bookings",
      icon: "M5 6h14M5 12h14M5 18h14",
    },
    {
      id: "book-ride",
      label: "Book a Ride",
      icon: "M5 16v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M3 12h2m14 0h2M8 7h.01M16 7h.01M12 2a5 5 0 0 1 5 5c0 1.38-.56 2.63-1.46 3.54A3 3 0 0 1 12 14a3 3 0 0 1-3.54-3.46A5 5 0 0 1 12 2z",
    },
    {
      id: "support",
      label: "Support Help Center",
      icon: "M5 10h18M5 6h14M5 14h14M8 18h8M12 14v4",
    },
    {
      id: "payment-methods",
      label: "Payment Methods",
      icon: "M3 10h18M5 6h14M5 14h14M8 18h8M12 14v4",
    },
    {
      id: "voice-chat",
      label: "Talk to Me",
      icon: "M4 6h16M4 18h16M12 6v12M9 9h3m3 0h3m-9 6h6",
    },
  ];

  const renderContent = () => {
    // Admin user role will have access to more tabs, render specific components
    if (userData.role === "admin") {
      switch (activeTab) {
        case "welcome":
          return <Welcome />;
        case "dashboard":
          return <DashboardHome />;
        case "fleet":
          return <FleetManagement />;
        case "driver":
          return <DriverManagement />;
        case "bookedCar":
          return <BookingManagement />;
        case "payment":
          return <Payment />;
        case "customer":
          return <OverviewAdmin />;
        case "report":
          return <DashboardOld />;

        default:
          return <OverviewAdmin />;
      }
    }
    // Regular user role will have access to limited tabs
    else if (userData.role === "common user") {
      switch (activeTab) {
        case "overview":
          return <OverviewUser />;
        case "my-bookings":
          return <MyBookings />;
        case "support":
          return <SupportHelpCenter />;
        case "payment-methods":
          return <PaymentMethods />;
        case "voice-chat":
          return <DashboardOld />;
        case "book-ride":
          return <BookRide />;
        default:
          return <Welcome />;
      }
    }
    return null; // No content until user role is determined
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full h-screen bg-gray-100 flex overflow-hidden"   >
      {/* Mobile menu toggle button - only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-20 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
      
      {/* Sidebar - with overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 
                    ${sidebarOpen && isMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => isMobile && setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-10 transition-all duration-300 ease-in-out flex-shrink-0
                  h-full bg-white shadow-md overflow-y-auto overflow-x-hidden
                  ${sidebarOpen ? 'left-0' : '-left-full md:left-0'} 
                  ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}`}
      >
        {/* Collapse/Expand Button - only visible on desktop */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 z-10 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}

        {/* Profile Section */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-200 p-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="mt-2 text-center">
                <h3 className="text-gray-800 font-medium">{userData.name}</h3>
                <p className="text-gray-500 text-sm capitalize">{userData.role}</p>

                <div className="mt-6 flex justify-around cursor-pointer">
                  <div
                    className="flex flex-col items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 mt-1">Profile</span>
                  </div>

                  <div className="flex flex-col items-center cursor-pointer">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 mt-1" onClick={handleFetchData}>
                      Gallery
                    </span>
                  </div>

                  <div className="flex flex-col items-center cursor-pointer">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="text-xs text-gray-600 mt-1">Notifications</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          <div
            className={`px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition 
                      ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="w-6 h-6 flex items-center justify-center bg-gray-700 text-white rounded-md">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-gray-700" onClick={() => setActiveTab("overview")}>Dashboard</span>
            )}
          </div>

          {/* Admin menu items */}
          {userData.role === "admin" && adminTabs.map((tab) => (
            <div
              key={tab.id}
              className={`px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition 
                          ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <div className="w-6 h-6 flex items-center justify-center bg-gray-700 text-white rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
              </div>
              {(!isCollapsed || isMobile) && <span>{tab.label}</span>}
            </div>
          ))}

          {/* User menu items */}
          {userData.role === "common user" && userTabs.map((tab) => (
            <div
              key={tab.id}
              className={`px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition 
                          ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <div className="w-6 h-6 flex items-center justify-center bg-gray-700 text-white rounded-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={tab.icon}
                  />
                </svg>
              </div>
              {(!isCollapsed || isMobile) && <span>{tab.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Display Pane */}
      <div className="flex-1 p-5 md:p-6 bg-gray-100 md:ml-0 mt-14 md:mt-0">
        {renderContent()}
      </div>
    </div>

  );
};

export default Dashboard;
