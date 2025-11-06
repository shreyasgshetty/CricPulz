import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, User } from "lucide-react";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5003/api/news");
        setNewsList(res.data);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading latest news...
      </div>
    );
  }

  if (!newsList.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-500">
        No approved news found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">
          📰 CricPulz News
        </h1>

        {newsList.map((news, index) => {
          const isOpen = expanded === index;
          return (
            <motion.div
              key={news.id}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Title and author */}
              <div
                className="p-6 cursor-pointer flex justify-between items-center"
                onClick={() => setExpanded(isOpen ? null : index)}
              >
                <div>
                  <h2 className="text-2xl font-semibold text-blue-400 hover:text-blue-300 transition">
                    {news.title}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                    <User className="w-4 h-4" />
                    <span>{news.author_name || "Unknown"}</span>
                    <span className="text-gray-600">•</span>
                    <span>{dayjs(news.created_at).format("MMM D, YYYY")}</span>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-gray-700"
                  >
                    {news.content.split("\n").map((para, i) => (
                      <p key={i} className="mb-4">
                        {para}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
