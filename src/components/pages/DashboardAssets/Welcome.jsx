import { useState, useEffect } from "react";
import Button from "../../ui/Button";

import {
  User,
  FileText,
  Settings,
  PlusCircle,
  ArrowRight,
  BarChart,
  Calendar,
  MessageSquare,
  Bell,
} from "lucide-react";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Welcome = ({ userName, userRole = "user" }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [UserData, setUserData] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get current logged-in user
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid); // Reference to user document
      try {
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const isAdmin = UserData?.role === "admin";

  const appInfo = [
    {
      title: isAdmin ? "Admin Dashboard Pro" : "User Dashboard",
      description: isAdmin
        ? "A powerful admin dashboard for managing your organization's resources, users, and analytics in one place."
        : "Access your personal dashboard to manage tasks, view analytics, and stay connected.",
    },
    {
      title: "Streamlined Workflow",
      description:
        "Simplify your daily tasks with our intuitive interface designed for maximum productivity.",
    },
    {
      title: "Data-Driven Insights",
      description: isAdmin
        ? "Access comprehensive analytics and reports to make informed business decisions."
        : "Track your performance metrics and personal statistics to improve productivity.",
    },
  ];

  // Animation on mount
  useEffect(() => {
    setIsLoaded(true);

    // Auto-rotate tabs for the app info
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % appInfo.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-gradient-to-br h-full 
  ${isAdmin ? "from-gray-950 to-gray-800" : "from-gray-900 to-gray-700"} 
  text-white p-6 rounded-2xl shadow-2xl transition-all duration-700 
  ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* App Introduction Section */}
      <div className="mb-8 overflow-hidden ">
        <div className="flex justify-between items-center mb-4">
          <h1
            className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100 transition-all duration-700 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {isAdmin ? "Admin Dashboard Pro" : "User Dashboard"}
          </h1>
          <div
            className={`flex space-x-2 transition-all duration-700 delay-300 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {appInfo.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeTab === index ? "bg-white w-6" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative h-24">
          {appInfo.map((info, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                activeTab === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10 pointer-events-none"
              }`}
            >
              <h3 className="text-xl font-semibold text-white">{info.title}</h3>
              <p className="text-gray-400">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`transition-all duration-700 delay-200 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl font-bold mb-3 flex items-center">
          <span className="mr-2">
            Welcome, {userName || (isAdmin ? "Admin" : "User")}
          </span>
          <span className="animate-bounce inline-block">👋</span>
        </h2>
        <p className="text-gray-400 mb-5">
          {isAdmin
            ? "Manage your dashboard efficiently. Start with key tasks below or set up if you're new."
            : "Access your personalized dashboard. Get started with the tools below or complete your setup."}
        </p>
      </div>

      {!isNewUser ? (
        <div
          className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Button
            className={`flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-lg`}
            onClick={() => setIsNewUser(true)}
          >
            <PlusCircle size={18} /> I'm New Here
          </Button>

          {isAdmin ? (
            <>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <User size={18} className="animate-pulse" /> Manage Users
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <FileText size={18} className="animate-pulse" /> View Reports
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <Settings size={18} className="animate-spin-slow" /> Settings
              </Button>
            </>
          ) : (
            <>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <Calendar size={18} className="animate-pulse" /> My Schedule
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <BarChart size={18} className="animate-pulse" /> My Analytics
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <MessageSquare size={18} className="animate-pulse" /> Messages
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <Bell size={18} className="animate-pulse" /> Notifications
              </Button>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                <User size={18} className="animate-pulse" /> My Profile
              </Button>
            </>
          )}
        </div>
      ) : (
        <div
          className={`bg-${
            isAdmin ? "gray" : "blue"
          }-800 p-6 rounded-xl mt-4 transition-all duration-500 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h3 className="text-xl font-semibold flex items-center">
            <span className="mr-2">Getting Started</span>
            <span className="animate-pulse inline-block">🚀</span>
          </h3>
          <ul className="text-gray-600 mt-6 space-y-4">
            {isAdmin
              ? [
                  "Set up your admin profile",
                  "Configure user roles",
                  "Review system settings",
                  "Explore dashboard features",
                ]
              : [
                  "Complete your user profile",
                  "Set your notification preferences",
                  "Explore available features",
                  "Connect with team members",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center space-x-2 transition-all duration-500 ease-in-out delay-${
                      200 + index * 100
                    }`}
                  >
                    <span className="text-gray-500">✓</span>
                    <span className="relative">
                      {item}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-expand"></span>
                    </span>
                  </li>
                ))}
          </ul>

          <Button
            className={`mt-6 bg-gradient-to-r ${
              isAdmin
                ? "from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700"
                : "from-gray-600 to-black hover:from-gray-500 hover:to-black"
            } transform hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center`}
            onClick={() => setIsNewUser(false)}
          >
            Back to Dashboard <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      )}

      <div
        className={`text-xs text-gray-500 mt-[200px] text-center bottom-0 transition-all duration-700 delay-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {isAdmin ? "Admin Dashboard Pro" : "User Dashboard"} v0.5 • Designed for
        efficiency
      </div>
    </div>
  );
};

export default Welcome;
