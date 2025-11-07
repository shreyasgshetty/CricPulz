import React, { useState, useEffect } from "react";
import axios from "axios";
import clsx from "clsx";
// For the new UI, icons are highly recommended:
// npm install react-icons
import { FiShield, FiUsers, FiBarChart2 } from "react-icons/fi";

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
      setLoading(true);
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
    <div className="overflow-x-auto bg-slate-800 rounded-lg shadow-lg border border-slate-700">
      <table className="w-full min-w-[600px]">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="py-3 px-5 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-20">
              Rank
            </th>
            <th className="py-3 px-5 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
              {isPlayer ? "Player" : "Team"}
            </th>
            <th className="py-3 px-5 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-32">
              {isPlayer ? "Country" : "Type"}
            </th>
            <th className="py-3 px-5 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-24">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.length === 0 && !loading ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-16 text-slate-400"
              >
                <FiBarChart2 className="mx-auto text-5xl mb-3" />
                <span className="text-lg">No Rankings Found</span>
                <p className="text-sm">
                  Data for this category is not available yet.
                </p>
              </td>
            </tr>
          ) : (
            data.map((r, index) => (
              <tr
                key={r.ranking_id || index}
                className="hover:bg-slate-700/50 transition-colors duration-150"
              >
                <td className="py-4 px-5">
                  <span className="text-xl font-bold text-slate-100">
                    {r.rank}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={r.logo_url || r.team_logo || fallbackImage}
                      alt={r.team_name || r.player_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <span className="font-medium text-white text-base">
                      {r.team_name || r.player_name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5 text-sm text-slate-300">
                  {r.country || r.type || "—"}
                </td>
                <td className="py-4 px-5 font-semibold text-lg text-white">
                  {r.points}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[50vh] bg-slate-900 text-slate-400">
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
      <span className="ml-3 text-lg">Loading rankings...</span>
    </div>
  );

  const currentData =
    mainTab === "teams"
      ? teamRankings[subTab]
      : playerRankings[subTab.toLowerCase()];

  // Create button lists for the sub-tabs
  const teamSubTabs = ["ODI", "T20", "Test"];
  const playerSubTabs = ["batting", "bowling", "allrounder"];
  const subTabList = mainTab === "teams" ? teamSubTabs : playerSubTabs;

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          🏆 CricPulz Rankings
        </h1>

        {/* --- MAIN TABS (Segmented Control) --- */}
        <div className="flex justify-center mb-5">
          <div className="flex space-x-2 p-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setMainTab("teams");
                setSubTab("ODI");
              }}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-40 px-4 py-2.5 rounded-md font-semibold transition-all duration-200",
                mainTab === "teams"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiShield size={18} /> Teams
            </button>
            <button
              onClick={() => {
                setMainTab("players");
                setSubTab("batting");
              }}
              className={clsx(
                "flex items-center justify-center gap-2 w-32 md:w-40 px-4 py-2.5 rounded-md font-semibold transition-all duration-200",
                mainTab === "players"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              )}
            >
              <FiUsers size={18} /> Players
            </button>
          </div>
        </div>

        {/* --- SUB TABS (Segmented Control) --- */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-2 p-1.5 bg-slate-800 rounded-lg border border-slate-700">
            {subTabList.map((t) => (
              <button
                key={t}
                onClick={() => setSubTab(t)}
                className={clsx(
                  "px-5 py-1.5 rounded-md font-medium transition-all duration-200 text-sm capitalize w-24 md:w-28",
                  subTab === t
                    ? "bg-slate-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* --- TABLE / LOADING SPINNER --- */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          renderRankingTable(currentData || [], mainTab === "players")
        )}
      </div>
    </div>
  );
}