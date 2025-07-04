import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Loader from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Users, 
  Car, 
  Calendar, 
  CreditCard, 
  HelpCircle, 
  Mic, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Activity
} from 'lucide-react';

// Admin dashboard components
import FleetManagement from "../search/FleetManagement";
import DashboardHome from "./DashboardAssets/DashboardHome";
import ModernDashboardHome from "./DashboardAssets/ModernDashboardHome";
import Welcome from "./DashboardAssets/Welcome";
import BookingManagement from "../admin/BookingManagement";
import Payment from "./DashboardAssets/PaymentDashboard";
import DriverManagement from "./DashboardAssets/DriverManagament";
import DashboardOld from "./Voice_booking";
import OverviewAdmin from "./OverviewAdmin";
import ModernOverviewAdmin from "./DashboardAssets/ModernOverviewAdmin";
import OverviewUser from "./OverviewUser";
import ModernOverviewUser from "./DashboardAssets/ModernOverviewUser";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New booking request", time: "5 min ago", read: false },
    { id: 2, message: "Payment confirmed", time: "1 hour ago", read: false },
    { id: 3, message: "Fleet maintenance due", time: "2 hours ago", read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Check if screen is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
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
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={20} /> },
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
        case "dashboard": return <ModernDashboardHome />;
        case "fleet": return <FleetManagement />;
        case "driver": return <DriverManagement />;
        case "bookedCar": return <BookingManagement />;
        case "payment": return <Payment />;
        case "customer": return <ModernOverviewAdmin />;
        case "report": return <DashboardOld />;
        default: return <Welcome />;
      }
    } else {
      switch (activeTab) {
        case "overview": return <ModernOverviewUser />;
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
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="ml-4 font-bold text-xl text-gray-900 dark:text-white">
              NAVA <span className="text-indigo-600">Transit</span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-100 dark:bg-gray-700 border-0 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none relative"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            !notification.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                              !notification.read ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`} />
                            <div className="ml-3">
                              <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User menu */}
            <div className="flex items-center">
              <div className="hidden md:block mr-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{userData.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{userData.role === 'admin' ? 'Administrator' : 'Customer'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? '100%' : '16rem', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
                isMobile ? 'fixed inset-0 z-20' : 'relative'
              }`}
            >
              {isMobile && (
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <div className="p-4">
                <div className="mt-8 space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className={`mr-3 ${
                        activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.span
                          layoutId="activeTabIndicator"
                          className="ml-auto"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <ChevronRight size={16} className="text-indigo-600 dark:text-indigo-400" />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Bottom section with logout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    auth.signOut();
                    navigate('/login');
                  }}
                  className="w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <LogOut size={20} className="mr-3 text-gray-500 dark:text-gray-400" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Home size={16} className="mr-1" />
              <span className="mx-1">/</span>
              <span className="font-medium text-gray-900 dark:text-white">{activeTabName}</span>
            </div>
            
            {/* Page content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
