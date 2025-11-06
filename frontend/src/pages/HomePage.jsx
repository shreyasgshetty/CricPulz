import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

export default function HomePage() {
  const [data, setData] = useState({ series: [], matches: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/public/home");
      setData(res.data);
    } catch (err) {
      console.error("Home fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-400 mb-2">
            🏏 CricPulz
          </h1>
        </div>

        {/* UPCOMING SERIES */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 border-b-2 border-blue-500 inline-block pb-2">
            Upcoming Series
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.series.length ? (
              data.series.map((s) => (
                <Link
                  to={`/series/${s.series_id}`}
                  key={s.series_id}
                  className="group block bg-gray-800 hover:bg-gray-700 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-blue-500/30 transition-all duration-300"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-blue-300 group-hover:text-blue-400">
                      {s.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Format:</span>{" "}
                      {s.format}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Type:</span>{" "}
                      {s.type}
                    </p>
                    <p className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">Host:</span>{" "}
                      {s.host_country}
                    </p>
                    <p className="text-gray-400 mt-3 text-sm">
                      🗓️ Starts: {dayjs(s.start_date).format("MMM D, YYYY")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No upcoming series found.
              </p>
            )}
          </div>
        </section>

        {/* UPCOMING MATCHES */}
        <section>
          <h2 className="text-3xl font-semibold mb-8 border-b-2 border-blue-500 inline-block pb-2">
            Upcoming Matches
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.matches.length ? (
              data.matches.map((m) => {
                const seriesName =
                  data.series.find((s) => s.series_id === m.series_id)?.name ||
                  "Match";

                // ✅ Expect m.team1_logo and m.team2_logo from backend (join with teams table)
                return (
                  <Link
                    to={`/matches/${m.match_id}`}
                    key={m.match_id}
                    className="block bg-gray-800 rounded-2xl p-5 shadow-md hover:shadow-blue-400/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Teams Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={m.team1_logo}
                          alt={m.team1}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <h3 className="text-lg font-semibold">{m.team1}</h3>
                      </div>
                      <span className="text-gray-400 font-bold">VS</span>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{m.team2}</h3>
                        <img
                          src={m.team2_logo}
                          alt={m.team2}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-center border-t border-gray-700 pt-3">
                      <p className="text-blue-400 font-medium text-sm">
                        {seriesName}
                      </p>
                      <p className="text-gray-300 mt-1 text-sm">
                        {dayjs(m.match_date).format("MMM D, YYYY")}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {dayjs(m.match_date).format("h:mm A")}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No upcoming matches found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
