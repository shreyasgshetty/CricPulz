import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";

// Import all the icons we'll need for the cards and headers
import {
  FiGrid,
  FiGlobe,
  FiCalendar,
  FiClock,
  FiList,
  FiAlertCircle,
  FiCheckCircle
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
    <span className="ml-3 text-lg">Loading...</span>
  </div>
);

// --- Empty State Component ---
const EmptyState = ({ message }) => (
  <div className="flex flex-col justify-center items-center min-h-[20vh] text-slate-500 col-span-full">
    <FiAlertCircle className="w-12 h-12 mb-4" />
    <h2 className="text-xl font-semibold">{message}</h2>
    <p className="text-slate-400">Please check back later.</p>
  </div>
);

// --- Reusable Series Card Component ---
const SeriesCard = ({ series }) => {
  const placeholderImage = `https://placehold.co/600x300/1e293b/94a3b8?text=${series.name.split(' ').slice(0,3).join('+')}`;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700 group"
    >
      <Link to={`/series/${series.series_id}`}>
        <img
          src={series.image_url || placeholderImage}
          alt={series.name}
          onError={(e) => (e.target.src = placeholderImage)}
          className="w-full h-36 object-cover"
        />
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors truncate">
            {series.name}
          </h3>
          <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            {dayjs(series.start_date).format("MMM D")} –{" "}
            {dayjs(series.end_date).format("MMM D, YYYY")}
          </p>
          <div className="space-y-2 border-t border-slate-700 pt-3">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FiGrid className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-500 w-16">Format:</span>
              <span className="text-slate-200">{series.format}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FiGlobe className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-500 w-16">Type:</span>
              <span className="text-slate-200">{series.type}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- Reusable Match Card Component ---
const MatchCard = ({ match, type = "upcoming" }) => {
  const navigate = useNavigate();
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";
  
  const isCompleted = type === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/matches/${match.match_id}`)}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700 cursor-pointer group"
    >
      <div className="px-5 py-3 bg-slate-700/50 border-b border-slate-700">
        <span className="text-sm font-semibold text-blue-400 truncate">
          {match.series_name || "Match"}
        </span>
      </div>
      <div className="p-5 flex items-center">
        <div className="flex-1 flex flex-col items-center text-center">
          <img
            src={match.team1_logo || fallbackImage}
            alt={match.team1}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-600 mb-2"
            onError={(e) => (e.target.src = fallbackImage)}
          />
          <h3 className="text-base font-bold text-white text-center px-2">
            {match.team1}
          </h3>
        </div>
        <div className="px-2 text-center">
          {isCompleted ? (
            <span className="text-sm font-bold text-green-500">Result</span>
          ) : (
            <span className="text-xl font-bold text-slate-500">VS</span>
          )}
        </div>
        <div className="flex-1 flex flex-col items-center text-center">
          <img
            src={match.team2_logo || fallbackImage}
            alt={match.team2}
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-600 mb-2"
            onError={(e) => (e.target.src = fallbackImage)}
          />
          <h3 className="text-base font-bold text-white text-center px-2">
            {match.team2}
          </h3>
        </div>
      </div>
      <div className="px-5 py-3 bg-slate-800/50 border-t border-slate-700">
        {isCompleted ? (
          <p className="text-sm text-green-400 font-medium flex items-center justify-center gap-2">
            <FiCheckCircle className="w-4 h-4" />
            {match.winner_team ? `${match.winner_team} won` : "Match Completed"}
          </p>
        ) : (
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <FiCalendar className="w-4 h-4" />
            {dayjs(match.match_date).format("MMM D, YYYY")}
            {match.start_time && (
              <>
                <span className="text-slate-600">|</span>
                <FiClock className="w-3 h-3" />
                {dayjs(match.start_time, "HH:mm:ss").format("h:mm A")}
              </>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// --- Main Home Page Component ---
export default function HomePage() {
  const [data, setData] = useState({ series: [], matches: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5003/api/public/home");
      setData(res.data);
    } catch (err) {
      console.error("Home fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen pt-12 md:pt-16 pb-16">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* HEADER */}
        <div className="text-center py-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            🏏 CricPulz
          </h1>
          <p className="text-lg text-slate-400">
            Your daily pulse of the cricket world.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* UPCOMING SERIES */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
                <FiList className="text-blue-400" />
                Upcoming Series
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.series.length ? (
                  data.series.map((s) => (
                    <SeriesCard key={s.series_id} series={s} />
                  ))
                ) : (
                  <EmptyState message="No upcoming series found." />
                )}
              </div>
            </section>

            {/* UPCOMING MATCHES */}
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
                <FiCalendar className="text-blue-400" />
                Upcoming Matches
              </h2>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {data.matches.length ? (
                  data.matches.map((m) => (
                    <MatchCard key={m.match_id} match={m} type="upcoming" />
                  ))
                ) : (
                  <EmptyState message="No upcoming matches found." />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}