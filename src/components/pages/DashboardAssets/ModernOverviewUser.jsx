import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  CreditCard,
  Calendar,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  ChevronRight,
  Search,
  Bus,
  Ticket,
  Gift,
  Shield,
  Zap,
  Award,
  Navigation,
  Plus,
  BookOpen,
  Heart,
  MessageCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import EnhancedCard from '../../ui/EnhancedCard';
import EnhancedButton from '../../ui/EnhancedButton';

const ModernOverviewUser = () => {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [tickets, setTickets] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    totalTrips: 24,
    totalSpent: 1285,
    rewardPoints: 450,
    memberSince: "2022"
  };

  const availableRoutes = [
    { 
      id: 1, 
      route: "Kigali → Butare", 
      duration: "2h 30m", 
      price: 35, 
      company: "Virunga Express",
      rating: 4.8,
      nextDeparture: "09:30 AM",
      features: ["Wi-Fi", "AC", "Snacks"]
    },
    { 
      id: 2, 
      route: "Kigali → Gisenyi", 
      duration: "3h 15m", 
      price: 45, 
      company: "Volcano Bus",
      rating: 4.6,
      nextDeparture: "10:00 AM",
      features: ["Wi-Fi", "Entertainment", "AC"]
    },
    { 
      id: 3, 
      route: "Kigali → Cyangugu", 
      duration: "4h 20m", 
      price: 55, 
      company: "Lake Kivu Transport",
      rating: 4.7,
      nextDeparture: "11:30 AM",
      features: ["Reclining Seats", "Wi-Fi", "Meals"]
    }
  ];

  const recentBookings = [
    {
      id: "BK-2024-0087",
      route: "Kigali → Butare",
      date: "2024-01-15",
      status: "completed",
      amount: 35,
      rating: 5
    },
    {
      id: "BK-2024-0072",
      route: "Butare → Kigali",
      date: "2024-01-10",
      status: "completed",
      amount: 35,
      rating: 4
    },
    {
      id: "BK-2024-0065",
      route: "Kigali → Gisenyi",
      date: "2024-01-05",
      status: "cancelled",
      amount: 45,
      rating: null
    }
  ];

  const spendingData = [
    { month: 'Sep', amount: 120 },
    { month: 'Oct', amount: 180 },
    { month: 'Nov', amount: 95 },
    { month: 'Dec', amount: 210 },
    { month: 'Jan', amount: 165 }
  ];

  const quickActions = [
    { icon: Calendar, label: "My Bookings", description: "View your trips", color: "from-blue-500 to-blue-600" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage payments", color: "from-green-500 to-green-600" },
    { icon: Gift, label: "Rewards", description: "Redeem points", color: "from-purple-500 to-purple-600" },
    { icon: MessageCircle, label: "Support", description: "Get help", color: "from-orange-500 to-orange-600" }
  ];

  const handleBooking = () => {
    if (!destination || !date) {
      alert('Please select a destination and date');
      return;
    }
    alert(`Booking ${tickets} ticket(s) for ${destination} on ${date}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-2xl px-6 py-3 shadow-soft">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
              <p className="text-sm text-gray-600">Ready for your next adventure?</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Trips", value: userData.totalTrips, icon: Bus, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Spent", value: `$${userData.totalSpent}`, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
            { label: "Reward Points", value: userData.rewardPoints, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Member Since", value: userData.memberSince, icon: Shield, color: "text-orange-600", bg: "bg-orange-50" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Booking */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Quick Booking
                </h2>
                <p className="text-sm text-gray-600 mt-1">Book your next trip in seconds</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Destination
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="">Select destination</option>
                      {availableRoutes.map((route) => (
                        <option key={route.id} value={route.route}>
                          {route.route} - ${route.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Travel Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Ticket className="w-4 h-4 inline mr-1" />
                      Passengers
                    </label>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{tickets}</span>
                      <button 
                        onClick={() => setTickets(tickets + 1)}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <EnhancedButton
                    variant="primary"
                    size="lg"
                    onClick={handleBooking}
                    className="px-8"
                  >
                    Book Now
                  </EnhancedButton>
                </div>
              </div>
            </motion.div>

            {/* Available Routes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Popular Routes</h2>
                <p className="text-sm text-gray-600 mt-1">Most booked destinations this month</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {availableRoutes.map((route) => (
                  <motion.div
                    key={route.id}
                    whileHover={{ backgroundColor: '#F9FAFB' }}
                    className="p-6 cursor-pointer transition-all"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Bus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{route.route}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {route.duration}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              {route.rating}
                            </span>
                            <span>{route.company}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            {route.features.map((feature, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${route.price}</p>
                        <p className="text-sm text-gray-600">Next: {route.nextDeparture}</p>
                        <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Spending Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Monthly Spending</h2>
                <p className="text-sm text-gray-600 mt-1">Your travel expenses over time</p>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                      fill="url(#spendingGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-soft border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Recent Trips</h2>
              </div>
              <div className="p-4 space-y-3">
                {recentBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        booking.status === 'completed' ? 'bg-green-500' : 
                        booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{booking.route}</p>
                        <p className="text-xs text-gray-600">{booking.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">${booking.amount}</p>
                      {booking.rating && (
                        <div className="flex items-center">
                          {[...Array(booking.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernOverviewUser;