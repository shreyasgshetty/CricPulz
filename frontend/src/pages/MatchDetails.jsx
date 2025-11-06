import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`http://localhost:5003/api/public/matches/${id}`);
        setMatch(res.data);
      } catch (err) {
        console.error("Error fetching match:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading match...
      </div>
    );

  if (!match)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400">
        Match not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-lg">
          <h1 className="text-3xl font-bold text-blue-400">
            {match.team1} vs {match.team2}
          </h1>
          <p className="text-gray-300">{match.series_name}</p>
          <p className="text-gray-400">
            📅 {dayjs(match.match_date).format("MMM D, YYYY")}
          </p>
          {match.venue && <p className="text-gray-400 italic">{match.venue}</p>}
          {match.winner_team && (
            <p className="text-green-400 font-semibold mt-2">
              🏆 Winner: {match.winner_team}
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/matches"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            ← Back to Matches
          </Link>
        </div>
      </div>
    </div>
  );
}
