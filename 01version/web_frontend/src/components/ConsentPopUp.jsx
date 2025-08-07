import { useState, useEffect } from "react";

const ConsentPopUp = () => {
  const [showConsent, setShowConsent] = useState(false);

  // Check if user has already made a cookie choice
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowConsent(true); // Show popup if no consent is stored
    }
  }, []);

  // Handle cookie acceptance
  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowConsent(false);
    // Add logic for enabling cookies or analytics (e.g., Google Analytics)
  };

  // Handle cookie rejection
  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowConsent(false);
    // Add logic to disable non-essential cookies
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-5 rounded-lg shadow-lg z-50 max-w-lg w-11/12 text-center">
      <p className="mb-4 text-base leading-relaxed">
        This website uses cookies to enhance your experience. By continuing, you
        agree to our use of cookies.{" "}
        <a href="/privacy-policy" target="_blank" className="text-blue-400 underline hover:text-blue-500">
          Learn more
        </a>
      </p>
      <div className="flex justify-center gap-3">
        <button
          onClick={handleAccept}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default ConsentPopUp;