import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import "../styles/dashboard.css";

export default function Agents() {

  const [form, setForm] = useState({
    name:"",
    email:"",
    phone:"",
    password:""
  });

  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);

  useEffect(()=>{
    fetchAgents();
  },[]);

  const fetchAgents = async ()=>{
    const res = await API.get("/agents");
    setAgents(res.data);
  }

  const submit = async e=>{
    e.preventDefault();
    try{
      await API.post("/agents", form);
      setForm({ name:"", email:"", phone:"", password:"" });
      toast.success("Agent added");
      navigate("/dashboard");
    }catch(err){
      toast.error("Failed to add agent");
    }
  }

  return (
    

    <div className="admin-container">

      <div className="dashboard-nav">
        <h2>Add Agents</h2>
        <Link className="admin-link" to="/dashboard">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h2>Add Agent</h2>

          <form onSubmit={submit}>
            <input className="admin-input" placeholder="Name"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
            />

            <input className="admin-input" placeholder="Email"
              value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})}
            />

            <input className="admin-input" placeholder="Phone"
              value={form.phone}
              onChange={e=>setForm({...form,phone:e.target.value})}
            />

            <input className="admin-input" placeholder="Password"
              value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})}
            />

            <button className="admin-btn">Add Agent</button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Current Agents</h2>

          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a,i)=>(
                <tr key={i}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>






    </div>
  );

}
