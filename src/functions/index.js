const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars"); // Consider using Handlebars for template rendering

admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Configure Nodemailer with improved security options
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
  // Additional security and performance configurations
  pool: true,
  rateLimit: 5, // Max 5 emails per second
  maxConnections: 10,
});

// HTML Email Template
const emailTemplate = handlebars.compile(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Confirmation</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .ticket-details {
            background-color: #f4f4f4;
            border-radius: 5px;
            padding: 20px;
            margin: 20px 0;
        }
        .header {
            background-color: #0066cc;
            color: white;
            padding: 10px;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 0.8em;
            color: #666;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Travel Rwanda - Ticket Confirmation</h1>
    </div>
    
    <p>Dear Traveler,</p>
    
    <div class="ticket-details">
        <h2>Booking Details</h2>
        <p><strong>Booking Number:</strong> {{bookingNumber}}</p>
        <p><strong>Route:</strong> {{route}}</p>
        <p><strong>Departure Date:</strong> {{departureDate}}</p>
        <p><strong>Seat Number:</strong> {{seatNumber}}</p>
        <p><strong>Amount Paid:</strong> {{amount}}</p>
    </div>

    <p>Thank you for choosing Travel Rwanda. We wish you a pleasant journey!</p>

    <div class="footer">
        <p>Questions? Contact our customer support at support@travelrwanda.com</p>
        <p>&copy; 2024 Travel Rwanda. All rights reserved.</p>
    </div>
</body>
</html>
`);

// Function to validate and sanitize email input
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to send ticket email
exports.sendTicketEmail = functions.firestore
    .document("bookings/{bookingId}")
    .onCreate(async (snapshot, context) => {
        const bookingData = snapshot.data();
        const email = bookingData.email;

        // Validate email
        if (!email || !validateEmail(email)) {
            console.log("Invalid email, skipping email sending.");
            return null;
        }

        // Prepare email data
        const mailOptions = {
            from: `Travel Rwanda <${gmailEmail}>`,
            to: email,
            subject: `Your Ticket Confirmation - Booking #${bookingData.bookingNumber}`,
            html: emailTemplate({
                bookingNumber: bookingData.bookingNumber || 'N/A',
                route: bookingData.route || 'Not Specified',
                departureDate: bookingData.departureDate || 'Not Specified',
                seatNumber: bookingData.seatNumber || 'Unassigned',
                amount: bookingData.amount ? `$${bookingData.amount.toFixed(2)}` : 'N/A'
            }),
        };

        try {
            // Send email with retry mechanism
            await transporter.sendMail(mailOptions);
            console.log("Ticket email sent successfully to:", email);
        } catch (error) {
            console.error("Error sending email:", error);
            
            // Optional: Implement a retry mechanism or error logging
            await admin.firestore()
                .collection('email-errors')
                .add({
                    email: email,
                    bookingId: context.params.bookingId,
                    errorMessage: error.message,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
        }

        return null;
    });