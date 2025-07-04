import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, MapPin, ChevronRight, Car, ArrowRight, Sparkles, Zap, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../ui/AnimatedBackground';
import EnhancedButton from '../ui/EnhancedButton';
import EnhancedCard from '../ui/EnhancedCard';

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const bookingSteps = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Choose Destination",
      description: "Select your dream destination from our extensive network of routes across Rwanda.",
      color: "from-gray-900 to-gray-700"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Pick Date & Time",
      description: "Find the perfect schedule that fits your travel plans with real-time availability.",
      color: "from-gray-800 to-gray-600"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Select Your Ride",
      description: "Choose from economy, business, or premium class options with detailed amenities.",
      color: "from-gray-700 to-gray-500"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Complete Booking",
      description: "Secure payment and instant ticket confirmation with QR code generation.",
      color: "from-gray-600 to-gray-400"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Voice Booking",
      description: "Book your tickets using voice commands for ultimate accessibility"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payments",
      description: "Multiple payment options with bank-level security"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Track your journey and get live updates"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Smart Features",
      description: "AI-powered recommendations and trip planning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
      <AnimatedBackground variant="dots" opacity={0.05} />
      
      {/* Navigation Header */}
      <nav className={`relative z-10 p-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-h3 font-bold text-primary">XPressit</h1>
              <p className="text-caption text-secondary">Travel Rwanda</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-body font-medium text-primary hover:text-secondary transition-fast">
              Home
            </a>
            <a href="#" className="text-body font-medium text-primary hover:text-secondary transition-fast">
              Routes
            </a>
            <a href="#" className="text-body font-medium text-primary hover:text-secondary transition-fast">
              Support
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-subtle rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-caption text-primary">Next-Gen Travel Experience</span>
              </div>
              
              <h1 className="text-display-1 font-bold text-primary leading-tight">
                Travel Rwanda with 
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Intelligence
                </span>
              </h1>
              
              <p className="text-body-lg text-secondary max-w-lg">
                Experience the future of travel with voice-powered booking, real-time tracking, 
                and AI-driven recommendations. Your journey starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <EnhancedButton
                size="lg"
                onClick={() => navigate('/login')}
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="text-body font-semibold"
              >
                Start Your Journey
              </EnhancedButton>
              
              <EnhancedButton
                variant="ghost"
                size="lg"
                className="text-body font-semibold"
              >
                Watch Demo
              </EnhancedButton>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-body-sm font-semibold text-primary">{feature.title}</h3>
                    <p className="text-body-sm text-secondary">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Booking Steps */}
          <div className={`space-y-6 transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="text-center mb-8">
              <h2 className="text-h2 font-bold text-primary mb-2">
                Book in 4 Simple Steps
              </h2>
              <p className="text-body text-secondary">
                Our streamlined process makes booking effortless
              </p>
            </div>

            <div className="space-y-4">
              {bookingSteps.map((step, index) => (
                <EnhancedCard
                  key={index}
                  variant={activeStep === index ? 'elevated' : 'minimal'}
                  className={`transition-all duration-500 transform cursor-pointer
                    ${activeStep === index 
                      ? 'scale-105 bg-gradient-primary text-white shadow-2xl' 
                      : 'hover:scale-102 hover:bg-subtle'
                    }`}
                  onMouseEnter={() => setActiveStep(index)}
                  padding="md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${activeStep === index 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-subtle text-primary'
                      }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-h4 font-semibold mb-1 ${activeStep === index ? 'text-white' : 'text-primary'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-body-sm ${activeStep === index ? 'text-white text-opacity-90' : 'text-secondary'}`}>
                        {step.description}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${activeStep === index 
                        ? 'border-white bg-white text-primary' 
                        : 'border-border-gray text-secondary'
                      }`}>
                      {index + 1}
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>

            {/* Demo Booking Card */}
            <EnhancedCard variant="elevated" className="bg-gradient-subtle">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="text-body font-semibold text-primary">Kigali → Huye</h4>
                    <p className="text-body-sm text-secondary">Popular route</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="text-body font-semibold text-primary">Today, 2:30 PM</h4>
                    <p className="text-body-sm text-secondary">Next departure</p>
                  </div>
                </div>
                
                <EnhancedButton
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/login')}
                  className="w-full"
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Book This Journey
                </EnhancedButton>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-gray bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <p className="text-body-sm text-secondary">
                © 2025 XPressit by PromCode. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-body-sm text-secondary hover:text-primary transition-fast">
                Privacy Policy
              </a>
              <a href="#" className="text-body-sm text-secondary hover:text-primary transition-fast">
                Terms of Service
              </a>
              <a href="#" className="text-body-sm text-secondary hover:text-primary transition-fast">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;