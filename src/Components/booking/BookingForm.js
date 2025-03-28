import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBooking from "../../hooks/useBookings";
import {
  getFleetByRoute,
  getAvailableRoutes,
} from "../../services/fleetService";
import { auth } from "../../firebase";
import { updateSeatStatus } from "../../services/fleetService";
import SeatBooking from "../pages/booking/BookingSeat";
import { sendNotificationToAdmin } from "../../services/notificationService";
import { X, User, MapPin, Calendar, CreditCard } from 'lucide-react';

const BookingForm = ({
  onClose = () => { }
}) => {
  const [route, setRoute] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [selectedFleet, setSelectedFleet] = useState("");
  const [fleetOptions, setFleetOptions] = useState([]);
  const [amount, setAmount] = useState(5000);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Loading states
  const [loadingFleets, setLoadingFleets] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Error states
  const [fleetError, setFleetError] = useState("");
  const [routeError, setRouteError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const { loading, error, makeBooking } = useBooking();
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [fleetId, setFleetId] = useState(null);
  const [formValues, setFormValues] = useState({
    route: "",
    departureDate: "",
    selectedFleet: "",
    customerName: "",
    phoneNumber: "",
    email: "",
  });

  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
    setSelectedFleet(""); // Reset fleet when route changes
    setFleetError("");
  };

  // Handle fleet selection change
  const handleFleetChange = (fleetId) => {
    setSelectedFleet(fleetId);
  };

  // Handle departure date change
  const handleDateChange = (newDate) => {
    setDepartureDate(newDate);
  };

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat); // Set the selected seat in form state
  };

  // Load fleet options when route changes
  useEffect(() => {
    const loadFleetOptions = async () => {
      if (!route) {
        setFleetOptions([]);
        return;
      }

      setLoadingFleets(true);
      setFleetError("");

      try {
        const fleets = await getFleetByRoute(route);
        setFleetOptions(fleets);
        if (fleets.length === 0) {
          setFleetError("No vehicles available for this route");
        }
      } catch (err) {
        console.error("Error loading fleet options:", err);
        setFleetError("Failed to load vehicles. Please try again.");
        setFleetOptions([]);
      } finally {
        setLoadingFleets(false);
      }
    };

    loadFleetOptions();
  }, [route]);




  const validateForm = () => {
    const errors = {};

    if (!customerName.trim()) {
      errors.customerName = "Customer name is required";
    }

    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Please enter a valid phone number";
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!route) {
      errors.route = "Route is required";
    }

    if (!departureDate) {
      errors.departureDate = "Departure date is required";
    }

    if (!selectedFleet) {
      errors.selectedFleet = "Fleet selection is required";
    }

    // Ensure a seat is selected if a fleet is chosen
    if (selectedFleet && !selectedSeat) {
      errors.selectedSeat = "Seat selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Debugging: Log current form values
    console.log("Form values:", {
      route,
      departureDate,
      selectedFleet,
      customerName,
      phoneNumber,
      selectedSeat,
    });

    // Validate form fields
    if (
      !route ||
      !departureDate ||
      !selectedFleet ||
      !selectedSeat ||
      !validateForm()
    ) {
      console.log("Validation failed", formErrors);
      return;
    }

    setSubmitting(true);
    setBookingStatus("processing");
    console.log("Set status to processing");

    try {
      const bookingId = await makeBooking(
        selectedFleet,
        route,
        departureDate,
        selectedSeat,
        amount,
        {
          customerName,
          phoneNumber,
          email
        }
      );

      // Update seat status
      await updateSeatStatus(selectedFleet, selectedSeat, "booked", userId);

      setBookingStatus("success");
      resetForm();

      // Close the modal after successful booking
      setTimeout(() => {
        setSubmitting(false);
        setBookingStatus(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error in submission:", err);
      setBookingStatus("error");

      setTimeout(() => {
        setBookingStatus(null);
        setSubmitting(false);
      }, 3000);
    }
  };

  // Function to reset form fields ✅
  const resetForm = () => {
    setRoute("");
    setDepartureDate("");
    setSelectedFleet("");
    setSelectedSeat("");
    setCustomerName("");
    setPhoneNumber("");
    setEmail("");
    setFormErrors({});
  };



  // Determine if form is in loading state
  const isLoading = loading || loadingFleets || loadingRoutes || submitting;

  // Determine if form is submittable
  const canSubmit =
    route &&
    departureDate &&
    selectedFleet &&
    customerName &&
    phoneNumber &&
    !isLoading;

  // Render status message
  const renderStatusMessage = () => {
    if (!bookingStatus) return null;

    switch (bookingStatus) {
      case "processing":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-b-4 border-black rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Processing your booking...</p>
              <p className="text-sm text-gray-500">
                Please wait while we confirm your reservation
              </p>
            </div>
          </div>
        );
      case "success":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">Booking Successful!</p>
              <p className="text-sm text-gray-500">
                Your booking has been sent to admin for approval
              </p>
              <p className="text-sm text-gray-500">
                You will be redirected to your booking details...
              </p>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">Booking Failed</p>
              <p className="text-sm text-gray-500">
                There was an error processing your booking. Please try again.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-gray-900 bg-opacity-50 z-50 ">
      {renderStatusMessage()}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-black text-white py-4 px-6 sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-wider">BOOK YOUR RIDE</h2>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-pulse flex flex-col items-center"
              role="status"
            >
              <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading booking data...</p>
              <span className="sr-only">Loading</span>
            </div>
          </div>
        )}

        {!loading && (
          <div className="p-6 overflow-auto max-h-screen">
            {error && (
              <div
                className="bg-red-50 border-l-4 border-red-900 text-red-900 p-4 mb-6"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X    size={24} />
            </button>

            <h2 className="text-lg font-bold mb-4">Book Your Ride</h2>

            <form className="p-6 overflow-y-auto max-h-[80vh]" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Customer Information */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User size={18} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your full name"
                      required
                    />
                    {formErrors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User size={18} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. 0798123456"
                      required
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User size={18} />
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="example@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Right Column - Trip Information */}
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <MapPin size={18} />
                      Route
                    </label>
                    <select
                      value={route}
                      onChange={(e) => handleRouteChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    >
                      <option value="">Select a route</option>
                      {availableRoutes.map((routeOption) => (
                        <option key={routeOption} value={routeOption}>
                          {routeOption}
                        </option>
                      ))}
                    </select>
                    {routeError && (
                      <p className="text-red-500 text-xs mt-1">{routeError}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Calendar size={18} />
                      Departure Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={departureDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      min={new Date().toISOString().slice(0, 16)}
                      required
                    />
                    {formErrors.departureDate && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.departureDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <User size={18} />
                      Vehicle
                    </label>
                    <select
                      value={selectedFleet}
                      onChange={(e) => handleFleetChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      required
                    >
                      <option value="">Select a vehicle</option>
                      {fleetOptions.map((fleet) => (
                        <option key={fleet.id} value={fleet.id}>
                          {fleet.name} - {fleet.type} ({fleet.seatCapacity} seats)
                        </option>
                      ))}
                    </select>
                    {fleetError && (
                      <p className="text-red-500 text-xs mt-1">{fleetError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seat Selection */}
              {selectedFleet && (
                <div className="mt-6 border-t pt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={18} />
                    Select Your Seat
                  </label>
                  <SeatBooking
                    fleetId={selectedFleet}
                    userId={userId}
                    onSeatSelect={handleSeatSelect}
                  />
                  {formErrors.selectedSeat && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.selectedSeat}</p>
                  )}
                </div>
              )}

              {/* Payment Information */}
              <div className="mt-6 border-t pt-6">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <CreditCard size={18} />
                  Amount
                </label>
                <input
                  type="text"
                  value={`₦${amount.toLocaleString()}`}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 border-t pt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                  disabled={!selectedSeat || submitting}
                >
                  {submitting ? 'Processing...' : 'Book Now'}
                </button>
              </div>

              {/* Status Messages */}
              {bookingStatus === "processing" && (
                <div className="mt-4 text-center text-gray-600">Processing your booking...</div>
              )}
              {bookingStatus === "success" && (
                <div className="mt-4 text-center text-green-600">Booking Successful!</div>
              )}
              {bookingStatus === "error" && (
                <div className="mt-4 text-center text-red-600">Booking Failed. Please try again.</div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
