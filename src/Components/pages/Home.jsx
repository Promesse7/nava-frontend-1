import React, { useState } from 'react';
import BusCompaniesDisplay from './BusCompaniesDisplay'
import { Search, Calendar, MapPin, Users, Clock, Bus, ArrowRight, Star, Shield, Phone, Filter, CreditCard, Menu, X, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedBusType, setSelectedBusType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const popularRoutes = [
    { 
      from: 'New York', 
      to: 'Boston', 
      price: 45, 
      duration: '4h 15m',
      busType: 'Luxury',
      amenities: ['WiFi', 'Power Outlets', 'Restroom'],
      departureTime: '08:00 AM',
      arrivalTime: '12:15 PM',
      availableSeats: 23,
      company: 'Express Lines',
      rating: 4.8
    },
    // Add more routes as needed
  ];

  const busTypes = ['All', 'Economy', 'Business', 'Luxury', 'Sleeper'];
  const amenities = ['WiFi', 'Power Outlets', 'Restroom', 'TV', 'Reclining Seats', 'Snacks'];

  const handleSearch = () => {
    // Simulate search functionality
    setIsSearched(true);
    setSearchResults(popularRoutes);
  };

  const BusFilterSection = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <button onClick={() => setShowFilters(!showFilters)} className="text-gray-500">
          <Filter size={20} />
        </button>
      </div>
      
      {showFilters && (
        <div className="space-y-6">
          {/* Bus Type Filter */}
          <div>
            <h4 className="font-medium mb-2">Bus Type</h4>
            <div className="flex flex-wrap gap-2">
              {busTypes.map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-lg ${
                    selectedBusType === type.toLowerCase() 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedBusType(type.toLowerCase())}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-medium mb-2">Price Range</h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="200"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Amenities Filter */}
          <div>
            <h4 className="font-medium mb-2">Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PassengerSelector = () => (
    <div className="relative">
      <label className="block text-gray-700 text-sm font-medium mb-2">Passengers</label>
      <button
        onClick={() => setShowPassengerModal(!showPassengerModal)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent flex justify-between items-center"
      >
        <span>{passengers} Passenger(s)</span>
        <ChevronDown size={20} className="text-gray-400" />
      </button>

      {showPassengerModal && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border p-4 z-50">
          <div className="flex items-center justify-between">
            <span>Adults</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                -
              </button>
              <span>{passengers}</span>
              <button
                onClick={() => setPassengers(passengers + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const SearchResults = () => (
    isSearched && (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <BusFilterSection />
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            {searchResults.map((bus, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow mb-4">
                <div className="flex flex-col md:flex-row justify-between">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-xl font-bold">{bus.company}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="ml-1">{bus.rating}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500">Departure</p>
                        <p className="font-semibold">{bus.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Arrival</p>
                        <p className="font-semibold">{bus.arrivalTime}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {bus.amenities.map((amenity, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price and Booking */}
                  <div className="md:w-48 flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${bus.price}</p>
                      <p className="text-gray-500">{bus.availableSeats} seats left</p>
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4">
                      Select Seats
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold">BusGo</span>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-black">My Bookings</a>
                <a href="#" className="text-gray-700 hover:text-black">Support</a>
                <a href="#" className="text-gray-700 hover:text-black">About Us</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden md:block px-4 py-2 rounded-lg border border-black">
                Sign In
              </button>
              <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a href="#" className="block text-gray-700">My Bookings</a>
            <a href="#" className="block text-gray-700">Support</a>
            <a href="#" className="block text-gray-700">About Us</a>
            <button className="w-full px-4 py-2 rounded-lg border border-black">
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-black text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-900 opacity-90" />
        <div className="relative container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Your Journey Begins Here</h1>
          <p className="text-xl mb-12 text-gray-300 text-center max-w-2xl mx-auto">
  Discover seamless bus travel with real-time booking, comfortable seats, and premium service.
</p>


          {/* Enhanced Search Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Departure City"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Destination City"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <PassengerSelector />

              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">Search</label>
                <button 
                  onClick={handleSearch}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <Search size={20} />
                  <span>Find Buses</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <SearchResults />

      {/* Features Section and rest of the content remains the same */}


     <BusCompaniesDisplay />

    </div>
  );
};

export default HomePage;