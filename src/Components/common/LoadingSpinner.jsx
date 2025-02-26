import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import "@fontsource/orbitron"; // Install it first using npm or yarn

const LoadingSpinner = () => {
  const [animationState, setAnimationState] = useState('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('finished');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col  h-screen min-h-64 p-8 bg-black rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative w-full h-32 mb-8">
        <div className="absolute bottom-0 w-100vw h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
      </div>
      
      <div className={`absolute bottom-16 w-100vw h-16 transition-transform duration-[1000ms] ease-in-out ${animationState === 'loading' ? '-translate-x-[150%]' : 'translate-x-[2150%]'}`}>
        <Car className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-4 h-6 bg-white/5 rounded animate-float-1 top-1/4 left-1/4" />
      </div>
      
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-[40px] font-semibold text-white animate-glow-text font-[Orbitron]">Your Comfort. Our Priority.</h3>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-0" />
          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
