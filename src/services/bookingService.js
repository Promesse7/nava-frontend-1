import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    query, 
    where, 
    serverTimestamp 
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  // Create a new booking
  export const createBooking = async (bookingData) => {
    try {
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
  
  // Get a booking by ID
  export const getBookingById = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        return { id: bookingSnap.id, ...bookingSnap.data() };
      } else {
        throw new Error("Booking not found");
      }
    } catch (error) {
      console.error("Error getting booking: ", error);
      throw error;
    }
  };
  
  // Get all bookings for a user
  export const getUserBookings = async (userId) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      
      return bookings;
    } catch (error) {
      console.error("Error getting user bookings: ", error);
      throw error;
    }
  };
  
  // Update booking status
  export const updateBookingStatus = async (bookingId, status) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      
      await updateDoc(bookingRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating booking status: ", error);
      throw error;
    }
  };
  
  // Update payment status
  export const updatePaymentStatus = async (bookingId, paymentStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      
      await updateDoc(bookingRef, {
        paymentStatus: paymentStatus,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error("Error updating payment status: ", error);
      throw error;
    }
  };