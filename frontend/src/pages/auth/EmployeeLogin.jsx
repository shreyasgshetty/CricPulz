import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5003/api/auth/employee-login", form);
      localStorage.setItem("employeeToken", res.data.token);
      alert("✅ Employee login successful!");
      navigate("/employee-dashboard"); // redirect to employee area
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Employee Login
        </h1>

        {message && <p className="text-center mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
          >
            Login as Employee
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Not an Employee?{" "}
          <span
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Go Back
          </span>
        </p>
      </div>
    </div>
  );
}
