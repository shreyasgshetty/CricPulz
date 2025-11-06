import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function MatchDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("summary");
  const [inningsTab, setInningsTab] = useState(0); // 0 = first innings, 1 = second innings
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Loading match details...
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400">
        Match not found.
      </div>
    );

  const { match, info, playingXI, innings } = data;

  // 🧮 Utility functions for totals
  const calcTotals = (batting) => {
    const runs = batting.reduce((a, b) => a + (b.runs || 0), 0);
    const wickets = batting.length > 10 ? 10 : Math.floor(batting.length / 2);
    const overs = ((batting.reduce((a, b) => a + (b.balls || 0), 0)) / 6).toFixed(1);
    return { runs, wickets, overs };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-blue-400">
            {match.team1} vs {match.team2}
          </h1>
          <p className="text-gray-300">{match.series_name}</p>
          <p className="text-gray-400">
            📅 {dayjs(match.match_date).format("MMM D, YYYY")}
          </p>
          {match.venue && <p className="italic text-gray-400">{match.venue}</p>}
          {match.winner_team && (
            <p className="text-green-400 font-semibold mt-2">
              🏆 Winner: {match.winner_team}
            </p>
          )}
        </div>

        {/* Main Tabs */}
        <div className="flex justify-center mt-8 gap-3 flex-wrap">
          {["summary", "scorecard", "playingXI", "info"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                "px-4 py-2 rounded-md font-semibold transition capitalize",
                tab === t
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              )}
            >
              {t === "playingXI" ? "Playing XI" : t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 bg-gray-800 rounded-xl p-6"
        >
          {/* 🏁 Summary */}
          {tab === "summary" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-400">Match Summary</h2>
              <p className="text-gray-300 leading-relaxed">
                {info?.result_summary || "Match summary not available."}
              </p>
            </div>
          )}

          {/* 🏏 Scorecard */}
          {tab === "scorecard" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-400">Scorecard</h2>

              {/* Innings switch buttons */}
              <div className="flex justify-center gap-3 mb-6">
                {innings.map((inn, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInningsTab(idx)}
                    className={clsx(
                      "px-4 py-2 rounded-md font-semibold transition",
                      inningsTab === idx
                        ? "bg-green-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    )}
                  >
                    {idx === 0 ? "1st Innings" : "2nd Innings"} ({inn.team_name})
                  </button>
                ))}
              </div>

              {/* Current Innings Data */}
              {innings[inningsTab] ? (
                <div>
                  {/* Totals */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-green-400">
                      {innings[inningsTab].team_name} Innings
                    </h3>
                    {(() => {
                      const totals = calcTotals(innings[inningsTab].batting);
                      return (
                        <p className="text-gray-300">
                          Total:{" "}
                          <span className="text-blue-400 font-semibold">
                            {totals.runs}/{totals.wickets}
                          </span>{" "}
                          ({totals.overs} ov)
                        </p>
                      );
                    })()}
                  </div>

                  {/* Batting Table */}
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse border border-gray-700">
                      <thead>
                        <tr className="bg-gray-700 text-gray-200">
                          <th className="p-2 text-left">Batsman</th>
                          <th className="p-2 text-center">R</th>
                          <th className="p-2 text-center">B</th>
                          <th className="p-2 text-center">4s</th>
                          <th className="p-2 text-center">6s</th>
                          <th className="p-2 text-center">SR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {innings[inningsTab].batting?.length ? (
                          innings[inningsTab].batting.map((b) => (
                            <tr key={b.score_id || b.player_id} className="border-t border-gray-700">
                              <td className="p-2 text-gray-300">{b.player_name}</td>
                              <td className="p-2 text-center">{b.runs}</td>
                              <td className="p-2 text-center">{b.balls}</td>
                              <td className="p-2 text-center">{b.fours}</td>
                              <td className="p-2 text-center">{b.sixes}</td>
                              <td className="p-2 text-center">{b.strike_rate}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center text-gray-400 p-2">
                              No batting data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Bowling Table */}
                  <div className="overflow-x-auto">
                    <h4 className="text-md font-semibold text-yellow-400 mb-2">
                      Bowling ({innings[inningsTab].team_name === data.match.team1 ? data.match.team2 : data.match.team1})
                    </h4>
                    <table className="w-full text-sm border-collapse border border-gray-700">
                      <thead>
                        <tr className="bg-gray-700 text-gray-200">
                          <th className="p-2 text-left">Bowler</th>
                          <th className="p-2 text-center">O</th>
                          <th className="p-2 text-center">W</th>
                          <th className="p-2 text-center">Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {innings[inningsTab].bowling?.length ? (
                          innings[inningsTab].bowling.map((b) => (
                            <tr key={b.score_id || b.player_id} className="border-t border-gray-700">
                              <td className="p-2 text-gray-300">{b.player_name}</td>
                              <td className="p-2 text-center">{b.overs}</td>
                              <td className="p-2 text-center">{b.wickets}</td>
                              <td className="p-2 text-center">{b.economy}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-gray-400 p-2">
                              No bowling data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center">Innings not available.</p>
              )}
            </div>
          )}

          {/* 🧍 Playing XI */}
          {tab === "playingXI" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-400">Playing XI</h2>
              {playingXI?.length ? (
                [...new Set(playingXI.map((p) => p.team_name))].map((team) => (
                  <div key={team} className="mb-4">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">{team}</h3>
                    <ul className="list-disc ml-6 text-gray-300 space-y-1">
                      {playingXI
                        .filter((p) => p.team_name === team)
                        .map((p, i) => (
                          <li key={i}>
                            {p.player_name} ({p.role})
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Playing XI not available.</p>
              )}
            </div>
          )}

          {/* 📋 Match Info */}
          {tab === "info" && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-blue-400">Match Info</h2>
              <ul className="text-gray-300 space-y-2">
                <li>🏏 Toss Winner: {info?.toss_winner || "N/A"}</li>
                <li>🎯 Decision: {info?.decision || "N/A"}</li>
                <li>🧑‍⚖️ Umpires: {info?.umpire1 || "N/A"}, {info?.umpire2 || "N/A"}</li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Back Button */}
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
