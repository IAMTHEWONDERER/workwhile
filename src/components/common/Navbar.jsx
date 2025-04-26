import { useState } from 'react';
import { User, Bell, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // This would use the actual router in a real application
  // For demo purposes, we're just showing how it would work
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app with React Router:
    // navigate(path);
    
    // For demo purposes, we'll toggle login state when clicking the user icon
    if (path === '/login' && !isLoggedIn) {
      setIsLoggedIn(true);
      setUsername('Demo User');
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      {/* White background with very subtle shadow */}
      <div className="absolute inset-0 bg-white shadow-sm"></div>
      
      {/* Navbar content */}
      <nav className="relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                indeed
              </div>
            </div>
            
            {/* Main navigation */}
            <div className="flex flex-1 mx-8 space-x-6">
              <a href="#" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                Find jobs
              </a>
              <a href="#" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                Company reviews
              </a>
              <a href="#" className="text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 py-5">
                Salary guide
              </a>
            </div>
            
            {/* Right side links and icons */}
            <div className="flex items-center space-x-5">
              {/* Saved jobs - always visible */}
              <button 
                onClick={() => handleNavigation('/saved-jobs')}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <Heart size={18} className="mr-1" />
                <span className="hidden sm:inline">Saved jobs</span>
              </button>
              
              {/* Conditional notifications icon - only when logged in */}
              {isLoggedIn && (
                <button 
                  onClick={() => handleNavigation('/notifications')}
                  className="text-gray-700 hover:text-blue-600"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </button>
              )}
              
              {/* Create job offer button */}
              <button 
                onClick={() => handleNavigation('/create-job')}
                className="hidden sm:block text-sm text-blue-600 font-medium hover:text-blue-800"
              >
                Create a job offer
              </button>
              
              {/* User icon/profile - links to login page when not logged in */}
              <button 
                onClick={() => handleNavigation(isLoggedIn ? '/profile' : '/login')}
                className="flex items-center justify-center"
                aria-label={isLoggedIn ? "User profile" : "Login"}
              >
                {isLoggedIn ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}