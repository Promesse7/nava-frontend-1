import React, { useState } from 'react';
import { Plane, Calendar, CreditCard, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const bookingSteps = [
    {
      icon: <MapPin className="w-12 h-12 text-blue-600" />,
      title: "Choose Destination",
      description: "Select your dream destination from our extensive network of routes."
    },
    {
      icon: <Calendar className="w-12 h-12 text-green-600" />,
      title: "Pick Date & Time",
      description: "Find the perfect schedule that fits your travel plans."
    },
    {
      icon: <Plane className="w-12 h-12 text-purple-600" />,
      title: "Select Ticket",
      description: "Choose from economy, business, or premium class options."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-indigo-600" />,
      title: "Complete Booking",
      description: "Secure payment and instant ticket confirmation."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Plane className="w-10 h-10 text-blue-700" />
          <h1 className="text-2xl font-bold text-gray-800">Travel Rwanda</h1>
        </div>
        <nav className="space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition">Destinations</a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition">Support</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 py-12">
        {/* Left Side - Animated Booking Steps */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Book Your Journey in <span className="text-blue-600">4 Easy Steps</span>
          </h2>

          {bookingSteps.map((step, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg shadow-md transition-all duration-300 transform 
                ${activeStep === index 
                  ? 'scale-105 bg-white border-2 border-blue-500' 
                  : 'bg-gray-50 hover:bg-white hover:scale-102'}`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className="flex items-center space-x-4">
                {step.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Hero Illustration */}
        <div className="relative flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl">
            <div className="flex space-x-4 items-center mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-800">Kigali</h4>
                <p className="text-sm text-gray-500">Destination Selected</p>
              </div>
            </div>
            <div className="flex space-x-4 items-center mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-gray-800">March 15, 2025</h4>
                <p className="text-sm text-gray-500">Departure Date</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center" onClick={ () => navigate('/login')} >
              Start Booking <ChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 text-center">
        <p className="text-gray-600">© 2025 Travel Rwanda. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;