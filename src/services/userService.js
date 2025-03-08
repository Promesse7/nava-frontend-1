import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X } from 'lucide-react'; // Assuming you're using lucide-react

const VehicleEntryForm = () => {
  const [showPopup, setShowPopup] = useState(false);
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





  return (
    <div>
      <button 
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add New Vehicle
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex h-screen items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/2 relative">
            <button 
              onClick={() => setShowPopup(false)} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">Add New Car</h2>
            <form className='flex flex-col h-[80vh] overflow-y-auto' onSubmit={handleSubmit}>
              {Object.keys(newCar).map((key) => (
                <div key={key} className="mt-4">
                  <label className="block text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === 'seats' ? (
                    <input
                      type="number"
                      name={key}
                      value={newCar[key]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      min="1"
                      placeholder="Enter number of seats"
                      required
                    />
                  ) : key === 'status' ? (
                    <select
                      name={key}
                      value={newCar[key]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="out-of-service">Out of Service</option>
                    </select>
                  ) : key === 'route' ? (
                    <select
                      name={key}
                      value={newCar[key]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Select a route</option>
                      <option value="Muhanga-Rubavu">Muhanga-Rubavu</option>
                      <option value="Kigali-Musanze">Kigali-Musanze</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={newCar[key]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  )}
                </div>
              ))}
              <button 
                type="submit" 
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save Car
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleEntryForm;