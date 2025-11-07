import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// It's a good idea to add icons for a more professional feel
// You can install react-icons by running: npm install react-icons
import {
  FiPlusCircle,
  FiCheck,
  FiX,
  FiClipboard,
  FiUsers,
  FiTrello,
  FiShield,
  FiGrid,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [data, setData] = useState({
    series: [],
    teams: [],
    matches: [],
    tournaments: [],
    employees: [],
    pendingNews: [],
    venues: [],
  });

  const [formSeries, setFormSeries] = useState({
    name: "",
    format: "",
    type: "",
    start_date: "",
    end_date: "",
    host_country: "",
  });

  const [formTeam, setFormTeam] = useState({
    team_name: "",
    country: "",
    gender: "male",
    logo_url: "",
    type: "",
  });

  const [formMatch, setFormMatch] = useState({
    series_id: "",
    team1_id: "",
    team2_id: "",
    venue_id: "",
    match_date: "",
    start_time: "",
  });

  const [formTournament, setFormTournament] = useState({
    name: "",
    type: "",
    start_date: "",
    end_date: "",
    host_country: "",
  });

  const [assignForm, setAssignForm] = useState({
    employee_id: "",
    target_type: "match",
    target_id: "",
    role: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // --- Base Styling Classes for consistency ---
  const inputStyle =
    "w-full px-3 py-2 rounded-md bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150";
  const labelStyle =
    "block text-sm font-medium text-slate-300 mb-1";
  const cardStyle =
    "bg-slate-800 border border-slate-700 p-5 rounded-lg shadow-lg";
  const cardHeaderStyle =
    "text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-3 flex items-center gap-2";
  const buttonStyle =
    "w-full py-2.5 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 flex items-center justify-center gap-2";

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
      const headers = { Authorization: `Bearer ${token}` };

      const [dashRes, tourRes, venueRes] = await Promise.all([
        axios.get("http://localhost:5003/api/admin/dashboard", { headers }),
        axios.get("http://localhost:5003/api/admin/tournaments", { headers }),
        axios.get("http://localhost:5003/api/admin/venues", { headers }),
      ]);

      setData({
        ...dashRes.data,
        tournaments: tourRes.data,
        venues: venueRes.data,
      });
    } catch (err) {
      toast.error("Failed to load admin data");
      navigate("/admin");
    }
  };

  // ------------------ CRUD HANDLERS -------------------
  // (All handler logic remains unchanged)
  // ... (handleSeriesCreate, handleTeamCreate, etc. are all identical)
  // ------------------ CRUD HANDLERS -------------------

  const handleSeriesCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/admin/series", formSeries, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Series created");
      setFormSeries({
        name: "",
        format: "",
        type: "",
        start_date: "",
        end_date: "",
        host_country: "",
      });
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleTeamCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/admin/team", formTeam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team created");
      setFormTeam({
        team_name: "",
        country: "",
        gender: "male",
        logo_url: "",
        type: "",
      });
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleMatchCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/admin/match", formMatch, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Match created");
      setFormMatch({
        series_id: "",
        team1_id: "",
        team2_id: "",
        venue_id: "",
        match_date: "",
        start_time: "",
      });
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleTournamentCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/admin/tournaments", formTournament, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Tournament created");
      setFormTournament({
        name: "",
        type: "",
        start_date: "",
        end_date: "",
        host_country: "",
      });
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5003/api/admin/assign", assignForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee assigned");
      setAssignForm({
        employee_id: "",
        target_type: "match",
        target_id: "",
        role: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Assign failed");
    }
  };

  const approveNews = async (id) => {
  if (!id) return toast.error("Invalid news ID");
  try {
    await axios.post(
      `http://localhost:5003/api/admin/news/${id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("✅ News approved successfully");
    fetchDashboard();
  } catch (err) {
    console.error("Approve news error:", err);
    toast.error(err.response?.data?.message || "Approve failed");
  }
};


  const rejectNews = async (id) => {
    const reason = prompt("Reason for rejection (optional):");
    try {
      await axios.post(
        `http://localhost:5003/api/admin/news/${id}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🚫 News rejected");
      fetchDashboard();
    } catch (err) {
      toast.error("Reject failed");
    }
  };
  
  // ------------------ MAIN UI -------------------
  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Admin Dashboard
        </h1>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* --- Create Series --- */}
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}>
              <FiGrid /> Create Series
            </h3>
            <form onSubmit={handleSeriesCreate} className="space-y-4">
              <div>
                <label htmlFor="seriesName" className={labelStyle}>Series Name</label>
                <input id="seriesName" value={formSeries.name} onChange={e=>setFormSeries({...formSeries,name:e.target.value})} placeholder="e.g., The Ashes 2025" className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="seriesFormat" className={labelStyle}>Format</label>
                <select id="seriesFormat" value={formSeries.format} onChange={e=>setFormSeries({...formSeries,format:e.target.value})} className={inputStyle}>
                  <option value="">Select Format</option>
                  <option value="ODI">ODI</option>
                  <option value="T20">T20</option>
                  <option value="Test">Test</option>
                </select>
              </div>
              <div>
                <label htmlFor="seriesType" className={labelStyle}>Type</label>
                <select id="seriesType" value={formSeries.type} onChange={e=>setFormSeries({...formSeries,type:e.target.value})} className={inputStyle}>
                  <option value="">Select Type</option>
                  <option value="International">International</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Franchise">Franchise</option>
                </select>
              </div>
              <div>
                <label htmlFor="seriesStart" className={labelStyle}>Start Date</label>
                <input id="seriesStart" type="date" value={formSeries.start_date} onChange={e=>setFormSeries({...formSeries,start_date:e.target.value})} className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="seriesEnd" className={labelStyle}>End Date</label>
                <input id="seriesEnd" type="date" value={formSeries.end_date} onChange={e=>setFormSeries({...formSeries,end_date:e.target.value})} className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="seriesHost" className={labelStyle}>Host Country</label>
                <input id="seriesHost" value={formSeries.host_country} onChange={e=>setFormSeries({...formSeries,host_country:e.target.value})} placeholder="e.g., Australia" className={inputStyle}/>
              </div>
              <button type="submit" className={buttonStyle}><FiPlusCircle /> Create Series</button>
            </form>
          </div>

          {/* --- Create Team --- */}
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}><FiShield /> Create Team</h3>
            <form onSubmit={handleTeamCreate} className="space-y-4">
              <div>
                <label htmlFor="teamName" className={labelStyle}>Team Name</label>
                <input id="teamName" value={formTeam.team_name} onChange={e=>setFormTeam({...formTeam,team_name:e.target.value})} placeholder="e.g., Mumbai Indians" className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="teamCountry" className={labelStyle}>Country</label>
                <input id="teamCountry" value={formTeam.country} onChange={e=>setFormTeam({...formTeam,country:e.target.value})} placeholder="e.g., India" className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="teamLogo" className={labelStyle}>Team Logo URL</label>
                <input id="teamLogo" value={formTeam.logo_url} onChange={e=>setFormTeam({...formTeam,logo_url:e.target.value})} placeholder="https://.../logo.png" className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="teamGender" className={labelStyle}>Gender</label>
                <select id="teamGender" value={formTeam.gender} onChange={e=>setFormTeam({...formTeam,gender:e.target.value})} className={inputStyle}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label htmlFor="teamType" className={labelStyle}>Type</label>
                <select id="teamType" value={formTeam.type} onChange={e=>setFormTeam({...formTeam,type:e.target.value})} className={inputStyle}>
                  <option value="">Select Type</option>
                  <option value="National">National</option>
                  <option value="Franchise">Franchise</option>
                  <option value="Club">Club</option>
                </select>
              </div>
              <button type="submit" className={buttonStyle}><FiPlusCircle /> Create Team</button>
            </form>
          </div>

          {/* --- Create Match --- */}
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}><FiClipboard /> Create Match</h3>
            <form onSubmit={handleMatchCreate} className="space-y-4">
              <div>
                <label htmlFor="matchSeries" className={labelStyle}>Select Series</label>
                <select id="matchSeries" value={formMatch.series_id} onChange={e=>setFormMatch({...formMatch,series_id:e.target.value})} className={inputStyle}>
                  <option value="">Select Series</option>
                  {data.series.map((s) => (
                    <option key={s.series_id || s.name} value={s.series_id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="matchTeam1" className={labelStyle}>Team 1</label>
                <select id="matchTeam1" value={formMatch.team1_id} onChange={e=>setFormMatch({...formMatch,team1_id:e.target.value})} className={inputStyle}>
                  <option value="">Select Team 1</option>
                  {data.teams.map((t) => (
                    <option key={t.team_id || t.name} value={t.team_id}>{t.name}</option>
                  ))}
                </select>
                {formMatch.team1_id && (
                  <img
                    src={data.teams.find(t => t.team_id === formMatch.team1_id)?.logo_url}
                    alt="Team 1 Logo"
                    className="w-10 h-10 mt-2 rounded-full object-cover mx-auto"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
              
              <div>
                <label htmlFor="matchTeam2" className={labelStyle}>Team 2</label>
                <select id="matchTeam2" value={formMatch.team2_id} onChange={e=>setFormMatch({...formMatch,team2_id:e.target.value})} className={inputStyle}>
                  <option value="">Select Team 2</option>
                  {data.teams.map((t) => (
                    <option key={t.team_id || t.name + "_2"} value={t.team_id}>{t.name}</option>
                  ))}
                </select>
                {formMatch.team2_id && (
                  <img
                    src={data.teams.find(t => t.team_id === formMatch.team2_id)?.logo_url}
                    alt="Team 2 Logo"
                    className="w-10 h-10 mt-2 rounded-full object-cover mx-auto"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              <div>
                <label htmlFor="matchVenue" className={labelStyle}>Venue</label>
                <select id="matchVenue" value={formMatch.venue_id} onChange={(e) => setFormMatch({ ...formMatch, venue_id: e.target.value })} className={inputStyle}>
                  <option value="">Select Venue</option>
                  {data.venues.map((v) => (
                    <option key={v.venue_id} value={v.venue_id}>
                      {v.venue_name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="matchDate" className={labelStyle}>Match Date</label>
                <input id="matchDate" type="date" value={formMatch.match_date} onChange={e=>setFormMatch({...formMatch,match_date:e.target.value})} className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="matchTime" className={labelStyle}>Start Time</label>
                <input id="matchTime" type="time" value={formMatch.start_time} onChange={e=>setFormMatch({...formMatch,start_time:e.target.value})} className={inputStyle}/>
              </div>

              <button type="submit" className={buttonStyle}><FiPlusCircle /> Create Match</button>
            </form>
          </div>

          {/* --- Create Tournament --- */}
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}><FiTrello /> Create Tournament</h3>
            <form onSubmit={handleTournamentCreate} className="space-y-4">
              <div>
                <label htmlFor="tourName" className={labelStyle}>Tournament Name</label>
                <input id="tourName" value={formTournament.name} onChange={e=>setFormTournament({...formTournament,name:e.target.value})} placeholder="e.g., IPL 2025" className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="tourType" className={labelStyle}>Type</label>
                <select id="tourType" value={formTournament.type} onChange={e=>setFormTournament({...formTournament,type:e.target.value})} className={inputStyle}>
                  <option value="">Select Type</option>
                  <option value="League">League</option>
                  <option value="Knockout">Knockout</option>
                  <option value="Bilateral">Bilateral</option>
                </select>
              </div>
              <div>
                <label htmlFor="tourStart" className={labelStyle}>Start Date</label>
                <input id="tourStart" type="date" value={formTournament.start_date} onChange={e=>setFormTournament({...formTournament,start_date:e.target.value})} className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="tourEnd" className={labelStyle}>End Date</label>
                <input id="tourEnd" type="date" value={formTournament.end_date} onChange={e=>setFormTournament({...formTournament,end_date:e.target.value})} className={inputStyle}/>
              </div>
              <div>
                <label htmlFor="tourHost" className={labelStyle}>Host Country</label>
                <input id="tourHost" value={formTournament.host_country} onChange={e=>setFormTournament({...formTournament,host_country:e.target.value})} placeholder="e.g., India" className={inputStyle}/>
              </div>
              <button type="submit" className={buttonStyle}><FiPlusCircle /> Create Tournament</button>
            </form>
          </div>
        </div>

        {/* --- Assign Employee & Pending News --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}><FiUsers /> Assign Employee</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label htmlFor="assignEmp" className={labelStyle}>Select Employee</label>
                <select id="assignEmp" value={assignForm.employee_id} onChange={e=>setAssignForm({...assignForm,employee_id:e.target.value})} className={inputStyle}>
                  <option value="">Select Employee</option>
                  {data.employees.map((emp) => (
                    <option key={emp.employee_id || emp.email} value={emp.employee_id}>
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="assignType" className={labelStyle}>Target Type</label>
                <select id="assignType" value={assignForm.target_type} onChange={e=>setAssignForm({...assignForm,target_type:e.target.value})} className={inputStyle}>
                  <option value="match">Match</option>
                  <option value="series">Series</option>
                  <option value="tournament">Tournament</option>
                  <option value="team">Team</option>
                  <option value="player">Player</option>
                  <option value="ranking">Ranking</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="assignTargetId" className={labelStyle}>Target ID</label>
                <input id="assignTargetId" value={assignForm.target_id} onChange={e=>setAssignForm({...assignForm,target_id:e.target.value})} placeholder="Target ID (e.g., 1, 2, 3...)" className={inputStyle}/>
              </div>

              <div>
                <label htmlFor="assignRole" className={labelStyle}>Role</label>
                <input id="assignRole" value={assignForm.role} onChange={e=>setAssignForm({...assignForm,role:e.target.value})} placeholder="e.g., Scorer, Manager, Editor" className={inputStyle}/>
              </div>

              <button type="submit" className={buttonStyle}>Assign Role</button>
            </form>
          </div>

          {/* --- Pending News --- */}
          <div className={cardStyle}>
            <h3 className={cardHeaderStyle}>Pending News Approval</h3>
            {data.pendingNews.length ? (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {data.pendingNews.map((n) => (
                  <div key={n.id || n.title} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-semibold text-white">{n.title}</h4>
                    <p className="text-sm text-slate-300 my-2 leading-relaxed">
                      {n.content?.slice(0,150)}{n.content?.length > 150 ? "..." : ""}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={()=>approveNews(n.id)} 
                        className="px-4 py-1.5 text-sm rounded-md font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 flex items-center gap-2"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button 
                        onClick={()=>rejectNews(n.id)} 
                        className="px-4 py-1.5 text-sm rounded-md font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 flex items-center gap-2"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p className="text-slate-400">No pending articles to review.</p>
              </div>
            )}
          </div>
          
        </div>
        <button
  type="button"
  onClick={() => navigate("/admin/manage/series")}
  className="w-full mt-3 py-2.5 px-4 rounded-md font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-150 flex items-center justify-center gap-2"
>
  <FiGrid /> Manage Series, Matches & Teams 
</button>

      </div>
    </div>
  );
}