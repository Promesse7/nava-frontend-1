import React, { useState } from 'react';
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, Bar } from 'recharts';
import { Users, Bus, Calendar, DollarSign } from 'lucide-react';

// Dashboard Component
const Dashboard = () => {
  const mockData = {
    stats: {
      totalBookings: 1234,
      activeUsers: 567,
      totalRevenue: 45678,
      busesInService: 89
    },
    bookingTrend: [
      { month: 'Jan', bookings: 120 },
      { month: 'Feb', bookings: 150 },
      { month: 'Mar', bookings: 180 },
      { month: 'Apr', bookings: 220 }
    ],
    revenueData: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 25000 }
    ]
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold">{mockData.stats.totalBookings}</h3>
            </div>
            <Calendar className="text-blue-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Users</p>
              <h3 className="text-2xl font-bold">{mockData.stats.activeUsers}</h3>
            </div>
            <Users className="text-green-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${mockData.stats.totalRevenue}</h3>
            </div>
            <DollarSign className="text-yellow-500 w-8 h-8" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Buses in Service</p>
              <h3 className="text-2xl font-bold">{mockData.stats.busesInService}</h3>
            </div>
            <Bus className="text-purple-500 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          <LineChart width={500} height={300} data={mockData.bookingTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#2563eb" />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
          <BarChart width={500} height={300} data={mockData.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#2563eb" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;