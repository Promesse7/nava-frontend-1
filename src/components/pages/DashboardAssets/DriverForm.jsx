import React, { useState } from 'react';
import { X, User, CreditCard, Calendar, MapPin, Phone } from 'lucide-react';
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
        <form className="p-6 overflow-y-auto max-h-[80vh]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={newDriver.firstName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={newDriver.lastName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={newDriver.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 0798123456"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newDriver.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <CreditCard size={18} />
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={newDriver.licenseNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter license number"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={18} />
                  License Expiry Date
                </label>
                <input
                  type="date"
                  name="licenseExpiryDate"
                  value={newDriver.licenseExpiryDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={18} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newDriver.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <MapPin size={18} />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={newDriver.address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={18} />
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={newDriver.emergencyContactName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Phone size={18} />
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={newDriver.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. 0798123456"
                  required
                />
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
            >
              Save Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;