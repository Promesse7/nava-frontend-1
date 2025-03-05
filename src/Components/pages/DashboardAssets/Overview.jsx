import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { FaCar, FaWallet, FaGift } from "react-icons/fa";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Ensure firebase is initialized


const Overview = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data);
          setBookings(data.bookings || []);
          setWalletBalance(data.walletBalance || 0);
          setLoyaltyPoints(data.loyaltyPoints || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Message */}
      <motion.h1 
        className="text-3xl font-bold text-indigo-600"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Hello, {user.name}!
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Bookings */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-blue-50 border-l-4 border-blue-500">
            <FaCar className="text-blue-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Active Bookings</h2>
              <p className="text-gray-600">{bookings.length > 0 ? `${bookings.length} Ongoing` : "No active bookings"}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Summary */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-green-50 border-l-4 border-green-500">
            <FaWallet className="text-green-500 text-4xl" />
            <CardContent>
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
              <p className="text-gray-600">${walletBalance.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loyalty Points */}
        {loyaltyPoints !== undefined && (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="p-6 shadow-xl flex items-center space-x-4 bg-yellow-50 border-l-4 border-yellow-500">
              <FaGift className="text-yellow-500 text-4xl" />
              <CardContent>
                <h2 className="text-xl font-semibold">Loyalty Rewards</h2>
                <p className="text-gray-600">{loyaltyPoints} points</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Overview;
