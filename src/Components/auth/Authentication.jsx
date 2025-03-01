import React, { useState, useEffect } from "react";
import { Mail, Lock, User, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import Loader from '../common/LoadingSpinner'





const AuthForm = () => {

  // Initialize Firestore
 const db = getFirestore();
 const adminUsers = ["admin@example.com", "anotheradmin@example.com"];
 const [loading, setLoading] = useState(true);
 useEffect(() => {
  // Simulate data fetching
  setTimeout(() => {
    setLoading(false);
  }, 3000);
}, []);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone:"",
    address: "",
    notifications: {
      emailUpdates: true,
      smsUpdates: true
    },
    membershipType: "",
    ticketHistory: "",
    updatedAt: null
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };
  
  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      let userCredential;
      let userRole = "common user"; // Default role
  
      if (isLogin) {
        // Sign in with Firebase
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Fetch user role and other details from Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userRole = userData.role; // Get role from Firestore
          setFormData((prev) => ({ ...prev, ...userData })); // Update formData state with DB values
        } else {
          setError("User data not found.");
          return;
        }
        
      } else {
        // Sign up new user
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  
        // Determine role based on email
        if (adminUsers.includes(formData.email)) {
          userRole = "admin";
        }
  
        // Prepare user data for Firestore
        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notifications: formData.notifications,
          membershipType: formData.membershipType,
          ticketHistory: formData.ticketHistory,
          role: userRole, // Include role
          updatedAt: new Date(), // Timestamp
        };
  
        // Save full user data to Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, userData);
  
        console.log("User registered:", userCredential.user);
      }
  
      // Store authentication state and role in localStorage
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", userRole);
  
      // Redirect based on role
      navigate(userRole === "admin" ? "/admin" : "/dashboard");
  
      // Reset form
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: "",
        notifications: {
          emailUpdates: true,
          smsUpdates: true,
        },
        membershipType: "",
        ticketHistory: "",
        updatedAt: null,
      });
  
    } catch (err) {
      setError(isLogin ? "Invalid credentials" : "Failed to create account");
      console.error("Auth error:", err);
    }
  };
  
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="">
        {loading ? (
        <Loader />
      ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-500">
          <div className="flex justify-center mb-8">
            <div className="bg-black-100 p-3 rounded-full">
              {isLogin ? <LogIn className="h-8 w-8 text-black" /> : <UserPlus className="h-8 w-8 text-black" />}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`pb-2 px-4 text-sm font-medium transition-colors duration-300 ${
                isLogin ? "text-black-600 border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`pb-2 px-4 text-sm font-medium transition-colors duration-300 ${
                !isLogin ? "text-black-600 border-b-2 border-black-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black  border-gray-600 text-white p-3 rounded-lg hover:bg-black-700"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleForm} className="text-sm text-gray-600 hover:text-gray-800">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
        
    </div>
  )}
   </div>
  );
};

export default AuthForm;
