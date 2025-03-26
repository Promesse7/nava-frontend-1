const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set SendGrid API Key from Firebase Config
sgMail.setApiKey(functions.config().sendgrid.key);

// Load email template
const emailTemplatePath = path.join(__dirname, 'booking-confirmation-template.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

// Primary Email Sending Cloud Function
exports.sendBookingEmail = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const bookingData = snap.data();
    
    // Validate required fields
    if (!bookingData.email || !bookingData.customerName) {
      console.error("Missing required booking information");
      return null;
    }

    // Replace placeholders in the email template
    const personalizedEmail = emailTemplate
      .replace('{{customerName}}', bookingData.customerName)
      .replace('{{route}}', bookingData.route || 'Not Specified')
      .replace('{{departureDate}}', bookingData.departureDate || 'Not Specified')
      .replace('{{seatNumber}}', bookingData.seatNumber || 'Not Assigned')
      .replace('{{amount}}', bookingData.amount || '0');

    // Email configuration
    const msg = {
      to: bookingData.email,
      from: "bookings@travelrwanda.com", // Your verified SendGrid email
      subject: "Booking Confirmation - Travel Rwanda",
      html: personalizedEmail,
      text: `Booking Confirmation for ${bookingData.customerName} - Route: ${bookingData.route || 'Not Specified'}`
    };

    try {
      // Send email
      await sgMail.send(msg);
      console.log("Booking confirmation email sent to:", bookingData.email);
      
      // Update booking document
      await snap.ref.update({ 
        emailSent: true, 
        emailSentAt: admin.firestore.FieldValue.serverTimestamp() 
      });

      return null;
    } catch (error) {
      console.error("Error sending email:", error);
      
      // Log email sending failure
      await snap.ref.update({ 
        emailSent: false, 
        emailError: error.toString(),
        emailFailedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    }
  });

// Periodic Email Retry Mechanism
exports.retryFailedEmails = functions.pubsub.schedule('every 1 hours').onRun(async context => {
  try {
    // Find bookings with failed email sends in last 24 hours
    const failedEmailsSnapshot = await admin.firestore()
      .collection('bookings')
      .where('emailSent', '==', false)
      .where('createdAt', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .limit(10)  // Limit to prevent overwhelming SendGrid
      .get();

    const batch = admin.firestore().batch();
    
    failedEmailsSnapshot.forEach(async doc => {
      const bookingData = doc.data();
      
      // Resend email logic similar to primary function
      const personalizedEmail = emailTemplate
        .replace('{{customerName}}', bookingData.customerName)
        .replace('{{route}}', bookingData.route || 'Not Specified')
        .replace('{{departureDate}}', bookingData.departureDate || 'Not Specified')
        .replace('{{seatNumber}}', bookingData.seatNumber || 'Not Assigned')
        .replace('{{amount}}', bookingData.amount || '0');

      const msg = {
        to: bookingData.email,
        from: "bookings@travelrwanda.com",
        subject: "Booking Confirmation - Travel Rwanda",
        html: personalizedEmail
      };

      try {
        await sgMail.send(msg);
        batch.update(doc.ref, { 
          emailSent: true, 
          emailRetriedAt: admin.firestore.FieldValue.serverTimestamp() 
        });
      } catch (error) {
        console.error(`Retry failed for booking ${doc.id}:`, error);
      }
    });

    // Commit batch updates
    await batch.commit();
    return null;
  } catch (error) {
    console.error("Error in email retry mechanism:", error);
    return null;
  }
});

// Optional: Webhook for tracking email events
exports.sendgridWebhook = functions.https.onRequest(async (req, res) => {
  const events = req.body;
  
  events.forEach(async event => {
    switch(event.event) {
      case 'delivered':
        // Update firestore document
        break;
      case 'opened':
        // Track email opens
        break;
      case 'clicked':
        // Track link clicks
        break;
    }
  });

  res.status(200).send('Webhook received');
});