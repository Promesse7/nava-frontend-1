import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '../../hooks/useBookings';
import { getFleetByRoute, getAvailableRoutes } from '../../services/fleetService';
import { sendNotificationToAdmin } from '../../services/notificationService';

const BookingForm = () => {
  const [route, setRoute] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('');
  const [fleetOptions, setFleetOptions] = useState([]);
  const [fetchedSeats, setFetchedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [amount, setAmount] = useState(5000);
  const [seatLayout, setSeatLayout] = useState([]);
  const [bookingStatus, setBookingStatus] = useState(null);
  
  // Loading states
  const [loadingFleets, setLoadingFleets] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Error states
  const [fleetError, setFleetError] = useState('');
  const [seatError, setSeatError] = useState('');
  const [routeError, setRouteError] = useState("");
  
  const navigate = useNavigate();
  const { loading, error, availableSeats, makeBooking, fetchAvailableSeats } = useBooking();
  const [availableRoutes, setAvailableRoutes] = useState([]);

  // Load available routes on component mount
  useEffect(() => {
    const loadRoutes = async () => {
      setLoadingRoutes(true);
      setRouteError("");

      try {
        const routes = await getAvailableRoutes();
        setAvailableRoutes(routes);
      } catch (error) {
        setRouteError("Failed to load routes. Please try again.");
        console.error("Error loading routes:", error);
      } finally {
        setLoadingRoutes(false);
      }
    };

    loadRoutes();
  }, []);

  // Handle route change
  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setSelectedFleet(''); // Reset fleet when route changes
    setSelectedSeat(''); // Reset seat when route changes
    setFleetError('');
    setSeatError('');
    setSeatLayout([]);
  };

  // Handle fleet selection change
  const handleFleetChange = (fleetId) => {
    setSelectedFleet(fleetId);
    setSelectedSeat(''); // Reset seat when fleet changes
    setSeatError('');
  };
  
  // Handle departure date change
  const handleDateChange = (newDate) => {
    setDepartureDate(newDate);
    setSelectedSeat(''); // Reset seat when date changes
    setSeatError('');
  };
  
  // Load fleet options when route changes
  useEffect(() => {
    const loadFleetOptions = async () => {
      if (!route) {
        setFleetOptions([]);
        return;
      }
      
      setLoadingFleets(true);
      setFleetError('');
      
      try {
        const fleets = await getFleetByRoute(route);
        setFleetOptions(fleets);
        if (fleets.length === 0) {
          setFleetError('No vehicles available for this route');
        }
      } catch (err) {
        console.error("Error loading fleet options:", err);
        setFleetError('Failed to load vehicles. Please try again.');
        setFleetOptions([]);
      } finally {
        setLoadingFleets(false);
      }
    };
    
    loadFleetOptions();
  }, [route]);


useEffect(() => {
  if (fetchedSeats && fetchedSeats.length > 0) {
    const seatLayout = fetchedSeats.map(seat => ({
      number: seat,
      isAvailable: true, // Adjust this based on your requirements
    }));
    setSeatLayout(seatLayout);
  } else {
    console.log("No seats available");
  }
}, [fetchedSeats]); // Update when fetchedSeats changes

// Load available seats when fleet and departure date are selected
useEffect(() => {
  const loadAvailableSeats = async () => {
    if (!selectedFleet || !departureDate) {
      return;
    }
    
    setSeatError('');
    
    try {
      // The problem is here - fetchAvailableSeats is not returning the seats properly
      const seats = await fetchAvailableSeats(selectedFleet, new Date(departureDate));
      
      // If seats is undefined, we need to handle that case
      if (!seats) {
        console.error("No seats returned from fetchAvailableSeats");
        setSeatError('No seats available for this vehicle on the selected date.');
        return;
      }
      
      console.log("Fetched seats successfully:", seats);
      
      // Generate seat layout
      const selectedFleetObj = fleetOptions.find(fleet => fleet.id === selectedFleet);
      console.log("Selected fleet object:", selectedFleetObj);
      
      if (selectedFleetObj) {
        // Only map if seats is defined
        const seatLayoutArray = Array.isArray(seats) ? seats.map(seatNumber => ({
          number: parseInt(seatNumber),
          isAvailable: true
        })) : [];
        
        console.log("Generated seat layout:", seatLayoutArray);
        setSeatLayout(seatLayoutArray);
      } else {
        console.error("Could not find selected fleet in fleet options");
        setSeatError('Could not load seat layout. Please try selecting the vehicle again.');
      }
    } catch (err) {
      console.error("Error loading available seats:", err);
      setSelectedSeat('');
      setSeatError('No seat layout available for this vehicle. Please select a different vehicle or date.');
    }
  };
  
  loadAvailableSeats();
  
  // Rest of your code...
}, [selectedFleet, departureDate, fetchAvailableSeats, fleetOptions, loading]);
  // Direct seat selection handler
  const handleSeatSelection = (seatNumber) => {
    console.log("Selected seat:", seatNumber);
  
    // Ensure both seat.number and seatNumber are compared as strings
    const seatNumStr = seatNumber.toString();
  
    // Check if the seat is available and not already selected
    const seat = seatLayout.find(seat => seat.number.toString() === seatNumStr);
    if (seat && seat.isAvailable && seatNumStr !== selectedSeat) {
      setSelectedSeat(seatNumStr);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!route || !departureDate || !selectedFleet || !selectedSeat) {
      return;
    }
    
    setSubmitting(true);
    setBookingStatus('processing');
    
    try {
      // Make the booking
      const bookingId = await makeBooking(
        selectedFleet,
        route,
        new Date(departureDate),
        selectedSeat,
        amount
      );
      
      // Send notification to admin
      await sendNotificationToAdmin({
        type: 'NEW_BOOKING',
        bookingId,
        route,
        departureDate,
        fleetId: selectedFleet,
        seatNumber: selectedSeat,
        amount,
        status: 'PENDING_APPROVAL',
        timestamp: new Date().toISOString()
      });
      
      setBookingStatus('success');
      
      // Show success message and redirect
      setTimeout(() => {
        navigate(`/bookings/${bookingId}`);
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingStatus('error');
      setTimeout(() => {
        setBookingStatus(null);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };
 
  // Determine if form is in loading state
  const isLoading = loading || loadingFleets || loadingRoutes || submitting;
  
  // Determine if form is submittable
  const canSubmit = route && departureDate && selectedFleet && selectedSeat && !isLoading;

  // Render seat layout
  // const renderSeatLayout = () => {
  //   if (!selectedFleet || !departureDate || seatLayout.length === 0) {
  //     console.log("Seat layout not ready. Checking data:");
  //     console.log("Selected Fleet:", selectedFleet);
  //     console.log("Departure Date:", departureDate);
  //     console.log("Seat Layout:", seatLayout);
  //     return null;
  //   }
    
  //   if (seatLayout.length === 0) {
  //     return <div>Loading seats...</div>;
  //   }
    
  //   console.log("Rendering seat layout:", seatLayout);
    
  //   return (
  //     <div className="mt-6">
  //       <h3 className="text-lg font-medium text-gray-900 mb-3">Select Your Seat</h3>
  //       <div className="grid grid-cols-4 gap-3">
  //         {seatLayout.map((seat) => (
  //           <button
  //             key={seat.number}
  //             type="button"
  //             disabled={!seat.isAvailable}
  //             onClick={() => handleSeatSelection(seat.number)}
  //             className={`
  //               relative p-3 border rounded-md flex items-center justify-center
  //               ${seat.isAvailable ? 'hover:bg-gray-100 cursor-pointer' : 'bg-gray-200 cursor-not-allowed'}
  //               ${selectedSeat === seat.number.toString() ? 'bg-black text-white hover:bg-gray-800' : ''}
  //             `}
  //           >
  //             <span className="font-medium">{seat.number}</span>
  //             {!seat.isAvailable && <span className="absolute inset-0 flex items-center justify-center text-red-600 text-xs">Booked</span>}
  //           </button>
  //         ))}
  //       </div>
  //       <p className="mt-2 text-sm text-gray-500">Click on an available seat to select it</p>
  //     </div>
  //   );
  // };
  

  const renderSeatLayout = () => {
    return seatLayout.map((seat) => (
      <div
        key={seat.number}
        className={`seat ${seat.isAvailable ? 'available' : 'unavailable'}`}
        onClick={() => handleSeatSelection(seat.number)}
      >
        Seat {seat.number}
      </div>
    ));
  };
  
  
  // Render status message
  const renderStatusMessage = () => {
    if (!bookingStatus) return null;
    
    switch (bookingStatus) {
      case 'processing':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-black rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Processing your booking...</p>
              <p className="text-sm text-gray-500">Please wait while we confirm your reservation</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium">Booking Successful!</p>
              <p className="text-sm text-gray-500">Your booking has been sent to admin for approval</p>
              <p className="text-sm text-gray-500">You will be redirected to your booking details...</p>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg font-medium">Booking Failed</p>
              <p className="text-sm text-gray-500">There was an error processing your booking. Please try again.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
 
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      {renderStatusMessage()}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-black text-white py-4 px-6 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-wider">BOOK YOUR RIDE</h2>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center" role="status">
              <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading booking data...</p>
              <span className="sr-only">Loading</span>
            </div>
          </div>
        )}
        
        {!loading && (
          <div className="p-6 overflow-auto max-h-screen">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-900 text-red-900 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6"> 
              {/* Route selection */}
              <div className="space-y-2">
                <label htmlFor="route" className="block text-sm font-medium text-gray-700">Route</label>
                <div className="relative">
                  <select 
                    id="route"
                    value={route} 
                    onChange={(e) => handleRouteChange(e.target.value)}
                    required
                    className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none ${loadingRoutes ? 'bg-gray-100 cursor-wait' : ''}`}
                    aria-describedby={routeError ? "route-error" : undefined}
                    disabled={loadingRoutes}
                  >
                    <option value="">{loadingRoutes ? "Loading routes..." : "Select a route"}</option>
                    {availableRoutes.map((routeOption) => (
                      <option key={routeOption} value={routeOption}>{routeOption}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                {routeError && <p id="route-error" className="mt-1 text-sm text-red-600">{routeError}</p>}
              </div>

              {/* Departure date selection */}
              <div className="space-y-2">
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Departure Date</label>
                <input 
                  id="departureDate"
                  type="datetime-local" 
                  value={departureDate} 
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none"
                />
              </div>
              
              {/* Fleet selection */}
              <div className="space-y-2">
                <label htmlFor="fleet" className="block text-sm font-medium text-gray-700">Vehicle</label>
                <div className="relative">
                  <select 
                    id="fleet"
                    value={selectedFleet} 
                    onChange={(e) => handleFleetChange(e.target.value)}
                    required
                    className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none ${loadingFleets ? 'bg-gray-100 cursor-wait' : ''}`}
                    aria-describedby={fleetError ? "fleet-error" : undefined}
                    disabled={!route || loadingFleets}
                  >
                    <option value="">{loadingFleets ? "Loading vehicles..." : "Select a vehicle"}</option>
                    {fleetOptions.map((fleet) => (
                      <option key={fleet.id} value={fleet.id}>
                        {fleet.name} - {fleet.type} ({fleet.seatCapacity} seats)
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                {fleetError && <p id="fleet-error" className="mt-1 text-sm text-red-600">{fleetError}</p>}
              </div>
{/* Seat selection */}
<div className="seat-selection">
  {seatLayout.length === 0 ? (
    <div>Loading seats...</div> // Show a loading message if no seats are available
  ) : (
    renderSeatLayout() // Render the seat layout if it's available
  )}
  
  {/* Display seat error if any */}
  {seatError && (
    <p id="seat-error" className="mt-1 text-sm text-red-600">
      {seatError}
    </p>
  )}
</div>

              {/* Amount display */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input 
                  id="amount"
                  type="text" 
                  value={`₦${amount.toLocaleString()}`} 
                  readOnly
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 border bg-gray-50 rounded-md appearance-none"
                />
                <p className="text-xs text-gray-500">Standard fare for all routes</p>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;