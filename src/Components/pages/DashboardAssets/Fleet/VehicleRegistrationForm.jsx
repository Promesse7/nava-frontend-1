// src/components/fleet/VehicleRegistrationForm.js
import React, { useState, useEffect } from 'react';
import { addVehicleToFleet } from '../../services/fleetService';
import { getAllDrivers } from '../../services/driverService';

function VehicleRegistrationForm() {
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    capacity: '',
    driverId: ''
  });
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available drivers when component mounts
    const fetchDrivers = async () => {
      try {
        const driversList = await getAllDrivers();
        setDrivers(driversList);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addVehicleToFleet(vehicle);
      alert('Vehicle registered successfully!');
      // Reset form
      setVehicle({
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        capacity: '',
        driverId: ''
      });
    } catch (error) {
      console.error("Error registering vehicle:", error);
      alert('Failed to register vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <h2>Register New Vehicle</h2>
      
      <div className="form-group">
        <label>Make</label>
        <input 
          type="text" 
          name="make" 
          value={vehicle.make} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Model</label>
        <input 
          type="text" 
          name="model" 
          value={vehicle.model} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Year</label>
        <input 
          type="number" 
          name="year" 
          value={vehicle.year} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>License Plate</label>
        <input 
          type="text" 
          name="licensePlate" 
          value={vehicle.licensePlate} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Seating Capacity</label>
        <input 
          type="number" 
          name="capacity" 
          value={vehicle.capacity} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Assign Driver</label>
        <select 
          name="driverId" 
          value={vehicle.driverId} 
          onChange={handleChange} 
          required
        >
          <option value="">Select a driver</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>
              {driver.name} - {driver.licenseNumber}
            </option>
          ))}
        </select>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register Vehicle'}
      </button>
    </form>
  );
}

export default VehicleRegistrationForm;