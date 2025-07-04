import React, { useState, useEffect } from "react";
import { Mail, Lock, User, UserPlus, LogIn, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import LoadingSpinner from '../ui/LoadingSpinner';
import EnhancedButton from '../ui/EnhancedButton';
import EnhancedInput from '../ui/EnhancedInput';
import EnhancedCard from '../ui/EnhancedCard';
import AnimatedBackground from '../ui/AnimatedBackground';

const AuthForm = () => {
  const db = getFirestore();
  const adminUsers = ["admin@example.com", "anotheradmin@example.com"];
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    notifications: {
      emailUpdates: true,
      smsUpdates: true
    },
    membershipType: "",
    ticketHistory: "",
    updatedAt: null
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setAuthLoading(true);
    setErrors({});

    try {
      let userCredential;
      let userRole = "common user";

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userRole = userData.role;
          setFormData(prev => ({ ...prev, ...userData }));
        } else {
          setErrors({ general: "User data not found." });
          return;
        }
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        if (adminUsers.includes(formData.email)) {
          userRole = "admin";
        }

        const userData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          notifications: formData.notifications,
          membershipType: formData.membershipType,
          ticketHistory: formData.ticketHistory,
          role: userRole,
          updatedAt: new Date(),
        };

        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, userData);
      }

      localStorage.setItem("auth", "true");
      localStorage.setItem("role", userRole);
      navigate("/dashboard");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        notifications: { emailUpdates: true, smsUpdates: true },
        membershipType: "",
        ticketHistory: "",
        updatedAt: null,
      });

    } catch (err) {
      setErrors({ 
        general: isLogin ? "Invalid email or password" : "Failed to create account. Please try again." 
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      notifications: { emailUpdates: true, smsUpdates: true },
      membershipType: "",
      ticketHistory: "",
      updatedAt: null,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <LoadingSpinner size="xl" text="Preparing your experience..." fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
      <AnimatedBackground variant="grid" opacity={0.03} />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <EnhancedCard variant="elevated" className="backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isLogin ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </div>
              <h1 className="text-h2 font-bold text-primary mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-body text-secondary">
                {isLogin 
                  ? "Sign in to continue your journey" 
                  : "Join thousands of satisfied travelers"
                }
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-subtle rounded-xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-body-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-body-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-body-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <EnhancedInput
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="w-4 h-4" />}
                  placeholder="Enter your full name"
                />
              )}

              <EnhancedInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="w-4 h-4" />}
                placeholder="Enter your email"
              />

              <div className="relative">
                <EnhancedInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-secondary hover:text-primary transition-fast"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <EnhancedInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-secondary hover:text-primary transition-fast"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              <EnhancedButton
                type="submit"
                loading={authLoading}
                size="lg"
                className="w-full mt-6"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </EnhancedButton>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-body-sm text-secondary">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleForm}
                  className="ml-1 text-primary font-medium hover:underline transition-fast"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;