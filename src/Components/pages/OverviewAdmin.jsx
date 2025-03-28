import React, { useState } from 'react';
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
  Link
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Overview = () => {
  const [selectedDate, setSelectedDate] = useState('');



  const actionButtons = [
    {
      icon: Package,
      label: 'Inventory Management',
      color: 'bg-green-500',
      onClick: () => alert('Navigating to Inventory Management')
    },
    {
      icon: BookOpen,
      label: 'Booking Management',
      color: 'bg-blue-500',
      onClick: () => alert('Navigating to Booking Management')
    },
    {
      icon: CreditCard,
      label: 'Payment & Reports',
      color: 'bg-red-500',
      onClick: () => alert('Navigating to Payment & Reports')
    },
    {
      icon: Users,
      label: 'Customer CRM',
      color: 'bg-orange-500',
      onClick: () => alert('Navigating to Customer CRM')
    },
    {
      icon: BarChart,
      label: 'Reporting & Analytics',
      color: 'bg-purple-500',
      onClick: () => alert('Navigating to Reporting & Analytics')
    },
    {
      icon: User,
      label: 'User Control',
      color: 'bg-gray-500',
      onClick: () => alert('Navigating to User Control')
    },
    {
      icon: Megaphone,
      label: 'Promotions',
      color: 'bg-cyan-500',
      onClick: () => alert('Navigating to Promotions')
    },
    {
      icon: Calendar,
      label: 'Event Management',
      color: 'bg-lime-500',
      onClick: () => alert('Navigating to Event Management')
    },
    {
      icon: Bell,
      label: 'Notifications',
      color: 'bg-orange-600',
      onClick: () => alert('Navigating to Notifications')
    },
    {
      icon: Link,
      label: 'Integrations',
      color: 'bg-indigo-500',
      onClick: () => alert('Navigating to Integrations')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Car Ticket Booking</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`
            ${button.color} 
            text-white 
            px-4 
            py-3 
            rounded-lg 
            flex 
            items-center 
            justify-center 
            space-x-2 
            hover:opacity-90 
            transition-all 
            duration-300 
            ease-in-out
          `}
            >
              <button.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Statistics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Total Tickets Card */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-500 mb-2">Total Tickets</h3>
                  <p className="text-2xl font-bold text-blue-600">634</p>
                </div>
                <span className="text-green-500 text-xs bg-green-50 px-2 py-1 rounded">
                  +12%
                </span>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Progress</h2>
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40">
                  <CircularProgressbar
                    value={20}
                    text="20%"
                    styles={buildStyles({
                      pathColor: '#EC4899', // Pink color
                      textColor: '#EC4899',
                      trailColor: '#E5E7EB', // Gray background
                    })}
                  />
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">Done by Car</p>
            </div>
          </div>

          {/* Right Column - Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Models Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Car Models Booked</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Sedan', percentage: 45, color: 'bg-blue-600' },
                  { name: 'SUV', percentage: 30, color: 'bg-pink-600' },
                  { name: 'Hatchback', percentage: 25, color: 'bg-blue-600' }
                ].map((model) => (
                  <div key={model.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{model.name}</span>
                      <span>{model.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${model.color} h-3 rounded-full`}
                        style={{ width: `${model.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Status */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Confirmed', percentage: 60, color: 'bg-blue-600' },
                  { name: 'Pending', percentage: 25, color: 'bg-pink-600' },
                  { name: 'Cancelled', percentage: 15, color: 'bg-blue-600' }
                ].map((status) => (
                  <div key={status.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{status.name}</span>
                      <span>{status.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${status.color} h-3 rounded-full`}
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;