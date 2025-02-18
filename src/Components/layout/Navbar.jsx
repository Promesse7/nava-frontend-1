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




export default Navbar;