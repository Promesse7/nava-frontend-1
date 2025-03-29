import React, { useState } from 'react';
import { MapPin, Clock, Star, ChevronDown, ChevronUp, Bus, Calendar } from 'lucide-react';
import HorizonCar from '../../assets/horizon.jpg';
import RitcoCar from '../../assets/ritco logo.jpg';
import VirungaCar from '../../assets/virunga.jpg';
import VolcanoCar from '../../assets/volcano.jpg';
import YegoCar from '../../assets/yego car.jpg';
import AlphaCar from '../../assets/alpha.jpg';
import ExcelCar from '../../assets/excel.webp';
import MoveCar from '../../assets/move car.jpg';
import OmegaCar from '../../assets/omega.jpg';






const BusCompaniesDisplay = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedRoutes, setExpandedRoutes] = useState({});

  // Sample data for bus companies
  const busCompanies = [
    {
      id: 1,
      name: "RITCO LTD",
      rating: 4.8,
      trips: 200,
      yearsActive: 15,
      logo: RitcoCar,
      fleetSize: 45,
      routes: [
        {
          id: 'r1',
          from: 'Muhanga',
          to: 'Kigali',
          duration: '4h 15m',
          stops: ['Kamonyi', 'Ruyenzi'],
          departureTime: ['06:00', '09:00', '12:00', '15:00'],
          price: '45,000',
          coordinates: [
            { lat: 40.7128, lng: -74.0060 }, // NY
            { lat: 42.3601, lng: -71.0589 }  // Boston
          ]
        },
        {
          id: 'r2',
          from: 'Huye',
          to: 'Musanze',
          duration: '8h 30m',
          stops: ['Ruhango', 'Muhanga', 'Kigali'],
          departureTime: ['07:00', '10:00', '13:00'],
          price: '75,000',
          coordinates: [
            { lat: 42.3601, lng: -71.0589 }, // Boston
            { lat: 38.9072, lng: -77.0369 }  // DC
          ]
        }
      ]
    },
    {
      id: 2,
      name: "HORIZON Express",
      rating: 4.6,
      trips: 150,
      yearsActive: 10,
      logo: HorizonCar,
      fleetSize: 35,
      routes: [
        {
          id: 'r3',
          from: 'Muhanga',
          to: 'Rubavu',
          duration: '4h 45m',
          stops: ['Ngororero', 'Musanze'],
          departureTime: ['08:00', '11:00', '14:00'],
          price: '55,000',
          coordinates: [
            { lat: 41.8781, lng: -87.6298 }, // Chicago
            { lat: 42.3314, lng: -83.0458 }  // Detroit
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Virunga Express",
      rating: 4.5,
      trips: 180,
      yearsActive: 12,
      logo: VirungaCar,
      fleetSize: 40,
      routes: [
        {
          id: "r3",
          from: "Rubavu",
          to: "Kigali",
          duration: "3h 45m",
          stops: ["Musanze", "Nyabugogo"],
          departureTime: ["06:30", "10:30", "14:30"],
          price: "50,000",
          coordinates: [
            { lat: -1.679, lng: 29.233 }, // Rubavu
            { lat: -1.950, lng: 30.060 } // Kigali
          ]
        }
      ]
    },
    {
      id: 4,
      name: "Alpha Express",
      rating: 4.7,
      trips: 160,
      yearsActive: 9,
      logo: AlphaCar,
      fleetSize: 30,
      routes: [
        {
          id: "r4",
          from: "Huye",
          to: "Kigali",
          duration: "4h",
          stops: ["Muhanga"],
          departureTime: ["05:00", "08:00", "12:00"],
          price: "48,000",
          coordinates: [
            { lat: -2.591, lng: 29.738 }, // Huye
            { lat: -1.950, lng: 30.060 } // Kigali
          ]
        }
      ]
    },
    {
      id: 5,
      name: "Excel",
      rating: 4.6,
      trips: 140,
      yearsActive: 8,
      logo: ExcelCar,
      fleetSize: 25,
      routes: [
        {
          id: "r5",
          from: "Musanze",
          to: "Kigali",
          duration: "2h 45m",
          stops: ["Nyirangarama"],
          departureTime: ["06:00", "09:30", "13:00"],
          price: "40,000",
          coordinates: [
            { lat: -1.500, lng: 29.633 }, // Musanze
            { lat: -1.950, lng: 30.060 } // Kigali
          ]
        }
      ]
    },
    {
      id: 6,
      name: "Volcano",
      rating: 4.9,
      trips: 190,
      yearsActive: 14,
      logo: VolcanoCar,
      fleetSize: 50,
      routes: [
        {
          id: "r6",
          from: "Kigali",
          to: "Gisenyi",
          duration: "3h 15m",
          stops: ["Nyabihu", "Musanze"],
          departureTime: ["07:00", "11:00", "15:00"],
          price: "55,000",
          coordinates: [
            { lat: -1.950, lng: 30.060 }, // Kigali
            { lat: -1.678, lng: 29.263 } // Gisenyi
          ]
        }
      ]
    },
    {
      id: 7,
      name: "Omega",
      rating: 4.3,
      trips: 120,
      yearsActive: 7,
      logo: OmegaCar,
      fleetSize: 20,
      routes: [
        {
          id: "r7",
          from: "Nyagatare",
          to: "Kigali",
          duration: "5h",
          stops: ["Kayonza"],
          departureTime: ["06:30", "10:00", "14:00"],
          price: "60,000",
          coordinates: [
            { lat: -1.320, lng: 30.320 }, // Nyagatare
            { lat: -1.950, lng: 30.060 } // Kigali
          ]
        }
      ]
    },
    {
      id: 8,
      name: "Move",
      rating: 4.2,
      trips: 100,
      yearsActive: 5,
      logo: MoveCar,
      fleetSize: 15,
      routes: [
        {
          id: "r8",
          from: "Kigali",
          to: "Rwamagana",
          duration: "1h 30m",
          stops: ["Kayonza"],
          departureTime: ["08:00", "12:00", "16:00"],
          price: "35,000",
          coordinates: [
            { lat: -1.950, lng: 30.060 }, // Kigali
            { lat: -1.948, lng: 30.432 } // Rwamagana
          ]
        }
      ]
    },
    {
      id: 9,
      name: "Yego Cabs",
      rating: 4.8,
      trips: 250,
      yearsActive: 6,
      logo: YegoCar,
      fleetSize: 60,
      routes: [
        {
          id: "r9",
          from: "Kigali",
          to: "Anywhere in Rwanda",
          duration: "Varies",
          stops: ["On-demand"],
          departureTime: ["24/7 Service"],
          price: "Depends on distance",
          coordinates: []
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
    <svg className="w-full h-60" viewBox="0 0 800 400">
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
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Available Bus Companies</h2>
      
      <div className="grid grid-cols-1 gap-6 max-h-[50vh] overflow-y-auto p-2">
        {busCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-2xl shadow-lg overflow-hidden ">
            <div className="p-4">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-14 h-14 rounded-lg object-cover"
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
