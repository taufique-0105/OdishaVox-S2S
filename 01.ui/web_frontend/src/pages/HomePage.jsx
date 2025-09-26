import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMic, FiType, FiRepeat, FiGlobe, FiAward, FiUsers, FiClock, FiVolume2 } from 'react-icons/fi';

function HomePage() {
  const navigate = useNavigate();

  const featureCards = [
    {
      title: "Speech to Speech",
      description: "Transform your voice into different speech patterns",
      icon: <FiRepeat className="w-8 h-8 text-green-500" />,
      color: "bg-green-100 hover:bg-green-200",
      route: "/sts",
      btnColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Text to Speech",
      description: "Convert written text into natural sounding speech",
      icon: <FiType className="w-8 h-8 text-indigo-500" />,
      color: "bg-indigo-100 hover:bg-indigo-200",
      route: "/tts",
      btnColor: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Speech to Text",
      description: "Transcribe spoken words into written text accurately",
      icon: <FiMic className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100 hover:bg-blue-200",
      route: "/stt",
      btnColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  const stats = [
    { value: "10K+", label: "Daily Users", icon: <FiUsers className="w-6 h-6" /> },
    { value: "99%", label: "Accuracy", icon: <FiAward className="w-6 h-6" /> },
    { value: "10+", label: "Languages", icon: <FiGlobe className="w-6 h-6" /> },
    { value: "Instant", label: "Processing", icon: <FiClock className="w-6 h-6" /> }
  ];

  // const testimonials = [
  //   {
  //     quote: "BharatVox has revolutionized how we handle Odia language content. The accuracy is unmatched!",
  //     author: "Pranab Das, Content Creator"
  //   },
  //   {
  //     quote: "As a teacher, this platform helps me create accessible learning materials for my students.",
  //     author: "Priyanka Mohanty, Educator"
  //   },
  //   {
  //     quote: "The speech-to-speech conversion helps me communicate effectively with my international clients.",
  //     author: "Rajesh Patnaik, Business Owner"
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            <span className="text-indigo-600">Bharat</span>Vox
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Your premier multilingual voice technology platform specializing in Indic language
          </p>
          {/* <div className="mt-8">
            <button 
              onClick={() => navigate("/demo")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition duration-300 inline-flex items-center"
            >
              <FiVolume2 className="mr-2" /> Live Demo
            </button>
          </div> */}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {featureCards.map((card, index) => (
            <div 
              key={index}
              className={`${card.color} rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex flex-col`}
            >
              <div className="mb-6 self-center">
                {card.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                {card.title}
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                {card.description}
              </p>
              <button
                onClick={() => navigate(card.route)}
                className={`${card.btnColor} text-white font-semibold py-3 px-6 rounded-xl transition duration-300 mt-auto w-full`}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose BharatVox?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-indigo-600 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 text-3xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Select Feature</h3>
              <p className="text-gray-600">Choose from our advanced voice technology tools tailored for Indic language</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 text-3xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Input Content</h3>
              <p className="text-gray-600">Provide your text or speech input in any supported language</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 text-3xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Results</h3>
              <p className="text-gray-600">Receive your converted output in your preferred language instantly</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        {/* <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <div className="text-gray-600 italic mb-6">"{testimonial.quote}"</div>
                <div className="text-gray-800 font-medium">— {testimonial.author}</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Voice Experience?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from our advanced voice technology platform.
          </p>
          <button
            onClick={() => navigate("/sts")}
            className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition duration-300"
          >
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;