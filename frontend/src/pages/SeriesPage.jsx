import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function SeriesPage() {
  const [data, setData] = useState({
    ongoing: [],
    upcoming: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeriesData();
  }, []);

  const fetchSeriesData = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/public/series");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching series:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading series...
      </div>
    );
  }

  const renderSeries = (seriesList) =>
    seriesList.length ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {seriesList.map((s) => (
          <Link
            to={`/series/${s.series_id}`}
            key={s.series_id}
            className="bg-gray-800 hover:bg-gray-700 transition-all p-6 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-blue-500/30"
          >
            <h3 className="text-xl font-bold mb-2 text-blue-300">{s.name}</h3>
            <p className="text-gray-400 text-sm">
              <span className="font-medium">Format:</span> {s.format}
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-medium">Type:</span> {s.type}
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-medium">Host:</span> {s.host_country}
            </p>
            <p className="text-gray-400 text-sm mt-3">
              📅 {dayjs(s.start_date).format("MMM D")} –{" "}
              {dayjs(s.end_date).format("MMM D, YYYY")}
            </p>
          </Link>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">No series found.</p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">

        <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">
          🏏 Cricket Series Overview
        </h1>

        {/* Ongoing Series */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-green-500 pb-2">
            🟢 Ongoing Series
          </h2>
          {renderSeries(data.ongoing)}
        </section>

        {/* Upcoming Series */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">
            🟠 Upcoming Series
          </h2>
          {renderSeries(data.upcoming)}
        </section>

        {/* Completed Series */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-500 pb-2">
            🔵 Completed Series
          </h2>
          {renderSeries(data.completed)}
        </section>

      </div>
    </div>
  );
}
