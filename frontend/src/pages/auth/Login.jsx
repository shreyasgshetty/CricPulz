import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-900 to-gray-900 ">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-blue-400 via-gray-500 to-purple-700 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-800 to-blue-500 text-white font-bold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <span
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
