import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiMenu, FiX, FiSettings, FiChevronDown, FiLogIn, FiUserPlus, FiHome, FiTrendingUp, FiBookmark } from 'react-icons/fi';
import BharatVoxLogo from '../assets/HalfLogo_transparent.png';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mainNavItems = [
    { label: 'Home', path: '/', icon: <FiHome className="mr-2" /> },
    // { label: 'Trending', path: '/trending', icon: <FiTrendingUp className="mr-2" /> },
    // { label: 'Bookmarks', path: '/bookmarks', icon: <FiBookmark className="mr-2" /> },
  ];

  const secondaryNavItems = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const accountNavItems = [
    { label: 'Login', path: '/login', icon: <FiLogIn className="text-lg" /> },
    { label: 'Register', path: '/register', icon: <FiUserPlus className="text-lg" /> },
    { label: 'Settings', path: '/settings', icon: <FiSettings className="text-lg" /> },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 cursor-pointer group"
            role="button"
            aria-label="Navigate to homepage"
          >
            <img
              src={BharatVoxLogo}
              alt="BharatVox logo"
              className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
              onError={() => console.error('Failed to load BharatVox logo')}
            />
            <h1 className="text-xl sm:text-4xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
              Bharat<span className="text-purple-600">Vox</span>
            </h1>
          </div>

          {/* Desktop Navigation and Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6" aria-label="Main navigation">
              {mainNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center text-gray-600 hover:text-cyan-600 font-medium text-lg px-3 py-2 rounded-md transition-all duration-300 hover:bg-gray-50 group relative"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.icon}
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              {secondaryNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="text-gray-600 hover:text-cyan-600 font-medium text-lg px-3 py-2 rounded-md transition-all duration-300 hover:bg-gray-50 group relative"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* Feedback and Account Menu (visible on md and up) */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/feedback')}
                className="flex items-center space-x-2 bg-cyan-50 text-gray-800 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Provide feedback"
              >
                <FiMessageSquare className="text-xl" />
                <span className="text-lg hidden lg:inline">Feedback</span>
              </button>

              <div className="relative" tabIndex={-1}>
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-cyan-600 focus:outline-none px-3 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Account menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <FiUser />
                  </div>
                  <FiChevronDown className={`text-xs transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                    tabIndex={-1}
                    aria-hidden="true"
                  ></div>
                )}

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {accountNavItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-800 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden sm:block md:block p-2 rounded-md text-gray-600 hover:text-cyan-600 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (visible on sm and below) */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-md">
            <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
              {mainNavItems.concat(secondaryNavItems).map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-gray-600 hover:text-cyan-600 font-medium text-base px-4 py-2 rounded-lg hover:bg-cyan-50 transition-all duration-300"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.icon || <span className="w-5"></span>}
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-2">
                {/* Account and Feedback in Mobile Menu (visible on sm and below) */}
                <div className="md:hidden flex flex-col space-y-3">
                  {accountNavItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-gray-600 hover:text-cyan-600 font-medium text-base px-4 py-2 rounded-lg hover:bg-cyan-50 transition-all duration-300 w-full"
                      aria-label={`Navigate to ${item.label}`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      navigate('/feedback');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 bg-cyan-50 text-gray-800 px-4 py-2 rounded-lg hover:bg-cyan-100 transition-all duration-300 w-full"
                    aria-label="Provide feedback"
                  >
                    <FiMessageSquare className="text-lg" />
                    <span>Feedback</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;