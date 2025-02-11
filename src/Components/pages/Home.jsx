import React, { useState } from 'react';
import { Search, Calendar, MapPin, Users, Clock, Bus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const HomePage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');

  const popularRoutes = [
    { from: 'New York', to: 'Boston', price: '$45' },
    { from: 'Chicago', to: 'Detroit', price: '$35' },
    { from: 'Los Angeles', to: 'San Francisco', price: '$55' }
  ];

  const companies = [
    { name: 'Express Lines', rating: '4.8', trips: '200+' },
    { name: 'Comfort Coach', rating: '4.7', trips: '150+' },
    { name: 'City Link', rating: '4.6', trips: '180+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Book Your Bus Journey</h1>
          <p className="text-xl mb-8">Safe, comfortable, and affordable bus tickets</p>

          {/* Search Form */}
          <Card className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="text-black" />
                <input
                  type="text"
                  placeholder="From"
                  className="w-full p-2 border rounded"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-black-600" />
                <input
                  type="text"
                  placeholder="To"
                  className="w-full p-2 border rounded"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="text-black-600" />
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <button className="bg-black-600 text-white p-2 rounded hover:bg-black-700 transition-colors">
                Search Buses
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" />
                Real-time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              Track your bus location and get instant updates about delays or changes
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Seat Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              Choose your preferred seat from our interactive seating layout
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bus className="mr-2" />
                Multiple Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              Compare prices and services from various bus operators
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{route.from} → {route.to}</p>
                      <p className="text-gray-600">Starting from {route.price}</p>
                    </div>
                    <button className="bg-black-600 text-white px-4 py-2 rounded hover:bg-black-700">
                      Book
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bus Companies Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Our Partner Companies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{company.name}</h3>
                <div className="mt-2">
                  <p>Rating: ⭐ {company.rating}</p>
                  <p>Monthly Trips: {company.trips}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;