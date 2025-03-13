import { 
  collection, 
  deleteDoc,
  doc,
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  query,
  where,
  getDocs,
  setDoc,
  increment
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

// Add or update seat layout for a vehicle
export const addSeatLayout = async (fleetId, totalSeats = 16) => {
  try {
    const fleetRef = doc(db, "fleet", fleetId);
    const fleetSnap = await getDoc(fleetRef);
    
    if (!fleetSnap.exists()) {
      throw new Error("Vehicle not found");
    }
    
    // Create seat layout object
    const layout = {};
    for (let i = 1; i <= totalSeats; i++) {
      // Convert number to string for Firebase keys
      const seatNumber = i.toString();
      layout[seatNumber] = {
        status: "available",
        bookedBy: null
      };
    }
    
    // Update the fleet document
    await updateDoc(fleetRef, {
      "seats": {
        total: totalSeats,
        available: totalSeats,
        layout: layout
      }
    });
    
    return { success: true, message: `Seat layout with ${totalSeats} seats added to vehicle` };
  } catch (error) {
    console.error("Error adding seat layout: ", error);
    throw error;
  }
};

// Update seat status (when booking is made or cancelled)
export const updateSeatStatus = async (fleetId, seatNumber, status, userId = null) => {
  if (!["booked", "available"].includes(status)) {
    throw new Error("Invalid seat status. Must be 'booked' or 'available'.");
  }

  if (status === "booked" && !userId) {
    throw new Error("User ID is required when booking a seat.");
  }

  try {
    const fleetRef = doc(db, "fleet", fleetId);
    const seatUpdate = {};

    seatUpdate[`seats.layout.${seatNumber}.status`] = status;

    if (status === "booked" && userId) {
      seatUpdate[`seats.layout.${seatNumber}.bookedBy`] = userId;
      seatUpdate["seats.available"] = increment(-1);
    } else if (status === "available") {
      seatUpdate[`seats.layout.${seatNumber}.bookedBy`] = null;
      seatUpdate["seats.available"] = increment(1);
    }

    await updateDoc(fleetRef, seatUpdate);
    return true;
  } catch (error) {
    console.error("Error updating seat status: ", error);
    throw error;
  }
};

// If seat layout doesn't exist, automatically create a default one
export const ensureSeatLayout = async (fleetId, totalSeats = 16) => {
  try {
    const fleetRef = doc(db, "fleet", fleetId);
    const fleetSnap = await getDoc(fleetRef);

    if (!fleetSnap.exists()) {
      throw new Error("Vehicle not found");
    }

    // Check if seats exist, if not create the default layout
    const fleetData = fleetSnap.data();
    if (!fleetData.seats || !fleetData.seats.layout) {
      await addSeatLayout(fleetId, totalSeats);
    }

    return { success: true, message: "Seat layout ensured" };
  } catch (error) {
    console.error("Error ensuring seat layout: ", error);
    throw error;
  }
};


// Get available seats for a vehicle
export const getAvailableSeats = async (fleetId) => {
  try {
    const fleet = await getFleetById(fleetId);

    if (!fleet || !fleet.seats) {
      throw new Error("Fleet data not found or is invalid.");
    }

    // If seat layout doesn't exist, create a default layout
    if (!fleet.seats.layout) {
      console.warn(`No seat layout found for fleet ID ${fleetId}. Creating a default layout...`);
      
      await addSeatLayout(fleetId, 16); // Creates a default layout with 16 seats
      const updatedFleet = await getFleetById(fleetId);
      if (!updatedFleet.seats?.layout) {
        throw new Error("Failed to create a seat layout for this vehicle.");
      }

      return getAvailableSeats(fleetId); // Retry fetching after layout creation
    }

    // Find available seats
    const availableSeats = Object.entries(fleet.seats.layout)
      .filter(([_, seatData]) => seatData.status === "available")
      .map(([seatNumber, _]) => seatNumber);

    console.log("Available seats:", availableSeats); // Debugging log to check available seats
    return availableSeats.length > 0 ? availableSeats : [];

  } catch (error) {
    console.error("Error getting available seats:", error.message);
    throw error;
  }
};



// Get all fleet vehicles
export const getAllVehicles = async () => {
  try {
    const fleetRef = collection(db, "fleet");
    const querySnapshot = await getDocs(fleetRef);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,  // ✅ Ensure Firestore's auto-generated ID is included
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all vehicles:", error);
    throw error;
  }
};

// Function to delete a vehicle
export const deleteVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) {
      throw new Error("Invalid vehicle ID");
    }

    const vehicleRef = doc(db, "fleet", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (!vehicleSnap.exists()) {
      throw new Error("Vehicle not found in database");
    }

    await deleteDoc(vehicleRef);
    return true;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

// Get all available routes from the fleet collection
export const getAvailableRoutes = async () => {
  try {
    const fleetRef = collection(db, "fleet");
    const querySnapshot = await getDocs(fleetRef);

    const routesSet = new Set();
    querySnapshot.forEach((doc) => {
      const route = doc.data().route;
      if (route) {
        routesSet.add(route);
      }
    });

    const routesArray = Array.from(routesSet);
    console.log("Available Routes:", routesArray);
    return routesArray;
  } catch (error) {
    console.error("Error getting available routes:", error);
    return []; // Return an empty array on error
  }
};

