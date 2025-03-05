import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { FaMapMarkerAlt, FaDollarSign, FaClock } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure Firebase is initialized



const RoutesPricing = () => {
  const [routes, setRoutes] = useState([]);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "routes"));
        const routesData = querySnapshot.docs.map((doc) => doc.data());
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    const fetchAvailability = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "availability"));
        const availabilityData = querySnapshot.docs.map((doc) => doc.data());
        setAvailability(availabilityData);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchRoutes();
    fetchAvailability();
  }, []);

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-indigo-600">Routes & Pricing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }}>
            <Card className="p-6 shadow-xl bg-blue-50 border-l-4 border-blue-500">
              <FaMapMarkerAlt className="text-blue-500 text-4xl" />
              <CardContent>
                <h2 className="text-xl font-semibold">{route.name}</h2>
                <p className="text-gray-600">Estimated Fare: ${route.fare}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="p-6 shadow-xl bg-green-50 border-l-4 border-green-500">
          <FaDollarSign className="text-green-500 text-4xl" />
          <CardContent>
            <h2 className="text-xl font-semibold">Price Estimator</h2>
            <p className="text-gray-600">Calculate your fare based on distance & time.</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Card className="p-6 shadow-xl bg-yellow-50 border-l-4 border-yellow-500">
          <FaClock className="text-yellow-500 text-4xl" />
          <CardContent>
            <h2 className="text-xl font-semibold">Real-Time Availability</h2>
            <p className="text-gray-600">Check available cars on your route.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RoutesPricing;
