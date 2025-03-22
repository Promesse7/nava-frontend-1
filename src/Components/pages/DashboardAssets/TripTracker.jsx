import React, { useState, useEffect } from 'react';
import { Map, Navigation, Clock, Cloud, Coffee, Newspaper } from 'lucide-react';

const TripTracker = () => {
  // State for the various features
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [destination, setDestination] = useState({ lat: 34.0522, lng: -118.2437 });
  const [tripStats, setTripStats] = useState({ 
    distance: { total: 382, remaining: 382 },
    time: { total: 360, remaining: 360 },
    speed: 65
  });
  const [weather, setWeather] = useState({
    current: { temp: 72, condition: 'Sunny' },
    forecast: [
      { time: '1h', temp: 70, condition: 'Sunny' },
      { time: '2h', temp: 68, condition: 'Partly Cloudy' },
      { time: '3h', temp: 65, condition: 'Cloudy' }
    ]
  });
  const [nearbyStops, setNearbyStops] = useState([
    { name: 'Rest Area 24', distance: 12, amenities: ['Restrooms', 'Food', 'Gas'] },
    { name: 'Viewpoint Overlook', distance: 28, amenities: ['Restrooms', 'Scenic View'] },
    { name: 'Mountain Gas Station', distance: 43, amenities: ['Gas', 'Food', 'Charging'] }
  ]);
  const [routeNews, setRouteNews] = useState([
    { title: 'Road Construction Ahead', content: 'Lane closures on Highway 101 near Santa Barbara', severity: 'medium' },
    { title: 'Local Festival This Weekend', content: 'Increased traffic expected in San Luis Obispo', severity: 'low' },
    { title: 'Accident Cleared', content: 'Previous delay near Ventura has been resolved', severity: 'low' }
  ]);

  // Simulates trip progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTripStats(prev => ({
        ...prev,
        distance: { 
          ...prev.distance, 
          remaining: Math.max(0, prev.distance.remaining - 2) 
        },
        time: { 
          ...prev.time, 
          remaining: Math.max(0, prev.time.remaining - 1) 
        }
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage
  const progressPercent = 100 - (tripStats.distance.remaining / tripStats.distance.total * 100);

  return (
    <div className="flex flex-col w-full mt-2 max-w-6xl mx-auto bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Header with trip overview */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold mb-2">Trip to Bugesera</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Navigation className="mr-2" size={20} />
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" size={20} />
            <span>{Math.floor(tripStats.time.remaining / 60)}h {tripStats.time.remaining % 60}m remaining</span>
          </div>
        </div>
      </div>

      {/* Map section (placeholder) */}
      <div className="bg-blue-100 h-64 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Map size={48} className="text-blue-500" />
          <p className="ml-4 text-blue-800 font-semibold">Interactive Map View</p>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
          <div 
            className="h-full bg-blue-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Trip stats */}
      <div className="flex border-b border-gray-200">
        <div className="flex-1 p-4 text-center border-r border-gray-200">
          <p className="text-sm text-gray-500">Distance Remaining</p>
          <p className="text-xl font-bold">{tripStats.distance.remaining} mi</p>
        </div>
        <div className="flex-1 p-4 text-center border-r border-gray-200">
          <p className="text-sm text-gray-500">Current Speed</p>
          <p className="text-xl font-bold">{tripStats.speed} mph</p>
        </div>
        <div className="flex-1 p-4 text-center">
          <p className="text-sm text-gray-500">ETA</p>
          <p className="text-xl font-bold">5:45 PM</p>
        </div>
      </div>

      {/* Weather section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <Cloud className="mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">Weather Updates</h2>
        </div>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-500">Current</p>
            <p className="font-bold">{weather.current.temp}°F</p>
            <p className="text-sm">{weather.current.condition}</p>
          </div>
          {weather.forecast.map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-500">+{item.time}</p>
              <p className="font-bold">{item.temp}°F</p>
              <p className="text-sm">{item.condition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby stops */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <Coffee className="mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">Nearby Stops</h2>
        </div>
        <div className="space-y-2">
          {nearbyStops.map((stop, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
              <div>
                <p className="font-medium">{stop.name}</p>
                <p className="text-xs text-gray-500">{stop.amenities.join(' • ')}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{stop.distance} mi</p>
                <p className="text-xs text-gray-500">~{Math.round(stop.distance / tripStats.speed * 60)} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route news */}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Newspaper className="mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">Route Updates</h2>
        </div>
        <div className="space-y-2">
          {routeNews.map((news, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${
                news.severity === 'high' ? 'bg-red-100 border-l-4 border-red-500' : 
                news.severity === 'medium' ? 'bg-yellow-100 border-l-4 border-yellow-500' : 
                'bg-blue-50 border-l-4 border-blue-300'
              }`}
            >
              <p className="font-medium">{news.title}</p>
              <p className="text-sm">{news.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripTracker;