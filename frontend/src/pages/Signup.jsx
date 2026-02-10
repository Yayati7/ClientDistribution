import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../styles/auth.css";


export default function Signup() {

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try {
      await API.post("/auth/register",{ email,password });
      toast.success("Admin created");
      navigate("/");
    } catch(err){
      toast.error(err.response?.data?.message || "Signup failed");
    }
  }

  return(
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create Admin</h2>

        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          onChange={e=>setPassword(e.target.value)}
        />

        <button>Signup</button>

        <p className="auth-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  )

}
