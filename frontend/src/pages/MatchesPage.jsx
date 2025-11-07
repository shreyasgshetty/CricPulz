import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
// For icons
import {
  FiCalendar,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiList,
  FiAlertCircle
} from "react-icons/fi";

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[50vh] text-slate-400">
    <svg
      className="animate-spin h-8 w-8 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span className="ml-3 text-lg">Loading matches...</span>
  </div>
);

// --- Empty State Component ---
const EmptyState = ({ message }) => (
  <div className="flex flex-col justify-center items-center min-h-[30vh] text-slate-500">
    <FiAlertCircle className="w-12 h-12 mb-4" />
    <h2 className="text-xl font-semibold">{message}</h2>
    <p className="text-slate-400">Please check back later.</p>
  </div>
);

// --- New Match Card Component ---
const MatchCard = ({ match, type }) => {
  const navigate = useNavigate();
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";
  
  const isCompleted = type === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/matches/${match.match_id}`)}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700 cursor-pointer group"
    >
      {/* Card Header: Series + Date */}
      <div className="px-5 py-3 bg-slate-700/50 border-b border-slate-700 flex justify-between items-center">
        <span className="text-sm font-semibold text-blue-400">
          {match.series_name || "Match"}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <FiCalendar className="w-3 h-3" />
          {dayjs(match.match_date).format("MMM D, YYYY")}
        </span>
      </div>

      {/* Card Body: Team vs Team */}
      <div className="p-5 flex items-center">
        {/* Team 1 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <img
            src={match.team1_logo || fallbackImage}
            alt={match.team1}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-slate-600 mb-2"
            onError={(e) => (e.target.src = fallbackImage)}
          />
          <h3 className="text-base md:text-lg font-bold text-white text-center px-2">
            {match.team1}
          </h3>
        </div>

        {/* 'VS' or Result */}
        <div className="px-2 text-center">
          {isCompleted ? (
            <span className="text-sm font-bold text-green-500">Result</span>
          ) : (
            <span className="text-xl font-bold text-slate-500">VS</span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex flex-col items-center text-center">
          <img
            src={match.team2_logo || fallbackImage}
            alt={match.team2}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-slate-600 mb-2"
            onError={(e) => (e.target.src = fallbackImage)}
          />
          <h3 className="text-base md:text-lg font-bold text-white text-center px-2">
            {match.team2}
          </h3>
        </div>
      </div>

      {/* Card Footer: Venue / Result */}
      <div className="px-5 py-3 bg-slate-800/50 border-t border-slate-700">
        {isCompleted ? (
          <p className="text-sm text-green-400 font-medium flex items-center justify-center gap-2">
            <FiCheckCircle className="w-4 h-4" />
            {match.winner_team ? `${match.winner_team} won` : "Match Completed"}
          </p>
        ) : (
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <FiMapPin className="w-4 h-4" />
            {match.venue || "Venue TBD"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default function MatchesPage() {
  const [data, setData] = useState({ upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // 'upcoming' or 'completed'

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5003/api/public/matches");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  // Group matches by series name for visual grouping
  const groupBySeries = (matches) => {
    return matches.reduce((acc, m) => {
      const key = m.series_name || "Other Matches";
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});
  };

  const renderMatchList = (matches, type) => {
    const grouped = groupBySeries(matches);

    if (matches.length === 0) {
      return <EmptyState message={`No ${type} matches found.`} />;
    }

    return (
      <div className="space-y-8">
        {Object.entries(grouped).map(([seriesName, list]) => (
          <section key={seriesName}>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">
              {seriesName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {list.map((m) => (
                <MatchCard key={m.match_id} match={m} type={type} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
          <FiList /> All Matches
        </h1>

        {/* --- TABS (Segmented Control) --- */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => setTab("upcoming")}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-40 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
                tab === "upcoming"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiClock size={16} /> Upcoming
            </button>
            <button
              onClick={() => setTab("completed")}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-40 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
                tab === "completed"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiCheckCircle size={16} /> Completed
            </button>
          </div>
        </div>

        {/* --- Content Area --- */}
        <div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {tab === "upcoming"
                  ? renderMatchList(data.upcoming, "upcoming")
                  : renderMatchList(data.completed, "completed")}
              </motion.div> Big Data Analytics
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}