const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize if not already
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Cloud function to create a booking with transaction
exports.createBooking = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to make a booking'
    );
  }
  
  const { fleetId, route, departureDate, seatNumber, amount } = data;
  const userId = context.auth.uid;
  
  // Validate inputs
  if (!fleetId || !route || !departureDate || !seatNumber) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required booking information'
    );
  }
  
  try {
    // Run as a transaction to ensure data consistency
    return await db.runTransaction(async (transaction) => {
      // Get the fleet document
      const fleetRef = db.collection('fleet').doc(fleetId);
      const fleetDoc = await transaction.get(fleetRef);
      
      if (!fleetDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Vehicle not found');
      }
      
      const fleetData = fleetDoc.data();
      
      // Check if seat is available
      if (!fleetData.seats || 
          !fleetData.seats.layout || 
          !fleetData.seats.layout[seatNumber] ||
          fleetData.seats.layout[seatNumber].status !== 'available') {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Seat is not available'
        );
      }
      
      // Create booking document
      const bookingRef = db.collection('bookings').doc();
      
      // Update seat status
      const seatUpdate = {};
      seatUpdate[`seats.layout.${seatNumber}.status`] = 'booked';
      seatUpdate[`seats.layout.${seatNumber}.bookedBy`] = userId;
      
      // If seats.available exists, decrement it
      if (typeof fleetData.seats.available === 'number') {
        seatUpdate['seats.available'] = admin.firestore.FieldValue.increment(-1);
      }
      
      // Update the fleet document
      transaction.update(fleetRef, seatUpdate);
      
      // Create the booking
      const booking = {
        userId,
        fleetId,
        route,
        departureDate: admin.firestore.Timestamp.fromDate(new Date(departureDate)),
        seatNumber,
        status: 'pending',
        paymentStatus: 'pending',
        amount: amount || 5000,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      transaction.set(bookingRef, booking);
      
      return { bookingId: bookingRef.id };
    });
  } catch (error) {
    console.error('Booking transaction failed:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});