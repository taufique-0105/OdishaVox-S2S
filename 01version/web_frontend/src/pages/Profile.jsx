import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please log in to view your profile.');
          setLoading(false);
          return;
        }

        const PROFILE_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/user/profile`;
        const response = await fetch(PROFILE_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user profile.');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'An error occurred while fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Logout functionality
  // const handleLogout = async () => {
  //   try {
  //     // Call backend logout if available (optional)
  //     await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
  //       method: 'POST', // Prefer POST for logout
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //       },
  //     }).catch(() => {}); // Ignore errors, client logout anyway

  //     // Remove token from local storage
  //     localStorage.removeItem('authToken');

  //     // Redirect to login
  //     navigate('/login');
  //   } catch (err) {
  //     console.error('Logout error:', err);
  //     setError('An error occurred during logout.');
  //   }
  // };

  const handleLogout = () => {
    // Remove JWT from localStorage
    localStorage.removeItem("token");
    // Optional: also clear user details
    localStorage.removeItem("user");
    // Redirect to login
    window.location.href = "/login";
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setUserData(null);
    window.location.reload(); // Trigger useEffect to refetch
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-lg text-gray-700 dark:text-gray-300">No user data found. Please log in.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:shadow-2xl">
        <div className="relative mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
            Your Profile
          </h2>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
        </div>
        {userData.picture && (
          <img
            src={userData.picture}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md"
            aria-label="User profile picture"
          />
        )}
        <div className="text-left space-y-4">
          <div className="flex items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Name:</span>
            <p className="text-lg text-gray-800 dark:text-gray-200">{userData.name || 'N/A'}</p>
          </div>
          <div className="flex items-center">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Email:</span>
            <p className="text-lg text-gray-800 dark:text-gray-200">{userData.email || 'N/A'}</p>
          </div>
          {userData.username && (
            <div className="flex items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">Username:</span>
              <p className="text-lg text-gray-800 dark:text-gray-200">{userData.username}</p>
            </div>
          )}
        </div>

        {/* ✅ Logout button */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            aria-label="Log out"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
