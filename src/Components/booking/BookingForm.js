import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '../../hooks/useBookings';
import { getFleetByRoute, getAvailableRoutes } from '../../services/fleetService';

const BookingForm = () => {
  const [route, setRoute] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('');
  const [fleetOptions, setFleetOptions] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [amount, setAmount] = useState(5000);
  
  // Loading states
  const [loadingFleets, setLoadingFleets] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  
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


  // Load available seats when fleet and departure date are selected
useEffect(() => {
  const loadAvailableSeats = async () => {
    if (!selectedFleet || !departureDate) {
      return;
    }
    
    setSeatError('');
    
    try {
      await fetchAvailableSeats(selectedFleet, new Date(departureDate));
    } catch (err) {
      console.error("Error loading available seats:", err);
      setSelectedSeat('');
      setSeatError('No seat layout available for this vehicle. Please select a different vehicle or date.');
    }
  };
  
  loadAvailableSeats();
  
  // Safety timeout to prevent infinite loading
  const safetyTimeout = setTimeout(() => {
    if (loading) {
      console.log("Loading timeout triggered");
      // Force loading to false if it's been too long
      // This would require making loading a local state as well
    }
  }, 10000); // 10 seconds timeout
  
  return () => clearTimeout(safetyTimeout);
}, [selectedFleet, departureDate, fetchAvailableSeats]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form is already validated via button disabled state, but double-check
    if (!route || !departureDate || !selectedFleet || !selectedSeat) {
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
      alert("Booking failed. Please try again.");
    }
  };
 
  // Determine if form is in loading state
  const isLoading = loading || loadingFleets || loadingRoutes;
  
  // Determine if form is submittable
  const canSubmit = route && departureDate && selectedFleet && selectedSeat && !isLoading;
 
  return (
    <div className="h-full w-full flex items-center justify-center p-4 ">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
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
                  className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              
              {/* Fleet selection */}
              <div className="space-y-2">
                <label htmlFor="fleet" className="block text-sm font-medium text-gray-700">Select Vehicle</label>
                <div className="relative">
                  <select 
                    id="fleet"
                    value={selectedFleet} 
                    onChange={(e) => handleFleetChange(e.target.value)}
                    required
                    disabled={!route || fleetOptions.length === 0 || loadingFleets}
                    className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md appearance-none transition-all ${(!route || fleetOptions.length === 0 || loadingFleets) ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    aria-describedby={fleetError ? "fleet-error" : undefined}
                  >
                    <option value="">
                      {loadingFleets ? 'Loading vehicles...' : 'Select a vehicle'}
                    </option>
                    {fleetOptions.map((fleet) => (
                      <option key={fleet.id} value={fleet.id}>
                        {fleet.name} - {fleet.plate}
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
              <div className="space-y-2">
                <label htmlFor="seat" className="block text-sm font-medium text-gray-700">Select Seat</label>
                <div className="relative">
                  <select 
                    id="seat"
                    value={selectedSeat} 
                    onChange={(e) => setSelectedSeat(e.target.value)}
                    required
                    disabled={!selectedFleet || !departureDate || loading}
                    className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md appearance-none transition-all ${(!selectedFleet || !departureDate || loading) ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    aria-describedby={seatError ? "seat-error" : undefined}
                  >
                    <option value="">
                      {loading ? 'Loading seats...' : 'Select a seat'}
                    </option>
                    {(Array.isArray(availableSeats) && availableSeats.length > 0) ? (
                      availableSeats.map((seat) => (
                        <option key={seat} value={seat}>
                          Seat {seat}
                        </option>
                      ))
                    ) : (
                      selectedFleet && !loading && <option value="" disabled>No seats available</option>
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                {seatError && <p id="seat-error" className="mt-1 text-sm text-red-600">{seatError}</p>}
              </div>
              
              {/* Amount */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (RWF)</label>
                <input 
                  id="amount"
                  type="number" 
                  value={amount} 
                  readOnly
                  className="block w-full px-3 py-3 border border-gray-300 bg-gray-50 rounded-md cursor-not-allowed"
                  aria-label="Fixed price amount"
                />
                <p className="text-xs text-gray-500">Fixed price for all routes</p>
              </div>
      
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={!canSubmit}
                className={`w-full py-3 px-4 flex justify-center items-center text-white font-medium rounded-md transition-all ${!canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                aria-disabled={!canSubmit}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                    <span className="sr-only">Processing booking request</span>               
                  </>
                ) : "BOOK NOW"}
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>All bookings are subject to availability</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;