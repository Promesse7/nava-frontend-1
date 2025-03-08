import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Camera, ChevronRight, Lock, Bell, HelpCircle, LogOut, Settings, Bookmark, CreditCard, User2, PlusCircle, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { db, auth} from '../../firebase'; // Import Firestore and Auth
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut, getAuth  } from 'firebase/auth';
import { Switch } from "@headlessui/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    notifications: true,
    theme: 'light',
    language: 'English'
  });

  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();

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

 
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const handleAvatarUpload = async (file) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!file) {
      toast.error("No file selected");
      return;
    }
  
    if (!user) {
      toast.error("User not authenticated");
      return;
    }
  
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "nava-travel"); // Ensure preset name is correct
      formData.append("folder", "nava-travel"); // Store in the right folder
  
      // Upload image to Cloudinary
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlhu0vkqm/image/upload",
        formData
      );
  
      const imageUrl = response.data.secure_url;
  
      // Update Firestore with the uploaded image URL
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { avatar: imageUrl }, { merge: true });
  
      // Update local state for immediate UI feedback
      setAvatarUrl(imageUrl);
      toast.success("Avatar uploaded and saved successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload the image.");
    } finally {
      setUploading(false);
    }
  };




  const SettingItem = ({ icon: Icon, title, onClick, isLogout = false }) => (
    <button onClick={onClick} className={`flex items-center justify-between w-full py-3 border-b ${isLogout ? "border-none text-red-600 hover:text-red-700" : "text-gray-800 hover:text-gray-900"}`} >
      <div className="flex items-center">
        <Icon className={`w-5 h-5 ${isLogout ? "text-red-500" : "text-gray-500"} mr-3`} />
        <span>{title}</span>
      </div>
      <ChevronRight className={`w-5 h-5 ${isLogout ? "text-red-500" : "text-gray-500"}`} />
    </button>
  );





  if (loading) {
    return <p className="text-center mt-6 font-[Orbitron] justify-center">Loading profile...</p>;
  }

  return (
    <div className=" mx-auto w-[80%] p-6 bg-white rounded-lg shadow-lg">
         <ToastContainer position="top-right" autoClose={3000} />
     {/* Header Section */}
     <div className="flex items-center  w-full max-w-screen-lg px-2 mb-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-transparent text-black shadow-md hover:shadow-lg 
                     hover:bg-gray-200 transition-all duration-300"
        >
          Go Back
        </button>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-black ml-20">
          Profile Settings
        </h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">

          {uploading && <p>Uploading...</p>}
          
    {userData.avatar || avatarUrl ? (
      <img 
        src={userData.avatar || avatarUrl} 
        alt="User Avatar" 
        className="w-full h-full object-cover" 
        onError={(e) => {
          console.error('Avatar image failed to load', e);
          e.target.src = ''; // Fallback to default
        }}
      />
    ) : (
      <User className="w-12 h-12 text-gray-400" />
    )}

<input 
    type="file" 
    id="avatarUpload" 
    style={{ display: "none" }} 
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        handleAvatarUpload(file);
      }
    }} 
    accept="image/*" 
  />
          </div>
          <Button  
                     onClick={() => document.getElementById("avatarUpload").click()}
                     variant="outline" size="small">Change Photo</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
          <Input label="Email" type="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
          <Input label="Phone Number" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} />
          <Input label="Address" value={userData.address} onChange={(e) => setUserData({...userData, address: e.target.value})} />
          <Input label="Password" type="password" value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className="flex items-center space-x-4">
          <label className="text-gray-600">Theme:</label>
          <select
            className="border rounded p-2 w-40"
            value={userData.theme}
            onChange={(e) => setUserData({...userData, theme: e.target.value})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
         {/* Notification Preferences */}
    
        <div className="flex items-center space-x-4 ">
          <label className="text-gray-600">Language:</label>
          <select
            className="border rounded p-2 w-40"
            value={userData.language}
            onChange={(e) => setUserData({...userData, language: e.target.value})}
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
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

        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <SettingItem icon={Lock} title="Change Password" onClick={() => {}} />
            <SettingItem icon={User} title="Edit Profile" onClick={() => {}} />
            <SettingItem icon={Bookmark} title="Saved Addresses" onClick={() => {}} />
            <SettingItem icon={Settings} title="Settings" onClick={() => {}} />
            <SettingItem icon={CreditCard} title="Payment Methods" onClick={() => {}} />
            <SettingItem icon={Bell} title="Notification Preferences" onClick={() => {}} />
            <SettingItem icon={HelpCircle} title="Help & Support" onClick={() => {}} />
            <SettingItem icon={LogOut} isLogout={true} title="Log Out" onClick={() => setShowLogoutModal(true)} />

            {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  handleLogout(); // Logout action
                  setShowLogoutModal(false); // Close modal
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)} // Close modal
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
      

          <div className="container mx-auto px-4 mt-6 flex justify-center ">
            <button onClick={handleUpdate} className="bg-black hover:bg-grey-700 text-white-500 text-white px-4 py-2 rounded">
              Save Changes
            </button>
          </div>
      </form>
    </div>
  );
};

export default ProfilePage;
