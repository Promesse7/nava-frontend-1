import React from 'react';
import { useEffect, useState } from "react";
import {
  User, Ticket, Clock, Settings, LogOut, Bell, Search,
  CreditCard, Calendar, Map, ChevronRight, Filter, Users,
  BarChart, AlertTriangle, CheckCircle, TrendingUp, Bus,
  Download, Printer
} from 'lucide-react';
import Loader from '../common/LoadingSpinner'
import {Link, useNavigate} from 'react-router-dom';


// initializing Firebase
import { auth, db } from "../../firebase"; // Ensure this is correctly imported
import { doc, getDoc } from "firebase/firestore";
import { getIdTokenResult, onAuthStateChanged, signOut } from "firebase/auth";


// Common Dashboard Layout Component
const DashboardLayout = ({ children, userType }) => {
   const [loading, setLoading] = useState(true);
   useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
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

  // Fetch user data from Firebase Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userRef = doc(db, "users", userId); // Assuming users are stored in "users" collection
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data()); // Store user data in state
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };


  const userMenu = [
    { icon: <User size={20} />, label: 'My Profile', path:'/profile' },
    { icon: <Ticket size={20} />, label: 'My Bookings' },
    { icon: <Clock size={20} />, label: 'Travel History' },
    { icon: <CreditCard size={20} />, label: 'Payment Methods' },
    { icon: <Settings size={20} />, label: 'Settings' },
    {icon: <LogOut size={20} />, label:'Log Out', onClick: handleLogout }

  ];

  const adminMenu = [
    { icon: <BarChart size={20} />, label: 'Dashboard' },
    { icon: <Bus size={20} />, label: 'Manage Routes' },
    { icon: <Users size={20} />, label: 'Customers' },
    { icon: <Ticket size={20} />, label: 'Bookings' },
    { icon: <TrendingUp size={20} />, label: 'Analytics' },
    { icon: <Settings size={20} />, label: 'Settings' },
    {icon: <LogOut size={20} />, label:'Log Out', onClick: handleLogout }
  ];

  const menuItems = userType === 'admin' ? adminMenu : userMenu;

  return (
     <div className=" ">
            {loading ? (
            <Loader />
          ) : (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-black text-white transition-all duration-300`}>
        <div className="p-4">
          <h2 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>
            {userType === 'admin' ? 'Admin Panel' : 'MyBusTickets'}
          </h2>
        </div>
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer"
            >
              {item.icon}
              {/* Use Link if there is a path, otherwise call onClick */}
              {item.path ? (
                <Link to={item.path} className={!isSidebarOpen ? "hidden" : ""}>
                  {item.label}
                </Link>
              ) : (
                <button onClick={item.onClick} className={!isSidebarOpen ? "hidden" : ""}>
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  // src={userData.avatar}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{userData.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>

)}
   </div>
  );
};

// User Dashboard Component
const UserDashboard = () => {
  const upcomingTrips = [
    {
      id: 1,
      from: 'New York',
      to: 'Boston',
      date: '2025-02-15',
      time: '09:00 AM',
      status: 'Confirmed',
      ticketNo: 'TK123456'
    },
    // Add more trips
  ];

  const recentBookings = [
    {
      id: 1,
      destination: 'Washington DC',
      date: '2025-02-10',
      amount: 75.00,
      status: 'Completed'
    },
    // Add more bookings
  ];

  return (
    <DashboardLayout userType= "common user">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button className="bg-blue-500 text-white p-6 rounded-xl hover:bg-blue-600 transition-colors">
          <Calendar size={24} className="mb-2" />
          <span className="block font-medium">Book Ticket</span>
        </button>
        <button className="bg-green-500 text-white p-6 rounded-xl hover:bg-green-600 transition-colors">
          <Map size={24} className="mb-2" />
          <span className="block font-medium">Track Bus</span>
        </button>
        <button className="bg-purple-500 text-white p-6 rounded-xl hover:bg-purple-600 transition-colors">
          <CreditCard size={24} className="mb-2" />
          <span className="block font-medium">Add Payment</span>
        </button>
        <button className="bg-orange-500 text-white p-6 rounded-xl hover:bg-orange-600 transition-colors">
          <Clock size={24} className="mb-2" />
          <span className="block font-medium">Travel History</span>
        </button>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Upcoming Trips</h2>
        <div className="space-y-4">
          {upcomingTrips.map((trip) => (
            <div key={trip.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{trip.from} → {trip.to}</div>
                  <div className="text-sm text-gray-500">
                    {trip.date} • {trip.time}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {trip.status}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Printer size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Download size={20} />
                    </button>
                  </div>
                </div> 
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Destination</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-3">{booking.destination}</td>
                <td>{booking.date}</td>
                <td>${booking.amount}</td>
                <td>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button className="text-blue-500 hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const statistics = [
    { label: 'Total Bookings', value: '1,234', trend: '+12%', icon: <Ticket size={24} /> },
    { label: 'Active Users', value: '856', trend: '+8%', icon: <Users size={24} /> },
    { label: 'Revenue', value: '$12,345', trend: '+15%', icon: <TrendingUp size={24} /> },
    { label: 'Bus Routes', value: '45', trend: '+5%', icon: <Bus size={24} /> }
  ];

  const recentBookings = [
    {
      id: 1,
      customer: 'Jane Smith',
      route: 'NY to Boston',
      date: '2025-02-11',
      amount: 45.00,
      status: 'Confirmed'
    },
    // Add more bookings
  ];

  return (
    <DashboardLayout userType="admin">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : index === 2 ? 'bg-purple-100' : 'bg-orange-100'}`}>
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500 mr-2">{stat.trend}</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <span>Add New Route</span>
              <ChevronRight size={20} />
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <span>Manage Schedules</span>
              <ChevronRight size={20} />
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between">
              <span>View Reports</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2">
              <span>Booking System</span>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-2">
              <span>Payment Gateway</span>
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-2">
              <span>GPS Tracking</span>
              <AlertTriangle className="text-yellow-500" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            <div className="p-2 text-sm">
              <p className="font-medium">System Update Scheduled</p>
              <p className="text-gray-500">Maintenance at 2:00 AM EST</p>
            </div>
            <div className="p-2 text-sm">
              <p className="font-medium">New Route Added</p>
              <p className="text-gray-500">NY to Philadelphia route is now active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Bookings</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} />
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download size={20} />
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-3">Customer</th>
              <th className="pb-3">Route</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-3">{booking.customer}</td>
                <td>{booking.route}</td>
                <td>{booking.date}</td>
                <td>${booking.amount}</td>
                <td>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button className="text-blue-500 hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export { UserDashboard, AdminDashboard };
