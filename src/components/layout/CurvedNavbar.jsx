import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Car, Calendar, CreditCard, User } from 'lucide-react';


const CurvedNavBar = ({ isAdmin = false }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState(location.pathname);

  // Define navigation items based on user role
  const adminNavItems = [
    { id: '/dashboard', icon: Home, label: 'Dashboard' },
    { id: '/fleet', icon: Car, label: 'Fleet' },
    { id: '/bookings', icon: Calendar, label: 'Bookings' },
    { id: '/payments', icon: CreditCard, label: 'Payments' },
    { id: '/user-profile', icon: User, label: 'Profile' },
  ];

  const userNavItems = [
    { id: '/overview', icon: Home, label: 'Home' },
    { id: '/my-bookings', icon: Calendar, label: 'Bookings' },
    { id: '/book-ride', icon: Car, label: 'Book' },
    { id: '/payment-methods', icon: CreditCard, label: 'Payments' },
    { id: '/user-profile', icon: User, label: 'Profile' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  // Select two items for the right side (excluding the first item used for the center button)
  const rightSideItems = navItems.slice(0, 3);
  const leftSideItems = navItems.slice(2, 5);

  // Animation variants for the navbar entrance
  const navbarVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for icons on hover
  const iconVariants = {
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.3 } },
    active: { scale: 1.1, color: '#3b82f6', transition: { duration: 0.2 } },
  };

  // Animation for the center button
  const centerButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)', transition: { duration: 0.3 } },
    active: { scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-16 z-50 sm:block md:hidden lg:hidden" // Show only on mobile (sm and below)
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Navbar with Curved Top */}
      <div
        className="relative h-full bg-gradient-to-r from-white to-blue-50 backdrop-blur-md bg-opacity-80 flex items-center shadow-lg"
        style={{
          clipPath: 'ellipse(60% 90% at 50% 90%)',
        }}
      >
        {/* Left side */}
        <div className="relative flex justify-around items-center w-1/2 h-full z-10">
          {leftSideItems.map((item) => (
            <Link to={item.id} key={item.id}>
              <motion.button
                className="relative flex flex-col items-center justify-center w-12 h-12 text-gray-600"
                onClick={() => setActiveTab(item.id)}
                variants={iconVariants}
                whileHover="hover"
                animate={activeTab === item.id ? 'active' : {}}
              >
                {activeTab === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-blue-200 rounded-full opacity-50"
                    layoutId="activeCircle"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}
                <item.icon className="h-6 w-6 relative z-10" />
              </motion.button>
            </Link>
          ))}
        </div>

        {/* Center Circle Button with Home Icon */}
        <Link to={isAdmin ? '/dashboard' : '/overview'}>
          <motion.button
            className="relative left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-xl border border-blue-200"
            variants={centerButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            onClick={() => setActiveTab(isAdmin ? '/dashboard' : '/overview')}
          >
            <Home className="h-6 w-6 text-blue-500" />
            {activeTab === (isAdmin ? '/dashboard' : '/overview') && (
              <motion.div
                className="absolute -inset-1 bg-blue-200 rounded-full opacity-50"
                layoutId="centerActiveCircle"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            )}
          </motion.button>
        </Link>

        {/* Right side */}
        <div className="relative flex justify-around items-center w-1/2 h-full z-10">
          {rightSideItems.map((item) => (
            <Link to={item.id} key={item.id}>
              <motion.button
                className="relative flex flex-col items-center justify-center w-12 h-12 text-gray-600"
                onClick={() => setActiveTab(item.id)}
                variants={iconVariants}
                whileHover="hover"
                animate={activeTab === item.id ? 'active' : {}}
              >
                {activeTab === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-blue-200 rounded-full opacity-50"
                    layoutId="activeCircle"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}
                <item.icon className="h-6 w-6 relative z-10" />
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CurvedNavBar;