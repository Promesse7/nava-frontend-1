import React, { useState, useEffect } from 'react';
import { Mail, User } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { db, auth } from '../../firebase'; // Import Firestore and Auth
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    notifications: true
  });

  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get current logged-in user
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid); // Reference to user document
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    try {
      await setDoc(userDocRef, userData, { merge: true }); // Update Firestore
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-6 font-[Orbitron] justify-center">Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl  mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <Button variant="outline" size="small">Change Photo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
          />
          <Input
            label="Email"
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({...userData, email: e.target.value})}
          />
          <Input
            label="Phone Number"
            value={userData.phone}
            onChange={(e) => setUserData({...userData, phone: e.target.value})}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={userData.notifications}
            onChange={(e) => setUserData({...userData, notifications: e.target.checked})}
          />
          <span className="ml-2 text-gray-600">Receive email notifications</span>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
