import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
// Icons for tabs and cards
import {
  FiGrid,
  FiMapPin,
  FiGlobe,
  FiCalendar,
  FiCheckCircle,
  FiActivity,
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
    <span className="ml-3 text-lg">Loading series...</span>
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

// --- New Series Card Component ---
const SeriesCard = ({ series }) => {
  const placeholderImage = `https://placehold.co/600x300/1e293b/94a3b8?text=${series.name.split(' ').slice(0,3).join('+')}`;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700 group"
    >
      <Link to={`/series/${series.series_id}`}>
        <img
          src={series.image_url || placeholderImage} // Assuming you might add image_url later
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
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <FiMapPin className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-500 w-16">Host:</span>
              <span className="text-slate-200">{series.host_country}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function SeriesPage() {
  const [data, setData] = useState({
    ongoing: [],
    upcoming: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ongoing"); // 'ongoing', 'upcoming', 'completed'

  useEffect(() => {
    fetchSeriesData();
  }, []);

  const fetchSeriesData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5003/api/public/series");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching series:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderSeries = (seriesList) =>
    seriesList.length ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {seriesList.map((s) => (
          <SeriesCard key={s.series_id} series={s} />
        ))}
      </div>
    ) : (
      <EmptyState message={`No ${tab} series found.`} />
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
          <FiList /> Cricket Series
        </h1>

        {/* --- TABS (Segmented Control) --- */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => setTab("ongoing")}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-36 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
                tab === "ongoing"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiActivity size={16} /> Ongoing
            </button>
            <button
              onClick={() => setTab("upcoming")}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-36 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
                tab === "upcoming"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiCalendar size={16} /> Upcoming
            </button>
            <button
              onClick={() => setTab("completed")}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-36 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
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
                {renderSeries(data[tab])}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}