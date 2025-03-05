import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { FaCalendarCheck, FaHistory, FaEdit, FaStar } from "react-icons/fa";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure firebase is initialized


const MyBookings = ({ userId }) => {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const tripsQuery = query(collection(db, "bookings"), where("userId", "==", userId));
        const tripDocs = await getDocs(tripsQuery);
        const trips = tripDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUpcomingTrips(trips.filter(trip => trip.status === "upcoming"));
        setPastTrips(trips.filter(trip => trip.status === "completed"));
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  const cancelBooking = async (tripId) => {
    try {
      await deleteDoc(doc(db, "bookings", tripId));
      setUpcomingTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error("Error canceling trip:", error);
    }
  };

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold text-indigo-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        My Bookings
      </motion.h1>

      {/* Upcoming Trips */}
      <h2 className="text-2xl font-semibold text-blue-500">Upcoming Trips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingTrips.length > 0 ? upcomingTrips.map(trip => (
          <motion.div whileHover={{ scale: 1.05 }} key={trip.id}>
            <Card className="p-6 shadow-xl space-y-4">
              <CardContent>
                <h3 className="text-xl font-semibold">{trip.carName}</h3>
                <p className="text-gray-600">{trip.pickupLocation} → {trip.dropoffLocation}</p>
                <p className="text-gray-500">{trip.date} at {trip.time}</p>
                <button 
                  onClick={() => cancelBooking(trip.id)}
                  className="mt-2 text-red-500 flex items-center"
                >
                  <FaEdit className="mr-2" /> Cancel Trip
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )) : <p className="text-gray-500">No upcoming trips.</p>}
      </div>

      {/* Past Trips */}
      <h2 className="text-2xl font-semibold text-green-500">Past Trips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pastTrips.length > 0 ? pastTrips.map(trip => (
          <motion.div whileHover={{ scale: 1.05 }} key={trip.id}>
            <Card className="p-6 shadow-xl space-y-4">
              <CardContent>
                <h3 className="text-xl font-semibold">{trip.carName}</h3>
                <p className="text-gray-600">{trip.pickupLocation} → {trip.dropoffLocation}</p>
                <p className="text-gray-500">Fare: ${trip.fare.toFixed(2)}</p>
                <button 
                  className="mt-2 text-yellow-500 flex items-center"
                >
                  <FaStar className="mr-2" /> Rate & Review
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )) : <p className="text-gray-500">No past trips.</p>}
      </div>
    </motion.div>
  );
};

export default MyBookings;
