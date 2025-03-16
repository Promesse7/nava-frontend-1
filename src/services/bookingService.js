import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { getFleetById } from "./fleetService";
import { getDriverById } from "./driverService";

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const bookingNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const bookingsRef = collection(db, "bookings");
    
    const newBooking = {
      userId: bookingData.userId,
      fleetId: bookingData.fleetId,
      route: bookingData.route,
      departureDate: bookingData.departureDate, 
      seatNumber: bookingData.seatNumber,
      status: "pending",
      paymentStatus: "pending",
      amount: bookingData.amount,
      bookingNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(bookingsRef, newBooking);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking: ", error);
    throw error;
  }
};

// Get all bookings for a user
export const getUserBookings = async (userId) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const bookings = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const booking = { id: doc.id, ...doc.data() };
        
        if (booking.createdAt) {
          booking.createdAt = booking.createdAt.toDate().toISOString();
        }
        
        if (booking.vehicleId) {
          try {
            booking.vehicleDetails = await getFleetById(booking.vehicleId);
            if (booking.vehicleDetails.driverId) {
              booking.driverDetails = await getDriverById(booking.vehicleDetails.driverId);
            }
          } catch (error) {
            console.error(`Error fetching details for booking ${booking.id}:`, error);
          }
        }
        
        return booking;
      })
    );
    
    return bookings;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

// Get a specific booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      throw new Error("Booking not found");
    }
    
    const booking = { id: bookingSnap.id, ...bookingSnap.data() };
    
    if (booking.vehicleId) {
      booking.vehicleDetails = await getFleetById(booking.vehicleId);
      if (booking.vehicleDetails.driverId) {
        booking.driverDetails = await getDriverById(booking.vehicleDetails.driverId);
      }
    }
    
    return booking;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

export const getAllBookings = async () => {
  const bookingsRef = collection(db, "bookings");
  const snapshot = await getDocs(bookingsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (bookingId, paymentStatus) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      paymentStatus,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};
