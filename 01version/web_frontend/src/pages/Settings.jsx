import React from 'react';
import { FaLock, FaUserAlt, FaVolumeUp } from 'react-icons/fa';
import SpeakerSelector from '../components/SpeakerSelector';

const Settings = () => {
  return (
    <div className="bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          <span className="text-violet-600">Settings</span>{' '}
          <span className="text-gray-700">Page</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Customize your experience and preferences
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="md:w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Settings Menu</h2>
          <ul className="space-y-3">
            <li>
              <a
                href="#speaker-settings"
                className="flex items-center p-3 rounded-lg text-violet-700 bg-violet-50 font-medium"
              >
                <FaVolumeUp className="h-5 w-5 mr-3" />
                Speaker Selection
              </a>
            </li>
            {/* <li>
              <a
                href="#privacy"
                className="flex items-center p-3 rounded-lg text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <FaLock className="h-5 w-5 mr-3" />
                Privacy Settings
              </a>
            </li>
            <li>
              <a
                href="#account"
                className="flex items-center p-3 rounded-lg text-gray-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              >
                <FaUserAlt className="h-5 w-5 mr-3" />
                Account Settings
              </a>
            </li> */}
          </ul>
        </nav>

        {/* Settings Content */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <SpeakerSelector />
        </div>
      </div>
    </div>
  );
};

export default Settings;
