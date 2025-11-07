import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Save, X, Calendar } from "lucide-react";

export default function AdminManageMatches() {
  const [matches, setMatches] = useState([]);
  const [series, setSeries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    try {
      const [matchRes, seriesRes, teamRes, venueRes] = await Promise.all([
        axios.get("http://localhost:5003/api/admin/match", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5003/api/admin/series", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5003/api/admin/team", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5003/api/admin/venues", { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      setMatches(matchRes.data);
      setSeries(seriesRes.data);
      setTeams(teamRes.data);
      setVenues(venueRes.data);
    } catch (err) {
      toast.error("Failed to load matches");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await axios.delete(`http://localhost:5003/api/admin/match/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Match deleted");
      fetchAll();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (m) => {
    setEditRow(m.match_id);
    setEditData(m);
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5003/api/admin/match/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Match updated");
      setEditRow(null);
      fetchAll();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-8">
          🏟 Manage Matches
        </h1>

        {matches.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Teams</th>
                  <th className="p-3 text-center">Series</th>
                  <th className="p-3 text-center">Venue</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Winner</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.match_id} className="border-t border-gray-700 hover:bg-gray-800 transition">
                    {/* Teams */}
                    <td className="p-3 flex items-center justify-start gap-3">
                      <img
                        src={m.team1_logo || "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg"}
                        alt={m.team1_name}
                        className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                        onError={(e) =>
                          (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg")
                        }
                      />
                      <span>{m.team1_name}</span>
                      <span className="text-gray-400 mx-2">vs</span>
                      <span>{m.team2_name}</span>
                      <img
                        src={m.team2_logo || "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg"}
                        alt={m.team2_name}
                        className="w-8 h-8 rounded-full border border-gray-700 object-cover"
                        onError={(e) =>
                          (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg")
                        }
                      />
                    </td>

                    {/* Series */}
                    <td className="p-3 text-center">
                      {editRow === m.match_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.series_id || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, series_id: e.target.value })
                          }
                        >
                          <option value="">None</option>
                          {series.map((s) => (
                            <option key={s.series_id} value={s.series_id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        m.series_name || "-"
                      )}
                    </td>

                    {/* Venue */}
                    <td className="p-3 text-center">
                      {editRow === m.match_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.venue_id || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, venue_id: e.target.value })
                          }
                        >
                          <option value="">Select Venue</option>
                          {venues.map((v) => (
                            <option key={v.venue_id} value={v.venue_id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        m.venue_name || "-"
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-3 text-center">
                      {editRow === m.match_id ? (
                        <input
                          type="date"
                          className="bg-gray-700 p-1 rounded"
                          value={editData.match_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, match_date: e.target.value })
                          }
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-300">
                          <Calendar size={14} />{" "}
                          {m.match_date?.split("T")[0] || "-"}
                        </span>
                      )}
                    </td>

                    {/* Winner */}
                    <td className="p-3 text-center">
                      {editRow === m.match_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.winner_team_id || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, winner_team_id: e.target.value })
                          }
                        >
                          <option value="">No Result</option>
                          {teams.map((t) => (
                            <option key={t.team_id} value={t.team_id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        teams.find((t) => t.team_id === m.winner_team_id)?.name || "-"
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 flex justify-center gap-2">
                      {editRow === m.match_id ? (
                        <>
                          <button
                            onClick={() => handleSave(m.match_id)}
                            className="bg-green-600 hover:bg-green-700 p-2 rounded"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 p-2 rounded"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(m)}
                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(m.match_id)}
                            className="bg-red-600 hover:bg-red-700 p-2 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center mt-10">No matches found.</p>
        )}
      </div>
    </div>
  );
}
