import { useEffect, useState } from "react";
import { Card } from "../../ui/Card";
import { FaCar, FaWallet, FaGift } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase"; // Make sure to import auth

const Overview = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get current logged-in user
      
      if (!user) {
        setIsLoading(false);
        setError("No user is logged in");
        return;
      }

      const userDocRef = doc(db, 'users', user.uid); // Reference to user document
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          setError("No user data found");
          console.log('No user data found');
        }
      } catch (error) {
        setError("Error loading data");
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle loading state
  if (isLoading) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  // Handle case where userData is still null after loading
  if (!userData) {
    return <div className="text-center text-gray-500 mt-10">No user data available</div>;
  }

  const { name, bookings = [], walletBalance = 0, loyaltyPoints = 0 } = userData;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-indigo-600">
        Hello, {name || "User"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Bookings */}
        <div className="transition-transform duration-300 hover:scale-105">
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-blue-50 border-l-4 border-blue-500">
            <FaCar className="text-blue-500 text-4xl" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Active Bookings</h2>
              <p className="text-gray-600">{bookings.length > 0 ? `${bookings.length} Ongoing` : "No active bookings"}</p>
            </div>
          </Card>
        </div>

        {/* Wallet Summary */}
        <div className="transition-transform duration-300 hover:scale-105">
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-green-50 border-l-4 border-green-500">
            <FaWallet className="text-green-500 text-4xl" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Wallet Balance</h2>
              <p className="text-gray-600">${walletBalance.toFixed(2)}</p>
            </div>
          </Card>
        </div>

        {/* Loyalty Points */}
        <div className="transition-transform duration-300 hover:scale-105">
          <Card className="p-6 shadow-xl flex items-center space-x-4 bg-yellow-50 border-l-4 border-yellow-500">
            <FaGift className="text-yellow-500 text-4xl" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Loyalty Rewards</h2>
              <p className="text-gray-600">{loyaltyPoints} points</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;