import React from 'react';
import { FaTools, FaClock } from 'react-icons/fa';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-center text-4xl mb-4">
          <FaTools className="text-blue-500 mr-3" />
          <FaClock className="text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Page Under Development
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're working hard to bring you this feature soon. Please check back later!
        </p>
        
        <div className="animate-pulse text-sm text-gray-500">
          Coming in the next update...
        </div>
      </div>
    </div>
  );
};

export default Register;