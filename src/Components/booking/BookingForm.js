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

const BookingForm = () => {
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

  const errors = validateForm(formValues);
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
    // Call makeBooking() to create a booking ✅
    const bookingData = {
      userId,
      route,
      departureDate,
      selectedFleet,
      selectedSeat,
      customerName,
      phoneNumber,
      email,
      amount,
      status: "pending",
    };

    console.log("Submitting booking:", bookingData);
    await makeBooking(bookingData);

    // Update seat status in Firebase
    await updateSeatStatus(selectedFleet, selectedSeat, "booked", userId);

    console.log("Setting success status");
    setBookingStatus("success");

    // Reset form after success
    setTimeout(() => {
      setSubmitting(false);
      setBookingStatus(null);
    }, 2000);
  } catch (err) {
    console.error("Error in submission:", err);
    setBookingStatus("error");

    setTimeout(() => setBookingStatus(null), 3000);
  }
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
    <div className="h-full w-full flex items-center justify-center p-4">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">
                  Customer Information
                </h3>
                <div className="space-y-4">
                  {/* Customer name */}
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className={`block w-full pl-3 pr-10 py-3 text-base border ${
                        formErrors.customerName
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md`}
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Phone number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className={`block w-full pl-3 pr-10 py-3 text-base border ${
                        formErrors.phoneNumber
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md`}
                      placeholder="e.g. 0798123456"
                    />
                    {formErrors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email (Optional)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-3 pr-10 py-3 text-base border ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      } focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md`}
                      placeholder="example@email.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trip information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-800">
                  Trip Information
                </h3>

                {/* Route selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="route"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Route
                  </label>
                  <div className="relative">
                    <select
                      id="route"
                      value={route}
                      onChange={(e) => handleRouteChange(e.target.value)}
                      required
                      className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none ${
                        loadingRoutes ? "bg-gray-100 cursor-wait" : ""
                      }`}
                      aria-describedby={routeError ? "route-error" : undefined}
                      disabled={loadingRoutes}
                    >
                      <option value="">
                        {loadingRoutes ? "Loading routes..." : "Select a route"}
                      </option>
                      {availableRoutes.map((routeOption) => (
                        <option key={routeOption} value={routeOption}>
                          {routeOption}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  {routeError && (
                    <p id="route-error" className="mt-1 text-sm text-red-600">
                      {routeError}
                    </p>
                  )}

                  {/* Departure date selection */}
                  <div className="space-y-2">
                    <label
                      htmlFor="departureDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Departure Date
                    </label>
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
                    <label
                      htmlFor="fleet"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Vehicle
                    </label>
                    <div className="relative">
                      <select
                        id="fleet"
                        value={selectedFleet}
                        onChange={(e) => handleFleetChange(e.target.value)}
                        required
                        className={`block w-full pl-3 pr-10 py-3 text-base border-gray-300 border focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white rounded-md appearance-none ${
                          loadingFleets ? "bg-gray-100 cursor-wait" : ""
                        }`}
                        aria-describedby={
                          fleetError ? "fleet-error" : undefined
                        }
                        disabled={loadingFleets}
                      >
                        <option value="">
                          {loadingFleets
                            ? "Loading vehicles..."
                            : "Select a vehicle"}
                        </option>
                        {fleetOptions.map((fleet) => (
                          <option key={fleet.id} value={fleet.id}>
                            {fleet.name} - {fleet.type} ({fleet.seatCapacity}{" "}
                            seats)
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {fleetError && (
                      <p id="fleet-error" className="mt-1 text-sm text-red-600">
                        {fleetError}
                      </p>
                    )}
                  </div>

                  {/* Only show SeatBooking if a fleet is selected */}
                  {selectedFleet && (
                    <SeatBooking
                      fleetId={selectedFleet}
                      userId={userId}
                      onSeatSelect={handleSeatSelect}
                    />
                  )}
                </div>

                {/* Payment information */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    Payment Information
                  </h3>

                  {/* Amount display */}
                  <div className="space-y-2">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="text"
                      value={`₦${amount.toLocaleString()}`}
                      readOnly
                      className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 border bg-gray-50 rounded-md appearance-none"
                    />
                    <p className="text-xs text-gray-500">
                      Standard fare for all routes
                    </p>
                  </div>

                  {/* Payment method */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            You will pay at our terminal before departure. No
                            online payment is required.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start space-x-2 mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-black border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the terms and conditions
                    </label>
                    <p className="text-gray-500">
                      By booking, you agree to our refund policy and terminal
                      rules.
                    </p>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!selectedSeat}
                  className={`w-full px-4 py-3 bg-black text-white rounded-md transition-colors duration-300 flex items-center justify-center ${
                    !canSubmit
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    "Book Now"
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
