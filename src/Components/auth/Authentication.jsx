import React, { useState } from "react";
import { Mail, Lock, User, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";





const AuthForm = () => {

  // Initialize Firestore
 const db = getFirestore();
 const adminUsers = ["admin@example.com", "anotheradmin@example.com"];

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        
        // Fetch user role from Firestore (using UID, not email)
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          userRole = userDoc.data().role;
        } else {
          setError("User role not found.");
          return;
        }
        
      } else {
        // Sign up new user
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match!");
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  
        // Save user role in Firestore
        const userRef = doc(db, "users", userCredential.user.uid);  // Use UID as document ID
        if (adminUsers.includes(formData.email)) {
          userRole = "admin"; // Hardcoded admin check
        }
        await setDoc(userRef, { role: userRole });  // Save role to Firestore
  
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
        email: "",
        password: "",
        confirmPassword: "",
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
              className="w-full bg-black-600 text-white p-3 rounded-lg hover:bg-black-700"
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
  );
};

export default AuthForm;
