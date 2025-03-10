import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBooking from '../../hooks/useBookings';
import { getFleetByRoute, getAvailableSeats } from '../../services/fleetService';

const BookingForm = () => {
  const [route, setRoute] = useState(''); 
  const [departureDate, setDepartureDate] = useState('');
  const [selectedFleet, setSelectedFleet] = useState('');
  const [fleetOptions, setFleetOptions] = useState([]);
  const [availableRoutes, setAvailableRoutes] = useState([]); // Added state to track available routes based on the fleet
  const [selectedSeat, setSelectedSeat] = useState('');
  const [amount, setAmount] = useState(5000);
  const [loadingFleets, setLoadingFleets] = useState(false);
  const [fleetError, setFleetError] = useState('');
  const [seatError, setSeatError] = useState('');
  const navigate = useNavigate();
  const { loading, error, availableSeats, makeBooking, fetchAvailableSeats } = useBooking();

  // Handle route change
  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setSelectedFleet(''); // Reset fleet when route changes
    setSelectedSeat(''); // Reset seat when route changes
  };

  // Handle fleet selection change
  const handleFleetChange = (fleetId) => {
    setSelectedFleet(fleetId);
    setRoute(''); // Reset route when fleet changes
    setAvailableRoutes(getRoutesByFleet(fleetId)); // Filter available routes by fleet
    setSelectedSeat(''); // Reset seat when fleet changes
  };

  // Get routes available for the selected fleet (this could be a predefined mapping based on your fleet data)
  const getRoutesByFleet = (fleetId) => {
      return fleetRoutes[fleetId] || [];
  };

  // Load fleet options when route changes
  useEffect(() => {
    const loadFleetOptions = async () => {
      if (route) {
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
        } finally {
          setLoadingFleets(false);
        }
      } else {
        setFleetOptions([]);
      }
    };
    
    loadFleetOptions();
  }, [route]);

  // Load available seats when fleet and departure date are selected
  useEffect(() => {
    const loadAvailableSeats = async () => {
      if (selectedFleet && departureDate) {
        try {
          await fetchAvailableSeats(selectedFleet, new Date(departureDate));
        } catch (err) {
          console.error("Error loading available seats:", err);
          setSelectedSeat('');
          setSeatError('No seat layout available for this vehicle. Please select a different vehicle.');
        }
      }
    };
    
    loadAvailableSeats();
  }, [selectedFleet, departureDate, fetchAvailableSeats]);

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

  return (
    <div className="h-full w-full flex items-center justify-center p-4 ">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-black text-white py-4 px-6 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-wider">BOOK YOUR RIDE</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-auto max-h-screen">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-900 text-red-900 p-4 mb-6" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="route" className="block text-sm font-medium text-gray-700">Route</label>
                <div className="relative">
                  <select 
                    id="route"
                    value={route} 
                    onChange={(e) => handleRouteChange(e.target.value)}
                    required
                    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none"
                    aria-describedby={fleetError ? "route-error" : undefined}
                  >
                    <option value="">Select a route</option>
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
                {fleetError && <p id="route-error" className="mt-1 text-sm text-red-600">{fleetError}</p>}
              </div>
              
              {/* ... the rest of your form remains the same */}
              
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
