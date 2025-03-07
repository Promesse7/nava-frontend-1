import { 
    collection, 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    query,
    where,
    getDocs
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  // Get a fleet vehicle by ID
  export const getFleetById = async (fleetId) => {
    try {
      const fleetRef = doc(db, "fleet", fleetId);
      const fleetSnap = await getDoc(fleetRef);
      
      if (fleetSnap.exists()) {
        return { id: fleetSnap.id, ...fleetSnap.data() };
      } else {
        throw new Error("Vehicle not found");
      }
    } catch (error) {
      console.error("Error getting fleet: ", error);
      throw error;
    }
  };
  
  // Get fleet vehicles by route
  export const getFleetByRoute = async (route) => {
    try {
      const fleetRef = collection(db, "fleet");
      const q = query(fleetRef, where("route", "==", route));
      const querySnapshot = await getDocs(q);
      
      const fleets = [];
      querySnapshot.forEach((doc) => {
        fleets.push({ id: doc.id, ...doc.data() });
      });
      
      return fleets;
    } catch (error) {
      console.error("Error getting fleet by route: ", error);
      throw error;
    }
  };
  
  // Update seat status (when booking is made or cancelled)
  export const updateSeatStatus = async (fleetId, seatNumber, status, userId = null) => {
    try {
      const fleetRef = doc(db, "fleet", fleetId);
      
      // Prepare the update object
      const seatUpdate = {};
      
      // Update the specific seat in the layout
      seatUpdate[`seats.layout.${seatNumber}.status`] = status;
      
      if (status === "booked" && userId) {
        seatUpdate[`seats.layout.${seatNumber}.bookedBy`] = userId;
        // Decrement available seats
        seatUpdate["seats.available"] = updateDoc.FieldValue.increment(-1);
      } else if (status === "available") {
        seatUpdate[`seats.layout.${seatNumber}.bookedBy`] = null;
        // Increment available seats
        seatUpdate["seats.available"] = updateDoc.FieldValue.increment(1);
      }
      
      await updateDoc(fleetRef, seatUpdate);
      return true;
    } catch (error) {
      console.error("Error updating seat status: ", error);
      throw error;
    }
  };
  
  // Get available seats for a vehicle
  export const getAvailableSeats = async (fleetId) => {
    try {
      const fleet = await getFleetById(fleetId);
      
      if (!fleet.seats || !fleet.seats.layout) {
        throw new Error("Seat layout not found for this vehicle");
      }
      
      // Find available seats
      const availableSeats = Object.entries(fleet.seats.layout)
        .filter(([_, seatData]) => seatData.status === "available")
        .map(([seatNumber, _]) => seatNumber);
      
      return {
        totalSeats: fleet.seats.total,
        availableSeats: availableSeats,
        availableCount: fleet.seats.available || availableSeats.length
      };
    } catch (error) {
      console.error("Error getting available seats: ", error);
      throw error;
    }
  };