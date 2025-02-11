import React, { useState } from 'react';
import { Map } from 'lucide-react';


// RouteMap Component
const RouteMap = ({ origin, destination, stops = [] }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Route Map</h3>
          <Map className="text-gray-500" />
        </div>
  
        <div className="relative py-4">
          {/* Route visualization */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
  
          {/* Origin */}
          <div className="relative flex items-center mb-8">
            <div className="w-4 h-4 rounded-full bg-blue-600 z-10"></div>
            <div className="ml-6">
              <h4 className="font-medium">{origin}</h4>
              <p className="text-sm text-gray-500">Starting Point</p>
            </div>
          </div>
  
          {/* Stops */}
          {stops.map((stop, index) => (
            <div key={index} className="relative flex items-center mb-8">
              <div className="w-3 h-3 rounded-full bg-gray-400 z-10"></div>
              <div className="ml-6">
                <h4 className="font-medium">{stop.name}</h4>
                <p className="text-sm text-gray-500">{stop.time}</p>
              </div>
            </div>
          ))}
  
          {/* Destination */}
          <div className="relative flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 z-10"></div>
            <div className="ml-6">
              <h4 className="font-medium">{destination}</h4>
              <p className="text-sm text-gray-500">Destination</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default RouteMap;