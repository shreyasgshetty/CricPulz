import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function MatchesPage() {
  const [data, setData] = useState({ upcoming: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";

  useEffect(() => {
    const fetchMatches = async () => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading matches...
      </div>
    );
  }

  // Group matches by series name for visual grouping
  const groupBySeries = (matches) => {
    const grouped = {};
    matches.forEach((m) => {
      const key = m.series_name || "Unknown Series";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    });
    return grouped;
  };

  const renderMatchList = (matches, type) => {
    const grouped = groupBySeries(matches);

    return Object.keys(grouped).length ? (
      Object.entries(grouped).map(([seriesName, list]) => (
        <div key={seriesName} className="mb-8">
          <h3 className="text-xl font-semibold text-blue-400 mb-3">
            {seriesName}
          </h3>
          <div className="space-y-3">
            {list.map((m) => (
              <div
                key={m.match_id}
                onClick={() => navigate(`/matches/${m.match_id}`)}
                className="bg-gray-800 hover:bg-gray-700 transition-all rounded-xl p-5 flex justify-between items-center cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={m.team1_logo || fallbackImage}
                    alt={m.team1}
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <span className="text-lg font-semibold">{m.team1}</span>
                  <span className="text-gray-400 font-medium">vs</span>
                  <span className="text-lg font-semibold">{m.team2}</span>
                  <img
                    src={m.team2_logo || fallbackImage}
                    alt={m.team2}
                    className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                </div>

                <div className="text-right text-sm">
                  <p className="text-gray-300">
                    {dayjs(m.match_date).format("MMM D, YYYY")}
                  </p>
                  {m.venue && (
                    <p className="text-gray-400 italic">{m.venue}</p>
                  )}
                  {type === "completed" && m.winner_team && (
                    <p className="text-green-400 font-medium mt-1">
                      🏆 {m.winner_team} won
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-center">No matches found.</p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">
          🏏 All Matches
        </h1>

        {/* Upcoming Matches */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">
            🟢 Upcoming Matches
          </h2>
          {renderMatchList(data.upcoming, "upcoming")}
        </section>

        {/* Completed Matches */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-500 pb-2">
            🔵 Completed Matches
          </h2>
          {renderMatchList(data.completed, "completed")}
        </section>
      </div>
    </div>
  );
}
