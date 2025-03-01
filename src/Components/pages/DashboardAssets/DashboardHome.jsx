import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; // Ensure Firebase is configured
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

const DashboardHome = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
      totalBookings: null,
      revenue: null,
      activeBookings: null,
      cancelledBookings: null,
      peakBookingHours: null,
      userActivity: null,
      availableCars: null,
      bookedCars: null,
      maintenanceAlerts: null,
      paymentStatus: null,
      customerFeedback: null,
      recentTransactions: null,
    });
    const [adminData, setAdminData] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");

  
    const fetchDashboardData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'dashboard'));
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const updatedData = { ...formData };
            Object.keys(updatedData).forEach((key) => {
              updatedData[key] = data[key] || null;
            });
            setDashboardData(updatedData);
            setShowForm(Object.values(updatedData).some(value => value === null));
          } else {
            setShowForm(true);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
      };

    
    useEffect(() => {
        // Fetch admin data

      const fetchAdminData = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'users'));  // Assuming users collection holds the admin's data
          querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.role === 'admin') {
              setAdminData(data);
            }
          });
        } catch (error) {
          console.error('Error fetching admin data:', error);
        }
      };
      fetchAdminData();
      fetchDashboardData();
    }, []);

    return (
        <div>
               {/* Main Content */}




      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Filter Card */}
          <div className="col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Data Filter</h3>
              <p className="text-gray-400 text-sm mb-4">Lorem ipsum is simply dummy</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Data A</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" checked />
                  <span className="text-sm">Data B</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" checked />
                  <span className="text-sm">Data C</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Data D</span>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Data E</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Company Card 1 */}
          <div className="col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Data Company</h3>
                  <p className="text-gray-400 text-xs">Lorem ipsum is simply dummy</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">This month</span>
                  <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center border-b pb-4">
                  <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Sales</span>
                      <span className="text-sm font-medium">$225.5K</span>
                    </div>
                    <p className="text-xs text-gray-400">Lorem ipsum dummy</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                      <div className="w-3/4 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center border-b pb-4">
                  <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data Product</span>
                      <span className="text-sm font-medium">$225.5K</span>
                    </div>
                    <p className="text-xs text-gray-400">Lorem ipsum dummy</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                      <div className="w-3/4 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>

          
          {/* Line Chart Card */}
          <div className="col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Data Company</h3>
                  <p className="text-gray-400 text-xs">Lorem ipsum is simply dummy</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">This month</span>
                  <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm mb-2">
                  <span className="text-gray-500">Product data A</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">5 Dec</span>
                </div>
              </div>
              
              <div className="relative h-48">
                {/* Line Chart Placeholder */}
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  <polyline
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    points="0,120 50,100 100,120 150,60 200,80 250,30 300,50"
                  />
                  <circle cx="50" cy="100" r="4" fill="#000" />
                  <circle cx="100" cy="120" r="4" fill="#000" />
                  <circle cx="150" cy="60" r="4" fill="#000" />
                  <circle cx="200" cy="80" r="4" fill="#000" />
                  <circle cx="250" cy="30" r="4" fill="#000" stroke="#fff" strokeWidth="2" />
                  <circle cx="300" cy="50" r="4" fill="#000" />
                  
                  {/* Data Point Highlight */}
                  <rect x="240" y="10" width="70" height="30" rx="4" fill="#000" />
                  <text x="275" y="28" textAnchor="middle" fill="#fff" fontSize="12">$465</text>
                </svg>
                
                <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div>
                  <span className="text-sm">Data A</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className="text-sm">Data B</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="col-span-3">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Data Company</h3>
                  <p className="text-gray-400 text-xs">Lorem ipsum is simply dummy</p>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">This month</span>
                  <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#000"
                      strokeWidth="10"
                      strokeDasharray="282.7"
                      strokeDashoffset="70"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-400">Balance</span>
                    <span className="text-2xl font-bold text-gray-800">$5,678.00</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full mt-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-800 mr-2"></div>
                    <span className="text-sm">eCommerce</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm">Transfer</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm">ePayment</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Details</h3>
                
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pl-10 rounded-md w-full"
                    placeholder="Search"
                  />
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <button className="px-3 py-2 rounded-full bg-white border text-sm">Today</button>
                  <button className="px-3 py-2 rounded-full bg-gray-700 text-white text-sm">This Week</button>
                  <button className="px-3 py-2 rounded-full bg-white border text-sm">This Month</button>
                  <button className="px-3 py-2 rounded-full bg-white border text-sm">6 Months</button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">Data A</span>
                          <p className="text-xs text-gray-400">Data description</p>
                        </div>
                        <span className="text-sm font-medium">37%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                        <div className="w-1/3 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">Data B</span>
                          <p className="text-xs text-gray-400">Data description</p>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                        <div className="w-1/4 h-1 bg-gray-800 rounded-full"></div>
                      </div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="col-span-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Recent Activity</h3>
                  <p className="text-gray-400 text-xs">Overview of recent actions</p>
                </div>
                <button className="text-sm text-gray-500 flex items-center">
                  <span>View All</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Payment Processing</p>
                        <p className="text-xs text-gray-500">Transaction ID: #12345</p>
                      </div>
                      <span className="text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Successfully processed payment of $1,250.00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">New User Registration</p>
                        <p className="text-xs text-gray-500">User ID: #78920</p>
                      </div>
                      <span className="text-xs text-gray-400">5 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Jane Smith completed account registration</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Project Milestone Completed</p>
                        <p className="text-xs text-gray-500">Project: Dashboard Redesign</p>
                      </div>
                      <span className="text-xs text-gray-400">Yesterday</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Team completed Phase 2 of the redesign project</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">System Alert</p>
                        <p className="text-xs text-gray-500">Server: PROD-DB-01</p>
                      </div>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">High CPU utilization detected and resolved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tasks Card */}
          <div className="col-span-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Upcoming Tasks</h3>
                  <p className="text-gray-400 text-xs">Your scheduled activities</p>
                </div>
                <button className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md">
                  Add New
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <input type="checkbox" className="mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">UI Design Review</p>
                        <p className="text-xs text-gray-500">Marketing Team</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-4">Today, 2:00 PM</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <input type="checkbox" className="mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Database Optimization</p>
                        <p className="text-xs text-gray-500">Development Team</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">High</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-4">Tomorrow, 10:00 AM</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <input type="checkbox" className="mr-3" checked />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium line-through text-gray-400">Weekly Team Meeting</p>
                        <p className="text-xs text-gray-500">All Departments</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-4">Yesterday</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <input type="checkbox" className="mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Client Presentation</p>
                        <p className="text-xs text-gray-500">Project X</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Low</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-4">Mar 3, 1:30 PM</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <input type="checkbox" className="mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Quarterly Budget Review</p>
                        <p className="text-xs text-gray-500">Finance Team</p>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Planning</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-4">Mar 5, 9:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;