import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { Search, Calendar, AlertTriangle, MapPin, Droplet, Check, Car, Wrench, Clock, Plus, X } from 'lucide-react';


const FleetManagement = () => {
  const [fleetData, setFleetData] = useState({
    availableCars: [],
    bookedCars: [],
    maintenanceAlerts: [],
    fuelEfficiency: [],
    routes: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [showPopup, setShowPopup] = useState(false);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [newCar, setNewCar] = useState({
    type: '',
    name: '',
    driver: '',
    plate: '',
    seats: '',
    status: 'available',
    fuelLevel: '',
    location: '',
    lastService: '',
    departureTime: '',
    arrivalTime: '',
    route: ''
  });



  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'fleet'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setFleetData({
        availableCars: data.filter(car => car.status === 'available') || [],
        bookedCars: data.filter(car => car.status === 'booked') || [],
        maintenanceAlerts: data.filter(car => car.maintenanceDue) || [],
        fuelEfficiency: data.map(car => ({
          id: car.id,
          name: car.name || 'Unknown',
          plate: car.plate || 'Unknown',
          efficiency: car.fuelEfficiency || 'N/A',
          lastRefill: car.lastRefill || 'Unknown',
          cost: car.fuelCost || 0
        })) || [],
        routes: data.map(car => ({
          name: car.name || 'Unknown',
          route: car.route || 'Unknown',
          departure: car.departureTime || 'Unknown',
          arrival: car.arrivalTime || 'Unknown'
        })) || []
      });
    });
  
    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);
  

  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'fleet'), newCar);
      setShowPopup(false);
      setNewCar({
        type: '', name: '', driver: '', plate: '', seats: '', status: 'available',
        fuelLevel: '', location: '', lastService: '', departureTime: '', arrivalTime: '', route: ''
      });
      alert('New car added successfully!');
    } catch (error) {
      console.error('Error adding new car:', error);
    }
  };

  
  // Filter data based on search term
  const filterData = (data) => {
    if (!searchTerm) return data;
    return data.filter(car => 
      (car.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (car.licensePlate?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  };
  

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Fleet Management Dashboard</h1>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by vehicle name or license plate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`p-3 font-medium flex items-center mr-4 ${activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('available')}
        >
          <Check size={18} className="mr-2" />
          Available Cars ({fleetData.availableCars.length})
        </button>
        <button 
          className={`p-3 font-medium flex items-center mr-4 ${activeTab === 'booked' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('booked')}
        >
          <Calendar size={18} className="mr-2" />
          Booked Cars ({fleetData.bookedCars.length})
        </button>
        <button 
          className={`p-3 font-medium flex items-center mr-4 ${activeTab === 'maintenance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <Wrench size={18} className="mr-2" />
          Maintenance Alerts ({fleetData.maintenanceAlerts.length})
        </button>
        <button 
          className={`p-3 font-medium flex items-center mr-4 ${activeTab === 'tracking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('tracking')}
        >
          <MapPin size={18} className="mr-2" />
          Location Tracking
        </button>
        <button 
          className={`p-3 font-medium flex items-center ${activeTab === 'fuel' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('fuel')}
        >
          <Droplet size={18} className="mr-2" />
          Fuel Efficiency
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Available Cars */}
        {activeTab === 'available' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="mr-2 text-green-600" />
              Available Cars
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.availableCars).map(car => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.licensePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                car.fuelLevel > 70 ? 'bg-green-600' : 
                                car.fuelLevel > 30 ? 'bg-yellow-400' : 
                                'bg-red-600'
                              }`} 
                              style={{ width: `${car.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{car.fuelLevel}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.lastService}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowPopup(true)} className="mt-4 mb-4 px-4 py-3 bg-blue-600 text-white rounded flex items-center mx-auto block">
              <Plus className="mr-2" /> Add New Car
            </button>

          </div>
        )}
        
        {showPopup && (
        <div className="fixed inset-0 flex  h-screen items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2 relative">
            <button onClick={() => setShowPopup(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">Add New Car</h2>
            <form className='flex flex-col h-[80vh] overflow-y-auto' onSubmit={handleSubmit}>
              {Object.keys(newCar).map((key) => (
                <div key={key} className="mt-4">
                  <label className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input
                    type="text"
                    name={key}
                    value={newCar[key]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Save Car</button>
            </form>
          </div>
        </div>
      )}

        {/* Booked Cars */}
        {activeTab === 'booked' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-600" />
              Currently Booked Cars
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.bookedCars).map(car => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.plate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.bookedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1 text-gray-400" />
                          {car.returnDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                car.fuelLevel > 70 ? 'bg-green-600' : 
                                car.fuelLevel > 30 ? 'bg-yellow-400' : 
                                'bg-red-600'
                              }`} 
                              style={{ width: `${car.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{car.fuelLevel}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Maintenance Alerts */}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" />
              Maintenance Alerts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.maintenanceAlerts).map(alert => (
                    <tr key={alert.id} className={alert.urgent ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.urgent ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Urgent
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.licensePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.alertType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{alert.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm">
                          Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Location Tracking */}
        {activeTab === 'tracking' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-indigo-600" />
              Vehicle Location Tracking
            </h2>
            <div className="border border-gray-200 rounded-lg h-64 bg-gray-100 flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                <p>Map view would be displayed here (showing all vehicle locations)</p>
                <p className="text-sm">Integrate with Google Maps or similar mapping API</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData([...fleetData.availableCars, ...fleetData.bookedCars]).map(car => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.plate}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          car.id in fleetData.bookedCars.map(c => c.id) 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {car.id in fleetData.bookedCars.map(c => c.id) ? 'In Use' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">Today, 10:23 AM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Fuel Efficiency */}
        {activeTab === 'fuel' && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Droplet className="mr-2 text-blue-600" />
              Fuel Consumption & Efficiency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Fleet Average MPG</h3>
                <p className="text-3xl font-bold text-blue-700">34.0</p>
                <p className="text-sm text-blue-600 mt-1">+2.5% from last month</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">Monthly Fuel Cost</h3>
                <p className="text-3xl font-bold text-green-700">$1,245.50</p>
                <p className="text-sm text-green-600 mt-1">-5.2% from last month</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">CO2 Emissions</h3>
                <p className="text-3xl font-bold text-purple-700">3.2 tons</p>
                <p className="text-sm text-purple-600 mt-1">-1.8% from last month</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency (MPG)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Refill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refill Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trends</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.fuelEfficiency).map(car => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{car.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.licensePlate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-medium ${
                          car.efficiency === 'N/A (Electric)' ? 'text-blue-600' :
                          car.efficiency > 35 ? 'text-green-600' :
                          car.efficiency > 25 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {car.efficiency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{car.lastRefill}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${car.cost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-24 bg-gray-100 rounded">
                          {/* This would be a mini graph/sparkline in a real app */}
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                            View Chart
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetManagement;