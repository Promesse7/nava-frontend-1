import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../../../firebase'; // Ensure this path is correct
import { collection, addDoc } from 'firebase/firestore';

const DriverForm = ({ showPopup, setShowPopup }) => {
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    dateOfBirth: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add new driver to Firestore
      const docRef = await addDoc(collection(db, 'drivers'), {
        ...newDriver,
        createdAt: new Date()
      });

      console.log('Driver added with ID: ', docRef.id);
      
      // Reset form and close popup
      setNewDriver({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        licenseNumber: '',
        licenseExpiryDate: '',
        dateOfBirth: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
      });
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding driver: ', error);
      alert('Failed to add driver. Please try again.');
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2 relative">
        <button 
          onClick={() => setShowPopup(false)} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold mb-4">Add New Driver</h2>
        <form 
          className='flex flex-col h-[80vh] overflow-y-auto' 
          onSubmit={handleSubmit}
        >
          {Object.keys(newDriver).map((key) => (
            <div key={key} className="mt-4">
              <label className="block text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={
                  key.includes('Date') || key === 'dateOfBirth' 
                    ? 'date' 
                    : key === 'email' 
                    ? 'email' 
                    : 'text'
                }
                name={key}
                value={newDriver[key]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          ))}
          <button 
            type="submit" 
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Driver
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;