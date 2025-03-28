const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const fs = require("fs").promises;
const path = require("path");
const QRCode = require("qrcode");

// Configuration - IMPORTANT: Use environment variables in production
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const EMAIL_TEMPLATE_PATH = path.join(__dirname, "booking-confirmation-template.html");
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "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";
const FROM_EMAIL = process.env.FROM_EMAIL || "promesserukundo@gmail.com";
const NEW_BOOKING_THRESHOLD_SECONDS = 300; // 5 minutes

// Enhanced Logging Function
function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  console[type === "error" ? "error" : "log"](`[${timestamp}] ${message}`);
}

// Initialize Firebase Admin
function initFirebase() {
  try {
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    log("Firebase Admin initialized successfully");
  } catch (error) {
    log(`Firebase initialization failed: ${error.message}`, "error");
    process.exit(1);
  }
}

// Set up SendGrid
function initSendGrid() {
  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    log("SendGrid initialized successfully");
  } catch (error) {
    log(`SendGrid initialization failed: ${error.message}`, "error");
    process.exit(1);
  }
}

// Load Email Template
async function loadEmailTemplate() {
  try {
    const template = await fs.readFile(EMAIL_TEMPLATE_PATH, "utf8");
    log("Email template loaded successfully");
    return template;
  } catch (error) {
    log(`Failed to load email template: ${error.message}`, "error");
    throw error;
  }
}

// Generate QR Code
async function generateQRCode(bookingData) {
  // Validate input data
  if (!bookingData || Object.keys(bookingData).length === 0) {
    log('No booking data provided for QR code generation', 'error');
    throw new Error('Invalid booking data');
  }

  try {
    // Ensure all required fields are present
    const requiredFields = ['customerName', 'route', 'seatNumber', 'id'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);
    
    if (missingFields.length > 0) {
      log(`Missing QR code fields: ${missingFields.join(', ')}`, 'error');
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Prepare QR code data
    const qrData = JSON.stringify({
      customerName: bookingData.customerName,
      route: bookingData.route,
      seatNumber: bookingData.seatNumber,
      bookingId: bookingData.id,
    });

    // Detailed logging of QR data
    log(`Generating QR Code with data: ${qrData}`, 'info');

    const qrCodeOptions = {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      width: 200,
      margin: 1,
    };

    return new Promise((resolve, reject) => {
      // Use try-catch within the callback for more comprehensive error handling
      QRCode.toDataURL(qrData, qrCodeOptions, (err, url) => {
        try {
          if (err) {
            log(`QR Code generation failed: ${err.message}`, "error");
            log(`Full error details: ${JSON.stringify(err)}`, "error");
            reject(err);
          } else {
            // Verify the generated URL
            if (!url || url.length === 0) {
              log('Generated QR code URL is empty', 'error');
              reject(new Error('Empty QR code URL'));
            }
            
            log(`QR Code successfully generated. URL length: ${url.length}`, 'info');
            resolve(url);
          }
        } catch (callbackError) {
          log(`Unexpected error in QR code generation callback: ${callbackError.message}`, 'error');
          reject(callbackError);
        }
      });
    });
  } catch (error) {
    log(`QR Code generation error: ${error.message}`, "error");
    log(`Full error details: ${JSON.stringify(error)}`, "error");
    throw error;
  }
}

// Personalize Email Template
function personalizeEmailTemplate(template, bookingData, qrCodeUrl) {
  return template
    .replace("{{customerName}}", bookingData.customerName || "Valued Customer")
    .replace("{{route}}", bookingData.route || "Not Specified")
    .replace("{{departureDate}}", bookingData.departureDate || "Not Specified")
    .replace("{{seatNumber}}", bookingData.seatNumber || "Not Assigned")
    .replace("{{amount}}", bookingData.amount ? `$${bookingData.amount}` : "Not Specified")
    .replace(
      "{{qrCode}}",
      `
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qrCodeUrl}" alt="Booking QR Code" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
      </div>
    `
    );
}

// Send Booking Confirmation Email
async function sendBookingConfirmationEmail(bookingData, emailTemplate) {
  try {
    const qrCodeUrl = await generateQRCode(bookingData);
    const personalizedEmail = personalizeEmailTemplate(emailTemplate, bookingData, qrCodeUrl);

    const emailMessage = {
      to: bookingData.email,
      from: FROM_EMAIL,
      subject: "Booking Confirmation - Travel Service",
      html: personalizedEmail,
      text: `Booking Confirmation for ${bookingData.customerName} - Route: ${bookingData.route}`,
    };

    await sgMail.send(emailMessage);
    log(`Email sent successfully to ${bookingData.email}`);
    return true;
  } catch (error) {
    log(`Email sending failed: ${error.message}`, "error");
    throw error;
  }
}

// Process New Booking
async function processNewBooking(bookingSnapshot) {
  const bookingData = bookingSnapshot.data();
  const bookingId = bookingSnapshot.id;

  log(`Detected booking ${bookingId} for ${bookingData.email}`);

  if (!bookingData.email) {
    log(`Skipping booking ${bookingId}: No email provided`, "error");
    return false;
  }

  // Check if email was already sent (optional, since field might not exist initially)
  if (bookingData.emailSent === true) {
    log(`Skipping booking ${bookingId}: Email already sent`);
    return false;
  }

  try {
    const emailTemplate = await loadEmailTemplate();
    await sendBookingConfirmationEmail({ ...bookingData, id: bookingId }, emailTemplate);

    await bookingSnapshot.ref.update({
      emailSent: true,
      emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    log(`Booking ${bookingId} processed successfully`);
    log(`Email sent to ${bookingData.email} successfully`);
    return true;
  } catch (error) {
    await bookingSnapshot.ref.update({
      emailSent: false,
      emailError: error.message,
      emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    log(`Failed to process booking ${bookingId}`, "error");
    return false;
  }
}

// Main Booking Listener
function startBookingListener() {
  const db = admin.firestore();

  db.collection("bookings")
    .onSnapshot(
      async (snapshot) => {
        const changes = snapshot.docChanges();
        if (changes.length === 0) {
          log("No changes detected in bookings");
          return;
        }

        log(`Detected ${changes.length} change(s) in bookings`);
        for (const change of changes) {
          if (change.type === "added") {
            const bookingData = change.doc.data();
            const bookingId = change.doc.id;

            log(`New booking detected: ${bookingId}`);
            await processNewBooking(change.doc);
          } else {
            log(`Ignoring change type '${change.type}' for booking ${change.doc.id}`);
          }
        }
      },
      (error) => {
        log(`Firestore snapshot error: ${error.message}`, "error");
      }
    );

  log("Booking email processor is running and listening for new bookings");
}

// Initialization and Startup
async function main() {
  try {
    initFirebase();
    initSendGrid();
    startBookingListener();
  } catch (error) {
    log(`Startup failed: ${error.message}`, "error");
    process.exit(1);
  }
}

// Start the application
main();

// Graceful Shutdown
process.on("SIGINT", () => {
  log("Received shutdown signal, closing connections...");
  admin.app().delete();
  process.exit(0);
});