import { useState } from 'react';
import { createBooking, getUserBookings, updateBookingStatus } from '../services/bookingService';
import { getAvailableSeats, updateSeatStatus } from '../services/fleetService';
import { auth } from '../firebase';

const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  
  // Create a new booking
  const makeBooking = async (fleetId, route, departureDate, seatNumber, amount) => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = auth.currentUser.uid;
      
      // Create the booking
      const bookingId = await createBooking({
        userId,
        fleetId,
        route,
        departureDate,
        seatNumber,
        amount
      });
      
      // Update the seat status
      await updateSeatStatus(fleetId, seatNumber, "booked", userId);
      
      setLoading(false);
      return bookingId;
    } catch (err) {
      setError(err.message);
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
  
  // Get available seats for a vehicle
  const fetchAvailableSeats = async (fleetId) => {
    setLoading(true);
    setError(null);
    
    try {
      const seats = await getAvailableSeats(fleetId);
      setAvailableSeats(seats.availableSeats);
      setLoading(false);
      return seats;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
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
    cancelBooking
  };
};

export default useBooking;