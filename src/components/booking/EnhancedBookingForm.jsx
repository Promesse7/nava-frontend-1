import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import useBooking from "../../hooks/useBookings";
import {
  getFleetByRoute,
  getAvailableRoutes,
} from "../../services/fleetService";
import { auth } from "../../firebase";
import { updateSeatStatus } from "../../services/fleetService";
import SeatBooking from "../pages/booking/BookingSeat";
import { sendNotificationToAdmin } from "../../services/notificationService";
import { 
  X, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Clock, 
  Car, 
  Mail, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
 
const EnhancedBookingForm = ({
  onClose = () => { }
}) => {
  // Form state
  const [activeStep, setActiveStep] = useState(1);
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

  // Validate current step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Route & Schedule
        if (!route) {
          errors.route = "Route is required";
        }
        if (!departureDate) {
          errors.departureDate = "Departure date is required";
        }
        if (!selectedFleet) {
          errors.selectedFleet = "Vehicle selection is required";
        }
        break;
      
      case 2: // Seat Selection
        if (!selectedSeat) {
          errors.selectedSeat = "Seat selection is required";
        }
        break;
      
      case 3: // Personal Information
        if (!customerName.trim()) {
          errors.customerName = "Full name is required";
        }
        if (!phoneNumber.trim()) {
          errors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber.replace(/\s/g, ""))) {
          errors.phoneNumber = "Please enter a valid phone number";
        }
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
          errors.email = "Please enter a valid email address";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(1, prev - 1));
  };

  // Validate entire form before submission
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

    if (selectedFleet && !selectedSeat) {
      errors.selectedSeat = "Seat selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setBookingStatus("processing");

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

  // Function to reset form fields
  const resetForm = () => {
    setRoute("");
    setDepartureDate("");
    setSelectedFleet("");
    setSelectedSeat("");
    setCustomerName("");
    setPhoneNumber("");
    setEmail("");
    setFormErrors({});
    setActiveStep(1);
  };

  // Determine if form is in loading state
  const isLoading = loading || loadingFleets || loadingRoutes || submitting;

  // Determine if current step can proceed
  const canProceed = () => {
    switch (activeStep) {
      case 1:
        return route && departureDate && selectedFleet;
      case 2:
        return selectedSeat;
      case 3:
        return customerName && phoneNumber;
      default:
        return false;
    }
  };

  // Render status message
  const renderStatusMessage = () => {
    if (!bookingStatus) return null;

    switch (bookingStatus) {
      case "processing":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-medium text-gray-900">Processing your booking...</p>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we confirm your reservation
              </p>
            </div>
          </motion.div>
        );
      case "success":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Booking Successful!</p>
              <p className="text-center text-gray-600 mt-2 max-w-sm">
                Your booking has been confirmed. You will receive a confirmation shortly.
              </p>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-medium">NAVA-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{route}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">{new Date(departureDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case "error":
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Booking Failed</p>
              <p className="text-center text-gray-600 mt-2 max-w-sm">
                There was an error processing your booking. Please try again or contact support.
              </p>
              <button
                onClick={() => {
                  setBookingStatus(null);
                  setSubmitting(false);
                }}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Step indicators
  const steps = [
    { id: 1, name: 'Trip Details' },
    { id: 2, name: 'Seat Selection' },
    { id: 3, name: 'Personal Info' },
    { id: 4, name: 'Payment' }
  ];

  return (
    <div className="fixed inset-0 flex h-screen items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      {renderStatusMessage()}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-indigo-600 text-white py-5 px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold tracking-wider">Book Your Journey</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center" role="status">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading booking data...</p>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-auto max-h-[80vh]">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 mb-6 rounded-r-md" role="alert">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <React.Fragment key={step.id}>
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          activeStep === step.id 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                            : activeStep > step.id
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {activeStep > step.id ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <span className={`text-xs mt-2 font-medium ${
                        activeStep === step.id 
                          ? 'text-indigo-600' 
                          : activeStep > step.id
                            ? 'text-gray-700'
                            : 'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    
                    {/* Connector Line */}
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        activeStep > i + 1 ? 'bg-indigo-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Trip Details</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <MapPin size={18} className="text-indigo-600" />
                          Route
                        </label>
                        <select
                          value={route}
                          onChange={(e) => handleRouteChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          required
                        >
                          <option value="">Select your route</option>
                          {availableRoutes.map((routeOption) => (
                            <option key={routeOption} value={routeOption}>
                              {routeOption}
                            </option>
                          ))}
                        </select>
                        {formErrors.route && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.route}</p>
                        )}
                        {routeError && (
                          <p className="text-red-500 text-xs mt-1">{routeError}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Calendar size={18} className="text-indigo-600" />
                          Departure Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={departureDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          min={new Date().toISOString().slice(0, 16)}
                          required
                        />
                        {formErrors.departureDate && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.departureDate}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Car size={18} className="text-indigo-600" />
                          Vehicle
                        </label>
                        <select
                          value={selectedFleet}
                          onChange={(e) => handleFleetChange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                          required
                          disabled={!route || loadingFleets}
                        >
                          <option value="">
                            {loadingFleets
                              ? "Loading vehicles..."
                              : route
                                ? "Select a vehicle"
                                : "Select a route first"}
                          </option>
                          {fleetOptions.map((fleet) => (
                            <option key={fleet.id} value={fleet.id}>
                              {fleet.name} - {fleet.type} ({fleet.capacity} seats)
                            </option>
                          ))}
                        </select>
                        {fleetError && (
                          <p className="text-red-500 text-xs mt-1">{fleetError}</p>
                        )}
                        {formErrors.selectedFleet && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.selectedFleet}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Select Your Seat</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <SeatBooking
                        fleetId={selectedFleet}
                        onSeatSelect={handleSeatSelect}
                        selectedSeat={selectedSeat}
                      />
                      {formErrors.selectedSeat && (
                        <p className="text-red-500 text-sm mt-4">{formErrors.selectedSeat}</p>
                      )}
                    </div>
                    
                    <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-800 mb-2">Trip Summary</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium">{route}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">{new Date(departureDate).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Personal Information</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <User size={18} className="text-indigo-600" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your full name"
                          required
                        />
                        {formErrors.customerName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.customerName}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Phone size={18} className="text-indigo-600" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. 0798123456"
                          required
                        />
                        {formErrors.phoneNumber && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Mail size={18} className="text-indigo-600" />
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="example@email.com"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">Payment & Confirmation</h3>
                    
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <CreditCard className="mr-2 text-indigo-600" size={20} />
                        Payment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Ticket Price:</span>
                          <span className="font-medium">Rwf {amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Service Fee:</span>
                          <span className="font-medium">Rwf 500</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2"></div>
                        <div className="flex justify-between items-center font-bold">
                          <span>Total:</span>
                          <span>Rwf {(amount + 500).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Payment will be collected upon confirmation
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                      <h4 className="font-medium text-indigo-800 mb-4">Booking Summary</h4>
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Route</p>
                          <p className="font-medium">{route}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium">{new Date(departureDate).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Vehicle</p>
                          <p className="font-medium">
                            {fleetOptions.find(f => f.id === selectedFleet)?.name || selectedFleet}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Seat</p>
                          <p className="font-medium">{selectedSeat}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Passenger</p>
                          <p className="font-medium">{customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">{phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-lg text-white flex items-center ${
                    canProceed()
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-6 py-3 rounded-lg text-white ${
                    !submitting
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Complete Booking"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedBookingForm;