const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode"); // Import QRCode package

// Initialize Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set SendGrid API Key
sgMail.setApiKey("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"); 

// Load email template
const emailTemplatePath = path.join(__dirname, "booking-confirmation-template.html");
const emailTemplate = fs.readFileSync(emailTemplatePath, "utf8");

const db = admin.firestore();
db.collection("bookings").onSnapshot(async (snapshot) => {
  for (const change of snapshot.docChanges()) {
    if (change.type === "added") {
      const bookingData = change.doc.data();

      if (!bookingData.email || !bookingData.customerName) {
        console.error("Missing required booking information");
        return;
      }

      // Generate a QR code with booking details
      const bookingInfo = JSON.stringify({
        name: bookingData.customerName,
        route: bookingData.route || "Not Specified",
        date: bookingData.departureDate || "Not Specified",
        seat: bookingData.seatNumber || "Not Assigned",
        amount: bookingData.amount || "0",
      });

      const qrCodeDataURL = await QRCode.toDataURL(bookingInfo);

      // Replace placeholders in email template
      const personalizedEmail = emailTemplate
        .replace("{{customerName}}", bookingData.customerName)
        .replace("{{route}}", bookingData.route || "Not Specified")
        .replace("{{departureDate}}", bookingData.departureDate || "Not Specified")
        .replace("{{seatNumber}}", bookingData.seatNumber || "Not Assigned")
        .replace("{{amount}}", bookingData.amount || "0")
        .replace("{{qrCode}}", `<img src="${qrCodeDataURL}" alt="Booking QR Code" />`);

      const msg = {
        to: bookingData.email,
        from: "promesserukundo@gmail.com",
        subject: "Booking Confirmation - Travel Rwanda",
        html: personalizedEmail,
        text: `Booking Confirmation for ${bookingData.customerName} - Route: ${bookingData.route || "Not Specified"}`,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent to:", bookingData.email);
          change.doc.ref.update({
            emailSent: true,
            emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          change.doc.ref.update({
            emailSent: false,
            emailError: error.toString(),
            emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
    }
  }
});

console.log("Listening for new bookings in Firestore...");
