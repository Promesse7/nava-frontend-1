import { useState } from "react";
import {
  createBooking,
  getUserBookings,
  updateBookingStatus,
} from "../services/bookingService";
import { getAvailableSeats, updateSeatStatus } from "../services/fleetService";
import { auth } from "../firebase";

const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatError, setSeatError] = useState("");

  // Create a new booking
  const makeBooking = async (
    fleetId,
    route,
    departureDate,
    seatNumber,
    amount,
    customerInfo = null // Add parameter for customer info
  ) => {
    setLoading(true);
    setError(null);
    console.log("Starting makeBooking with:", { fleetId, route, departureDate, amount });
  
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
  
      console.log("Creating booking for user:", userId);
      
      // Create the booking with customer info
      const bookingId = await createBooking({
        userId,
        fleetId,
        route,
        departureDate,
        seatNumber,
        amount,
        customerInfo, // Add customer info to booking data
        status: "PENDING_APPROVAL",
        createdAt: new Date().toISOString()
      });
      
      console.log("Booking created successfully with ID:", bookingId);
  
      // Only update seat status if a specific seat was selected
      if (seatNumber) {
        console.log("Updating seat status:", seatNumber);
        await updateSeatStatus(fleetId, seatNumber, "booked", userId);
        console.log("Seat status updated successfully");
      }
  
      setLoading(false);
      return bookingId;
    } catch (err) {
      console.error("Error in makeBooking:", err);
      setError(err.message || "Failed to create booking");
      setLoading(false);
      throw err;
    }
  };

  // Get user's bookings
  const fetchUserBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = auth.currentUser.uid;
      const userBookings = await getUserBookings(userId);
      setBookings(userBookings);
      setLoading(false);
      return userBookings;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const fetchAvailableSeats = async (fleetId, date) => {
    setLoading(true); // Start loading

    try {
      // Your logic to get available seats (adjust according to how you're fetching the data)
      const seats = await getAvailableSeats(fleetId); // Assuming getAvailableSeats is returning seat data

      console.log("Fetched seats:", seats); // Logs the seat data

      // Ensure you're returning the fetched seats as per the second block structure
      if (seats.length === 0) {
        setSeatError("No available seats for this vehicle.");
        setAvailableSeats([]); // Clear available seats
      } else {
        setAvailableSeats(seats); // Set the available seats to state
        setSeatError(""); // Clear any previous errors
      }

      return seats; // Return the seats, following the structure in the second block
    } catch (error) {
      console.error("Error fetching seats:", error.message);
      setAvailableSeats([]); // Clear seats in case of error
      setSeatError("No seat data received."); // Display error message
      throw error; // Ensure the error is thrown for further handling
    } finally {
      setLoading(false); // Set loading to false after the operation is complete
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId, fleetId, seatNumber) => {
    setLoading(true);
    setError(null);

    try {
      // Update booking status
      await updateBookingStatus(bookingId, "cancelled");

      // Release the seat
      await updateSeatStatus(fleetId, seatNumber, "available");

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    bookings,
    availableSeats,
    makeBooking,
    fetchUserBookings,
    fetchAvailableSeats,
    cancelBooking,
  };
};

export default useBooking;
