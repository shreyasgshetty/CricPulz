import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading...
      </div>
    );
  }

  // Changed pt-24 to pt-16 to match the header's h-16
  return (
    <div className="bg-gray-900 text-white min-h-screen pt-16">
  <div className="max-w-6xl mx-auto px-4 space-y-12">

        <h1 className="text-4xl font-bold text-center tracking-tight">
          🏏 CricPulz - Upcoming Matches & Series
        </h1>

        {/* Upcoming Series */}
        <section>
          {/* Made the heading border more prominent and used the brand color */}
          <h2 className="text-3xl font-semibold mb-6 border-b-2 border-blue-500 pb-3">
            Upcoming Series
      _   </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.series.length ? (
              data.series.map((s) => (
              // Wrap card in a Link to make it clickable
                <Link 
                to={`/series/${s.series_id}`} 
                key={s.series_id} 
                className="block"
              >
                {/* Added more padding (p-6), a lift effect, and a shadow glow on hover */}
                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/30 h-full">
                    <h3 className="text-xl font-bold mb-3 text-blue-300">{s.name}</h3>
                    <p className="text-gray-400">
                      <span className="font-medium text-gray-300">Format:</span> {s.format}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium text-gray-300">Type:</span> {s.type}
                    </p>
    _               <p className="text-gray-400">
                      <span className="font-medium text-gray-300">Host:</span> {s.host_country}
                    </p>
                    <p className="text-gray-300 mt-4 text-sm">
                      Starts: {dayjs(s.start_date).format("MMM D, YYYY")}
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

        {/* Upcoming Matches */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b-2 border-blue-500 pb-3">
            Upcoming Matches
          </h2>
          <div className="space-y-4">
            {data.matches.length ? (
              data.matches.map((m) => {
                // Find the series name from the data.series array
                const seriesName = data.series.find(
                  (s) => s.series_id === m.series_id
                )?.name;

                return (
                  // Wrap item in a Link
                  <Link
                    to={`/matches/${m.match_id}`}
                    key={m.match_id}
                    className="block"
                  >
                    {/* Added hover effect and more padding */}
                    <div className="bg-gray-800 p-5 rounded-xl flex justify-between items-center transition-all duration-300 hover:bg-gray-700 hover:shadow-lg">
                      <div>
                        <h3 className="text-lg font-bold">
                          {m.team1} 🆚 {m.team2}
                        </h3>
                        {/* Display the series name, not the ID */}
                        <p className="text-sm text-blue-400 mt-1">
          _               {seriesName || "Match"}
                        </p>
                      </div>
                        {/* Split Date and Time for a cleaner layout */}
                      <div className="text-right">
                          <p className="text-gray-300 font-medium">
                            {dayjs(m.match_date).format("MMM D, YYYY")}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {dayjs(m.match_date).format("h:mm A")}
                          </p>
                        </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-500 text-center">
                No upcoming matches found.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}