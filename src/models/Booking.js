// This file defines the structure of a booking object
// It's not strictly necessary with Firebase, but helps with code organization and documentation

const BookingModel = {
    userId: "",      // Reference to the user making the booking
    fleetId: "",     // Reference to the booked vehicle
    route: "",       // Route string (e.g., "Muhanga-Rubavu")
    departureDate: null, // Timestamp
    seatNumber: "",  // String or array of strings
    status: "",      // "pending", "confirmed", "cancelled", "completed"
    paymentStatus: "", // "pending", "paid"
    amount: 0,       // Numerical value
    createdAt: null, // Timestamp
    updatedAt: null  // Timestamp
  };
  
  export default BookingModel;