import React from 'react';
import { useSpeaker, useUpdateSpeaker } from '../context/SpeakerContext';
import { FaUser } from 'react-icons/fa';

const SpeakerSelector = () => {
  const speaker = useSpeaker();
  const updateSpeaker = useUpdateSpeaker();

  const handleSpeakerChange = (gender, voiceName) => {
    updateSpeaker({ gender, voiceName });
  };

  return (
    <section id="speaker-settings" className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Speaker Preferences
      </h2>
      <p className="text-gray-600 mb-6">
        Choose your preferred voice for audio feedback
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Male Speaker Option Card */}
        <div
          className={`w-full sm:w-1/2 p-6 rounded-lg border-2 cursor-pointer transition-all ${
            speaker.gender === 'male'
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-200 hover:border-violet-300'
          }`}
          onClick={() => handleSpeakerChange('male', 'abhilash')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Male Voice (Abhilash)</h3>
            {speaker.gender === 'male' && (
              <span className="bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                Selected
              </span>
            )}
          </div>
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="h-10 w-10 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Female Speaker Option Card */}
        <div
          className={`w-full sm:w-1/2 p-6 rounded-lg border-2 cursor-pointer transition-all ${
            speaker.gender === 'female'
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-200 hover:border-violet-300'
          }`}
          onClick={() => handleSpeakerChange('female', 'vidya')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Female Voice (Vidya)</h3>
            {speaker.gender === 'female' && (
              <span className="bg-violet-500 text-white text-xs px-2 py-1 rounded-full">
                Selected
              </span>
            )}
          </div>
          <div className="flex justify-center py-4">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <FaUser className="h-10 w-10 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection Indicator */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          Current selection:{' '}
          <span className="font-medium capitalize text-violet-600">
            {speaker.gender} voice ({speaker.voiceName})
          </span>
        </p>
      </div>
    </section>
  );
};

export default SpeakerSelector;
