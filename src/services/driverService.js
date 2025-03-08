// src/services/driverService.js
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    addDoc, 
    updateDoc, 
    query, 
    where 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Get all drivers for dropdown selection
  export const getAllDrivers = async () => {
    const driversRef = collection(db, 'drivers');
    const snapshot = await getDocs(driversRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };
  
  // Get driver by ID
  export const getDriverById = async (driverId) => {
    const driverRef = doc(db, 'drivers', driverId);
    const driverDoc = await getDoc(driverRef);
    
    if (!driverDoc.exists()) {
      throw new Error('Driver not found');
    }
    
    return {
      id: driverDoc.id,
      ...driverDoc.data()
    };
  };
  
  // Get driver with their assigned vehicles
  export const getDriverWithVehicles = async (driverId) => {
    const driver = await getDriverById(driverId);
    
    // If driver has assigned vehicles, fetch them
    if (driver.assignedVehicles && driver.assignedVehicles.length > 0) {
      const vehicles = await Promise.all(
        driver.assignedVehicles.map(async (vehicleId) => {
          const vehicleRef = doc(db, 'vehicles', vehicleId);
          const vehicleDoc = await getDoc(vehicleRef);
          
          if (vehicleDoc.exists()) {
            return {
              id: vehicleDoc.id,
              ...vehicleDoc.data()
            };
          }
          return null;
        })
      );
      
      // Filter out any null values (in case a vehicle was deleted)
      driver.vehicles = vehicles.filter(v => v !== null);
    }
    
    return driver;
  };