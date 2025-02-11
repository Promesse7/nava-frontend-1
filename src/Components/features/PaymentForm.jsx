import React, { useState } from 'react';
import Input from '../ui/Input';

// 3. PaymentForm Component - Essential for completing bookings
const PaymentForm = ({ amount, onPaymentComplete }) => {
    const [paymentData, setPaymentData] = useState({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      name: ''
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Here you would integrate with your payment processor
      console.log('Processing payment:', paymentData);
      onPaymentComplete?.();
    };
  
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
        <div className="mb-6">
          <p className="text-gray-600">Total Amount</p>
          <p className="text-3xl font-bold text-blue-600">${amount}</p>
        </div>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full p-3 border rounded-lg"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
              maxLength="19"
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full p-3 border rounded-lg"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full p-3 border rounded-lg"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                maxLength="3"
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1">Card Holder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full p-3 border rounded-lg"
              value={paymentData.name}
              onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pay Now
          </button>
        </form>
      </div>
    );
  };

  export default PaymentForm;