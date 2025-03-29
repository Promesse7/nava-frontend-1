import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Card, CardContent } from "../../ui/Card";
import {
  FaEdit,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCheckCircle,
  FaHourglass,
  FaPlus,
  FaCarSide,
  FaHistory,
  FaSearch,
  FaCar,
  FaInfoCircle,
  FaRegTimesCircle,
  FaArrowRight,
  FaFileAlt,
  FaBookmark,
  FaTimes,
  FaCheck,
  FaClock,
  FaUserAlt,
  FaArrowLeft,
  FaClipboardCheck
} from "react-icons/fa";
import { FaMoneyBillWave, FaUniversity, FaMobileAlt, FaCreditCard } from 'react-icons/fa';

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BookRide from "./BookRide";
import TicketView from "../../features/TicketView";
import { ArrowLeft, Plus } from "lucide-react";

const MyBookings = () => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const navigate = useNavigate();
  const [showBookARide, setShowBookARide] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    momoPhone: '',
    momoName: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [paymentStep, setPaymentStep] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [ShowReceiptModal, setShowReceiptModal] = useState(false);

  // Add these functions to your component
  const openPaymentModal = (trip) => {
    setSelectedTrip(trip);
    setPaymentMethod(null);
    setPaymentStep(1);
    setPaymentComplete(false);
    setShowPaymentModal(true);
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'momo') {
      return paymentDetails.momoPhone.length >= 10 && paymentDetails.momoName.length > 0;
    } else if (paymentMethod === 'bank') {
      return paymentDetails.bankName.length > 0 &&
        paymentDetails.accountNumber.length > 0 &&
        paymentDetails.accountName.length > 0;
    }
    return false;
  };

  const processPayment = () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentComplete(true);
      setPaymentStep(3);
      // Here you would normally update the trip's payment status in your database
    }, 2000);
  };

  // Helper functions to fix the undefined errors
  const calculateDaysRemaining = (date) => {
    if (!date) return 0;

    const today = new Date();
    const tripDate =
      typeof date === "string"
        ? new Date(date)
        : date.toDate
          ? date.toDate()
          : new Date(date);

    const diffTime = Math.abs(tripDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalSpent = () => {
    const upcomingTotal = upcomingTrips.reduce(
      (sum, trip) => sum + (trip.amount || 0),
      0
    );
    const pastTotal = pastTrips.reduce(
      (sum, trip) => sum + (trip.fare || 0),
      0
    );
    return (upcomingTotal + pastTotal).toFixed(2);
  };

  const getReviewLabel = (rating) => {
    if (rating === 5) return "Excellent";
    if (rating === 4) return "Very Good";
    if (rating === 3) return "Good";
    if (rating === 2) return "Fair";
    if (rating === 1) return "Poor";
    return "";
  };

  useEffect(() => {
    const unsubscribe = fetchBookings(); // Subscribe to real-time updates

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, []);

  const fetchVehicleDetails = async (fleetId) => {
    try {
      if (!fleetId) {
        console.warn("Fleet ID is missing or undefined.");
        return null;
      }

      console.log("Fetching vehicle details for fleetId:", fleetId);

      const vehicleRef = doc(db, "fleet", fleetId);
      const vehicleDoc = await getDoc(vehicleRef);

      if (!vehicleDoc.exists()) {
        console.warn("No vehicle found for fleetId:", fleetId);
        return null;
      }

      return vehicleDoc.data();
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      return null;
    }
  };

  const fetchBookings = () => {
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return () => { };
    }

    console.log("Listening for real-time bookings for user:", user.uid);

    const tripsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(tripsQuery, async (snapshot) => {
      const trips = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const tripData = { id: doc.id, ...doc.data() };

          console.log("Trip Data:", tripData);

          // Ensure fleetId exists before fetching vehicle details
          const vehicleDetails = tripData.fleetId
            ? await fetchVehicleDetails(tripData.fleetId)
            : null;

          return { ...tripData, vehicle: vehicleDetails };
        })
      );

      console.log("Updated trips data with vehicles:", trips);

      // Separate upcoming and past trips based on departureDate
      const now = new Date();
      const upcoming = trips.filter((trip) => {
        const departureDate = trip.departureDate
          ? typeof trip.departureDate === "string"
            ? new Date(trip.departureDate)
            : trip.departureDate.toDate()
          : null;

        return (
          departureDate &&
          departureDate > now &&
          (trip.status === "pending" || trip.status === "approved")
        );
      });

      const past = trips.filter((trip) => {
        const departureDate = trip.departureDate
          ? typeof trip.departureDate === "string"
            ? new Date(trip.departureDate)
            : trip.departureDate.toDate()
          : null;

        return (
          !departureDate ||
          departureDate < now ||
          trip.status === "completed" ||
          trip.status === "cancelled"
        );
      });

      setUpcomingTrips(upcoming);
      setPastTrips(past);
      setLoading(false);
    });

    return unsubscribe; // Return the unsubscribe function to clean up the listener
  };


  const cancelBooking = async (tripId) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      // Update the status to cancelled instead of deleting
      await updateDoc(doc(db, "bookings", tripId), {
        status: "cancelled",
        updatedAt: new Date(),
      });

      // Move from upcoming to past trips
      const cancelledTrip = upcomingTrips.find((trip) => trip.id === tripId);
      if (cancelledTrip) {
        setUpcomingTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        setPastTrips((prev) => [
          ...prev,
          { ...cancelledTrip, status: "cancelled" },
        ]);
      }

      toast.success("Trip cancelled successfully");
    } catch (error) {
      console.error("Error canceling trip:", error);
      toast.error("Failed to cancel trip");
    }
  };

  const openRatingModal = (trip) => {
    setSelectedTrip(trip);
    setRating(trip.rating || 0);
    setReview(trip.review || "");
    setShowRatingModal(true);
  };

  const openReceiptModal = (trip) => {
    setSelectedTrip(trip);
    setShowReceiptModal(true);
  };

  const submitRating = async () => {
    try {
      await updateDoc(doc(db, "bookings", selectedTrip.id), {
        rating,
        review,
        reviewed: true,
        updatedAt: new Date(),
      });

      setPastTrips((prev) =>
        prev.map((trip) =>
          trip.id === selectedTrip.id
            ? { ...trip, rating, review, reviewed: true }
            : trip
        )
      );

      setShowRatingModal(false);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";

    try {
      const date =
        typeof dateString === "string"
          ? new Date(dateString)
          : dateString.toDate
            ? dateString.toDate()
            : new Date();

      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
            <FaHourglass className="mr-1" /> Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <FaCheckCircle className="mr-1" /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
            <FaCheckCircle className="mr-1" /> Completed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      {!showBookARide ? (
        <>
          <motion.div
            className="p-2 md:p-6 space-y-4 sm:overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <motion.h1
                className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 md:mb-0"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                My Bookings
              </motion.h1>

              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center self-start md:self-auto"
                onClick={() => setShowBookARide(true)}
              >
                <FaPlus className="mr-2" /> Book New Trip
              </button>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-500 font-medium">Total Trips</p>
                <p className="text-2xl font-bold">
                  {upcomingTrips.length + pastTrips.length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-600 font-medium">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingTrips.length}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-600 font-medium">Completed</p>
                <p className="text-2xl font-bold">{pastTrips.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-600 font-medium">Total Spent</p>
                <p className="text-2xl font-bold">
                  {calculateTotalSpent()} Rwf
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 ">
              <button
                className={`py-3 px-6 font-medium flex items-center ${selectedTab === "upcoming"
                  ? "border-b-2 border-indigo-600 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setSelectedTab("upcoming")}
              >
                <FaCarSide className="mr-2" />
                Upcoming Trips
                <span className="ml-2 bg-indigo-100 text-indigo-700 py-1 px-2 rounded-full text-sm">
                  {upcomingTrips.length}
                </span>
              </button>
              <button
                className={`py-3 px-6 font-medium flex items-center ${selectedTab === "past"
                  ? "border-b-2 border-indigo-600 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
                onClick={() => setSelectedTab("past")}
              >
                <FaHistory className="mr-2" />
                Past Trips
                <span className="ml-2 bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-sm">
                  {pastTrips.length}
                </span>
              </button>
            </div>

            {/* Trip Display */}
            {selectedTab === "upcoming" && (
              <>
                {upcomingTrips.length > 0 ? (
                  <>
                    {/* Sort and filter options */}
                    <div className="flex flex-col md:flex-row justify-between mb-4 ">
                      <div className="mb-2 md:mb-0">
                        <select className="p-2 border border-gray-300 rounded-md text-gray-700">
                          <option>Sort by: Nearest Date</option>
                          <option>Sort by: Farthest Date</option>
                          <option>Sort by: Price (High to Low)</option>
                          <option>Sort by: Price (Low to High)</option>
                        </select>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search trips..."
                          className="p-2 pl-8 border border-gray-300 rounded-md w-full"
                        />
                        <FaSearch className="absolute left-2 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto ">
                      {upcomingTrips.map((trip) => (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          key={trip.id}
                          className="transition-all duration-200"
                        >
                          <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100">
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <FaCar className="text-xl mr-2" />
                                  <div>
                                    <h3 className="font-bold text-base">
                                      {trip.vehicle.name || "Booked Vehicle"}
                                    </h3>
                                    <p className="text-indigo-100 text-xs">
                                      {trip.vehicle.type || "Standard"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    Upcoming
                                  </div>
                                  <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                                  onClick={() => navigate('/trip')}
                                  >
                                    Track Trip
                                  </button>
                                </div>
                              </div>
                            </div>

                            <CardContent className="p-6">
                              <div className="flex items-start mb-2 mt-2">
                                <FaCalendarAlt className="text-indigo-600 mr-2" />
                                <div>
                                  <p className="text-xs text-gray-500">Departure</p>
                                  <p className="font-medium text-sm">
                                    {formatDate(trip.departureDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-2">
                                <FaMapMarkerAlt className="text-indigo-600 mr-2" />
                                <div>
                                  <p className="text-xs text-gray-500">Route</p>
                                  <p className="font-medium text-sm">
                                    {trip.route || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-2">
                                <FaClipboardCheck
                                  className={`text-${trip.status === "approved"
                                    ? "green"
                                    : trip.status === "pending"
                                      ? "yellow"
                                      : "red"
                                    }-600 mr-2`}
                                />
                                <div>
                                  <p className="text-xs text-gray-500">Status</p>
                                  <p
                                    className={`font-medium text-sm text-${trip.status === "approved"
                                      ? "green"
                                      : trip.status === "pending"
                                        ? "yellow"
                                        : "red"
                                      }-600`}
                                  >
                                    {trip.status || "Pending"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-2">
                                <FaDollarSign className="text-indigo-600 mr-2" />
                                <div>
                                  <p className="text-xs text-gray-500">Payment</p>
                                  <p className="font-medium text-sm">
                                    {trip.amount?.toFixed(2) || "0.00"} Rwf
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between gap-2">
                                <button className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 text-xs flex items-center">
                                  <FaInfoCircle className="mr-1" /> Details
                                </button>
                                <button
                                  onClick={() => openPaymentModal(trip)}
                                  className="px-2 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-xs flex items-center"
                                >
                                  <FaMoneyBillWave className="mr-1" /> Pay
                                </button>
                                <button
                                  onClick={() => cancelBooking(trip.id)}
                                  className="px-2 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-xs flex items-center"
                                >
                                  <FaRegTimesCircle className="mr-1" /> Cancel
                                </button>
                              </div>

                              {showPaymentModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                                  <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white rounded-lg p-4 max-w-sm w-full shadow-xl"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <h3 className="text-lg font-semibold">
                                        {paymentStep === 1 ? "Payment Method" : "Details"}
                                      </h3>
                                      <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>

                                    {selectedTrip && (
                                      <div className="bg-gray-50 p-2 rounded-md mb-2">
                                        <p className="font-medium text-sm">
                                          {selectedTrip.vehicle?.name || "Booked Vehicle"}
                                        </p>
                                        <p className="text-xs text-indigo-600">
                                          {selectedTrip.amount?.toFixed(2) || "0.00"} Rwf
                                        </p>
                                      </div>
                                    )}

                                    {paymentStep === 1 && (
                                      <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div
                                          className={`border rounded-lg p-2 text-center cursor-pointer ${paymentMethod === "momo" ? "border-indigo-500" : "border-gray-200"
                                            }`}
                                          onClick={() => setPaymentMethod("momo")}
                                        >
                                          <FaMobileAlt className="text-indigo-600 mx-auto" />
                                          <p className="text-xs font-medium">Mobile Money</p>
                                        </div>
                                        <div
                                          className={`border rounded-lg p-2 text-center cursor-pointer ${paymentMethod === "bank" ? "border-indigo-500" : "border-gray-200"
                                            }`}
                                          onClick={() => setPaymentMethod("bank")}
                                        >
                                          <FaUniversity className="text-indigo-600 mx-auto" />
                                          <p className="text-xs font-medium">Bank</p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="flex justify-end space-x-2 mt-2">
                                      <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="px-2 py-1 border border-gray-300 rounded-md text-xs"
                                      >
                                        Cancel
                                      </button>
                                      {paymentStep === 1 && (
                                        <button
                                          onClick={() => setPaymentStep(2)}
                                          disabled={!paymentMethod}
                                          className={`px-3 py-1 rounded-md text-xs ${paymentMethod ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                                            }`}
                                        >
                                          Next
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-lg p-8 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-indigo-100 p-4 rounded-full">
                        <FaCalendarAlt className="text-indigo-500 text-3xl" />
                      </div>
                    </div>
                    <h3 className="text-gray-700 text-xl font-medium">
                      No upcoming trips
                    </h3>
                    <p className="text-gray-500 mt-2 mb-6">
                      Ready to plan your next journey?
                    </p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Book Your First Trip
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {selectedTab === "past" && (
              <>
                {pastTrips.length > 0 ? (
                  <>
                    {/* Sort and filter options */}
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div className="mb-2 md:mb-0">
                        <select className="p-2 border border-gray-300 rounded-md text-gray-700">
                          <option>Sort by: Most Recent</option>
                          <option>Sort by: Oldest First</option>
                          <option>Sort by: Highest Rated</option>
                        </select>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search past trips..."
                          className="p-2 pl-8 border border-gray-300 rounded-md w-full"
                        />
                        <FaSearch className="absolute left-2 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-h-full overflow-y-auto">
                      {pastTrips.map((trip) => (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          key={trip.id}
                          className="transition-all duration-200"
                        >
                          <Card className="overflow-hidden shadow-md hover:shadow-xl border border-gray-100">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <FaCar className="text-2xl mr-3" />
                                  <div>
                                    <h3 className="font-bold text-lg">
                                      {trip.carName || "Completed Trip"}
                                    </h3>
                                    <p className="text-green-100 text-sm">
                                      {trip.vehicleType || "Standard"}
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                  Completed
                                </div>
                              </div>
                            </div>

                            <CardContent className="p-5">
                              <div className="flex items-start mb-4">
                                <div className="bg-green-50 p-2 rounded-md mr-3">
                                  <FaCalendarAlt className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Trip Date
                                  </p>
                                  <p className="font-medium">
                                    {formatDate(trip.date)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-4">
                                <div className="bg-green-50 p-2 rounded-md mr-3">
                                  <FaMapMarkerAlt className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Route</p>
                                  <p className="font-medium">
                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mr-1">
                                      {trip.route}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-4">
                                <div className="bg-green-50 p-2 rounded-md mr-3">
                                  <FaDollarSign className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Payment
                                  </p>
                                  <p className="font-medium">
                                    Rwf {trip.amount?.toFixed(2) || "0.00"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start mb-4">
                                <div className="bg-green-50 p-2 rounded-md mr-3">
                                  <FaClock className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Duration
                                  </p>
                                  <p className="font-medium">
                                    {trip.duration || "0 minutes"}
                                  </p>
                                </div>
                              </div>



                              {trip.reviewed ? (
                                <div className="mt-3 bg-yellow-50 p-3 rounded-md">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Your Rating
                                  </p>
                                  <div className="flex items-center mb-1">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        className={
                                          i < trip.rating
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                        }
                                      />
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                      {getReviewLabel(trip.rating)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => openRatingModal(trip)}
                                    className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors flex items-center"
                                  >
                                    <FaStar className="mr-2" /> Rate & Review
                                  </button>
                                </div>
                              ) : null}

                              <div
                                className={`border-t border-gray-100 pt-4 mt-4 flex justify-between ${!trip.reviewed ? "mt-2" : ""
                                  }`}
                              >
                                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center "
                                  onClick={() => openReceiptModal(trip)}>
                                  <FaFileAlt className="mr-2" /> Receipt
                                </button>
                                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                                  <FaBookmark className="mr-2" /> Save Route
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-lg p-8 text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-100 p-4 rounded-full">
                        <FaHistory className="text-green-500 text-3xl" />
                      </div>
                    </div>
                    <h3 className="text-gray-700 text-xl font-medium">
                      No past trips found
                    </h3>
                    <p className="text-gray-500 mt-2 mb-6">
                      Your completed trips will appear here
                    </p>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Book a Trip Now
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      Rate Your Experience
                    </h3>
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaCar className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedTrip?.carName}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(selectedTrip?.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-2 font-medium">
                    How would you rate your trip?
                  </p>
                  <div className="flex items-center justify-center mb-4 bg-gray-50 p-3 rounded-md">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-3xl cursor-pointer mx-1 transition-all duration-200 ${i < rating ? "text-yellow-500" : "text-gray-300"
                          } ${i < rating ? "scale-110" : ""}`}
                        onClick={() => setRating(i + 1)}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm mb-4">
                    {rating === 5
                      ? "Excellent"
                      : rating === 4
                        ? "Very Good"
                        : rating === 3
                          ? "Good"
                          : rating === 2
                            ? "Fair"
                            : rating === 1
                              ? "Poor"
                              : "Select a rating"}
                  </p>

                  <p className="text-gray-600 mb-2 font-medium">
                    Share your experience (optional)
                  </p>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="What did you like or dislike about your trip?"
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                    rows={3}
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitRating}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      disabled={rating === 0}
                    >
                      <FaCheck className="mr-2" /> Submit Rating
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Ticket View Modal */}

            {ShowReceiptModal && (
               <TicketView />
            )}

            <Toaster />
          </motion.div>
        </>
      ) : (
        <>
          <button
            onClick={() => setShowBookARide(false)}
            className="px-4 py-2 flex items-center bg-gray-500 text-white rounded-md hover:bg-gray-600 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Bookings
          </button>
          <BookRide /> {/* Show Book a Ride component */}
        </>
      )}
    </>
  );
};

export default MyBookings;
