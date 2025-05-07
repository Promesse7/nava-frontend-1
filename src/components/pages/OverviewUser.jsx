import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Calendar,
  ShoppingCart,
  MessageCircle,
  Settings,
  Lock,
  Activity,
  Bell,
  MapPin,
  Ticket,
  List,
  TrendingUp,
  ChevronRight,
  Search,
  Home,
  Bus
} from 'lucide-react';
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

import Layout from '../layout/Layout';

const Dashboard = () => {
  // State for ticket booking form
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [userData, setUserData] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data
  const availableRoutes = [
    "Kigali to Butare",
    "Kigali to Gisenyi",
    "Kigali to Cyangugu",
    "Kigali to Ruhengeri"
  ];

  const stats = {
    totalRevenue: 'R24,500',
    ticketsSold: '1,200',
    activeUsers: '320',
  };

  const revenueData = [20, 45, 30, 70, 55, 40];
  
  const busCompanies = [
    { name: "Virunga Express", trips: "120+ trips", years: "7 years of service", rating: 4.8 },
    { name: "Volcano Bus", trips: "95+ trips", years: "5 years of service", rating: 4.5 }
  ];

  // Handle ticket booking submission
  const handleBooking = () => {
    alert(`Booking confirmed for ${tickets} ticket(s) to ${destination} on ${date}`);
  };
  const renderContent = () => {
    if (!userData) return <Welcome />;

    if (userData.role === "admin") {
      switch (activeTab) {
        case "dashboard": return(
          <>
 <div className="max-w-7xl mx-auto">
            {/* Dashboard greeting */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Traveler</h2>
              <p className="text-slate-300">Plan your next journey with us</p>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { title: "Total Revenue", value: stats.totalRevenue, change: "+20% this month", color: "from-green-500 to-emerald-700", icon: TrendingUp },
                { title: "Tickets Purchased", value: stats.ticketsSold, change: "-5% this month", color: "from-blue-500 to-indigo-700", icon: Ticket },
                { title: "Active Users", value: stats.activeUsers, change: "+10% this month", color: "from-purple-500 to-indigo-700", icon: User },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-slate-300 font-medium">{stat.title}</h3>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        {React.createElement(stat.icon, { className: "w-5 h-5 text-white" })}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className={`text-sm ${stat.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bus companies list */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Available Bus Companies</h2>
                </div>
                <div className="divide-y divide-slate-700">
                  {busCompanies.map((company, index) => (
                    <div key={index} className="p-6 flex items-center justify-between hover:bg-slate-700">
                      <div className="flex items-center space-x-4">
                        <div className="bg-indigo-600 p-3 rounded-lg">
                          <Bus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-slate-300">{company.trips}</p>
                            <p className="text-sm text-slate-300">{company.years}</p>
                            <div className="flex items-center text-yellow-400">
                              {"★".repeat(Math.floor(company.rating))}
                              <span className="ml-1 text-sm text-slate-300">{company.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center">
                        View Routes <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Booking form */}
              <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Book a Ticket</h2>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Destination</label>
                    <select
                      className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="">Select a route</option>
                      {availableRoutes.map((route) => (
                        <option key={route} value={route}>
                          {route}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Travel Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Number of Tickets</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      value={tickets}
                      onChange={(e) => setTickets(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleBooking}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 rounded-lg transition shadow-lg font-medium"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            
            {/* Revenue chart */}
            <div className="mt-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Revenue Trends</h2>
              </div>
              <div className="p-6">
                <div className="flex items-end h-64 space-x-4">
                  {revenueData.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 ease-in-out hover:from-indigo-500 hover:to-purple-500"
                        style={{ height: `${value * 2}px` }}
                      />
                      <div className="text-xs text-slate-400 mt-2">Week {index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </>
        );
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

  return (
    <Layout>
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-880 to-slate-900 text-white h-[80vh]">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Travel Rwanda</h1>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-700 rounded-lg px-3 py-2 flex-1 max-w-md mx-6">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search destinations, routes, or tickets..." 
              className="bg-transparent border-none focus:outline-none text-white w-full px-3"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" /> Talk to me
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-all shadow-md">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-4">
          <nav className="space-y-1 mt-6">
            {[
              { icon: Home, label: 'Dashboard', id: 'dashboard' },
              { icon: User, label: 'Profile', id: 'profile' },
              { icon: Calendar, label: 'My Bookings', id: 'my-bookings' },
              { icon: CreditCard, label: 'Payments', id: 'payments' },
              { icon: Ticket, label: 'Rewards', id: 'rewards' },
              { icon: MessageCircle, label: 'Support', id: 'support' },
              { icon: Settings, label: 'Settings', id: 'settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {React.createElement(item.icon, { className: "w-5 h-5" })}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        
        {/* Main dashboard content */}
        <main className="flex-1 overflow-hidden p-2">
         {renderContent()}
        </main>
      </div>
      
      {/* Mobile bottom navigation */}
      {/* <nav className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-3">
        <div className="flex justify-around">
          {[
            { icon: Home, label: 'Home' },
            { icon: Calendar, label: 'Bookings' },
            { icon: Bus, label: 'Trips' },
            { icon: CreditCard, label: 'Payments' },
            { icon: User, label: 'Profile' }
          ].map((item, index) => (
            <button key={index} className="flex flex-col items-center text-slate-400 hover:text-indigo-400">
              {React.createElement(item.icon, { className: "w-6 h-6" })}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav> */}
    </div>
    </Layout>
  );
};

export default Dashboard;