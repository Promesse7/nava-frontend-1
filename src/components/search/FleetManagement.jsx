import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase"; // Make sure storage is imported
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  Search,
  Calendar,
  AlertTriangle,
  MapPin,
  Droplet,
  Check,
  Car,
  Wrench,
  Clock,
  Plus,
  X,
} from "lucide-react";

import { getAllVehicles, deleteVehicle } from "../../services/fleetService";
import { getDriverById } from "../../services/driverService";
import VehicleRegistrationForm from '../pages/DashboardAssets/Fleet/VehicleRegistrationForm';

const FleetManagement = () => {
  const [fleetData, setFleetData] = useState({
    availableCars: [],
    bookedCars: [],
    maintenanceAlerts: [],
    fuelEfficiency: [],
    routes: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [showPopup, setShowPopup] = useState(false);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [newCar, setNewCar] = useState({
    type: "",
    name: "",
    driver: "",
    plate: "",
    seats: "",
    status: "available",
    fuelLevel: "",
    location: "",
    lastService: "",
    departureTime: "",
    arrivalTime: "",
    route: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [departureDate, setDepartureDate] = useState("");

  const fetchVehicles = async () => {
    try {
      const vehiclesList = await getAllVehicles();

      // Ensure each vehicle has an `id`
      setVehicles(
        vehiclesList.map((vehicle) => ({
          id: vehicle.id, // ✅ Now, every vehicle has an `id`
          ...vehicle,
        }))
      );
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to load vehicles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "fleet"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setFleetData({
        availableCars: data.filter((car) => car.status === "available") || [],
        bookedCars: data.filter((car) => car.status === "booked") || [],
        maintenanceAlerts: data.filter((car) => car.maintenanceDue) || [],
        fuelEfficiency:
          data.map((car) => ({
            id: car.id,
            name: car.name || "Unknown",
            plate: car.plate || "Unknown",
            efficiency: car.fuelEfficiency || "N/A",
            lastRefill: car.lastRefill || "Unknown",
            cost: car.fuelCost || 0,
          })) || [],
        routes:
          data.map((car) => ({
            name: car.name || "Unknown",
            route: car.route || "Unknown",
            departure: car.departureTime || "Unknown",
            arrival: car.arrivalTime || "Unknown",
          })) || [],
      });
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  // Fetch drivers from Firestore when component loads
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversRef = collection(db, "drivers");
        const snapshot = await getDocs(driversRef);
        const driversList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDrivers(driversList);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  // New function to handle form submission from VehicleRegistrationForm
  const handleVehicleRegistration = async (formData) => {
    try {
      // Extract data from the form
      const { 
        name, 
        plate, 
        driverId, 
        departureDate, 
        arrivalTime, 
        imageUrl,
        ...otherFields 
      } = formData;

      // Find driver details from driverId
      let driverName = "";
      if (driverId) {
        const driverData = drivers.find(driver => driver.id === driverId);
        if (driverData) {
          driverName = `${driverData.firstName} ${driverData.lastName || ''}`.trim();
        }
      }

      // Create the seat layout object (same as in original code)
      const totalSeats = Number.isInteger(parseInt(otherFields.seats))
        ? parseInt(otherFields.seats)
        : 16;

      const layout = {};
      for (let i = 1; i <= totalSeats; i++) {
        layout[i.toString()] = {
          status: "available",
          bookedBy: null,
        };
      }

      // Create vehicle object with proper structure
      const vehicleData = {
        name: name,
        plate: plate,
        driverId: driverId,
        driver: driverName,
        departureTime: departureDate, // Use the datetime-local value
        arrivalTime: arrivalTime,
        imageUrl: imageUrl || null, // Cloudinary image URL
        status: "available",
        seats: {
          total: totalSeats,
          available: totalSeats,
          layout,
        },
        // Add any other fields from the form
        ...otherFields
      };

      // Add vehicle to Firestore and store the document ID
      const vehicleRef = await addDoc(collection(db, "fleet"), vehicleData);
      const vehicleId = vehicleRef.id;

      // Update Firestore to include the auto-generated ID in the document
      await updateDoc(doc(db, "fleet", vehicleId), { id: vehicleId });

      // Close popup after successful submission
      setShowPopup(false);
      
      // Refresh vehicle list
      fetchVehicles();

      alert("Vehicle registered successfully!");
    } catch (error) {
      console.error("Error registering vehicle:", error);
      alert("Error registering vehicle: " + error.message);
    }
  };

  // Original handleSubmit kept for backward compatibility
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure all required fields are filled
      if (!newCar.name || !newCar.type || !newCar.plate) {
        alert("Please fill in all required fields: Name, Type, and Plate.");
        return;
      }

      // Ensure seats is a valid number
      const totalSeats = Number.isInteger(parseInt(newCar.seats))
        ? parseInt(newCar.seats)
        : 16;

      // Create the seat layout object
      const layout = {};
      for (let i = 1; i <= totalSeats; i++) {
        layout[i.toString()] = {
          status: "available",
          bookedBy: null,
        };
      }

      // Add seat structure to the vehicle object
      const carWithSeats = {
        ...newCar,
        seats: {
          total: totalSeats,
          available: totalSeats,
          layout,
        },
      };

      // Add car to Firestore and store the document ID
      const vehicleRef = await addDoc(collection(db, "fleet"), carWithSeats);
      const vehicleId = vehicleRef.id;

      // Update Firestore to include the auto-generated ID in the document
      await updateDoc(doc(db, "fleet", vehicleId), { id: vehicleId });

      // Reset form and close popup
      setShowPopup(false);
      setNewCar({
        type: "",
        name: "",
        driver: "",
        plate: "",
        seats: "",
        status: "available",
        fuelLevel: "",
        location: "",
        lastService: "",
        departureTime: "",
        arrivalTime: "",
        route: "",
      });

      alert("New car added successfully with seat layout!");
    } catch (error) {
      console.error("Error adding new car:", error);
      alert("Error adding car: " + error.message);
    }
  };
  // Show delete confirmation
  const handleDeleteClick = (car) => {
    if (!car || !car.id) {
      console.error("Error: Car object is invalid", car);
      return;
    }

    console.log("Selected car for deletion:", car); // Debugging log
    setCarToDelete(car);
    setShowConfirm(true);
  };

  // Delete car
  const confirmDelete = async () => {
    if (!carToDelete || !carToDelete.id) {
      console.error("Error: No valid car selected for deletion");
      return;
    }

    try {
      await deleteVehicle(carToDelete.id);
      setShowConfirm(false);
      setCarToDelete(null);
      fetchVehicles(); // Refresh vehicle list
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  // Filter data based on search term
  const filterData = (data) => {
    if (!searchTerm) return data;
    return data.filter(
      (car) =>
        (car.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (car.licensePlate?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        )
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Fleet Management Dashboard
      </h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by vehicle name or license plate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`p-3 font-medium flex items-center mr-4 ${
            activeTab === "available"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          <Check size={18} className="mr-2" />
          Available Cars ({fleetData.availableCars.length})
        </button>
        <button
          className={`p-3 font-medium flex items-center mr-4 ${
            activeTab === "booked"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("booked")}
        >
          <Calendar size={18} className="mr-2" />
          Booked Cars ({fleetData.bookedCars.length})
        </button>
        <button
          className={`p-3 font-medium flex items-center mr-4 ${
            activeTab === "maintenance"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("maintenance")}
        >
          <Wrench size={18} className="mr-2" />
          Maintenance Alerts ({fleetData.maintenanceAlerts.length})
        </button>
        <button
          className={`p-3 font-medium flex items-center mr-4 ${
            activeTab === "tracking"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("tracking")}
        >
          <MapPin size={18} className="mr-2" />
          Location Tracking
        </button>
        <button
          className={`p-3 font-medium flex items-center ${
            activeTab === "fuel"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("fuel")}
        >
          <Droplet size={18} className="mr-2" />
          Fuel Efficiency
        </button>
      </div>
    
      {/* Content based on active tab */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-[60vh] overflow-auto">
        {/* Available Cars */}
        {activeTab === "available" && (
          <div className="overflow-y-auto max-h-screen">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="mr-2 text-green-600" />
              Available Cars
            </h2>
            <div className="">
              <table className="min-w-full divide-y  divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 overflow-y-auto">
                  {filterData(fleetData.availableCars).map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.licensePlate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                car.fuelLevel > 70
                                  ? "bg-green-600"
                                  : car.fuelLevel > 30
                                  ? "bg-yellow-400"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${car.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {car.fuelLevel}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.lastService}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                          onClick={() => handleDeleteClick(car)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowPopup(true)}
              className="mt-4 mb-4 px-4 py-3 bg-blue-600 text-white rounded flex items-center mx-auto "
            >
              <Plus className="mr-2" /> Add New Car
            </button>
          </div>
        )}

         {/* Vehicle Registration Form Popup */}
      {showPopup && (
        <VehicleRegistrationForm 
          setShowPopup={setShowPopup} 
          drivers={drivers} 
          handleSubmit={handleVehicleRegistration}
        />
      )}

        {/* Booked Cars */}
        {activeTab === "booked" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-blue-600" />
              Currently Booked Cars
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booked By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.bookedCars).map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.plate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.bookedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1 text-gray-400" />
                          {car.returnDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                car.fuelLevel > 70
                                  ? "bg-green-600"
                                  : car.fuelLevel > 30
                                  ? "bg-yellow-400"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${car.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {car.fuelLevel}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Maintenance Alerts */}
        {activeTab === "maintenance" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="mr-2 text-yellow-500" />
              Maintenance Alerts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.maintenanceAlerts).map((alert) => (
                    <tr
                      key={alert.id}
                      className={alert.urgent ? "bg-red-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.urgent ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Urgent
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.licensePlate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.alertType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {alert.dueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm">
                          Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Location Tracking */}
        {activeTab === "tracking" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-indigo-600" />
              Vehicle Location Tracking
            </h2>
            <div className="border border-gray-200 rounded-lg h-64 bg-gray-100 flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                <p>
                  Map view would be displayed here (showing all vehicle
                  locations)
                </p>
                <p className="text-sm">
                  Integrate with Google Maps or similar mapping API
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData([
                    ...fleetData.availableCars,
                    ...fleetData.bookedCars,
                  ]).map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.plate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-400" />
                        {car.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            car.id in fleetData.bookedCars.map((c) => c.id)
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {car.id in fleetData.bookedCars.map((c) => c.id)
                            ? "In Use"
                            : "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        Today, 10:23 AM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fuel Efficiency */}
        {activeTab === "fuel" && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Droplet className="mr-2 text-blue-600" />
              Fuel Consumption & Efficiency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">
                  Fleet Average MPG
                </h3>
                <p className="text-3xl font-bold text-blue-700">34.0</p>
                <p className="text-sm text-blue-600 mt-1">
                  +2.5% from last month
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">
                  Monthly Fuel Cost
                </h3>
                <p className="text-3xl font-bold text-green-700">$1,245.50</p>
                <p className="text-sm text-green-600 mt-1">
                  -5.2% from last month
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-2">
                  CO2 Emissions
                </h3>
                <p className="text-3xl font-bold text-purple-700">3.2 tons</p>
                <p className="text-sm text-purple-600 mt-1">
                  -1.8% from last month
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency (MPG)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Refill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refill Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trends
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterData(fleetData.fuelEfficiency).map((car) => (
                    <tr key={car.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.licensePlate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            car.efficiency === "N/A (Electric)"
                              ? "text-blue-600"
                              : car.efficiency > 35
                              ? "text-green-600"
                              : car.efficiency > 25
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {car.efficiency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.lastRefill}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${car.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-24 bg-gray-100 rounded">
                          {/* This would be a mini graph/sparkline in a real app */}
                          <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                            View Chart
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete {carToDelete?.name}?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => confirmDelete()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
