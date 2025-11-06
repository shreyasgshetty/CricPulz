import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

export default function SeriesDetails() {
  const { id } = useParams();
  const [series, setSeries] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchSeriesDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);


  const fetchSeriesDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5003/api/public/series/${id}`);
      setSeries(res.data.series);
      setMatches(res.data.matches);
    } catch (err) {
      console.error("Error fetching series details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading series details...
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400">
        Series not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Series Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-400 mb-2">{series.name}</h1>
            <p className="text-gray-300">
              <span className="font-semibold">Format:</span> {series.format} |{" "}
              <span className="font-semibold">Type:</span> {series.type}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold">Host Country:</span>{" "}
              {series.host_country}
            </p>
            <p className="text-gray-400 mt-1">
              📅 {dayjs(series.start_date).format("MMM D")} –{" "}
              {dayjs(series.end_date).format("MMM D, YYYY")}
            </p>
          </div>
        </div>

        {/* Matches */}
        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">
          Matches in this Series
        </h2>

        {matches.length ? (
          <div className="space-y-4">
            {matches.map((m) => (
              <div
                key={m.match_id}
                className="bg-gray-800 rounded-xl p-5 flex justify-between items-center hover:bg-gray-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={m.team1_logo || fallbackImage}
                    alt={m.team1}
                    className="w-10 h-10 rounded-full border border-gray-600 object-cover"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <div className="text-lg font-semibold">{m.team1}</div>
                  <span className="text-gray-400 font-medium">vs</span>
                  <div className="text-lg font-semibold">{m.team2}</div>
                  <img
                    src={m.team2_logo || fallbackImage}
                    alt={m.team2}
                    className="w-10 h-10 rounded-full border border-gray-600 object-cover"
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No matches available for this series.</p>
        )}

        {/* Back button */}
        <div className="mt-8 text-center">
          <Link
            to="/series"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            ← Back to Series
          </Link>
        </div>
      </div>
    </div>
  );
}
