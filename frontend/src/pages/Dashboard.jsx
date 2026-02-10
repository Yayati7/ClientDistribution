import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "../styles/dashboard.css";

export default function Dashboard(){

  const [tasks,setTasks] = useState([]);
  const [stats,setStats] = useState({});
  const [distribution,setDistribution] = useState([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(()=>{
    fetchTasks();
    fetchStats();
  },[]);

  const fetchTasks = async ()=>{
    const res = await API.get("/upload/tasks");
    setTasks(res.data);
  }

  const fetchStats = async ()=>{
    const res = await API.get("/agents/stats");
    setStats(res.data);
    setDistribution(res.data.tasksPerAgent || []);
  }

  const handleLogout = ()=>{
      logout();
      toast.success("Logged out successfully");
      navigate("/");
  };

  return(
      <div className="dashboard-wrapper">

        {/* Navbar */}
        <div className="dashboard-nav">
          <h2>Dashboard</h2>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Subnav */}
        <div className="dashboard-subnav">
          <button className="nav-btn" onClick={()=>navigate("/agents")}>Add Agents</button>
          <button className="nav-btn" onClick={()=>navigate("/upload")}>Upload CSV</button>
        </div>

        {/* Body */}
        <div className="dashboard-body">

          {/* Tasks */}
          <div className="tasks-section">
            <h3>Distributed Tasks</h3>

            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Notes</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t,i)=>(
                  <tr key={i}>
                    <td>{t.firstName}</td>
                    <td>{t.phone}</td>
                    <td>{t.notes}</td>
                    <td>{t.agent?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="stats-section">

            <div className="card">
              <h3>Summary</h3>
              <p>Total Agents: {stats.totalAgents}</p>
              <p>Total Tasks: {stats.totalTasks}</p>
            </div>

            <div className="card">
              <h3>Agent Distribution</h3>
              {distribution.map((d,i)=>(
                <p key={i}>
                  Agent: {d.name} — Tasks: {d.count}
                </p>
              ))}
            </div>

          </div>

        </div>
      </div>
  )
}
