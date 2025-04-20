import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Activity, Calendar, AlertCircle, FileText, Clock, Users, DollarSign, TrendingUp, XCircle } from 'lucide-react';

const ReportsLogsDashboard = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  
  const tabs = [
    { id: 'revenue', label: 'Revenue Reports', icon: DollarSign },
    { id: 'bookings', label: 'Booking Trends & Insights', icon: TrendingUp },
    { id: 'cancelled', label: 'Cancelled & Missed Bookings', icon: XCircle },
    { id: 'system', label: 'System Activity Logs', icon: Activity }
  ];
  
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-y-scroll scrollbar-thin scrollbar-thumb-black scrollbar-track-white">
      {/* Header */}
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold text-gray-800">Reports & Logs</h1>
        <p className="text-sm text-gray-500">View and analyze business performance data</p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center p-4 px-6 font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Content */}
      <div className="p-4 overflow-hidden">
        {activeTab === 'revenue' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-green-900">$24,389.45</h3>
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 12.3% from last month</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Average Daily</p>
                    <h3 className="text-2xl font-bold text-blue-900">$786.76</h3>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">↑ 3.7% from last month</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-800">Revenue per Booking</p>
                    <h3 className="text-2xl font-bold text-purple-900">$157.35</h3>
                  </div>
                </div>
                <p className="text-xs text-purple-600 mt-2">↑ 5.2% from last month</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Revenue Breakdown</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded border">
                <BarChart className="w-12 h-12 text-gray-400" />
                <p className="ml-2 text-gray-500">Revenue chart visualization</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Methods</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded border">
                  <PieChart className="w-12 h-12 text-gray-400" />
                  <p className="ml-2 text-gray-500">Payment methods breakdown</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Top Services by Revenue</h3>
                <div className="space-y-2">
                  {['Premium Consultation', 'Standard Session', 'Group Workshop', 'Quick Checkup'].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b">
                      <span className="text-gray-700">{service}</span>
                      <span className="font-semibold">${(5000 - index * 1200).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Total Bookings</p>
                    <h3 className="text-2xl font-bold text-blue-900">156</h3>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">↑ 8.3% from last month</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-indigo-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-800">Repeat Clients</p>
                    <h3 className="text-2xl font-bold text-indigo-900">65%</h3>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 mt-2">↑ 2.1% from last month</p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-emerald-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-emerald-800">Avg. Booking Duration</p>
                    <h3 className="text-2xl font-bold text-emerald-900">75 min</h3>
                  </div>
                </div>
                <p className="text-xs text-emerald-600 mt-2">Same as last month</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Booking Trends (Last 30 Days)</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded border">
                <LineChart className="w-12 h-12 text-gray-400" />
                <p className="ml-2 text-gray-500">Booking trends visualization</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Popular Booking Times</h3>
                <div className="space-y-2">
                  {['Monday 9-11 AM', 'Wednesday 1-3 PM', 'Thursday 4-6 PM', 'Friday 10-12 PM'].map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b">
                      <span className="text-gray-700">{time}</span>
                      <span className="font-semibold">{30 - index * 5} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Most Requested Services</h3>
                <div className="space-y-2">
                  {['Premium Consultation', 'Standard Session', 'Group Workshop', 'Quick Checkup'].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border-b">
                      <span className="text-gray-700">{service}</span>
                      <span className="font-semibold">{45 - index * 10} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'cancelled' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">Cancelled Bookings</p>
                    <h3 className="text-2xl font-bold text-red-900">12</h3>
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-2">↓ 3.2% from last month</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-amber-800">Missed Appointments</p>
                    <h3 className="text-2xl font-bold text-amber-900">8</h3>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-2">↓ 1.5% from last month</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-gray-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">Lost Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">$2,145.60</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">↓ 4.7% from last month</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Cancellation Reasons</h3>
              <div className="h-48 flex items-center justify-center bg-gray-50 rounded border">
                <PieChart className="w-12 h-12 text-gray-400" />
                <p className="ml-2 text-gray-500">Cancellation reasons breakdown</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Cancellations</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {name: 'Alex Johnson', service: 'Premium Consultation', date: 'Feb 28, 2025', time: '10:30 AM', status: 'Cancelled', reason: 'Schedule conflict'},
                    {name: 'Maria Garcia', service: 'Standard Session', date: 'Feb 27, 2025', time: '3:15 PM', status: 'Missed', reason: 'No-show'},
                    {name: 'James Wilson', service: 'Quick Checkup', date: 'Feb 26, 2025', time: '4:45 PM', status: 'Cancelled', reason: 'Illness'},
                    {name: 'Sarah Brown', service: 'Group Workshop', date: 'Feb 25, 2025', time: '1:00 PM', status: 'Cancelled', reason: 'Personal emergency'}
                  ].map((booking, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-900">{booking.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{booking.service}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{booking.date}, {booking.time}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{booking.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'system' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">Total Activities</p>
                    <h3 className="text-2xl font-bold text-blue-900">543</h3>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Last 30 days</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-indigo-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-800">Admin Actions</p>
                    <h3 className="text-2xl font-bold text-indigo-900">78</h3>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 mt-2">Last 30 days</p>
              </div>
              
              <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-rose-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-rose-800">Data Modifications</p>
                    <h3 className="text-2xl font-bold text-rose-900">126</h3>
                  </div>
                </div>
                <p className="text-xs text-rose-600 mt-2">Last 30 days</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">System Activity Logs</h3>
                <div className="flex space-x-2">
                  <select className="text-sm border rounded p-1">
                    <option>All Actions</option>
                    <option>Modifications</option>
                    <option>Deletions</option>
                    <option>Admin Actions</option>
                  </select>
                  <select className="text-sm border rounded p-1">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Today</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {timestamp: 'Mar 04, 2025 09:42 AM', admin: 'Sarah Admin', action: 'Modification', entity: 'User Profile', details: 'Updated contact information for client #1254'},
                    {timestamp: 'Mar 03, 2025 03:15 PM', admin: 'John Manager', action: 'Deletion', entity: 'Booking', details: 'Removed duplicate booking ID #8754'},
                    {timestamp: 'Mar 03, 2025 10:27 AM', admin: 'Sarah Admin', action: 'Admin', entity: 'System Settings', details: 'Updated payment gateway configuration'},
                    {timestamp: 'Mar 02, 2025 02:18 PM', admin: 'Alex Support', action: 'Modification', entity: 'Service', details: 'Updated pricing for Premium Consultation'},
                    {timestamp: 'Mar 02, 2025 11:05 AM', admin: 'Maria Admin', action: 'Admin', entity: 'User Role', details: 'Assigned admin privileges to user #45'},
                    {timestamp: 'Mar 01, 2025 09:32 AM', admin: 'John Manager', action: 'Deletion', entity: 'Customer', details: 'Removed test account #TEST123'}
                  ].map((log, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-xs text-gray-500">{log.timestamp}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{log.admin}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          log.action === 'Modification' ? 'bg-blue-100 text-blue-800' : 
                          log.action === 'Deletion' ? 'bg-red-100 text-red-800' : 
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-900">{log.entity}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex justify-between items-center mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Export Activity Logs
                </button>
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
                    &lt;
                  </button>
                  <span className="text-sm text-gray-500">Page 1 of 12</span>
                  <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsLogsDashboard;