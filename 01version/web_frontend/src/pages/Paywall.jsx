import React from 'react';
import { FaCheckCircle, FaRocket, FaStar, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For subtle animations

const Paywall = () => {
  const features = [
    { text: "Context-Aware AI Processing", icon: <FaCheckCircle className="text-teal-400" /> },
    { text: "Priority Developer Support", icon: <FaRocket className="text-teal-400" /> },
    { text: "Real-Time Language Translation", icon: <FaStar className="text-teal-400" /> },
    { text: "Advanced Security Protocols", icon: <FaLock className="text-teal-400" /> },
    { text: "Unlimited API Access", icon: <FaCheckCircle className="text-teal-400" /> },
    { text: "Customizable Dashboards", icon: <FaStar className="text-teal-400" /> },
  ];

  const handleFreeTrail = () => {
    console.log("Free Trail ");
  }

  const handleSubscription = () => {
    console.log("Subscription Started");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full text-white space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-lg shadow-inner"
          >
            <span className="tracking-wider"><img src="../assets/HalfLogo_transparent.png" alt="" /></span>
          </motion.div>
        </div>

        {/* Premium Title */}
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-wider text-white/90">
          Unlock Premium Experience
        </h2>

        {/* Subtitle */}
        <p className="text-center text-sm sm:text-base text-white/70">
          Elevate your experience with cutting-edge features and exclusive access.
        </p>

        {/* Features */}
        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-3"
            >
              {feature.icon}
              <span className="text-white/80 text-sm sm:text-base">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Price Box */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/10 border border-white/20 rounded-xl text-center py-4 sm:py-5 text-lg sm:text-xl font-medium text-white/90"
          onClick={handleSubscription}
        >
          $12 / month
          <span className="block text-xs sm:text-sm text-white/60">Billed annually, save 20%</span>
        </motion.div>

        {/* Subscribe Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-teal-400 to-blue-600 hover:from-blue-600 hover:to-teal-400 transition-all duration-300 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg"
          onClick={handleFreeTrail}
        >
          Start Your Free Trial
        </motion.button>

        {/* Note */}
        <p className="text-center text-xs sm:text-sm text-white/50">
          14-day free trial. Cancel anytime. No credit card required.
        </p>

        {/* Testimonial */}
        <div className="text-center text-white/70 text-xs sm:text-sm">
          <p>"Voice connected, world united"</p>
          <p className="text-white/50">— Anil Kumar Hansda, 2025</p>
        </div>

        {/* Futuristic Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-3xl rounded-3xl" />
      </motion.div>
    </div>
  );
};

export default Paywall;