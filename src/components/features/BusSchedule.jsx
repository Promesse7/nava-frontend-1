import React, { useState } from 'react';
import { Search, Clock, MapPin, Bus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const BusSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data - in real app this would come from props or API
  const schedules = [
    {
      id: 1,
      route: "Route 42",
      destination: "Downtown Terminal",
      departure: "10:00 AM",
      status: "On Time",
      platform: "A",
      stops: ["Central Park", "Main Street", "City Hall"],
      isExpress: true
    },
    {
      id: 2,
      route: "Route 15",
      destination: "Airport",
      departure: "10:15 AM",
      status: "Delayed",
      platform: "B",
      stops: ["Shopping Mall", "University", "Airport Terminal"],
      isExpress: false
    },
    {
      id: 3,
      route: "Route 7",
      destination: "Beach Boulevard",
      departure: "10:30 AM",
      status: "On Time",
      platform: "C",
      stops: ["River Street", "Beach Park", "Oceanview"],
      isExpress: false
    }
  ];

  const filteredSchedules = schedules.filter(schedule => 
    schedule.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'text-green-500 bg-green-100';
      case 'delayed':
        return 'text-amber-500 bg-amber-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-center">
            Live Bus Schedule
          </CardTitle>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search routes or destinations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div 
              key={schedule.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Bus className="text-blue-500" size={24} />
                  <div>
                    <h3 className="font-semibold text-lg">{schedule.route}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      {schedule.destination}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="font-medium">{schedule.departure}</span>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(schedule.status)}`}>
                    {schedule.status === 'Delayed' && <AlertCircle size={14} className="mr-1" />}
                    {schedule.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Platform {schedule.platform}
                  </span>
                  {schedule.isExpress && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Express
                    </span>
                  )}
                </div>
                <div className="text-gray-500">
                  {schedule.stops.join(" → ")}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusSchedule;