import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function AdminManage() {
  const [series, setSeries] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem("adminToken");

  // Fetch series
  useEffect(() => {
    fetchSeries();
    // eslint-disable-next-line
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/admin/series", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSeries(res.data);
    } catch (err) {
      toast.error("Failed to load series");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this series?")) return;
    try {
      await axios.delete(`http://localhost:5003/api/admin/series/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Series deleted");
      fetchSeries();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (s) => {
    setEditRow(s.series_id);
    setEditData(s);
  };

  const handleCancel = () => {
    setEditRow(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5003/api/admin/series/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Series updated");
      setEditRow(null);
      fetchSeries();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
          🏏 Manage Series
        </h1>

        {series.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-center">Format</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Host</th>
                  <th className="p-3 text-center">Start</th>
                  <th className="p-3 text-center">End</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => (
                  <tr
                    key={s.series_id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-3">
                      {editRow === s.series_id ? (
                        <input
                          className="bg-gray-700 p-1 rounded w-full"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                        />
                      ) : (
                        s.name
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === s.series_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.format}
                          onChange={(e) =>
                            setEditData({ ...editData, format: e.target.value })
                          }
                        >
                          <option value="ODI">ODI</option>
                          <option value="T20">T20</option>
                          <option value="Test">Test</option>
                        </select>
                      ) : (
                        s.format
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === s.series_id ? (
                        <select
                          className="bg-gray-700 p-1 rounded"
                          value={editData.type}
                          onChange={(e) =>
                            setEditData({ ...editData, type: e.target.value })
                          }
                        >
                          <option value="International">International</option>
                          <option value="Domestic">Domestic</option>
                          <option value="Franchise">Franchise</option>
                        </select>
                      ) : (
                        s.type
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === s.series_id ? (
                        <input
                          className="bg-gray-700 p-1 rounded w-full"
                          value={editData.host_country}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              host_country: e.target.value,
                            })
                          }
                        />
                      ) : (
                        s.host_country
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === s.series_id ? (
                        <input
                          type="date"
                          className="bg-gray-700 p-1 rounded"
                          value={editData.start_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              start_date: e.target.value,
                            })
                          }
                        />
                      ) : (
                        s.start_date?.split("T")[0]
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRow === s.series_id ? (
                        <input
                          type="date"
                          className="bg-gray-700 p-1 rounded"
                          value={editData.end_date?.split("T")[0] || ""}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              end_date: e.target.value,
                            })
                          }
                        />
                      ) : (
                        s.end_date?.split("T")[0]
                      )}
                    </td>

                    <td className="p-3 flex justify-center gap-2">
                      {editRow === s.series_id ? (
                        <>
                          <button
                            onClick={() => handleSave(s.series_id)}
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
                            onClick={() => handleEdit(s)}
                            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.series_id)}
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
          <p className="text-gray-400 text-center mt-10">No series found.</p>
        )}
      </div>
    </div>
  );
}
