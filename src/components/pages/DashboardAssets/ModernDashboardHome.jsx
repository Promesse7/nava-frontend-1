import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  Car,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { db } from '../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import EnhancedCard from '../../ui/EnhancedCard';

const ModernDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalRevenue: { value: 245680, change: 12.5, trend: 'up' },
      totalBookings: { value: 1847, change: -3.2, trend: 'down' },
      activeVehicles: { value: 127, change: 5.8, trend: 'up' },
      customerSatisfaction: { value: 4.7, change: 2.1, trend: 'up' }
    },
    revenueData: [],
    bookingData: [],
    vehicleStatus: [],
    recentActivities: []
  });

  // Generate mock data for visualization
  useEffect(() => {
    const generateMockData = () => {
      // Revenue data for the last 30 days
      const revenueData = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        revenue: Math.floor(Math.random() * 5000) + 3000,
        bookings: Math.floor(Math.random() * 50) + 20,
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString()
      }));

      // Booking status distribution
      const bookingData = [
        { name: 'Confirmed', value: 65, color: '#10B981' },
        { name: 'Pending', value: 20, color: '#F59E0B' },
        { name: 'Cancelled', value: 10, color: '#EF4444' },
        { name: 'Completed', value: 5, color: '#6366F1' }
      ];

      // Vehicle status
      const vehicleStatus = [
        { status: 'Active', count: 85, percentage: 67 },
        { status: 'Maintenance', count: 25, percentage: 20 },
        { status: 'Available', count: 17, percentage: 13 }
      ];

      // Recent activities
      const recentActivities = [
        {
          id: 1,
          type: 'booking',
          title: 'New booking confirmed',
          description: 'Route: Kigali → Butare | Customer: John Doe',
          time: '5 minutes ago',
          status: 'success'
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment received',
          description: 'Amount: $45.00 | Booking #KGL-2024-0087',
          time: '12 minutes ago',
          status: 'success'
        },
        {
          id: 3,
          type: 'maintenance',
          title: 'Vehicle maintenance scheduled',
          description: 'Vehicle ID: VH-001 | Date: Tomorrow 9:00 AM',
          time: '1 hour ago',
          status: 'warning'
        },
        {
          id: 4,
          type: 'cancellation',
          title: 'Booking cancelled',
          description: 'Route: Kigali → Gisenyi | Refund processed',
          time: '2 hours ago',
          status: 'error'
        }
      ];

      setDashboardData(prev => ({
        ...prev,
        revenueData,
        bookingData,
        vehicleStatus,
        recentActivities
      }));
      setLoading(false);
    };

    generateMockData();
  }, []);

  const MetricCard = ({ title, value, change, trend, icon: Icon, prefix = '', suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft hover:shadow-elegant transition-all duration-300 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-soft border border-gray-100 ${className}`}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
            Export Report
          </button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={dashboardData.metrics.totalRevenue.value}
          change={dashboardData.metrics.totalRevenue.change}
          trend={dashboardData.metrics.totalRevenue.trend}
          icon={DollarSign}
          prefix="$"
        />
        <MetricCard
          title="Total Bookings"
          value={dashboardData.metrics.totalBookings.value}
          change={dashboardData.metrics.totalBookings.change}
          trend={dashboardData.metrics.totalBookings.trend}
          icon={Calendar}
        />
        <MetricCard
          title="Active Vehicles"
          value={dashboardData.metrics.activeVehicles.value}
          change={dashboardData.metrics.activeVehicles.change}
          trend={dashboardData.metrics.activeVehicles.trend}
          icon={Car}
        />
        <MetricCard
          title="Customer Rating"
          value={dashboardData.metrics.customerSatisfaction.value}
          change={dashboardData.metrics.customerSatisfaction.change}
          trend={dashboardData.metrics.customerSatisfaction.trend}
          icon={Users}
          suffix="/5"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1F2937" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1F2937" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1F2937"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Booking Status */}
        <ChartCard title="Booking Status Distribution">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.bookingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.bookingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value}%`, 'Percentage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {dashboardData.bookingData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Status */}
        <ChartCard title="Fleet Status">
          <div className="space-y-4">
            {dashboardData.vehicleStatus.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  <span className="text-sm text-gray-500">{item.count} vehicles</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activities */}
        <ChartCard title="Recent Activities" className="lg:col-span-2">
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {dashboardData.recentActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    activity.status === 'error' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {activity.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {activity.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {activity.status === 'info' && <Clock className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default ModernDashboardHome;