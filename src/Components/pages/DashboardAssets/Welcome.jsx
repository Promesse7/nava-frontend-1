import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { User, FileText, Settings, PlusCircle, ArrowRight } from "lucide-react";

const Welcome = ({ adminName }) => {
  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const appInfo = [
    {
      title: "Admin Dashboard Pro",
      description: "A powerful admin dashboard for managing your organization's resources, users, and analytics in one place."
    },
    {
      title: "Streamlined Workflow",
      description: "Simplify management tasks with our intuitive interface designed for maximum productivity."
    },
    {
      title: "Data-Driven Decisions",
      description: "Access comprehensive analytics and reports to make informed business decisions."
    }
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
    <div className={`bg-gradient-to-br h-full from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* App Introduction Section */}
      <div className="mb-8 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            Admin Dashboard Pro
          </h1>
          <div className={`flex space-x-2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {appInfo.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`h-2 w-2 rounded-full transition-all ${activeTab === index ? 'bg-white w-6' : 'bg-gray-600'}`}
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
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10 pointer-events-none'
              }`}
            >
              <h3 className="text-xl font-semibold text-white">{info.title}</h3>
              <p className="text-gray-400">{info.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-3xl font-bold mb-3 flex items-center">
          <span className="mr-2">Welcome, {adminName || "Admin"}</span>
          <span className="animate-bounce inline-block">👋</span>
        </h2>
        <p className="text-gray-400 mb-5">
          Manage your dashboard efficiently. Start with key tasks below or set up
          if you're new.
        </p>
      </div>

      {!isNewAdmin ? (
        <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <Button
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            onClick={() => setIsNewAdmin(true)}
          >
            <PlusCircle size={18} /> I'm New Here
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-text-indigo-50 hover:from-blue-500 hover:to-blue-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <User size={18} className="animate-pulse" /> Manage Users
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <FileText size={18} className="animate-pulse" /> View Reports
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <Settings size={18} className="animate-spin-slow" /> Settings
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <Settings size={18} className="animate-spin-slow" /> Settings
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg">
            <Settings size={18} className="animate-spin-slow" /> Settings
          </Button>
        </div>
      ) : (
        <div className={`bg-gray-800 p-6 rounded-xl mt-4 transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-xl font-semibold flex items-center">
            <span className="mr-2">Getting Started</span>
            <span className="animate-pulse inline-block">🚀</span>
          </h3>
          <ul className="text-gray-400 mt-4 space-y-3">
            {[
              "Set up your admin profile",
              "Configure user roles",
              "Review system settings",
              "Explore dashboard features"
            ].map((item, index) => (
              <li key={index} className={`flex items-center transition-all duration-500 delay-${200 + index * 100}`}>
                <span className="text-green-400 mr-2">✓</span>
                <span className="relative">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 animate-expand"></span>
                </span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center"
            onClick={() => setIsNewAdmin(false)}
          >
            Back to Dashboard <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      )}
      
      <div className={`text-xs text-gray-500 mt-[200px] text-center bottom-0 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        Admin Dashboard Pro v0.5 • Designed for efficiency
      </div>
    </div>
  );
};



export default Welcome;