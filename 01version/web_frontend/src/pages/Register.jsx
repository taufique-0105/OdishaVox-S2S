/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowRight, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");

  // Handle input change
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate input
  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "All fields are required.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const errorMsg = validateForm();
    if (errorMsg) {
      setStatus(errorMsg);
      setProcessing(false);
      return;
    }

    try {
      console.log(form)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      setStatus("success");
      navigate("/profile");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setProcessing(false);
    }
  };

  // Google login hook
  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       const decoded = jwtDecode(
  //         tokenResponse.credential || tokenResponse.access_token
  //       );
  //       console.log("Google user:", decoded);

  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/v1/auth/google`,
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ token: tokenResponse.access_token }),
  //         }
  //       );

  //       const data = await response.json();
  //       if (!response.ok) throw new Error(data.message || "Google login failed");

  //       if (data.token) {
  //         localStorage.setItem("authToken", data.token);
  //       }

  //       setStatus("success");
  //       navigate("/profile");
  //     } catch (err) {
  //       setStatus(err.message);
  //     }
  //   },
  //   onError: () => setStatus("Google login failed!"),
  // });


  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      console.log("Google Access Token:", tokenResponse.access_token);

      const GOOGLE_LOGIN_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
      const response = await fetch(GOOGLE_LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenResponse.access_token }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed on server.");

      console.log("Google login success:", data);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Google Login Failed");
  };
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "auth-code", // or "implicit" if backend expects code
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            <span className="text-cyan-600">Join</span> Us
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account and start your journey
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div
            className={`px-6 py-3 ${status === "success" ? "bg-green-100" : "bg-gray-100"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {status === "success"
                  ? "Registration successful!"
                  : "Fill out the form to register"}
              </span>
              {status === "success" && (
                <FaCheck className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>

          {/* Form Area */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.form
                onSubmit={onSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={onChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <motion.button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-70"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {processing ? "Processing..." : "Register"}
                    <FaArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.form>
            </AnimatePresence>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <hr className="flex-1 border-gray-300" />
              <span className="px-2 text-sm text-gray-500">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Button */}
            <motion.button
              onClick={() => googleLogin()}
              className="w-full inline-flex items-center justify-center rounded-lg border py-3 hover:bg-gray-50 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="mr-2 text-red-500" />
              Continue with Google
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
