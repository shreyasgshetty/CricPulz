import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("✅ Registered successfully!", { duration: 4000 });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center  bg-gradient-to-r from-blue-900 to-gray-900">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:from-blue-700 hover:to-purple-500 transition-all duration-300 shadow-lg"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
