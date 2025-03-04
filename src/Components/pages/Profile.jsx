import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "@/firebaseConfig";
import { Switch } from "@/components/ui/switch";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { FaUser, FaMoon, FaGlobe, FaBell, FaLock } from "react-icons/fa";

const db = getFirestore(app);

const ProfileSettings = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUser(data);
          setTheme(data.theme || "light");
          setLanguage(data.language || "English");
          setNotifications(data.notifications || true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "users", userId), {
        theme,
        language,
        notifications,
      });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <motion.div className="p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold text-indigo-600">Profile & Settings</h1>
      
      <Card className="p-6 shadow-lg space-y-4">
        <CardContent>
          <div className="flex items-center space-x-4">
            <FaUser className="text-indigo-600 text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <Input type="text" placeholder="Name" defaultValue={user.name} className="mt-2" />
              <Input type="email" placeholder="Email" defaultValue={user.email} className="mt-2" />
              <Input type="tel" placeholder="Phone" defaultValue={user.phone} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6 shadow-lg flex items-center space-x-4">
        <FaMoon className="text-gray-600 text-3xl" />
        <h2 className="text-xl font-semibold">Theme Selection</h2>
        <Switch checked={theme === "dark"} onChange={() => setTheme(theme === "light" ? "dark" : "light")} />
      </Card>
      
      <Card className="p-6 shadow-lg flex items-center space-x-4">
        <FaGlobe className="text-green-600 text-3xl" />
        <h2 className="text-xl font-semibold">Language Preferences</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="ml-4 p-2 border rounded">
          <option>English</option>
          <option>French</option>
          <option>Spanish</option>
        </select>
      </Card>
      
      <Card className="p-6 shadow-lg flex items-center space-x-4">
        <FaBell className="text-yellow-600 text-3xl" />
        <h2 className="text-xl font-semibold">Notification Settings</h2>
        <Switch checked={notifications} onChange={() => setNotifications(!notifications)} />
      </Card>

      <Card className="p-6 shadow-lg flex items-center space-x-4">
        <FaLock className="text-red-600 text-3xl" />
        <h2 className="text-xl font-semibold">Security</h2>
        <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2" />
      </Card>

      <Button onClick={handleUpdate} className="w-full bg-indigo-600 text-white py-2 rounded-lg">Save Changes</Button>
    </motion.div>
  );
};

export default ProfileSettings;
