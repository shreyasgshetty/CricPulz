import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUserPlus, FiUser, FiLock, FiMail } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Base Styling Classes (consistent with Login.jsx) ---
  const labelStyle = "block text-sm font-medium text-slate-300 mb-1";
  const inputStyle =
    "w-full pl-10 pr-3 py-2.5 rounded-md bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150";
  const buttonStyle =
    "w-full py-2.5 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 flex items-center justify-center gap-2";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      await axios.post("http://localhost:5003/api/auth/register", form);
      toast.success("✅ Registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-900 p-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-lg w-full max-w-md">
        
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          <FiUserPlus /> Create Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className={labelStyle}>Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                className={inputStyle}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className={labelStyle}>Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className={inputStyle}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div>
            <label htmlFor="password" className={labelStyle}>Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6} // Good practice
                className={inputStyle}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${buttonStyle} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}