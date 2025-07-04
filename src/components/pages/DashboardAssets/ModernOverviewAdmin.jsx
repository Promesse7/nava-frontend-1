import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  BookOpen,
  CreditCard,
  Users,
  BarChart,
  User,
  Megaphone,
  Calendar,
  Bell,
  Link,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';
import EnhancedCard from '../../ui/EnhancedCard';
import EnhancedButton from '../../ui/EnhancedButton';

const ModernOverviewAdmin = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced mock data
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: { value: 2847, change: 15.2, trend: 'up' },
    totalRevenue: { value: 185420, change: 8.7, trend: 'up' },
    activeBookings: { value: 156, change: -3.1, trend: 'down' },
    customerRating: { value: 4.8, change: 2.1, trend: 'up' }
  });

  const monthlyData = [
    { month: 'Jan', bookings: 400, revenue: 24000 },
    { month: 'Feb', bookings: 300, revenue: 18000 },
    { month: 'Mar', bookings: 600, revenue: 36000 },
    { month: 'Apr', bookings: 800, revenue: 48000 },
    { month: 'May', bookings: 700, revenue: 42000 },
    { month: 'Jun', bookings: 900, revenue: 54000 }
  ];

  const actionButtons = [
    {
      icon: Package,
      label: 'Fleet Management',
      description: 'Manage vehicles and drivers',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      count: '127 vehicles',
      route: '/fleet'
    },
    {
      icon: BookOpen,
      label: 'Booking Management',
      description: 'View and manage bookings',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      count: '45 pending',
      route: '/bookings'
    },
    {
      icon: CreditCard,
      label: 'Payment & Reports',
      description: 'Financial overview and reports',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      count: '$12.5k today',
      route: '/payments'
    },
    {
      icon: Users,
      label: 'Customer Management',
      description: 'Manage customer relationships',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      count: '1,847 customers',
      route: '/customers'
    },
    {
      icon: BarChart,
      label: 'Analytics & Reports',
      description: 'Detailed business analytics',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      count: '15 reports',
      route: '/analytics'
    },
    {
      icon: Megaphone,
      label: 'Marketing & Promotions',
      description: 'Manage campaigns and offers',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      count: '3 active',
      route: '/promotions'
    }
  ];

  const quickStats = [
    { label: 'Routes Active', value: 24, icon: MapPin, color: 'text-green-600' },
    { label: 'Avg Trip Time', value: '2.5h', icon: Clock, color: 'text-blue-600' },
    { label: 'On-time Rate', value: '94%', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Satisfaction', value: '4.8★', icon: User, color: 'text-yellow-600' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const StatCard = ({ title, value, change, trend, prefix = '', suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className={`flex items-center space-x-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administrative Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive business overview and management hub</p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <EnhancedButton
                variant="ghost"
                size="sm"
                icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                Refresh
              </EnhancedButton>
              <EnhancedButton
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
              >
                Export Data
              </EnhancedButton>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tickets Sold"
            value={dashboardStats.totalTickets.value}
            change={dashboardStats.totalTickets.change}
            trend={dashboardStats.totalTickets.trend}
          />
          <StatCard
            title="Revenue This Month"
            value={dashboardStats.totalRevenue.value}
            change={dashboardStats.totalRevenue.change}
            trend={dashboardStats.totalRevenue.trend}
            prefix="$"
          />
          <StatCard
            title="Active Bookings"
            value={dashboardStats.activeBookings.value}
            change={dashboardStats.activeBookings.change}
            trend={dashboardStats.activeBookings.trend}
          />
          <StatCard
            title="Customer Rating"
            value={dashboardStats.customerRating.value}
            change={dashboardStats.customerRating.change}
            trend={dashboardStats.customerRating.trend}
            suffix="/5"
          />
        </div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Action Buttons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {actionButtons.map((button, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100 p-6 cursor-pointer group"
              onClick={() => console.log(`Navigate to ${button.route}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${button.color}`}>
                  <button.icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{button.label}</h3>
                <p className="text-sm text-gray-600 mb-3">{button.description}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${button.bgColor} ${button.textColor}`}>
                  {button.count}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
              <p className="text-sm text-gray-600">Bookings and revenue over time</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="bookings" fill="#1F2937" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Booking Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-soft border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Fleet Utilization</h3>
              <p className="text-sm text-gray-600">Current vehicle usage statistics</p>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-40 h-40">
                  <CircularProgressbar
                    value={78}
                    text="78%"
                    styles={buildStyles({
                      pathColor: '#1F2937',
                      textColor: '#1F2937',
                      trailColor: '#E5E7EB',
                      strokeLinecap: 'round'
                    })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">85</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">25</p>
                  <p className="text-sm text-gray-600">Maintenance</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">17</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernOverviewAdmin;