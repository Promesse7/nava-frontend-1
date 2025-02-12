// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { LogoutButton } from '../components/LogoutButton';
import {
  User, Ticket, Clock, Settings, Bell, Search,
  CreditCard, Calendar, Map, ChevronRight, Filter, Users,
  BarChart, AlertTriangle, CheckCircle, TrendingUp, Bus,
  Download, Printer
} from 'lucide-react';

export const MainLayout = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  const userMenu = [
    { icon: <User size={20} />, label: 'My Profile', path: '/profile' },
    { icon: <Ticket size={20} />, label: 'My Bookings', path: '/bookings' },
    { icon: <Clock size={20} />, label: 'Travel History', path: '/history' },
    { icon: <CreditCard size={20} />, label: 'Payment Methods', path: '/payments' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' }
  ];

  const adminMenu = [
    { icon: <BarChart size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Bus size={20} />, label: 'Manage Routes', path: '/admin/routes' },
    { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
    { icon: <Ticket size={20} />, label: 'Bookings', path: '/admin/bookings' },
    { icon: <TrendingUp size={20} />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' }
  ];

  const menuItems = userType === 'admin' ? adminMenu : userMenu;

  return (
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
            <a
              key={index}
              href={item.path}
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              {item.icon}
              <span className={!isSidebarOpen ? 'hidden' : ''}>{item.label}</span>
            </a>
          ))}
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
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
                  src={user?.photoURL || "/api/placeholder/32/32"}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user?.email}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};