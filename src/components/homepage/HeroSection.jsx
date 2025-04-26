import { useState, useEffect, forwardRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const partnerLogos = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Apple", color: "#A2AAAD" },
  { name: "Meta", color: "#0080FB" },
  { name: "Netflix", color: "#E50914" },
  { name: "Uber", color: "#000000" },
  { name: "Airbnb", color: "#FF5A5F" },
  { name: "Spotify", color: "#1DB954" },
  { name: "Tesla", color: "#CC0000" },
];

const HeroSection = forwardRef((props, ref) => {
  const [rotation, setRotation] = useState(0);
  
  // Simulate rotating partners banner
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={ref}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl top-1/4 left-1/4 animate-pulse" style={{ backgroundColor: '#3c78e6' }}></div>
        <div className="absolute w-72 h-72 rounded-full bg-yellow-300 opacity-20 blur-3xl bottom-1/4 right-1/4 animate-pulse" style={{ backgroundColor: '#EDC418' }}></div>
      </div>
      
      {/* Logo with circular hue */}
      <div className="relative mb-8 z-10">
        <div className="absolute inset-0 rounded-full opacity-10 blur-3xl transform scale-150" style={{ backgroundColor: '#3c78e6' }}></div>
        <div className="absolute inset-0 rounded-full opacity-10 blur-3xl transform scale-125 translate-x-6" style={{ backgroundColor: '#EDC418' }}></div>
        
        <div className="relative bg-white rounded-full p-6 shadow-lg">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: '#3c78e6' }}>
            Work<span style={{ color: '#EDC418' }}>While</span>
          </div>
        </div>
      </div>
      
      {/* Rotating partner logos */}
      <div className="relative w-full md:w-4/5 lg:w-3/4 xl:w-2/3 mx-auto h-16 mb-10 overflow-hidden">
        <div 
          className="absolute w-full whitespace-nowrap" 
          style={{ transform: `translateX(-${rotation}px)` }}
        >
          <div className="inline-flex space-x-8 px-8">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, index) => (
              <div key={index} className="flex items-center justify-center h-12 w-24 bg-white rounded-xl shadow-md">
                <span style={{ color: partner.color }} className="font-bold text-lg">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tagline */}
      <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-light max-w-2xl text-center mb-8 z-10">
        Shape your future with expert guidance and opportunities crafted for young professionals
      </h1>
      
      {/* Search bar */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Find your future now" 
            className="w-full px-6 py-4 pr-12 text-lg rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white"
            style={{ focusRingColor: '#3c78e6' }}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button className="text-white p-2 rounded-full transition" style={{ backgroundColor: '#3c78e6' }}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Job categories */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl z-10">
        {['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design', 'Engineering', 'Customer Service'].map((category, index) => (
          <div key={index} className="bg-white rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
            <span className="text-gray-700 font-medium">{category}</span>
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} style={{ color: '#3c78e6' }} />
      </div>
    </section>
  );
});

export default HeroSection;