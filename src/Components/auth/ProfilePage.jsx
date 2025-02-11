import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
// import { Input, Button } from '../ui/Button';
import Button from '../ui/Button';


// ProfilePage Component
const ProfilePage = () => {
    const [userData, setUserData] = useState({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      notifications: true
    });
  
    const handleUpdate = (e) => {
      e.preventDefault();
      // Handle profile update logic
      console.log('Profile update:', userData);
    };
  
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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