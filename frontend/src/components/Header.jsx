import React, { useState, useEffect } from "react";
import bgImage from '../image/download.jpg';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';

function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div className="relative h-[70vh] flex items-center justify-center">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center text-white max-w-3xl px-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Green Farming
          <span className="block text-green-400 mt-1 text-2xl md:text-3xl">
            Your Agricultural Equipment Marketplace
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-2xl mx-auto">
          Rent premium farming equipment at affordable prices. 
          Empowering farmers with access to modern agriculture tools.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 
                     transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
          >
            Browse Equipment
          </button>
          
          {!isAuthenticated && (
            <button 
              onClick={() => navigate('/register')}
              className="bg-transparent border border-white text-white px-6 py-2 
                       rounded-full hover:bg-white hover:text-green-600 
                       transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
            >
              Join Now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Header;
