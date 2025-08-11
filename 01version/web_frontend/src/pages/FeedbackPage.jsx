/* eslint-disable no-unused-vars */
import { FaCheck, FaArrowRight, FaStar, FaRegStar } from 'react-icons/fa';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 1,
    feedback: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.feedback.trim()) {
      alert('Please provide your feedback');
      return;
    }

    setIsSubmitted(true);

    try {
      const FEEDBACK_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/feedback/submit`;

      // Structure the data exactly as the API expects
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: Number(formData.rating), // Ensure rating is a number
        message: formData.feedback.trim() // Some APIs expect 'message' instead of 'feedback'
      };

      console.log('Submitting:', requestBody); // Debug log

      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'web_frontend, v0.1.0',
          // Add authorization if needed:
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      const data = await response.json();
      console.log('Success:', data);

    } catch (error) {
      console.error('Error:', error);
      alert(`Submission failed: ${error.message}`);
      setIsSubmitted(false); // Show form again on error
    } finally {
      // Only reset on successful submission
      if (!isSubmitted) {
        setFormData({
          name: "",
          email: "",
          rating: 1,
          feedback: ""
        });
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header remains unchanged */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3">
            <span className="text-cyan-600">Share</span> Your <span className="text-blue-600">Feedback</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            We'd love to hear your thoughts about our service
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div className={`px-6 py-3 ${!isSubmitted ? 'bg-gray-100' : 'bg-green-100'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {!isSubmitted ? 'Ready to receive your feedback' : 'Thank you for your feedback!'}
              </span>
              {isSubmitted && <FaCheck className="h-5 w-5 text-green-600" />}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8">
            <AnimatePresence>
              {isSubmitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    initial={{ rotate: -30, scale: 0.5 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <FaCheck className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Feedback Submitted!</h3>
                  <p className="text-gray-600 text-center mb-6">We appreciate you taking the time to help us improve.</p>
                  <motion.button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center hover:bg-blue-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit another feedback
                    <FaArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name and Email inputs remain unchanged */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

                  {/* Rating Section with React Icons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="mt-4">
                      <div className="flex justify-between mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            className="cursor-pointer"
                            onClick={() => handleStarClick(star)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Rate ${star} star`}
                          >
                            {star <= formData.rating ? (
                              <FaStar className="text-3xl text-yellow-500" />
                            ) : (
                              <FaRegStar className="text-3xl text-gray-300" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                      <div className="h-12 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={formData.rating}
                            className="text-sm font-semibold px-4 py-2 rounded-full bg-blue-100 text-gray-800"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            {formData.rating === 1 && '🌧 Terrible'}
                            {formData.rating === 2 && '😐 Okay'}
                            {formData.rating === 3 && '🙂 Good'}
                            {formData.rating === 4 && '😊 Very Good'}
                            {formData.rating === 5 && '🤩 Excellent'}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Feedback textarea remains unchanged */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback*</label>
                    <textarea
                      name="feedback"
                      placeholder="Tell us what you think..."
                      value={formData.feedback}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition min-h-[150px]"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Submit Feedback
                      <FaArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer remains unchanged */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Your feedback helps us improve our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;