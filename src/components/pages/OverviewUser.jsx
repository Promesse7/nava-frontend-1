// src/components/Dashboard.js
import React, { useState, useRef, useEffect } from 'react';
import {
    User,
    CreditCard,
    Calendar,
    ShoppingCart,
    MessageCircle,
    Heart,
    Settings,
    HelpCircle,
    Lock,
    Download,
    Activity,
    Bell,
    MapPin,
    Ticket,
    List,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BusCompaniesDisplay from './BusCompaniesDisplay';
import { getAvailableRoutes } from '../../services/fleetService';
import AccessibleTicketBooking from './Voice_booking';

const Dashboard = () => {
    // State for ticket booking form
    const [availableRoutes, setAvailableRoutes] = useState([]);
    const [loadingRoutes, setLoadingRoutes] = useState(false);
    const [routeError, setRouteError] = useState("");
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [tickets, setTickets] = useState(1);
    const navigate = useNavigate();

    // Mock data for stats and charts
    const stats = {
        totalRevenue: 'R24,500',
        ticketsSold: '1,200',
        activeUsers: '320',
    };

    const revenueData = [50, 100, 75, 150, 200, 180]; // Mock data for bar chart

    const accountFunctions = [
        {
            icon: User,
            label: 'Profile Management',
            color: 'bg-blue-500',
            onClick: () => alert('Opening Profile Management'),
            description: 'Update personal info, profile picture, and preferences'
        },
        {
            icon: CreditCard,
            label: 'Payment Methods',
            color: 'bg-green-500',
            onClick: () => alert('Managing Payment Methods'),
            description: 'Add, remove, or edit payment cards and methods'
        },
        {
            icon: Calendar,
            label: 'Bookings & Reservations',
            color: 'bg-purple-500',
            onClick: () => alert('Viewing Bookings'),
            description: 'View and manage all your current and past bookings'
        },
        {
            icon: ShoppingCart,
            label: 'Order History',
            color: 'bg-red-500',
            onClick: () => alert('Checking Order History'),
            description: 'Track and review your previous purchases'
        },
        {
            icon: MessageCircle,
            label: 'Support Chat',
            color: 'bg-indigo-500',
            onClick: () => alert('Opening Customer Support'),
            description: 'Connect with customer support team'
        },
        {
            icon: Settings,
            label: 'Account Settings',
            color: 'bg-gray-500',
            onClick: () => alert('Opening Account Settings'),
            description: 'Manage account preferences and security options'
        },
         {
            icon: Lock,
            label: 'Security & Privacy',
            color: 'bg-red-600',
            onClick: () => alert('Opening Security Settings'),
            description: 'Manage passwords, two-factor authentication'
        },
        {
            icon: Activity,
            label: 'Activity Log',
            color: 'bg-orange-500',
            onClick: () => alert('Viewing Activity Log'),
            description: 'Review recent account activities and actions'
        },
        {
            icon: Bell,
            label: 'Notifications',
            color: 'bg-cyan-500',
            onClick: () => alert('Managing Notifications'),
            description: 'Configure notification preferences'
        },
        {
            icon: MapPin,
            label: 'Saved Addresses',
            color: 'bg-lime-600',
            onClick: () => alert('Managing Addresses'),
            description: 'Add, edit, or remove saved delivery addresses'
        },
        {
            icon: Ticket,
            label: 'Rewards & Vouchers',
            color: 'bg-amber-500',
            onClick: () => alert('Checking Rewards'),
            description: 'View and manage loyalty points and vouchers'
        },
        {
            icon: List,
            label: 'Subscription Management',
            color: 'bg-rose-500',
            onClick: () => alert('Managing Subscriptions'),
            description: 'View and modify active subscriptions'
        }
    ];


    const scrollRef = useRef(null);


    useEffect(() => {
        const loadRoutes = async () => {
            setLoadingRoutes(true);
            setRouteError("");

            try {
                const routes = await getAvailableRoutes();
                setAvailableRoutes(routes);
            } catch (error) {
                setRouteError("Failed to load routes. Please try again.");
                console.error("Error loading routes:", error);
            } finally {
                setLoadingRoutes(false);
            }
        };

        loadRoutes();
    }, []);

    // Handle ticket booking submission
    const handleBooking = (e) => {
        e.preventDefault();
        alert(`Booking confirmed for ${tickets} ticket(s) to ${destination} on ${date}`);
        // Add logic to send booking data to a backend API here
    };

    return (
        <>
              <div
      className="p-6  flex-shrink-0 sm:max-w-[95vw] lg:max-w-[95vw] bg-gray-900 h-[80vh]  overflow-hidden text-white"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 p-4 bg-gray-800 rounded-xl shadow-md">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center"
          >
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-100">Travel Rwanda</h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow hover:bg-gray-600"
            onClick={() => navigate("/disabled")}
          >
            Talk to me
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm md:text-base shadow hover:bg-gray-600"
          >
            Settings
          </button>
        </div>
      </div>

      <div className="max-h-[82vh] max-w-[100%] pr-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-800">
        {/* Account Functions Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {accountFunctions.map((func, index) => (
            <button
                key={index}
                onClick={func.onClick}
                className="bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-all shadow"
              >
                {React.createElement(func.icon, { className: "w-5 h-5" })}
                <span className="text-sm font-medium">{func.label}</span>
              </button>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ticket Booking Form */}
          <div
            className="col-span-2 grid grid-cols-1 md:grid-cols-1"
          >
            <div className="bg-gray-800 rounded-xl shadow-md backdrop-blur-md bg-opacity-80">
              <BusCompaniesDisplay />
            </div>
          </div>
          <div
            className="bg-gray-800 p-6 rounded-xl shadow-md backdrop-blur-md bg-opacity-80"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-100">Book a Ticket</h2>
            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Destination</label>
                <select
                  className="w-full bg-gray-700 p-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-gray-300 transition"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                >
                  <option value="">Select a route</option>
                  {availableRoutes.map((routeOption) => (
                    <option key={routeOption} value={routeOption}>
                      {routeOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Travel Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-700 p-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-gray-300 transition"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-gray-700 p-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-gray-300 transition"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-700 text-white p-2 rounded-lg hover:bg-gray-600 transition shadow"
              >
                Book Now
              </button>
            </form>
          </div>

          {/* Stats Section */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Total Revenue", value: stats.totalRevenue, change: "+20% this month", color: "text-green-600" },
              { title: "Tickets Bought", value: stats.ticketsSold, change: "-5% this month", color: "text-red-600" },
              { title: "Active Users", value: stats.activeUsers, change: "+10% this month", color: "text-green-600" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-xl shadow-md backdrop-blur-md bg-opacity-80"
              >
                <h2 className="text-sm text-gray-300">{stat.title}</h2>
                <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div
            className="col-span-2 bg-gray-800 p-6 rounded-xl shadow-md backdrop-blur-md bg-opacity-80"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-100">Revenue Trends</h2>
            <div className="flex space-x-2 h-35 items-end">
              {revenueData.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-700 w-10 rounded-t-lg"
                  style={{ height: `${value}px` }}
                />
              ))}
            </div>
          </div>

          {/* Additional Widgets */}
          <div
            className="bg-gray-800 p-6 rounded-xl shadow-md backdrop-blur-md bg-opacity-80"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-100">Quick Stats</h2>
            <p className="text-sm text-gray-300">Pending Bookings: 45</p>
            <p className="text-sm text-gray-300">Completed Trips: 320</p>
          </div>

          {/* Info Card */}
          <div
            className="col-span-2 bg-gray-800 p-4 rounded-xl shadow-md backdrop-blur-md bg-opacity-80 mb-10"
          >
            <h2 className="text-lg font-bold mb-2 text-gray-100">Financial Insight</h2>
            <p className="text-sm text-gray-300">
              I'm able to look at a single dashboard for all my financial needs to improve my startup!
            </p>
          </div>
        </div>
      </div>
    </div>
        </>

    );
};

export default Dashboard;
