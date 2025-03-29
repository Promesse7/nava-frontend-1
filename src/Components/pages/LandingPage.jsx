import React, { useState } from 'react';
import {  Calendar, CreditCard, MapPin, ChevronRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const bookingSteps = [
    {
      icon: <MapPin className="w-12 h-12 text-gray-400" />,
      title: "Choose Destination",
      description: "Select your dream destination from our extensive network of routes."
    },
    {
      icon: <Calendar className="w-12 h-12 text-gray-400" />,
      title: "Pick Date & Time",
      description: "Find the perfect schedule that fits your travel plans."
    },
    {
      icon: <Car className="w-12 h-12 text-gray-400" />,
      title: "Select Ticket",
      description: "Choose from economy, business, or premium class options."
    },
    {
      icon: <CreditCard className="w-12 h-12 text-gray-400" />,
      title: "Complete Booking",
      description: "Secure payment and instant ticket confirmation."
    }
  ];
 
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-gray-100 md:flex md:flex-col  md:justify-center md:items-center">

  
      {/* Header */}
      <header className="p-6 flex justify-between items-center ">
        <div className="flex items-center space-x-3">
          <Car className="w-10 h-10 text-gray-400" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center md:text-left">   Travel Rwanda </h1>


        </div>
        <nav className="space-x-6 ml-[20vw]">
          <a href="#" className="text-gray-700 hover:text-black transition">Home</a>
          <a href="#" className="text-gray-700 hover:text-black transition">Destinations</a>
          <a href="#" className="text-gray-700 hover:text-black transition">Support</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 py-12">
        {/* Left Side - Animated Booking Steps */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Book Your Journey in <span className="text-gray-400">4 Easy Steps</span>
          </h2>

          {bookingSteps.map((step, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg shadow-md transition-all duration-300 transform 
                ${activeStep === index 
                  ? 'scale-105 bg-white border-2 border-gray-400' 
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
          <div className="absolute w-72 h-72 bg-gray-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl">
            <div className="flex space-x-4 items-center mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
              <div>
                <h4 className="font-semibold text-gray-800">Kigali</h4>
                <p className="text-sm text-gray-500">Destination Selected</p>
              </div>
            </div>
            <div className="flex space-x-4 items-center mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
              <div>
                <h4 className="font-semibold text-gray-800">March 15, 2025</h4>
                <p className="text-sm text-gray-500">Departure Date</p>
              </div>
            </div>
            <button className="w-full bg-gray-600 text-white py-3 rounded-lg  hover:bg-gray-400  transition flex items-center justify-center" onClick={ () => navigate('/login')} >
              Start Booking <ChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className=" p-6 text-center">
        <p className="text-gray-600">© 2025 Travel Rwanda by PromCode. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;