import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

// 1. Navbar Component - Essential for navigation
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">BusBook</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/search" className="text-gray-700 hover:text-blue-600">Find Buses</a>
            <a href="/bookings" className="text-gray-700 hover:text-blue-600">My Bookings</a>
            {isLoggedIn ? (
              <button className="flex items-center text-gray-700 hover:text-blue-600">
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            ) : (
              <button className="flex items-center text-gray-700 hover:text-blue-600">
                <User className="w-5 h-5 mr-1" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <a href="/" className="block py-2 text-gray-700">Home</a>
            <a href="/search" className="block py-2 text-gray-700">Find Buses</a>
            <a href="/bookings" className="block py-2 text-gray-700">My Bookings</a>
            {isLoggedIn ? (
              <button className="flex items-center py-2 text-gray-700">
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            ) : (
              <button className="flex items-center py-2 text-gray-700">
                <User className="w-5 h-5 mr-1" />
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};


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

export { Navbar, BusList, PaymentForm };