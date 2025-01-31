import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

// 2. BusList Component - Essential for displaying search results
const BusList = ({ buses }) => {
    const [sortBy, setSortBy] = useState('price');
  
    const sortedBuses = [...buses].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });
  
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Buses</h2>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="price">Sort by Price</option>
            <option value="time">Sort by Time</option>
          </select>
        </div>
  
        <div className="space-y-4">
          {sortedBuses.map((bus) => (
            <div key={bus.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{bus.companyName}</h3>
                  <p className="text-gray-600">{bus.busType}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-blue-600">${bus.price}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="font-bold">{bus.departureTime}</p>
                  <p className="text-sm text-gray-500">{bus.origin}</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-right">
                  <p className="font-bold">{bus.arrivalTime}</p>
                  <p className="text-sm text-gray-500">{bus.destination}</p>
                </div>
              </div>
  
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">{bus.seatsAvailable} seats available</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  export default BusList;