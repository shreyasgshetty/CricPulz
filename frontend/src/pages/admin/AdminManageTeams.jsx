import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Save, X, Globe } from "lucide-react";

export default function AdminManageTeams() {
  const [teams, setTeams] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/admin/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    } catch (err) {
      toast.error("Failed to load teams");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await axios.delete(`http://localhost:5003/api/admin/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team deleted");
      fetchTeams();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (t) => {
    setEditRow(t.team_id);
    setEditData(t);
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5003/api/admin/team/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team updated");
      setEditRow(null);
      fetchTeams();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-8">
          🏏 Manage Teams
        </h1>

        {teams.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Logo</th>
                  <th className="p-3 text-left">Team Name</th>
                  <th className="p-3 text-center">Country</th>
                  <th className="p-3 text-center">Gender</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr
                    key={t.team_id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-3 text-center">
                      <img
                        src={t.logo_url || "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg"}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                        onError={(e) => (e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/15/Cricket_picto.svg")}
                      />
                    </td>

                    <td className="p-3 text-left">
                      {editRow === t.team_id ? (
                        <input
                          className="bg-gray-700 p-1 rounded w-full"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      ) : (
                        t.name
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === t.team_id ? (
                        <input
                          className="bg-gray-700 p-1 rounded"
                          value={editData.country}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              country: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1">
                            <Globe size={14} className="text-blue-400" />
                            {t.country}
                          </span>
                        </>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === t.team_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.gender}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      ) : (
                        t.gender
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === t.team_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.type}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="National">National</option>
                          <option value="Franchise">Franchise</option>
                          <option value="Club">Club</option>
                        </select>
                      ) : (
                        t.type
                      )}
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      {editRow === t.team_id ? (
                        <>
                          <button
                            onClick={() => handleSave(t.team_id)}
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
                            onClick={() => handleEdit(t)}
                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.team_id)}
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
          <p className="text-gray-400 text-center mt-10">No teams found.</p>
        )}
      </div>
    </div>
  );
}
