import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { FaSearch, FaCar, FaClock, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure firebase is initialized
import BookingForm from "../../../Components/booking/BookingForm"; // Import the BookingForm component

const BookRide = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carsCollection = await getDocs(collection(db, "cars"));
        setCars(carsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

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
        Book a Ride
      </motion.h1>
      
      <div className="space-y-2 flex justify-between">
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find the perfect car for your trip!
        </motion.p>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <FaCar className="text-gray-500 text-xl" />
          <FaClock className="text-gray-500 text-xl" />
          <FaMapMarkerAlt className="text-gray-500 text-xl" />
          <FaCreditCard className="text-gray-500 text-xl" />
        </motion.div>
      </div>

      <div className="flex items-center space-x-4 border-b pb-4">
        <FaSearch className="text-gray-500 text-xl" />
        <input 
          type="text" 
          placeholder="Search by type, price, location..." 
          className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Display booking form if a car is selected */}
      {selectedCar && (
        <motion.div 
          className="p-6 bg-white shadow-md rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Booking for {selectedCar.name}</h2>
          <BookingForm fleetId={selectedCar.id} />
          <button 
            className="mt-4 text-red-500"
            onClick={() => setSelectedCar(null)}
          >
            Cancel
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars
          .filter(car => car.name.toLowerCase().includes(search.toLowerCase()))
          .map(car => (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              key={car.id}
              onClick={() => setSelectedCar(car)}
            >
              <Card className="p-6 shadow-xl space-y-4 cursor-pointer">
                <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded" />
                <CardContent>
                  <h2 className="text-xl font-semibold">{car.name}</h2>
                  <p className="text-gray-600">{car.type} - ${car.price}/day</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        }
      </div>
    </motion.div>
  );
};

export default BookRide;
