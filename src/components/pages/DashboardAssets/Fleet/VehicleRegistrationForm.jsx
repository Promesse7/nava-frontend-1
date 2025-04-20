import { useState, useEffect } from 'react';
import { X, Upload, Car, Calendar, Clock, User, CreditCard,Wrench,MapPin,Droplet } from 'lucide-react';
import { db } from "../../../../firebase"; // Make sure storage is imported
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
const VehicleRegistrationForm = ({ setShowPopup, drivers, handleSubmit: onSubmitForm }) => {
  const [newCar, setNewCar] = useState({
    name: '',
    driverId: '',
    plate: '',
    arrivalTime: '',
    seats: '16',  // Default value for seats
    type: '',     // Added as required in original form
    fuelLevel: '',
    location: '',
    lastService: '',
    route: '',
  });
  
  const [departureDate, setDepartureDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadLoading(true);
    
    // Create a FormData object to prepare for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nava-travel'); // Replace with your Cloudinary upload preset
    
    try {
      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dlhu0vkqm/image/upload', // Replace YOUR_CLOUD_NAME
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      setImageUrl(data.secure_url);
      setNewCar({ ...newCar, imageUrl: data.secure_url });
      setUploadLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadLoading(false);
    }
  };
  
  // Modified to match the parent component's expected behavior
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Ensure all required fields are filled
      if (!newCar.name || !newCar.plate || !newCar.type) {
        alert("Please fill in all required fields: Name, Type, and Plate.");
        return;
      }
  
      // Ensure seats is a valid number
      const totalSeats = Number.isInteger(parseInt(newCar.seats))
        ? parseInt(newCar.seats)
        : 16;
  
      // Create the seat layout object
      const layout = {};
      for (let i = 1; i <= totalSeats; i++) {
        layout[i.toString()] = {
          status: "available",
          bookedBy: null,
        };
      }
  
      // Combine all form data, including seat structure and departureDate
      const formData = {
        ...newCar,
        departureDate,
        seats: {
          total: totalSeats,
          available: totalSeats,
          layout,
        },
      };
  
      // Pass data to parent component's handler (if applicable)
      if (onSubmitForm) {
        onSubmitForm(formData);
      }
  
      // Add car to Firestore and store the document ID
      const vehicleRef = await addDoc(collection(db, "fleet"), formData);
      const vehicleId = vehicleRef.id;
  
      // Update Firestore to include the auto-generated ID in the document
      await updateDoc(doc(db, "fleet", vehicleId), { id: vehicleId });
  
      // Reset form and close popup
      setShowPopup(false);
      setNewCar({
        type: "",
        name: "",
        driver: "",
        plate: "",
        seats: "",
        status: "available",
        fuelLevel: "",
        location: "",
        lastService: "",
        departureTime: "",
        arrivalTime: "",
        route: "",
      });
  
      alert("New car added successfully with seat layout!");
    } catch (error) {
      console.error("Error adding new car:", error);
      alert("Error adding car: " + error.message);
    }
  };
  
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
        <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Car size={24} />
            Register New Vehicle
          </h2>
          <button
            onClick={() => setShowPopup(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <form className="p-6 overflow-y-auto max-h-[80vh]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Car Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Car size={18} />
                  Vehicle Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCar.name}
                  onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Toyota Camry 2023"
                  required
                />
              </div>
              
              {/* Vehicle Type - Added from original form */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Car size={18} />
                  Vehicle Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={newCar.type}
                  onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. Sedan, SUV, Bus"
                  required
                />
              </div>
              
              {/* License Plate */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <CreditCard size={18} />
                  License Plate
                </label>
                <input
                  type="text"
                  name="plate"
                  value={newCar.plate}
                  onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. ABC-1234"
                  required
                />
              </div>
              
              {/* Driver Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  Assign Driver
                </label>
                <select
                  name="driverId"
                  value={newCar.driverId}
                  onChange={(e) => setNewCar({ ...newCar, driverId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Select a Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} - {driver.licenseNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Number of Seats */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  Number of Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  value={newCar.seats}
                  onChange={(e) => setNewCar({ ...newCar, seats: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Departure Date & Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={18} />
                  Departure Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              {/* Arrival Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Clock size={18} />
                  Arrival Time
                </label>
                <input
                  type="text"
                  name="arrivalTime"
                  value={newCar.arrivalTime}
                  onChange={(e) => setNewCar({ ...newCar, arrivalTime: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 5:30 PM"
                />
              </div>
              
              {/* Route */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={18} />
                  Route
                </label>
                <input
                  type="text"
                  name="route"
                  value={newCar.route}
                  onChange={(e) => setNewCar({ ...newCar, route: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. City Center - Airport"
                />
              </div>
              
              {/* Fuel Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Droplet size={18} />
                  Fuel Level
                </label>
                <input
                  type="text"
                  name="fuelLevel"
                  value={newCar.fuelLevel}
                  onChange={(e) => setNewCar({ ...newCar, fuelLevel: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 75%"
                />
              </div>
              
              {/* Last Service Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Wrench size={18} />
                  Last Service Date
                </label>
                <input
                  type="date"
                  name="lastService"
                  value={newCar.lastService}
                  onChange={(e) => setNewCar({ ...newCar, lastService: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          {/* Image Upload Section - Bottom Section */}
          <div className="mt-6 border-t pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Upload size={18} />
              Vehicle Image
            </label>
            <div className="flex items-center">
              <div className="w-full flex flex-col items-center">
                {imageUrl ? (
                  <div className="relative w-full h-40 mb-2">
                    <img 
                      src={imageUrl} 
                      alt="Vehicle" 
                      className="h-40 w-full object-cover rounded-md" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setNewCar({ ...newCar, imageUrl: '' });
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-indigo-500 rounded-md shadow-sm border border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                    <Upload size={24} />
                    <span className="mt-2 text-sm text-gray-600">Click to upload image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    {uploadLoading && <span className="mt-2 text-xs text-gray-500">Uploading...</span>}
                  </label>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-8 border-t pt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Uploading...' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleRegistrationForm;