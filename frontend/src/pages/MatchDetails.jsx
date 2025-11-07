import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import clsx from "clsx";
// Icons for a professional feel
// npm install react-icons
import {
  FiInfo,
  FiUsers,
  FiList,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";

// 🧮 Fixed utility function for totals
const calcTotals = (batting = [], bowling = []) => {
  const runs = batting.reduce((a, b) => a + (b.runs || 0), 0);
  // Correctly calculate wickets from the bowling figures
  const wickets = bowling.reduce((a, b) => a + (b.wickets || 0), 0);
  
  const totalBalls = batting.reduce((a, b) => a + (b.balls || 0), 0);
  // Correctly format overs, e.g., 19.5 or 20.0
  const fullOvers = Math.floor(totalBalls / 6);
  const partialBalls = totalBalls % 6;
  const overs = `${fullOvers}.${partialBalls}`;
  
  return { runs, wickets, overs };
};

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
    <span className="ml-3 text-lg">Loading match details...</span>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col justify-center items-center min-h-[50vh] text-red-400">
    <FiAlertCircle className="w-16 h-16 mb-4" />
    <h2 className="text-2xl font-semibold">{message}</h2>
    <p className="text-red-300">Please check the match ID and try again.</p>
  </div>
);

export default function MatchDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("scorecard"); // Default to scorecard
  const [inningsTab, setInningsTab] = useState(0); // 0 = first, 1 = second
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5003/api/match/${id}`);
        setData(res.data);
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
      <div className="min-h-screen bg-slate-900 pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-slate-900 pt-16 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          <EmptyState message="Match Not Found" />
        </div>
      </div>
    );

  const { match, info, playingXI, innings } = data;

  // Calculate scores for the header
  const inn1 = calcTotals(innings[0]?.batting, innings[0]?.bowling);
  const inn2 = calcTotals(innings[1]?.batting, innings[1]?.bowling);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-12 md:pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* --- Main Score Header --- */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8 shadow-lg">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-400">
              {match.series_name}
            </p>
            <p className="text-xs text-slate-500">
              {dayjs(match.match_date).format("dddd, MMMM D, YYYY")}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center text-center divide-x divide-slate-700">
            <div className="px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white truncate">
                {innings[0]?.team_name || match.team1}
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-blue-400 mt-1">
                {inn1.runs}/{inn1.wickets}
              </p>
              <p className="text-sm text-slate-400">({inn1.overs} Overs)</p>
            </div>
            <div className="px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white truncate">
                {innings[1]?.team_name || match.team2}
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-blue-400 mt-1">
                {inn2.runs}/{inn2.wickets}
              </p>
              <p className="text-sm text-slate-400">({inn2.overs} Overs)</p>
            </div>
          </div>
          <div className="text-center mt-5">
            <p className="inline-block bg-green-600/20 text-green-300 font-semibold px-4 py-1.5 rounded-full text-sm">
              {info?.result_summary || "Result pending"}
            </p>
          </div>
        </div>

        {/* --- Main Tabs (Segmented Control) --- */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 p-1.5 bg-slate-800 rounded-lg border border-slate-700">
            {[
              { key: "scorecard", label: "Scorecard", icon: <FiList /> },
              { key: "playingXI", label: "Playing XI", icon: <FiUsers /> },
              { key: "info", label: "Match Info", icon: <FiInfo /> },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={clsx(
                  "flex items-center justify-center gap-2 w-32 md:w-36 px-4 py-2.5 rounded-md font-semibold transition-all duration-200 text-sm",
                  tab === t.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Tab Content --- */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700"
        >
          {/* 🏏 Scorecard */}
          {tab === "scorecard" && (
            <div>
              {/* Innings switch buttons */}
              <div className="flex justify-center gap-2 mb-6 p-1.5 bg-slate-700/50 rounded-lg border border-slate-600 max-w-md mx-auto">
                {innings.map((inn, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInningsTab(idx)}
                    className={clsx(
                      "w-full px-4 py-2 rounded-md font-semibold transition text-sm",
                      inningsTab === idx
                        ? "bg-slate-600 text-white shadow"
                        : "text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    {inn.team_name} ({idx === 0 ? "1st" : "2nd"} Inn)
                  </button>
                ))}
              </div>

              {/* Current Innings Data */}
              {innings[inningsTab] ? (
                <div>
                  {(() => {
                    const currentInnings = innings[inningsTab];
                    const totals = calcTotals(
                      currentInnings.batting,
                      currentInnings.bowling
                    );
                    return (
                      <>
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Batting: {currentInnings.team_name}
                        </h3>
                        {/* Batting Table */}
                        <div className="overflow-x-auto mb-6">
                          <table className="w-full min-w-[600px]">
                            <thead className="bg-slate-700/50">
                              <tr>
                                <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Batsman</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">R</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">B</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">4s</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">6s</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">SR</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {currentInnings.batting?.length ? (
                                currentInnings.batting.map((b) => (
                                  <tr key={b.score_id || b.player_id} className="hover:bg-slate-700/50">
                                    <td className="p-3 text-white font-medium">{b.player_name}</td>
                                    <td className="p-3 text-right font-bold text-white">{b.runs}</td>
                                    <td className="p-3 text-right text-slate-300">{b.balls}</td>
                                    <td className="p-3 text-right text-slate-300">{b.fours}</td>
                                    <td className="p-3 text-right text-slate-300">{b.sixes}</td>
                                    <td className="p-3 text-right text-slate-300">{b.strike_rate}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center text-slate-400 p-4">
                                    No batting data available.
                                  </td>
                                </tr>
                              )}
                              {/* Totals Row */}
                              <tr className="bg-slate-700/50">
                                <td className="p-3 text-white font-bold">Total</td>
                                <td className="p-3 text-right text-white font-bold">{totals.runs}</td>
                                <td colSpan="4" className="p-3 text-left text-slate-300 font-medium">
                                  ({totals.wickets} Wkts, {totals.overs} Ov)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Bowling Table */}
                        <h3 className="text-xl font-semibold text-white mb-4">
                          Bowling: {currentInnings.team_name === match.team1 ? match.team2 : match.team1}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead className="bg-slate-700/50">
                              <tr>
                                <th className="p-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Bowler</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">O</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">W</th>
                                <th className="p-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Econ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {currentInnings.bowling?.length ? (
                                currentInnings.bowling.map((b) => (
                                  <tr key={b.score_id || b.player_id} className="hover:bg-slate-700/50">
                                    <td className="p-3 text-white font-medium">{b.player_name}</td>
                                    <td className="p-3 text-right text-slate-300">{b.overs}</td>
                                    <td className="p-3 text-right font-bold text-white">{b.wickets}</td>
                                    <td className="p-3 text-right text-slate-300">{b.economy}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center text-slate-400 p-4">
                                    No bowling data available.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-slate-400 text-center">Innings not available.</p>
              )}
            </div>
          )}

          {/* 🧍 Playing XI */}
          {tab === "playingXI" && (
            <div>
              {playingXI?.length ? (
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  {[...new Set(playingXI.map((p) => p.team_name))].map(
                    (team) => (
                      <div key={team} className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400 border-b border-slate-700 pb-2">
                          {team}
                        </h3>
                        <div className="space-y-3">
                          {playingXI
                            .filter((p) => p.team_name === team)
                            .map((p, i) => (
                              <div key={i} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                                <FiUsers className="text-slate-400 w-5 h-5" />
                                <div>
                                  <p className="font-medium text-white">{p.player_name}</p>
                                  <p className="text-sm text-slate-400 capitalize">{p.role}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-center">Playing XI not available.</p>
              )}
            </div>
          )}

          {/* 📋 Match Info */}
          {tab === "info" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Toss Winner</dt>
                  <dd className="text-lg text-white">{info?.toss_winner || "N/A"}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Decision</dt>
                  <dd className="text-lg text-white capitalize">{info?.decision || "N/A"}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Venue</dt>
                  <dd className="text-lg text-white">{match?.venue || "N/A"}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Series</dt>
                  <dd className="text-lg text-white">{match?.series_name || "N/A"}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Umpire 1</dt>
                  <dd className="text-lg text-white">{info?.umpire1 || "N/A"}</dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-slate-400">Umpire 2</dt>
                  <dd className="text-lg text-white">{info?.umpire2 || "N/A"}</dd>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-5 py-2.5 rounded-lg transition-all duration-150 font-semibold"
          >
            <FiArrowLeft />
            Back to All Matches
          </Link>
        </div>
      </div>
    </div>
  );
}