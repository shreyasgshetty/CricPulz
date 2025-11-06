import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";

export default function RankingsPage() {
  const [teamRankings, setTeamRankings] = useState({
    ODI: [],
    T20: [],
    Test: [],
  });
  const [playerRankings, setPlayerRankings] = useState({
    batting: [],
    bowling: [],
    allrounder: [],
  });
  const [loading, setLoading] = useState(true);

  const [mainTab, setMainTab] = useState("teams"); // 'teams' or 'players'
  const [subTab, setSubTab] = useState("ODI"); // for teams or players type

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg";

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const [teamRes, playerRes] = await Promise.all([
          axios.get("http://localhost:5003/api/rankings/teams"),
          axios.get("http://localhost:5003/api/rankings/players"),
        ]);
        setTeamRankings(teamRes.data);
        setPlayerRankings(playerRes.data);
      } catch (err) {
        console.error("Error fetching rankings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  const renderRankingTable = (data, isPlayer = false) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-gray-800 rounded-xl overflow-hidden">
        <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
          <tr>
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">{isPlayer ? "Player" : "Team"}</th>
            <th className="py-3 px-4 text-left">{isPlayer ? "Country" : "Type"}</th>
            <th className="py-3 px-4 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr
              key={r.ranking_id}
              className="border-b border-gray-700 hover:bg-gray-700 transition"
            >
              <td className="py-3 px-4 font-semibold text-blue-400">{r.rank}</td>
              <td className="py-3 px-4 flex items-center gap-3">
                <img
                  src={r.logo_url || r.team_logo || fallbackImage}
                  alt={r.team_name || r.player_name}
                  className="w-8 h-8 rounded-full border border-gray-600"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <span>{r.team_name || r.player_name}</span>
              </td>
              <td className="py-3 px-4 text-gray-300">
                {r.country || r.type || "—"}
              </td>
              <td className="py-3 px-4 font-semibold">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading rankings...
      </div>
    );
  }

  const currentData =
    mainTab === "teams"
      ? teamRankings[subTab]
      : playerRankings[subTab.toLowerCase()];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          🏆 CricPulz Rankings
        </h1>

        {/* MAIN TABS */}
        <div className="flex justify-center gap-6 mb-6">
          {["teams", "players"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setMainTab(tab) ||
                setSubTab(tab === "teams" ? "ODI" : "batting")
              }
              className={clsx(
                "px-5 py-2 rounded-lg font-semibold transition",
                mainTab === tab
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              )}
            >
              {tab === "teams" ? "Teams" : "Players"}
            </button>
          ))}
        </div>

        {/* SUB TABS */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {mainTab === "teams"
            ? ["ODI", "T20", "Test"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSubTab(t)}
                  className={clsx(
                    "px-4 py-2 rounded-md transition",
                    subTab === t
                      ? "bg-blue-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  {t}
                </button>
              ))
            : ["batting", "bowling", "allrounder"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSubTab(t)}
                  className={clsx(
                    "px-4 py-2 rounded-md transition capitalize",
                    subTab === t
                      ? "bg-blue-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  )}
                >
                  {t}
                </button>
              ))}
        </div>

        {/* TABLE */}
        {currentData && currentData.length ? (
          renderRankingTable(currentData, mainTab === "players")
        ) : (
          <p className="text-center text-gray-400">No rankings found.</p>
        )}
      </div>
    </div>
  );
}
