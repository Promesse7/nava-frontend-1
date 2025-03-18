// Add these imports at the top of your file
import { useState } from 'react';
import { FaMoneyBillWave, FaUniversity, FaMobileAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

// Add this state in your component
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentMethod, setPaymentMethod] = useState(null);
const [paymentDetails, setPaymentDetails] = useState({
  momoPhone: '',
  momoName: '',
  bankName: '',
  accountNumber: '',
  accountName: ''
});
const [paymentStep, setPaymentStep] = useState(1);
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [paymentComplete, setPaymentComplete] = useState(false);
const [selectedTrip, setSelectedTrip] = useState(null);

// Add these functions to your component
const openPaymentModal = (trip) => {
  setSelectedTrip(trip);
  setPaymentMethod(null);
  setPaymentStep(1);
  setPaymentComplete(false);
  setShowPaymentModal(true);
};

const handlePaymentDetailsChange = (e) => {
  setPaymentDetails({
    ...paymentDetails,
    [e.target.name]: e.target.value
  });
};

const validatePaymentDetails = () => {
  if (paymentMethod === 'momo') {
    return paymentDetails.momoPhone.length >= 10 && paymentDetails.momoName.length > 0;
  } else if (paymentMethod === 'bank') {
    return paymentDetails.bankName.length > 0 && 
           paymentDetails.accountNumber.length > 0 && 
           paymentDetails.accountName.length > 0;
  }
  return false;
};

const processPayment = () => {
  setIsProcessingPayment(true);
  // Simulate payment processing
  setTimeout(() => {
    setIsProcessingPayment(false);
    setPaymentComplete(true);
    setPaymentStep(3);
    // Here you would normally update the trip's payment status in your database
  }, 2000);
};

// Add this JSX in your component where you want the payment button to appear
// For example, you might add it in the upcoming trips card buttons section:

// Replace existing button with this in your trip card:
<div className="border-t border-gray-100 pt-4 mt-2 flex justify-between">
  <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors flex items-center">
    <FaInfoCircle className="mr-2" /> Details
  </button>
  <button
    onClick={() => openPaymentModal(trip)}
    className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors flex items-center"
  >
    <FaMoneyBillWave className="mr-2" /> Pay Now
  </button>
  <button
    onClick={() => cancelBooking(trip.id)}
    className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
  >
    <FaRegTimesCircle className="mr-2" /> Cancel
  </button>
</div>

// Add this payment modal to your component, right before the Toaster component:
{showPaymentModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {paymentStep === 1 ? "Select Payment Method" : 
           paymentStep === 2 ? `${paymentMethod === 'momo' ? 'Mobile Money' : 'Bank'} Details` :
           "Payment Confirmation"}
        </h3>
        <button
          onClick={() => setShowPaymentModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </div>

      {selectedTrip && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <FaCar className="text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">{selectedTrip.vehicle?.name || "Booked Vehicle"}</p>
              <p className="text-sm text-gray-500">
                {formatDate(selectedTrip.departureDate)}
              </p>
              <p className="text-sm font-semibold text-indigo-600 mt-1">
                Amount: {selectedTrip.amount?.toFixed(2) || "0.00"} Rwf
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentStep === 1 && (
        <>
          <p className="text-gray-600 mb-4">Choose your preferred payment method:</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                paymentMethod === 'momo' 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setPaymentMethod('momo')}
            >
              <div className="bg-indigo-100 p-3 rounded-full mb-3">
                <FaMobileAlt className="text-indigo-600 text-xl" />
              </div>
              <p className="font-medium">Mobile Money</p>
              <p className="text-xs text-gray-500 text-center mt-1">Pay with MTN MoMo</p>
            </div>
            
            <div 
              className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                paymentMethod === 'bank' 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => setPaymentMethod('bank')}
            >
              <div className="bg-indigo-100 p-3 rounded-full mb-3">
                <FaUniversity className="text-indigo-600 text-xl" />
              </div>
              <p className="font-medium">Bank Account</p>
              <p className="text-xs text-gray-500 text-center mt-1">Pay with your bank account</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setPaymentStep(2)}
              disabled={!paymentMethod}
              className={`px-6 py-2 rounded-md flex items-center ${
                paymentMethod 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue <FaArrowRight className="ml-2" />
            </button>
          </div>
        </>
      )}

      {paymentStep === 2 && (
        <>
          {paymentMethod === 'momo' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMobileAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="momoPhone"
                    value={paymentDetails.momoPhone}
                    onChange={handlePaymentDetailsChange}
                    placeholder="e.g. 078XXXXXXX"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Account Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="momoName"
                    value={paymentDetails.momoName}
                    onChange={handlePaymentDetailsChange}
                    placeholder="Name on MoMo account"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm text-yellow-700">
                  You will receive a prompt on your phone to complete the payment.
                </p>
              </div>
            </div>
          )}
          
          {paymentMethod === 'bank' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Bank Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="bankName"
                    value={paymentDetails.bankName}
                    onChange={handlePaymentDetailsChange}
                    placeholder="e.g. Bank of Kigali"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Account Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountNumber"
                    value={paymentDetails.accountNumber}
                    onChange={handlePaymentDetailsChange}
                    placeholder="Your account number"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Account Holder Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountName"
                    value={paymentDetails.accountName}
                    onChange={handlePaymentDetailsChange}
                    placeholder="Name on bank account"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between space-x-3 mt-6">
            <button
              onClick={() => setPaymentStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <button
              onClick={processPayment}
              disabled={!validatePaymentDetails()}
              className={`px-6 py-2 rounded-md flex items-center ${
                validatePaymentDetails()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </div>
        </>
      )}

      {paymentStep === 3 && (
        <div className="text-center py-6">
          {isProcessingPayment ? (
            <>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Processing Payment</h3>
              <p className="text-gray-500">Please wait while we process your payment...</p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Successful!</h3>
              <p className="text-gray-500 mb-6">Your booking has been confirmed.</p>
              <p className="text-sm bg-gray-50 p-3 rounded-md text-gray-600 mb-6">
                Reference ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  </div>
)}