import React, { useState } from 'react';
import { MapPin, Clock, Star, ChevronDown, ChevronUp, Bus, Calendar } from 'lucide-react';

const BusCompaniesDisplay = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedRoutes, setExpandedRoutes] = useState({});

  // Sample data for bus companies
  const busCompanies = [
    {
      id: 1,
      name: "Express Lines",
      rating: 4.8,
      trips: 200,
      yearsActive: 15,
      logo: "/api/placeholder/100/100",
      fleetSize: 45,
      routes: [
        {
          id: 'r1',
          from: 'New York',
          to: 'Boston',
          duration: '4h 15m',
          stops: ['Hartford', 'Worcester'],
          departureTime: ['06:00', '09:00', '12:00', '15:00'],
          price: '$45',
          coordinates: [
            { lat: 40.7128, lng: -74.0060 }, // NY
            { lat: 42.3601, lng: -71.0589 }  // Boston
          ]
        },
        {
          id: 'r2',
          from: 'Boston',
          to: 'Washington DC',
          duration: '8h 30m',
          stops: ['New York', 'Philadelphia', 'Baltimore'],
          departureTime: ['07:00', '10:00', '13:00'],
          price: '$75',
          coordinates: [
            { lat: 42.3601, lng: -71.0589 }, // Boston
            { lat: 38.9072, lng: -77.0369 }  // DC
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Comfort Coach",
      rating: 4.6,
      trips: 150,
      yearsActive: 10,
      logo: "/api/placeholder/100/100",
      fleetSize: 35,
      routes: [
        {
          id: 'r3',
          from: 'Chicago',
          to: 'Detroit',
          duration: '4h 45m',
          stops: ['Gary', 'Kalamazoo'],
          departureTime: ['08:00', '11:00', '14:00'],
          price: '$55',
          coordinates: [
            { lat: 41.8781, lng: -87.6298 }, // Chicago
            { lat: 42.3314, lng: -83.0458 }  // Detroit
          ]
        }
      ]
    }
  ];

  const toggleRoutes = (companyId) => {
    setExpandedRoutes(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  // SVG Map Component with Routes
  const RouteMap = ({ routes }) => (
    <svg className="w-full h-64" viewBox="0 0 800 400">
      {/* US Map outline placeholder */}
      <path
        d="M100,100 L700,100 L700,300 L100,300 Z"
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="2"
      />
      
      {/* Route lines */}
      {routes.map((route, index) => (
        <g key={index}>
          <line
            x1={100 + (route.coordinates[0].lng + 140) * 2}
            y1={100 + (route.coordinates[0].lat - 30) * 2}
            x2={100 + (route.coordinates[1].lng + 140) * 2}
            y2={100 + (route.coordinates[1].lat - 30) * 2}
            stroke="black"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          {/* City markers */}
          <circle
            cx={100 + (route.coordinates[0].lng + 140) * 2}
            cy={100 + (route.coordinates[0].lat - 30) * 2}
            r="4"
            fill="red"
          />
          <circle
            cx={100 + (route.coordinates[1].lng + 140) * 2}
            cy={100 + (route.coordinates[1].lat - 30) * 2}
            r="4"
            fill="red"
          />
        </g>
      ))}
    </svg>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Available Bus Companies</h2>
      
      <div className="grid grid-cols-1 gap-8">
        {busCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{company.name}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="ml-1">{company.rating}</span>
                      </div>
                      <div className="text-gray-600">
                        {company.trips}+ trips
                      </div>
                      <div className="text-gray-600">
                        {company.yearsActive} years of service
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRoutes(company.id)}
                  className="text-gray-500 hover:text-black"
                >
                  {expandedRoutes[company.id] ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </div>

              {/* Expanded Route Information */}
              {expandedRoutes[company.id] && (
                <div className="mt-6 space-y-8">
                  {/* Route Map */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-lg font-semibold mb-4">Route Map</h4>
                    <RouteMap routes={company.routes} />
                  </div>

                  {/* Routes List */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Available Routes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {company.routes.map((route) => (
                        <div
                          key={route.id}
                          className="bg-gray-50 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{route.from} → {route.to}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{route.duration}</span>
                              </div>
                            </div>
                            <div className="text-lg font-bold">{route.price}</div>
                          </div>

                          {/* Departure Times */}
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Departure Times</h5>
                            <div className="flex flex-wrap gap-2">
                              {route.departureTime.map((time, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white rounded-full text-sm border"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Stops */}
                          <div>
                            <h5 className="text-sm font-medium mb-2">Stops</h5>
                            <div className="flex flex-wrap gap-2">
                              {route.stops.map((stop, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white rounded-full text-sm border"
                                >
                                  {stop}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors mt-4">
                            View Schedule
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusCompaniesDisplay;