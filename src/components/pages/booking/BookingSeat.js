import React, { useEffect, useState } from 'react';
import { getAvailableSeats, updateSeatStatus } from "../../../services/fleetService";
import { db } from "../../../firebase"; // Firebase config
import { doc, getDoc } from "firebase/firestore";

const CarSeatBooking = ({ fleetId, userId, onSeatSelect }) => {
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

  const handleSeatSelect = (seatNumber) => {
    if (seats[seatNumber]?.status !== "booked") {
      setSelectedSeat(seatNumber);
      onSeatSelect(seatNumber);
    }
  };

  if (!fleetId) {
    return <p className="text-center py-4">Please select a fleet to book a seat.</p>;
  }

  if (loading) return (
    <div className="flex justify-center items-center h-48">
      <p className="text-gray-600">Loading seats...</p>
    </div>
  );

  // Convert seats object to array for easier mapping
  const seatArray = Object.entries(seats).map(([seatNumber, seat]) => ({
    id: seatNumber,
    number: seatNumber,
    status: seat.status,
    ...seat
  }));

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>

        <div className="relative w-full h-[100vh] bg-white rounded-lg border border-gray-300 overflow-hidden">
          {/* Car outline */}
          <svg viewBox="0 0 800 1500" className="w-full h-full">
            {/* Car body */}
            <path d="M100,200 L100,1500 L700,1500 L700,200 C700,150 650,100 600,100 L200,100 C150,100 100,150 100,200 Z"
              fill="none" stroke="#374151" strokeWidth="2" />

            <path d="M150,150 L150,100 L650,100 L650,150"
              fill="none" stroke="#374151" strokeWidth="2" />

            {/* Driver's seat */}
            <rect x="150" y="180" width="80" height="100" rx="10"
              fill="#d1d5db" stroke="#374151" strokeWidth="2" />

            {/* Steering wheel */}
            <circle cx="190" cy="230" r="20"
              fill="none" stroke="#374151" strokeWidth="2" />

            {/* Passenger seats - rendered dynamically below */}

            {/* Seats mapping */}
            {seatArray.map((seat) => {
              // Calculate position based on seat number
              // This is a simplified example - you'll need to adjust for your actual layout
              const seatNum = parseInt(seat.number);
              const row = Math.floor((seatNum - 1) / 3);
              const col = (seatNum - 1) % 3;

              const x = 280 + col * 120;
              const y = 180 + row * 120;

              // Get seat color based on status
              let fillColor = "#10b981"; // Available - green
              if (seat.status === "booked") {
                fillColor = "#ef4444"; // Booked - red
              } else if (selectedSeat === seat.number) {
                fillColor = "#3b82f6"; // Selected - blue
              }

              return (
                <g key={seat.id} onClick={() => handleSeatSelect(seat.number)}
                  className={`cursor-pointer ${seat.status === "booked" ? "opacity-80" : "hover:opacity-80"}`}
                  data-seat-number={seat.number}>
                  <rect x={x} y={y} width="80" height="100" rx="10"
                    fill={fillColor} stroke="#374151" strokeWidth="2" />
                  <text x={x + 40} y={y + 50}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontWeight="bold" fontSize="16">
                    {seat.number}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>


      <div className="mt-4">
        <p className="text-center">
          {selectedSeat ? `Seat ${selectedSeat} selected` : "Select a seat to continue"}
        </p>
      </div>
    </div>
  );
};

export default CarSeatBooking;