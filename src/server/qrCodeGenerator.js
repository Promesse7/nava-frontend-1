const QRCode = require("qrcode");

async function generateQRCode(ticketURL) {
    try {
        return await QRCode.toDataURL(ticketURL); // Generates a Base64 QR code
    } catch (error) {
        console.error("QR Code Generation Error:", error);
        return null;
    }
}

module.exports = { generateQRCode };
