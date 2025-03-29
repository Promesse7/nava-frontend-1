import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Card, CardContent } from "../../ui/Card";
import { FaSearch, FaCar, FaClock, FaMapMarkerAlt, FaCreditCard} from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure firebase is initialized
import BookingForm from "../../../Components/booking/BookingForm"; // Import the BookingForm component
import { getAllVehicles } from "../../../services/fleetService";

const BookRide = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const openForm = () => setIsOpen(true);
  const closeForm = () => {
    console.log("Closing form...");
    setIsOpen(false);
    console.log("isOpen after closing:", isOpen);
  };



  useEffect(() => {
    const fetchCars = async () => {
      try {
        const vehicles = await getAllVehicles();
        // Filter vehicles by status and calculate available seats dynamically
        const availableCars = vehicles
          .filter((vehicle) => vehicle.status === 'available')
          .map((vehicle) => ({
            ...vehicle,
            // Calculate available seats dynamically from the layout
            calculatedAvailable: vehicle.layout
              ? Object.values(vehicle.layout).filter((seat) => seat.status === 'available').length
              : 0,
          }));
        setCars(availableCars);
      } catch (error) {
        console.error('Error fetching available vehicles:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <motion.div
      className="p-6 space-y-6 bg-white h-full overflow-auto"
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
          className="relative w-full max-w-lg bg-white shadow-xl rounded-lg p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedCar(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>

           {isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <h2 className="text-xl font-semibold mb-4">Booking for {selectedCar?.name}</h2>
                <BookingForm onClose={closeForm} />
               
            </div>
          )}
          



        </motion.div>
      )}



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {cars
          .filter(car => car.name.toLowerCase().includes(search.toLowerCase()))
          .map(car => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={car.id}
              onClick={() => {
                setSelectedCar(car);  // Set the selected car
                openForm();            // Open the booking form
              }}
            >
              <Card className="p-6 shadow-xl space-y-4 cursor-pointer hover:shadow-2xl transition-shadow duration-300 rounded-lg">
                {/* Car Image */}
                <img src={car.imageUrl} alt={car.name} className="w-full h-40 object-cover rounded-lg" />

                <CardContent className="space-y-2">
                  {/* Car Name & Type */}
                  <h2 className="text-2xl font-semibold">{car.name}</h2>
                  <p className="text-gray-500">{car.type} | Plate: {car.plate}</p>

                  {/* Route & Timing */}
                  <div className="text-gray-700">
                    <p className="font-medium">Route: <span className="text-gray-600">{car.route}</span></p>
                    <p className="font-medium">Departure: <span className="text-gray-600">{new Date(car.departureTime).toLocaleString()}</span></p>
                    <p className="font-medium">Arrival: <span className="text-gray-600">{car.arrivalTime}</span></p>
                  </div>

                  {/* Driver Details */}
                  <div className="border-t pt-1 text-gray-700">
                    <p className="font-medium">Driver: <span className="text-gray-600">{car.driver}</span></p>
                  </div>

                  {/* Availability & Last Service */}
                  <div className=" justify-between text-gray-700 text-sm">
                    <p className="">Seats Available: <span className="font-semibold">{car.seats.available} / {car.seats.total}</span></p>
                  </div>

                  {/* Booking Status */}
                  <div className="text-center mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${car.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                      {car.status.toUpperCase()}
                    </span>
                  </div>
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
