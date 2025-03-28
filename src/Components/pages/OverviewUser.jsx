// src/components/Dashboard.js
import React, { useState } from 'react';
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
    List
  } from 'lucide-react';
  

const Dashboard = () => {
    // State for ticket booking form
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [tickets, setTickets] = useState(1);

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
            icon: Heart,
            label: 'Favorites & Wishlist',
            color: 'bg-pink-500',
            onClick: () => alert('Opening Favorites'),
            description: 'View and manage your saved items'
        },
        {
            icon: Settings,
            label: 'Account Settings',
            color: 'bg-gray-500',
            onClick: () => alert('Opening Account Settings'),
            description: 'Manage account preferences and security options'
        },
        {
            icon: HelpCircle,
            label: 'Help Center',
            color: 'bg-yellow-500',
            onClick: () => alert('Opening Help Center'),
            description: 'Access FAQs, guides, and support resources'
        },
        {
            icon: Lock,
            label: 'Security & Privacy',
            color: 'bg-red-600',
            onClick: () => alert('Opening Security Settings'),
            description: 'Manage passwords, two-factor authentication'
        },
        {
            icon: Download,
            label: 'Downloads & Documents',
            color: 'bg-teal-500',
            onClick: () => alert('Opening Downloads'),
            description: 'Access and download your important documents'
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

    // Handle ticket booking submission
    const handleBooking = (e) => {
        e.preventDefault();
        alert(`Booking confirmed for ${tickets} ticket(s) to ${destination} on ${date}`);
        // Add logic to send booking data to a backend API here
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 max-w-[80%] ">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold">P</span>
                    </div>
                    <h1 className="text-2xl font-bold">Puzzlebot</h1>
                </div>
                <div className="flex space-x-4">
                    <button className="bg-gray-700 px-4 py-2 rounded-lg">Analytics</button>
                    <button className="bg-gray-700 px-4 py-2 rounded-lg">Settings</button>
                </div>
            </div>
           
           <div className=' max-h-screen max-w-[80%] overflow-y-scroll overflow-x-hidden'>
          <div className="flex gap-4 mb-4 overflow-x-auto py-2">
  {accountFunctions.map((func, index) => (
    <div key={index} className="group relative flex-shrink-0">
      <button
        onClick={func.onClick}
        className={`
          ${func.color} 
          text-white 
          w-full 
          px-4 
          py-3 
          rounded-lg 
          flex 
          items-center 
          justify-center 
          space-x-2 
          hover:opacity-90 
          transition-all 
          duration-300 
          ease-in-out
          group-hover:shadow-lg
        `}
      >
        <func.icon className="w-4 h-4 mt-1 mr-2 text-center" />
        <span className="text-sm font-medium text-center">{func.label}</span>
      </button>
      <div className="
        absolute 
        z-10 
        bg-gray-800 
        text-white 
        text-xs 
        p-2 
        rounded 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity 
        duration-300 
        pointer-events-none 
        bottom-full 
        left-1/2 
        transform 
        -translate-x-1/2 
        -translate-y-2
        min-w-[200px]
        text-center
      ">
        {func.description}
      </div>
    </div>
  ))}
</div>


            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Section */}
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-sm text-gray-400">Total Revenue</h2>
                        <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                        <p className="text-green-400 text-sm">+20% this month</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-sm text-gray-400">Tickets Sold</h2>
                        <p className="text-2xl font-bold">{stats.ticketsSold}</p>
                        <p className="text-red-400 text-sm">-5% this month</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-sm text-gray-400">Active Users</h2>
                        <p className="text-2xl font-bold">{stats.activeUsers}</p>
                        <p className="text-green-400 text-sm">+10% this month</p>
                    </div>
                </div>

                {/* Ticket Booking Form */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Book a Ticket</h2>
                    <form onSubmit={handleBooking}>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Destination</label>
                            <select
                                className="w-full bg-gray-700 p-2 rounded-lg text-white"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            >
                                <option value="">Select Destination</option>
                                <option value="New York">New York</option>
                                <option value="London">London</option>
                                <option value="Tokyo">Tokyo</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Travel Date</label>
                            <input
                                type="date"
                                className="w-full bg-gray-700 p-2 rounded-lg text-white"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Number of Tickets</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-gray-700 p-2 rounded-lg text-white"
                                value={tickets}
                                onChange={(e) => setTickets(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 p-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Book Now
                        </button>
                    </form>
                </div>

                {/* Revenue Chart */}
                <div className="col-span-2 bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Revenue Trends</h2>
                    <div className="flex space-x-2 h-40">
                        {revenueData.map((value, index) => (
                            <div
                                key={index}
                                className="bg-green-400 w-10 rounded-t-lg"
                                style={{ height: `${value}px` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional Widgets */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
                    <p className="text-sm text-gray-400">Pending Bookings: 45</p>
                    <p className="text-sm text-gray-400">Completed Trips: 320</p>
                </div>

                {/* Info Card */}
                <div className="col-span-2 bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Financial Insight</h2>
                    <p className="text-sm text-gray-400">
                        I'm able to look at a single dashboard for all my financial needs to improve my startup!
                    </p>
                </div>
            </div>
           </div>

           
        </div>
    );
};

export default Dashboard;