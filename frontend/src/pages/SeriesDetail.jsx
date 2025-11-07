import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
// Icons
import {
  FiGrid,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiArrowLeft,
  FiList,
  FiAlertCircle,
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
    <span className="ml-3 text-lg">Loading series details...</span>
  </div>
);

// --- Empty State Component ---
const EmptyState = ({ message, isError = false }) => (
  <div className={`flex flex-col justify-center items-center min-h-[50vh] ${isError ? 'text-red-400' : 'text-slate-500'}`}>
    <FiAlertCircle className="w-16 h-16 mb-4" />
    <h2 className="text-2xl font-semibold">{message}</h2>
    {isError && <p className="text-red-300">Please check the URL and try again.</p>}
  </div>
);

// --- Reusable Match Card Component (from MatchesPage) ---
const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";
  
  // Determine if match is completed by checking for a winner
  const isCompleted = !!match.winner_team;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/matches/${match.match_id}`)}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700 cursor-pointer group"
    >
      {/* Card Header: Match Date */}
      <div className="px-5 py-3 bg-slate-700/50 border-b border-slate-700 flex justify-end items-center">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <FiCalendar className="w-3 h-3" />
          {dayjs(match.match_date).format("MMM D, YYYY")}
          {!isCompleted && match.start_time && (
            <>
              <span className="text-slate-600">|</span>
              <FiClock className="w-3 h-3" />
              {dayjs(match.start_time, "HH:mm:ss").format("h:mm A")}
            </>
          )}
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

export default function SeriesDetails() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeriesDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSeriesDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5003/api/public/series/${id}`);
      setSeries(res.data.series);
      setMatches(res.data.matches);
    } catch (err)
 {
      console.error("Error fetching series details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-slate-900 pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <EmptyState message="Series Not Found" isError />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Series Header */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-8 border border-slate-700">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {series.name}
          </h1>
          <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            {dayjs(series.start_date).format("MMM D")} –{" "}
            {dayjs(series.end_date).format("MMM D, YYYY")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-700 pt-4">
            <div className="flex items-center gap-2 text-slate-300">
              <FiGrid className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs text-slate-400">Format</span>
                <p className="font-medium">{series.format}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <FiGlobe className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs text-slate-400">Type</span>
                <p className="font-medium">{series.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <FiMapPin className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs text-slate-400">Host</span>
                <p className="font-medium">{series.host_country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Matches */}
        <h2 className="text-xl md:text-2xl font-semibold mb-5 flex items-center gap-2">
          <FiList /> Matches
        </h2>

        {matches.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matches.map((m) => (
              <MatchCard key={m.match_id} match={m} />
            ))}
          </div>
        ) : (
          <EmptyState message="No matches available for this series." />
        )}

        {/* Back button */}
        <div className="mt-10 text-center">
          <Link
            to="/series"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-5 py-2.5 rounded-lg transition-all duration-150 font-semibold"
          >
            <FiArrowLeft />
            Back to All Series
          </Link>
        </div>
      </div>
    </div>
  );
}