import React, { useState } from 'react';
import { Calendar, DollarSign, RefreshCw, CreditCard } from 'lucide-react';

const PaymentDashboard = () => {
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState('day');
  
  // Sample data - would be replaced with real data from your API
  const dashboardData = {
    earnings: {
      day: 350.75,
      week: 2430.50,
      month: 9875.25
    },
    pendingPayments: 675.40,
    refundRequests: [
      { id: 1, amount: 49.99, status: 'pending', date: '2025-03-01' },
      { id: 2, amount: 129.50, status: 'processing', date: '2025-02-28' }
    ],
    paymentMethods: [
      { method: 'Mobile Money', count: 45, percentage: 45 },
      { method: 'Card', count: 30, percentage: 30 },
      { method: 'Cash', count: 15, percentage: 15 },
      { method: 'Bank Transfer', count: 10, percentage: 10 }
    ]
  };

  return (
    <div className="flex flex-col p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Payment & Transactions</h1>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Earnings Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Total Earnings</h2>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="flex items-center mb-3 space-x-2">
            <span className="text-2xl font-bold">
              ${dashboardData.earnings[timePeriod].toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 capitalize">({timePeriod})</span>
          </div>
          
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setTimePeriod('day')}
              className={`flex-1 py-1 text-xs font-medium ${
                timePeriod === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setTimePeriod('week')}
              className={`flex-1 py-1 text-xs font-medium ${
                timePeriod === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`flex-1 py-1 text-xs font-medium ${
                timePeriod === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        
        {/* Pending Payments Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Pending Payments</h2>
            <RefreshCw className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold">${dashboardData.pendingPayments.toFixed(2)}</span>
          </div>
          <div className="mt-6 text-xs text-gray-500">
            Awaiting processing
          </div>
        </div>
        
        {/* Refund Requests Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Refund Requests</h2>
            <Calendar className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{dashboardData.refundRequests.length}</span>
          </div>
          <div className="mt-2">
            {dashboardData.refundRequests.length > 0 ? (
              <div className="text-xs space-y-1">
                {dashboardData.refundRequests.map(refund => (
                  <div key={refund.id} className="flex justify-between">
                    <span>${refund.amount.toFixed(2)}</span>
                    <span className={`capitalize ${
                      refund.status === 'pending' ? 'text-yellow-500' : 'text-blue-500'
                    }`}>
                      {refund.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No pending refunds</div>
            )}
          </div>
        </div>
        
        {/* Payment Methods Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Payment Methods</h2>
            <CreditCard className="h-5 w-5 text-purple-500" />
          </div>
          <div className="space-y-2">
            {dashboardData.paymentMethods.map((method, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between text-xs mb-1">
                  <span>{method.method}</span>
                  <span className="font-medium">{method.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Transactions Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  TX38492
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mar 3, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $124.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mobile Money
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  TX38491
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mar 2, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $85.50
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Card
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  TX38490
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mar 2, 2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  $49.99
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Cash
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending Refund
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;