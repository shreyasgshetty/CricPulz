import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
// Switched to react-icons for consistency with other pages
import {
  FiUser,
  FiX,
  FiArrowRight,
  FiFileText,
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
    <span className="ml-3 text-lg">Loading latest news...</span>
  </div>
);

// --- Empty State Component ---
const EmptyState = () => (
  <div className="flex flex-col justify-center items-center min-h-[50vh] text-slate-500">
    <FiAlertCircle className="w-16 h-16 mb-4" />
    <h2 className="text-2xl font-semibold">No News Found</h2>
    <p className="text-slate-400">There are no approved news articles at this time.</p>
  </div>
);

// --- News Card Component ---
const NewsCard = ({ news, onClick, isFeatured = false }) => {
  // Use a fallback image
  const placeholderImage = `https://placehold.co/600x400/1e293b/94a3b8?text=${news.title.split(' ').slice(0,3).join('+')}`;
  
  return (
    <motion.div
      layoutId={`news-card-${news.id}`}
      onClick={() => onClick(news)}
      className={`
        bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700
        transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-700
        cursor-pointer group flex
        ${isFeatured ? "flex-col md:flex-row" : "flex-col"}
      `}
    >
      {/* Image */}
      <div className={isFeatured ? "md:w-1/2 w-full" : "w-full"}>
        <img
          src={news.image_url || placeholderImage}
          alt={news.title}
          onError={(e) => (e.target.src = placeholderImage)}
          className="w-full h-48 object-cover"
        />
      </div>
      
      {/* Content */}
      <div className={`p-5 flex flex-col ${isFeatured ? "md:w-1/2 w-full" : "w-full"}`}>
        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {news.title}
        </h2>

        {/* Metabar */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
          <FiUser className="w-4 h-4" />
          <span>{news.author_name || "CricPulz Staff"}</span>
          <span className="text-slate-600">•</span>
          <span>{dayjs(news.created_at).format("MMM D, YYYY")}</span>
        </div>
        
        {/* Snippet */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow">
          {news.content.substring(0, 120)}...
        </p>

        {/* Read More */}
        <div className="mt-auto">
          <span className="font-semibold text-blue-500 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
            Read More <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Expanded Modal View Component ---
const ExpandedNewsView = ({ news, onClose }) => {
  const placeholderImage = `https://placehold.co/800x400/1e293b/94a3b8?text=${news.title.split(' ').slice(0,3).join('+')}`;
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
      />
      
      {/* Content Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          layoutId={`news-card-${news.id}`}
          className="relative max-w-3xl w-full bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/80 text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
          
          <div className="max-h-[90vh] overflow-y-auto">
            <img
              src={news.image_url || placeholderImage}
              alt={news.title}
              onError={(e) => (e.target.src = placeholderImage)}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6 md:p-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                {news.title}
              </h1>
              
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                <FiUser className="w-4 h-4" />
                <span>{news.author_name || "CricPulz Staff"}</span>
                <span className="text-slate-600">•</span>
                <span>{dayjs(news.created_at).format("MMMM D, YYYY")}</span>
              </div>
              
              {/* Using prose for beautiful article formatting */}
              <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
                {news.content.split("\n").map((para, i) => (
                  para.trim() && <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// --- Main Page Component ---
export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5003/api/news");
        // Sort by date, newest first
        setNewsList(res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-16 pb-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!newsList.length) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-16 pb-12">
        <EmptyState />
      </div>
    );
  }

  const featuredNews = newsList[0];
  const regularNews = newsList.slice(1);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
          <FiFileText /> CricPulz News
        </h1>

        {/* Featured Article */}
        {featuredNews && (
          <div className="mb-8 md:mb-12">
            <NewsCard
              news={featuredNews}
              onClick={setSelectedNews}
              isFeatured
            />
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {regularNews.map((news) => (
            <NewsCard
              key={news.id}
              news={news}
              onClick={setSelectedNews}
            />
          ))}
        </div>
      </div>

      {/* This is where the "magic" happens */}
      <AnimatePresence>
        {selectedNews && (
          <ExpandedNewsView
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}