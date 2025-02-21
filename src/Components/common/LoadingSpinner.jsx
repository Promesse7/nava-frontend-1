import React from 'react';
import { Car } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen min-h-64 p-8 bg-black rounded-lg overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Light streak road */}
      <div className="relative w-full h-32 mb-8">
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
        <div className="absolute bottom-2 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse delay-150" />
        <div className="absolute bottom-4 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse delay-300" />
      </div>

      {/* Animated car container */}
      <div className="relative">
        {/* Glowing car effect */}
        <div className="absolute inset-0 bg-white/20 blur-xl animate-glow" />
        <div className="relative transform animate-float">
          <Car className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>
      </div>

      {/* Floating tickets */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-4 h-6 bg-white/5 rounded animate-float-1 top-1/4 left-1/4" />
        <div className="absolute w-4 h-6 bg-white/5 rounded animate-float-2 top-1/3 right-1/4" />
        <div className="absolute w-4 h-6 bg-white/5 rounded animate-float-3 bottom-1/4 left-1/3" />
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-xl font-semibold text-white animate-glow-text">
          Booking Your Ticket...
        </h3>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-0" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -30px) rotate(10deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -40px) rotate(-10deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -20px) rotate(15deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 5s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 4.5s ease-in-out infinite;
        }

        .animate-glow-text {
          animation: glow 2s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
