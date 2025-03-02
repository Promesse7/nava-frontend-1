import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import Loader from '../common/LoadingSpinner';
import DashboardHome from './DashboardAssets/DashboardHome';
import Welcome from './DashboardAssets/Welcome';
import Settings from './DashboardAssets/Settings';
import { auth, db } from "../../firebase"; // Ensure this is correctly imported
import { getDoc } from "firebase/firestore";
import { getIdTokenResult, signOut } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User, Ticket, Clock, LogOut,   CreditCard
} from 'lucide-react';

//displaying dashboards
import FleetManagement from '../search/FleetManagement';


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

    useEffect(() => {
      const fetchUserRoles = async (user) => {
        if (user) {
          try {
            const tokenResult = await getIdTokenResult(user);
            setUserRoles(tokenResult.claims.role || []);
          } catch (error) {
            console.error("Error fetching user roles:", error);
          }
        }
      };
  
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        fetchUserRoles(user);
      });
  
      return () => unsubscribe();
    }, []);
  
     // Fetch user data from Firestore
     useEffect(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser; // Get current logged-in user
        if (!user) return;
  
        const userDocRef = doc(db, 'users', user.uid); // Reference to user document
        try {
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        setLoading(false);
      };
  
      fetchUserData();
    }, []);
  

  
    const fetchDashboardData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'dashboard'));
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const updatedData = { ...formData };
            Object.keys(updatedData).forEach((key) => {
              updatedData[key] = data[key] || null;
            });
            setDashboardData(updatedData);
            setShowForm(Object.values(updatedData).some(value => value === null));
          } else {
            setShowForm(true);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
      };

    
    useEffect(() => {
        // Fetch admin data

      const fetchAdminData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));  // Assuming users collection holds the admin's data
          querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.role === 'admin') {
              setAdminData(data);
            }
          });
        } catch (error) {
          console.error('Error fetching admin data:', error);
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
        await setDoc(doc(db, 'dashboard', 'dashboardData'), formData);
        setDashboardData(formData);
        setShowForm(false);
      } catch (error) {
        console.error('Error updating dashboard data:', error);
      }
    };

    const handleFetchData = () => {
        fetchDashboardData(); // Trigger the function to load the data
      };

          // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

      const adminTabs = [
        { id: "driver", label: "Driver Management", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        { id: "fleet", label: "Fleet Management", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
        { id: "payment", label: "Payment & Transactions", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
        { id: "customer", label: "Customer Management", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
        { id: "report", label: "Reports & Logs", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
        { id: "message", label: "Messages", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
      ];

      const userTabs = [
        { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", label: 'My Profile', path:'/profile' },
        { icon: <Ticket size={20} className="text-black" />, label: 'My Bookings' },
        { icon: <Clock size={20} className="text-black" />, label: 'Travel History' },
        { icon: <CreditCard size={20} className="text-black" />, label: 'Payment Methods' },
        { icon: <Settings size={20} className="text-black" />, label: 'Settings' }
    
      ];
  
      const renderContent = () => {
        switch (activeTab) {
          case "welcome":
            return <Welcome />;
          case "dashboard":
            return <DashboardHome />;
          case "fleet":
            return <FleetManagement />;
          case "settings":
            return <Settings />;
          default:
            return <Welcome />;
        }
      };
      
  
    if (loading) return <Loader />;

  return (
    <div className="w-full h-screen bg-gray-100 flex">



      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-full">
        {/* Profile Section */}
        <div className="bg-gradient-to-r from-gray-300 to-gray-200 p-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-gray-800 font-medium">{userData.name}</h3>
              <p className="text-gray-500 text-sm">{userData.role}</p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-around">
            <div className="flex flex-col items-center " onClick={() => navigate('/profile')}>
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-gray-600 mt-1">Profile</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-600 mt-1" onClick={handleFetchData}>Gallery</span>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-xs text-gray-600 mt-1">Notifications</span>
            </div>
          </div>
        </div>
        
        {/* Project Selection */}
        <div className="px-4 py-4">
          <div className="bg-gray-200 rounded-md p-3 flex items-center justify-between">
            <span className="text-gray-700">Select Car</span>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Menu Items */}
        <nav className="mt-4 snap-y">
          <div className="px-4 py-3 flex items-center space-x-3 text-gray-700 font-medium">
            <span>Home</span>
          </div>
          
          <div className="px-4 py-3 flex items-center space-x-3 bg-gray-100 border-r-4 border-gray-800 text-gray-800 font-medium" onClick={() => setActiveTab("dashboard")} title='Dashboard'>
            <div className="w-6 h-6 rounded-md bg-gray-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <span>Dashboard</span>
            <div className="w-2 h-2 rounded-full bg-gray-800 ml-auto"></div>
          </div>
 
    {/* Admin menu items */}
   
    {userData.role === "admin" && (
  <>
    {adminTabs.map((tab) => (
      <div 
        key={tab.id} 
        className="px-4 py-3 flex items-center space-x-3 text-gray-500 cursor-pointer hover:bg-gray-100 transition"
        onClick={() => setActiveTab(tab.id)}
        title={tab.label}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
        </div>
        <span>{tab.label}</span>
      </div>
    ))}
  </>
)}
    
    {userData.role === "common user" && (
  <>
    {userTabs.map((tab) => (
      <div 
        key={tab.id} 
        className="px-4 py-3 flex items-center space-x-3 text-black cursor-pointer hover:bg-gray transition"
        onClick={() => setActiveTab(tab.id)}
        title={tab.label}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
        </div>
        <span>{tab.label}</span>
      </div>
    ))}
  </>
)}
          



{/*Common menu  items*/}
          <div className="px-4 py-3 flex items-center space-x-3 text-gray-500">
            <div className="w-6 h-6 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span>Light Mode</span>
            <div className="ml-auto w-8 h-4 bg-gray-800 rounded-full flex items-center relative">
              <div className="absolute right-0 w-4 h-4 bg-white rounded-full shadow"></div>
            </div>
          </div>
          
        
          
          <div className="px-4 py-3 flex items-center space-x-3 text-gray-500">
            <div className="w-6 h-6 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span>Settings</span>
          </div>
        </nav>
      </div>



     {/* Main Display Pane */}
     <div className="flex-1 p-5 bg-gray-100">
        {renderContent()}
      </div>
      
    </div>
  );
};

export default Dashboard;