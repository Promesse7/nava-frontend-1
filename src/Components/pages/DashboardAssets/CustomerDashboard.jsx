import React, { useState } from 'react';
import { Search, Users, Star, Award, MessageSquare, ChevronDown, ChevronUp, Mail, Phone, Calendar, FileText } from 'lucide-react';

const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState('profiles');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  // Sample data
  const customers = [
    {
      id: 1,
      name: "Jane Cooper",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      bookings: 27,
      lastBooking: "2025-02-28",
      rating: 4.8,
      frequent: true,
      supportTickets: 1
    },
    {
      id: 2,
      name: "Michael Scott",
      email: "michael@example.com",
      phone: "(555) 234-5678",
      bookings: 42,
      lastBooking: "2025-03-01",
      rating: 4.9,
      frequent: true,
      supportTickets: 0
    },
    {
      id: 3,
      name: "Emily Johnson",
      email: "emily@example.com",
      phone: "(555) 345-6789",
      bookings: 8,
      lastBooking: "2025-02-15",
      rating: 4.2,
      frequent: false,
      supportTickets: 2
    },
    {
      id: 4,
      name: "Robert Chen",
      email: "robert@example.com",
      phone: "(555) 456-7890",
      bookings: 15,
      lastBooking: "2025-02-25",
      rating: 4.5,
      frequent: false,
      supportTickets: 0
    }
  ];

  const supportTickets = [
    {
      id: 101,
      customerId: 1,
      subject: "Driver was late",
      status: "Open",
      priority: "Medium",
      created: "2025-02-28",
      description: "The driver was 15 minutes late and didn't call to notify me."
    },
    {
      id: 102,
      customerId: 3,
      subject: "Payment issue",
      status: "Open",
      priority: "High",
      created: "2025-02-26",
      description: "I was charged twice for my last ride."
    },
    {
      id: 103,
      customerId: 3,
      subject: "App crashed during booking",
      status: "Closed",
      priority: "Low",
      created: "2025-02-15",
      description: "The app crashed when I tried to book a ride."
    }
  ];

  const toggleCustomerExpand = (id) => {
    if (expandedCustomer === id) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(id);
    }
  };

  const renderCustomerProfiles = () => {
    return (
      <div>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="space-y-4">
          {customers.map(customer => (
            <div key={customer.id} className="bg-white rounded-lg shadow">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleCustomerExpand(customer.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {customer.frequent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Award size={14} className="mr-1" /> Frequent
                    </span>
                  )}
                  <span className="inline-flex items-center text-amber-500">
                    <Star size={16} className="mr-1 fill-amber-500" /> {customer.rating}
                  </span>
                  {expandedCustomer === customer.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedCustomer === customer.id && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone size={16} className="mr-2 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Booking History</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span>Last booking: {customer.lastBooking}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FileText size={16} className="mr-2 text-gray-400" />
                          <span>Total bookings: {customer.bookings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Support Tickets</h4>
                    {supportTickets.filter(ticket => ticket.customerId === customer.id).length > 0 ? (
                      <div className="space-y-2">
                        {supportTickets
                          .filter(ticket => ticket.customerId === customer.id)
                          .map(ticket => (
                            <div key={ticket.id} className="border rounded p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{ticket.subject}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  ticket.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {ticket.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No support tickets</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFrequentRiders = () => {
    const frequentCustomers = customers.filter(customer => customer.frequent);
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Frequent Riders</h2>
          <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-sm">
            {frequentCustomers.length} riders
          </span>
        </div>
        
        <div className="bg-white rounded-lg shadow divide-y">
          {frequentCustomers.map(customer => (
            <div key={customer.id} className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">{customer.bookings}</div>
                  <div className="text-xs text-gray-500">Rides</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-medium">{customer.rating}</div>
                  <div className="text-xs text-gray-500">Avg. Rating</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-medium">{customer.lastBooking}</div>
                  <div className="text-xs text-gray-500">Last Ride</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Customer Feedback & Ratings</h2>
          <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
            <Star size={16} className="mr-1 text-amber-500 fill-amber-500" />
            <span className="text-amber-700 font-medium">4.6 Avg Rating</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center">
                  <div className="w-8 text-sm font-medium">{rating} ★</div>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ 
                        width: rating === 5 ? '65%' : 
                               rating === 4 ? '25%' : 
                               rating === 3 ? '8%' : 
                               rating === 2 ? '2%' : '0%' 
                      }} 
                    />
                  </div>
                  <div className="w-9 text-xs text-gray-500 text-right">
                    {rating === 5 ? '65%' : 
                     rating === 4 ? '25%' : 
                     rating === 3 ? '8%' : 
                     rating === 2 ? '2%' : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Recent Reviews</h3>
            <div className="space-y-3">
              <div className="p-2 bg-gray-50 rounded border-l-4 border-green-500">
                <div className="flex items-center mb-1">
                  <div className="text-amber-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500" />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-gray-500">Jane C. - 2025-03-01</span>
                </div>
                <p className="text-sm">"Great service as always. Driver was on time and very courteous."</p>
              </div>
              <div className="p-2 bg-gray-50 rounded border-l-4 border-green-500">
                <div className="flex items-center mb-1">
                  <div className="text-amber-500 flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-500" />
                    ))}
                    <Star size={14} className="text-gray-300" />
                  </div>
                  <span className="ml-2 text-xs text-gray-500">Robert C. - 2025-02-28</span>
                </div>
                <p className="text-sm">"Good ride, but the app navigation wasn't the best route."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportTickets = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Support Tickets & Complaints</h2>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Open: {supportTickets.filter(t => t.status === 'Open').length}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Closed: {supportTickets.filter(t => t.status === 'Closed').length}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supportTickets.map(ticket => {
                const customer = customers.find(c => c.id === ticket.customerId);
                return (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{ticket.id}</div>
                      <div className="text-sm text-gray-500">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {customer?.name.charAt(0)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{customer?.name}</div>
                          <div className="text-sm text-gray-500">{customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.created}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-500">Manage customer profiles, frequent riders, feedback, and support tickets</p>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'profiles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('profiles')}
              >
                <Users size={16} className="inline mr-2" />
                Customer Profiles
              </button>
              <button
                className={`${
                  activeTab === 'frequent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('frequent')}
              >
                <Award size={16} className="inline mr-2" />
                Frequent Riders
              </button>
              <button
                className={`${
                  activeTab === 'feedback'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('feedback')}
              >
                <Star size={16} className="inline mr-2" />
                Feedback & Ratings
              </button>
              <button
                className={`${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('tickets')}
              >
                <MessageSquare size={16} className="inline mr-2" />
                Support Tickets
              </button>
            </nav>
          </div>
        </div>
        
        <div>
          {activeTab === 'profiles' && renderCustomerProfiles()}
          {activeTab === 'frequent' && renderFrequentRiders()}
          {activeTab === 'feedback' && renderFeedback()}
          {activeTab === 'tickets' && renderSupportTickets()}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;