import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '../../hooks/useBookings';
import { createBooking } from "../../services/bookingService";
import { getFleetByRoute } from '../../services/fleetService';

const BookingForm = () => {
  const [route, setRoute] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('');
  const [fleetOptions, setFleetOptions] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [amount, setAmount] = useState(5000);
  const [seatNumber, setSeatNumber] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  const { loading, error, availableSeats, makeBooking, fetchAvailableSeats } = useBooking();
  
  // Load fleet options when route changes
  useEffect(() => {
    const loadFleetOptions = async () => {
      if (route) {
        try {
          const fleets = await getFleetByRoute(route);
          setFleetOptions(fleets);
        } catch (err) {
          console.error("Error loading fleet options:", err);
        }
      }
    };
    
    loadFleetOptions();
  }, [route]);
  
  // Load available seats when fleet is selected
  useEffect(() => {
    const loadAvailableSeats = async () => {
      if (selectedFleet) {
        try {
          await fetchAvailableSeats(selectedFleet);
        } catch (err) {
          console.error("Error loading available seats:", err);
        }
      }
    };
    
    loadAvailableSeats();
  }, [selectedFleet, fetchAvailableSeats]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!route || !departureDate || !selectedFleet || !selectedSeat) {
      alert("Please fill in all fields");
      return;
    }
    
    try {
      const bookingId = await makeBooking(
        selectedFleet,
        route,
        new Date(departureDate),
        selectedSeat,
        amount
      );
      
      alert("Booking successful!");
      navigate(`/bookings/${bookingId}`);
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };
 
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="booking-form">
      <h2>Book a Ride</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Route</label>
          <select 
            value={route} 
            onChange={(e) => setRoute(e.target.value)}
            required
          >
            <option value="">Select a route</option>
            <option value="Muhanga-Rubavu">Muhanga-Rubavu</option>
            <option value="Kigali-Musanze">Kigali-Musanze</option>
            {/* Add more routes as needed */}
          </select>
        </div>
        
        <div className="form-group">
          <label>Departure Date</label>
          <input 
            type="datetime-local" 
            value={departureDate} 
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Select Vehicle</label>
          <select 
            value={selectedFleet} 
            onChange={(e) => setSelectedFleet(e.target.value)}
            required
            disabled={fleetOptions.length === 0}
          >
            <option value="">Select a vehicle</option>
            {fleetOptions.map((fleet) => (
              <option key={fleet.id} value={fleet.id}>
                {fleet.name} - {fleet.plate}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Select Seat</label>
          <select 
            value={selectedSeat} 
            onChange={(e) => setSelectedSeat(e.target.value)}
            required
            disabled={!selectedFleet}
          >
            <option value="">Select a seat</option>
            {availableSeats.map((seat) => (
              <option key={seat} value={seat}>
                Seat {seat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount (RWF)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            readOnly
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !route || !departureDate || !selectedFleet || !selectedSeat}
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;