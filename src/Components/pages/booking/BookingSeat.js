import React, { useEffect, useState } from 'react';
import { getAvailableSeats, updateSeatStatus } from "../../../services/fleetService";
import { db } from "../../../firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore";

const SeatBooking = ({ fleetId, userId, onSeatSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState("");
  const [seats, setSeats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fleetId) {
      setLoading(false);
      return;
    }

    const fetchSeats = async () => {
      try {
        const fleetRef = doc(db, "fleet", fleetId);
        const fleetSnap = await getDoc(fleetRef);

        if (fleetSnap.exists()) {
          const fleetData = fleetSnap.data();

          if (fleetData?.seats?.layout) {
            setSeats(fleetData.seats.layout);
          } else {
            console.warn("No seat layout found for this fleet.");
            setSeats({});
          }
        } else {
          console.error("Fleet document not found.");
          setSeats({});
        }
      } catch (error) {
        console.error("Error fetching seat layout:", error);
        setSeats({});
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [fleetId]);

  const handleSeatChange = (e, seatNumber) => {
    e.preventDefault(); // Prevent form submission
    setSelectedSeat(seatNumber);
    onSeatSelect(seatNumber);  // Passing selected seat to parent
  };

  if (!fleetId) {
    return <p>Please select a fleet to book a seat.</p>;
  }

  if (loading) return <p>Loading seats...</p>;

  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {Object.entries(seats).map(([seatNumber, seat]) => (
        <button
          key={seatNumber}
          type="button" // Explicitly set type to button to prevent form submission
          onClick={(e) => handleSeatChange(e, seatNumber)} // Pass the event and seat number
          disabled={seat.status === "booked"}
          className={`p-4 border rounded ${
            seat.status === "booked" 
              ? "bg-red-500 text-white" 
              : selectedSeat === seatNumber
                ? "bg-blue-500 text-white" // Highlight selected seat
                : "bg-green-500 text-white"
          }`}
        >
          {seatNumber}
        </button>
      ))}
    </div>
  );
};

export default SeatBooking;