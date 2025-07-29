import React from 'react';
import { IoClose, IoChevronDown, IoChevronUp, IoCheckmark } from 'react-icons/io5';

const LanguageSelector = ({
  label,
  selectedLanguage,
  onSelectLanguage,
  showLanguageModal,
  setShowLanguageModal,
}) => {
  const languages = [
    { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
    { code: "od-IN", name: "Odia", flag: "🇮🇳" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "ta-IN", name: "Tamil", flag: "🇮🇳" },
    { code: "te-IN", name: "Telugu", flag: "🇮🇳" },
    { code: "kn-IN", name: "Kannada", flag: "🇮🇳" },
    { code: "ml-IN", name: "Malayalam", flag: "🇮🇳" },
    { code: "bn-IN", name: "Bengali", flag: "🇮🇳" },
    { code: "gu-IN", name: "Gujarati", flag: "🇮🇳" },
    { code: "mr-IN", name: "Marathi", flag: "🇮🇳" },
    { code: "pa-IN", name: "Punjabi", flag: "🇮🇳" },
  ];

  // Add "Auto Detect" for Source Language
  if (label === "Source Language") {
    languages.unshift({ code: "unknown", name: "Auto Detect", flag: "🌐" });
  }

  const getLanguageName = (code) => {
    return languages.find((l) => l.code === code)?.name || "Select Language";
  };

  const getLanguageFlag = (code) => {
    return languages.find((l) => l.code === code)?.flag || "";
  };

  const handleLanguageSelect = (code) => {
    console.log('Selected language:', code);
    onSelectLanguage(code);
    setShowLanguageModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      console.log('Overlay clicked, closing modal');
      setShowLanguageModal(false);
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked, showLanguageModal:', showLanguageModal);
    setShowLanguageModal(true);
  };

  return (
    <div className="w-2/5 mb-4">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
      
      {/* Selector Button */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="w-full flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center">
          <span className="text-base mr-2">{getLanguageFlag(selectedLanguage)}</span>
          <span className="text-sm font-medium text-gray-800">{getLanguageName(selectedLanguage)}</span>
        </div>
        {showLanguageModal ? (
          <IoChevronUp className="text-blue-500 text-xl" />
        ) : (
          <IoChevronDown className="text-blue-500 text-xl" />
        )}
      </button>

      {/* Modal */}
        {showLanguageModal && (
          <div
            className="fixed inset-0 z-50 modal-overlay bg-opacity-80 backdrop-blur-sm flex items-center justify-center"
            onClick={handleOverlayClick}
          >
            <div
          className="bg-white w-full max-w-md rounded-t-2xl p-5 max-h-[65vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
            >
          {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Select {label}</h2>
              <button
                type="button"
                onClick={() => {
                  console.log('Close button clicked');
                  setShowLanguageModal(false);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
            
            {/* Language List */}
            <div className="space-y-2">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLanguageSelect(item.code)}
                  className={`w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 ${
                    selectedLanguage === item.code ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-base mr-2">{item.flag}</span>
                    <span
                      className={`text-base ${
                        selectedLanguage === item.code ? 'font-semibold text-blue-600' : 'text-gray-800'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  {selectedLanguage === item.code && (
                    <IoCheckmark className="text-blue-500 text-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;