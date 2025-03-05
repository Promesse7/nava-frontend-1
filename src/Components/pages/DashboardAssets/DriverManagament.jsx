import { useState, useEffect } from 'react';
import { db } from '../../../firebase'; // Ensure the correct path to your Firebase config
import { collection, getDocs } from 'firebase/firestore';
import { Phone, Mail, Star, Calendar, Clock, MapPin, Car, ThumbsUp, ThumbsDown, CheckCircle, XCircle, AlertTriangle, Search, Filter, ChevronDown, Eye, Edit, Trash, User, UserCheck, UserX } from 'lucide-react';
import DriverForm from './DriverForm';
const DriverManagement = () => {
  // Sample data for demonstration
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  // const [drivers, setDrivers] = useState([
  //   {
  //     id: "DRV-42",
  //     name: "Michael Rodriguez",
  //     contact: {
  //       email: "michael.r@example.com",
  //       phone: "555-876-5432"
  //     },
  //     availability: {
  //       status: "Available",
  //       schedule: [
  //         { day: "Monday", hours: "8:00 AM - 6:00 PM" },
  //         { day: "Tuesday", hours: "8:00 AM - 6:00 PM" },
  //         { day: "Wednesday", hours: "8:00 AM - 6:00 PM" },
  //         { day: "Thursday", hours: "8:00 AM - 6:00 PM" },
  //         { day: "Friday", hours: "8:00 AM - 6:00 PM" }
  //       ],
  //       nextAvailable: "2025-03-03T08:00:00"
  //     },
  //     performance: {
  //       rating: 4.8,
  //       totalTrips: 128,
  //       totalFeedback: 87,
  //       feedback: [
  //         { id: "FB-001", bookingId: "BK-2025-001", rating: 5, comment: "Very professional and punctual", date: "2025-03-01" },
  //         { id: "FB-002", bookingId: "BK-2024-098", rating: 5, comment: "Excellent service, very helpful with luggage", date: "2025-02-28" },
  //         { id: "FB-003", bookingId: "BK-2024-087", rating: 4, comment: "Good driver, arrived on time", date: "2025-02-25" }
  //       ]
  //     },
  //     assignedBookings: [
  //       {
  //         id: "BK-2025-001",
  //         customer: "John Smith",
  //         car: "Tesla Model 3",
  //         time: "2025-03-10T09:00:00",
  //         pickup: "Airport Terminal 2"
  //       }
  //     ],
  //     pastBookings: [
  //       {
  //         id: "BK-2024-098",
  //         customer: "Lisa Johnson",
  //         car: "BMW 5 Series",
  //         time: "2025-02-28T14:00:00",
  //         pickup: "Downtown Hotel"
  //       },
  //       {
  //         id: "BK-2024-087",
  //         customer: "Robert Chen",
  //         car: "Mercedes E-Class",
  //         time: "2025-02-25T10:30:00",
  //         pickup: "Convention Center"
  //       }
  //     ]
  //   },
  //   {
  //     id: "DRV-28",
  //     name: "Jennifer Adams",
  //     contact: {
  //       email: "jennifer.a@example.com",
  //       phone: "555-321-9876"
  //     },
  //     availability: {
  //       status: "On Duty",
  //       schedule: [
  //         { day: "Monday", hours: "7:00 AM - 3:00 PM" },
  //         { day: "Tuesday", hours: "7:00 AM - 3:00 PM" },
  //         { day: "Wednesday", hours: "Off" },
  //         { day: "Thursday", hours: "7:00 AM - 3:00 PM" },
  //         { day: "Friday", hours: "7:00 AM - 3:00 PM" }
  //       ],
  //       nextAvailable: "2025-03-05T07:00:00"
  //     },
  //     performance: {
  //       rating: 4.9,
  //       totalTrips: 156,
  //       totalFeedback: 102,
  //       feedback: [
  //         { id: "FB-004", bookingId: "BK-2025-004", rating: 5, comment: "Outstanding service, very knowledgeable about the city", date: "2025-03-01" },
  //         { id: "FB-005", bookingId: "BK-2024-092", rating: 5, comment: "Fantastic experience, would request again", date: "2025-02-27" },
  //         { id: "FB-006", bookingId: "BK-2024-086", rating: 4, comment: "Great driver, smooth ride", date: "2025-02-25" }
  //       ]
  //     },
  //     assignedBookings: [
  //       {
  //         id: "BK-2025-004",
  //         customer: "Sarah Miller",
  //         car: "Ford Escape",
  //         time: "2025-03-15T12:00:00",
  //         pickup: "Downtown Hotel Plaza"
  //       }
  //     ],
  //     pastBookings: [
  //       {
  //         id: "BK-2024-092",
  //         customer: "David Brown",
  //         car: "Toyota Camry",
  //         time: "2025-02-27T09:15:00",
  //         pickup: "Corporate Offices"
  //       },
  //       {
  //         id: "BK-2024-086",
  //         customer: "Emma Watson",
  //         car: "Audi A6",
  //         time: "2025-02-25T16:45:00",
  //         pickup: "Airport Terminal 1"
  //       }
  //     ]
  //   },
  //   {
  //     id: "DRV-35",
  //     name: "Alex Johnson",
  //     contact: {
  //       email: "alex.j@example.com",
  //       phone: "555-111-2233"
  //     },
  //     availability: {
  //       status: "On Leave",
  //       schedule: [
  //         { day: "Monday", hours: "9:00 AM - 7:00 PM" },
  //         { day: "Tuesday", hours: "9:00 AM - 7:00 PM" },
  //         { day: "Wednesday", hours: "9:00 AM - 7:00 PM" },
  //         { day: "Thursday", hours: "Off" },
  //         { day: "Friday", hours: "Off" }
  //       ],
  //       nextAvailable: "2025-03-10T09:00:00"
  //     },
  //     performance: {
  //       rating: 4.6,
  //       totalTrips: 95,
  //       totalFeedback: 67,
  //       feedback: [
  //         { id: "FB-007", bookingId: "BK-2024-095", rating: 5, comment: "Very friendly and professional", date: "2025-02-26" },
  //         { id: "FB-008", bookingId: "BK-2024-089", rating: 4, comment: "Good service overall", date: "2025-02-24" },
  //         { id: "FB-009", bookingId: "BK-2024-078", rating: 4, comment: "Prompt and courteous", date: "2025-02-21" }
  //       ]
  //     },
  //     assignedBookings: [],
  //     pastBookings: [
  //       {
  //         id: "BK-2024-095",
  //         customer: "Michael Chen",
  //         car: "Lexus ES",
  //         time: "2025-02-26T11:30:00",
  //         pickup: "Grand Hotel"
  //       },
  //       {
  //         id: "BK-2024-089",
  //         customer: "Jessica Parker",
  //         car: "Honda Accord",
  //         time: "2025-02-24T14:15:00",
  //         pickup: "Shopping Mall"
  //       }
  //     ]
  //   }
  // ]);

  // Filter and search states
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch drivers data from Firestore
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const driversCollection = collection(db, 'drivers');
      const driverSnapshot = await getDocs(driversCollection);
      const driverList = driverSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDrivers(driverList);
      setFilteredDrivers(driverList);
    } catch (err) {
      console.error('Error fetching drivers: ', err);
      setError('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter drivers based on search term
  useEffect(() => {
    const filtered = drivers.filter((driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [searchTerm, drivers]);


  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Selected driver for detail view
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'bookings', 'schedule', 'feedback'
  const [filteredDrivers, setFilteredDrivers] = useState([]);

  // Apply filters and search
  useEffect(() => {
    const updatedFilteredDrivers = drivers.filter(driver => {
      // Search functionality
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        driver.name.toLowerCase().includes(searchLower) ||
        driver.id.toLowerCase().includes(searchLower) ||
        (driver.contact?.email && driver.contact.email.toLowerCase().includes(searchLower)); // Safe access with optional chaining
      
      // Availability filter
      const matchesAvailability = availabilityFilter === 'All' || driver.availability.status === availabilityFilter;
      
      // Rating filter
      let matchesRating = true;
      if (ratingFilter !== 'All') {
        const minRating = parseFloat(ratingFilter);
        matchesRating = driver.performance.rating >= minRating;
      }
  
      return matchesSearch && matchesAvailability && matchesRating;
    });
  
    // Update the filteredDrivers state
    setFilteredDrivers(updatedFilteredDrivers);
  }, [drivers, searchTerm, availabilityFilter, ratingFilter]); // Add dependencies to re-run the effect when any filter changes
  


  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get availability status badge styling
  const getAvailabilityBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'On Duty':
        return 'bg-blue-100 text-blue-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle viewing driver details
  const viewDriverDetails = (driver) => {
    setSelectedDriver(driver);
    setViewMode('detail');
    setActiveTab('profile');
  };

  // Return to list view
  const backToList = () => {
    setViewMode('list');
    setSelectedDriver(null);
  };

  // Get star rating display
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-1 text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Driver Management</h1>
      
      {viewMode === 'list' && (
        <>
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by Name, ID, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button 
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
                <ChevronDown size={18} className="ml-2" />
              </button>
              
              {/* Action button */}
              <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"  onClick={() => setShowDriverPopup(true)} >
                + Add New Driver
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Available">Available</option>
                      <option value="On Duty">On Duty</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                    <select 
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                    >
                      <option value="All">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 mr-2"
                    onClick={() => {
                      setAvailabilityFilter('All');
                      setRatingFilter('All');
                    }}
                  >
                    Reset
                  </button>
                  <button 
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Drivers Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">{driver.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center mb-1">
                            <Mail size={14} className="mr-1 text-gray-500" /> {driver.contact.email}
                          </div>
                          <div className="text-sm text-gray-900 flex items-center">
                            <Phone size={14} className="mr-1 text-gray-500" /> {driver.contact.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityBadge(driver.availability.status)}`}>
                            {driver.availability.status}
                          </span>
                          {driver.availability.status !== 'Available' && (
                            <div className="text-sm text-gray-500 mt-1">
                              Next available: {formatDate(driver.availability.nextAvailable)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {renderStarRating(driver.performance.rating)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {driver.performance.totalFeedback} reviews
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {driver.assignedBookings.length} current
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.pastBookings.length} completed
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => viewDriverDetails(driver)}
                            >
                              <Eye size={18} />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No drivers found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDrivers.length}</span> of <span className="font-medium">{filteredDrivers.length}</span> drivers
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Driver Details View */}
      {viewMode === 'detail' && selectedDriver && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header with back button */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <button 
              className="flex items-center text-blue-600 hover:text-blue-800"
              onClick={backToList}
            >
              <ChevronDown className="transform rotate-90 mr-1" size={18} />
              Back to drivers
            </button>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center">
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 flex items-center">
                <Clock size={16} className="mr-1" />
                Update Status
              </button>
            </div>
          </div>
          
          {/* Driver info header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedDriver.name}</h2>
                  <div className="text-gray-600">{selectedDriver.id}</div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityBadge(selectedDriver.availability.status)}`}>
                      {selectedDriver.availability.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="flex items-center mb-1">
                  {renderStarRating(selectedDriver.performance.rating)}
                  <span className="ml-2 text-gray-600">({selectedDriver.performance.totalFeedback} reviews)</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedDriver.performance.totalTrips} total trips completed
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('schedule')}
              >
                Schedule
              </button>
              <button
                className={`px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'feedback'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('feedback')}
              >
                Feedback
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Email</div>
                        <div className="text-gray-800 flex items-center">
                          <Mail size={16} className="mr-2 text-gray-500" />
                          {selectedDriver.contact.email}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Phone</div>
                        <div className="text-gray-800 flex items-center">
                          <Phone size={16} className="mr-2 text-gray-500" />
                          {selectedDriver.contact.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Summary */}
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Performance Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white rounded-md border border-gray-100">
                        <div className="text-2xl font-bold text-gray-800">{selectedDriver.performance.rating.toFixed(1)}</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-md border border-gray-100">
                        <div className="text-2xl font-bold text-gray-800">{selectedDriver.performance.totalTrips}</div>
                        <div className="text-sm text-gray-500">Trips</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-md border border-gray-100">
                        <div className="text-2xl font-bold text-gray-800">{selectedDriver.performance.totalFeedback}</div>
                        <div className="text-sm text-gray-500">Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Current Status */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Current Status</h3>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getAvailabilityBadge(selectedDriver.availability.status)}`}>
                          {selectedDriver.availability.status}
                        </span>
                      </div>
                      {selectedDriver.availability.status !== 'Available' && (
                        <div className="text-gray-700">
                          Next available: <span className="font-medium">{formatDate(selectedDriver.availability.nextAvailable)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mr-2">
                        <UserCheck size={16} className="inline mr-1" /> Set Available
                      </button>
                      <button className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700">
                        <UserX size={16} className="inline mr-1" /> Set On Leave
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Assigned Bookings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Currently Assigned Bookings</h3>
                  {selectedDriver.assignedBookings.length > 0 ? (
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedDriver.assignedBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.id}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.customer}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.car}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatDate(booking.time)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.pickup}</td>
                              <td className="px-4 py-3 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Eye size={16} />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <Edit size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500">
                      No current bookings assigned to this driver
                    </div>
                  )}
                </div>
                
                {/* Past Bookings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Past Bookings</h3>
                  {selectedDriver.pastBookings.length > 0 ? (
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Location</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedDriver.pastBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.id}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.customer}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.car}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{formatDate(booking.time)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{booking.pickup}</td>
                              <td className="px-4 py-3 text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Eye size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center text-gray-500">
                      No past bookings found for this driver
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">Weekly Schedule</h3>
                    <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                      <Edit size={14} className="mr-1" />
                      Edit Schedule
                    </button>
                  </div>
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Day</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/3">Hours</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDriver.availability.schedule.map((day) => (
                        <tr key={day.day} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{day.day}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {day.hours === "Off" ? (
                              <span className="text-gray-500">Day Off</span>
                            ) : (
                              <div className="flex items-center">
                                <Clock size={14} className="mr-2 text-gray-500" />
                                {day.hours}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Next Availability</h3>
                  <div className="flex items-center text-gray-700">
                    <Calendar size={18} className="mr-2 text-gray-500" />
                    <span className="font-medium">{formatDate(selectedDriver.availability.nextAvailable)}</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Update Driver Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-md flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Set Available
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-md flex items-center">
                      <Car size={16} className="mr-2" />
                      Set On Duty
                    </button>
                    <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-md flex items-center">
                      <Clock size={16} className="mr-2" />
                      Schedule Leave
                    </button>
                    <button className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md flex items-center">
                      <XCircle size={16} className="mr-2" />
                      Set Unavailable
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-800">Customer Feedback</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-3xl font-bold text-gray-900">{selectedDriver.performance.rating.toFixed(1)}</div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={20}
                                className={
                                  i < Math.floor(selectedDriver.performance.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : i === Math.floor(selectedDriver.performance.rating) && selectedDriver.performance.rating % 1 >= 0.5
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">Based on {selectedDriver.performance.totalFeedback} reviews</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-gray-700">
                          <span className="font-medium">{selectedDriver.performance.totalTrips}</span> trips completed
                        </div>
                        <div className="text-sm text-gray-500">
                          Feedback rate: {((selectedDriver.performance.totalFeedback / selectedDriver.performance.totalTrips) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium text-gray-700 mb-3">Recent Feedback</h4>
                      {selectedDriver.performance.feedback.map((feedback) => (
                        <div key={feedback.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < feedback.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                                <div className="ml-2 text-sm font-medium text-gray-700">
                                  Booking {feedback.bookingId}
                                </div>
                              </div>
                              <div className="mt-1 text-gray-800">{feedback.comment}</div>
                            </div>
                            <div className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Driver Rating Trends</h3>
                  <div className="text-gray-500 text-center p-6">
                    Rating history chart would appear here
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <DriverForm 
        showPopup={showDriverPopup} 
        setShowPopup={setShowDriverPopup} 
      />
    </div>
  );
};

export default DriverManagement;