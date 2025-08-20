import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // UI 
    console.log("Registration form:", form);
  };

  const passwordsMismatch =
    form.password && form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div>
        <h1>Registration form</h1>
        <p>jhfmh</p>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter your name"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>


          {/* UserName */}
          <div>
            <label className="block text-sm font-medium text-gray-700">UserName</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter your Username"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter new password"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Re-enter Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Re-enter Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Re-enter password"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {passwordsMismatch && (
              <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2 text-white font-medium hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Logins (UI only) */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center rounded-lg border py-2 hover:bg-gray-50 transition"
          >
            <FaGoogle className="mr-2" />
            Google
          </button>
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center rounded-lg border py-2 hover:bg-gray-50 transition"
          >
            <FaGithub className="mr-2" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
