import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [data, setData] = useState({
    series: [],
    teams: [],
    matches: [],
    employees: [],
    pendingNews: []
  });
  const [formSeries, setFormSeries] = useState({ name: "", format: "", type: "", start_date: "", end_date: "", host_country: "" });
  const [formTeam, setFormTeam] = useState({ team_name: "", country: "", gender: "male", logo_url: "", type: "" });
  const [formMatch, setFormMatch] = useState({ series_id: "", team1_id: "", team2_id: "", venue_id: "" });
  const [assignForm, setAssignForm] = useState({ employee_id: "", target_type: "match", target_id: "", role: "" });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin");
      return;
    }
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load admin data");
      navigate("/admin");
    }
  };

  const handleSeriesCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/series", formSeries, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Series created");
      setFormSeries({ name: "", format: "", type: "", start_date: "", end_date: "", host_country: "" });
      fetchDashboard();
    } catch (err) { toast.error(err.response?.data?.message || "Create failed"); }
  };

  const handleTeamCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/team", formTeam, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Team created");
      setFormTeam({ team_name: "", country: "", gender: "male", logo_url: "", type: "" });
      fetchDashboard();
    } catch (err) { toast.error(err.response?.data?.message || "Create failed"); }
  };

  const handleMatchCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/match", formMatch, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Match created");
      setFormMatch({ series_id: "", team1_id: "", team2_id: "", venue_id: "" });
      fetchDashboard();
    } catch (err) { toast.error(err.response?.data?.message || "Create failed"); }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/assign", assignForm, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("Employee assigned");
      setAssignForm({ employee_id: "", target_type: "match", target_id: "", role: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Assign failed"); }
  };

  const approveNews = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/news/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("News approved");
      fetchDashboard();
    } catch (err) { toast.error("Approve failed"); }
  };

  const rejectNews = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      await axios.post(`http://localhost:5000/api/admin/news/${id}/reject`, { reason }, { headers: { Authorization: `Bearer ${token}` }});
      toast.success("News rejected");
      fetchDashboard();
    } catch (err) { toast.error("Reject failed"); }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-xl mb-4">Create Series</h3>
            <form onSubmit={handleSeriesCreate} className="space-y-3">
              <input value={formSeries.name} onChange={e=>setFormSeries({...formSeries,name:e.target.value})} placeholder="Series Name" className="w-full p-2 rounded bg-gray-700"/>
              <input value={formSeries.format} onChange={e=>setFormSeries({...formSeries,format:e.target.value})} placeholder="Format (ODI/T20/Test)" className="w-full p-2 rounded bg-gray-700"/>
              <input value={formSeries.type} onChange={e=>setFormSeries({...formSeries,type:e.target.value})} placeholder="Type (league/friendly)" className="w-full p-2 rounded bg-gray-700"/>
              <input value={formSeries.host_country} onChange={e=>setFormSeries({...formSeries,host_country:e.target.value})} placeholder="Host Country" className="w-full p-2 rounded bg-gray-700"/>
              <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded">Create</button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-xl mb-4">Create Team / Franchise</h3>
            <form onSubmit={handleTeamCreate} className="space-y-3">
              <input value={formTeam.team_name} onChange={e=>setFormTeam({...formTeam,team_name:e.target.value})} placeholder="Team Name" className="w-full p-2 rounded bg-gray-700"/>
              <input value={formTeam.country} onChange={e=>setFormTeam({...formTeam,country:e.target.value})} placeholder="Country" className="w-full p-2 rounded bg-gray-700"/>
              <input value={formTeam.type} onChange={e=>setFormTeam({...formTeam,type:e.target.value})} placeholder="Type (franchise/national)" className="w-full p-2 rounded bg-gray-700"/>
              <button className="w-full py-2 bg-gradient-to-r from-green-500 to-teal-500 rounded">Create Team</button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-xl mb-4">Create Match</h3>
            <form onSubmit={handleMatchCreate} className="space-y-3">
              <select value={formMatch.series_id} onChange={e=>setFormMatch({...formMatch,series_id:e.target.value})} className="w-full p-2 rounded bg-gray-700">
                <option value="">Select Series</option>
                {data.series.map(s => <option key={s.series_id} value={s.series_id}>{s.name}</option>)}
              </select>
              <select value={formMatch.team1_id} onChange={e=>setFormMatch({...formMatch,team1_id:e.target.value})} className="w-full p-2 rounded bg-gray-700">
                <option value="">Team 1</option>
                {data.teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
              </select>
              <select value={formMatch.team2_id} onChange={e=>setFormMatch({...formMatch,team2_id:e.target.value})} className="w-full p-2 rounded bg-gray-700">
                <option value="">Team 2</option>
                {data.teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
              </select>
              <button className="w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded">Create Match</button>
            </form>
          </div>
        </div>

        {/* Assign employees and pending news */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-2xl mb-4">Assign Employee</h3>
            <form onSubmit={handleAssign} className="space-y-3">
              <select value={assignForm.employee_id} onChange={e=>setAssignForm({...assignForm,employee_id:e.target.value})} className="w-full p-2 rounded bg-gray-700">
                <option value="">Select Employee</option>
                {data.employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.name} ({emp.email})</option>)}
              </select>
              <select value={assignForm.target_type} onChange={e=>setAssignForm({...assignForm,target_type:e.target.value})} className="w-full p-2 rounded bg-gray-700">
                <option value="match">Match</option>
                <option value="series">Series</option>
                <option value="team">Team</option>
                <option value="player">Player</option>
                <option value="ranking">Ranking</option>
              </select>
              <input value={assignForm.target_id} onChange={e=>setAssignForm({...assignForm,target_id:e.target.value})} placeholder="Target ID (numeric)" className="w-full p-2 rounded bg-gray-700"/>
              <input value={assignForm.role} onChange={e=>setAssignForm({...assignForm,role:e.target.value})} placeholder="Role (eg: scorer, manager)" className="w-full p-2 rounded bg-gray-700"/>
              <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded">Assign</button>
            </form>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow">
            <h3 className="text-2xl mb-4">Pending News / Articles</h3>
            {data.pendingNews.length ? data.pendingNews.map(n => (
              <div key={n.news_id} className="bg-gray-700 p-3 rounded mb-3">
                <h4 className="font-semibold">{n.title}</h4>
                <p className="text-sm text-gray-300 my-2">{n.content?.slice(0,200)}{n.content && n.content.length > 200 ? "..." : ""}</p>
                <div className="flex gap-2">
                  <button onClick={()=>approveNews(n.news_id)} className="px-3 py-1 bg-green-600 rounded">Approve</button>
                  <button onClick={()=>rejectNews(n.news_id)} className="px-3 py-1 bg-red-600 rounded">Reject</button>
                </div>
              </div>
            )) : <p className="text-gray-400">No pending articles</p>}
          </div>
        </div>

        <div className="mt-8">
          <button onClick={()=>navigate("/manage-teams")} className="mr-4 px-4 py-2 bg-purple-600 rounded">Manage Teams</button>
          <button onClick={()=>navigate("/manage-players")} className="mr-4 px-4 py-2 bg-blue-600 rounded">Manage Players</button>
          <button onClick={()=>navigate("/manage-matches")} className="mr-4 px-4 py-2 bg-yellow-600 rounded">Manage Matches</button>
        </div>
      </div>
    </div>
  );
}
