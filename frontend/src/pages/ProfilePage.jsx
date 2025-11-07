import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, LogOut, Settings, Trophy, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5003/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        navigate("/login"); // redirect if token invalid or expired
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call backend logout to clear cookie (if any)
      await axios.post("http://localhost:5003/api/auth/logout", {}, { withCredentials: true });

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-300">
        Loading your profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400">
        No profile data found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg"
        >
          {/* Profile Picture Placeholder */}
          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center text-5xl font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-blue-400 mb-2">{user.name}</h1>
            <p className="text-gray-300 flex items-center justify-center md:justify-start gap-2">
              <Mail size={18} /> {user.email}
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => alert("Settings page coming soon!")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats / Highlights Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10"
        >
          <div className="bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <Trophy size={20} /> Achievements
            </h2>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>🏆 Top 1% user engagement in Fantasy League</li>
              <li>📈 15 matches predicted correctly</li>
              <li>⭐ Joined: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Star size={20} /> Favorite Teams
            </h2>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>🇮🇳 India</li>
              <li>🔥 Royal Challengers Bangalore</li>
              <li>🇦🇺 Australia</li>
            </ul>
          </div>
        </motion.div>

        {/* Activity / History Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-5 mt-10 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <User size={20} /> Recent Activity
          </h2>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>🕒 Viewed “India vs RCB” match details</li>
            <li>💬 Commented on latest news article</li>
            <li>📊 Checked rankings and team stats</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
