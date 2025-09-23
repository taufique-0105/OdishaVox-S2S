import React, { useState } from "react";
import { FaGoogle, FaCheck, FaArrowRight } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // --- Email/Password Login Handler ---
  const loginUser = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      setLoading(true);
      const LOGIN_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth/login`;

      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed.");

      console.log("Email/Password login success:", data);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err.message);
      alert(err.message); // (optional) show error
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login Handlers ---
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

  // --- Google Login Hook ---
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "implicit", // or "auth-code" if backend expects code
  });

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3">
            <span className="text-cyan-600">Welcome to</span> <span className="text-blue-600">BharatVox</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div className="px-6 py-3 bg-gray-100">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Ready to access your account
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8">
            <form className="space-y-6" onSubmit={loginUser}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
                <div className="text-right mt-1">
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                  <FaArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-2 text-sm text-gray-500">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              {/* Custom Google Button */}
              <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center border border-gray-300 py-3 mt-4 rounded-lg bg-white hover:bg-gray-100 transition"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                <span className="text-gray-700">Sign in with Google</span>
              </button>
            </form>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Register
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Your privacy and security are important to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;