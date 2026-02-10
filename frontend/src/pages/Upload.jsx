import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import "../styles/dashboard.css";

export default function Upload(){

  const [file,setFile]=useState();

  const navigate = useNavigate();

  const upload = async ()=>{
    const formData = new FormData();
    formData.append("file", file);

    try{
      await API.post("/upload", formData);
      toast.success("CSV uploaded successfully");
      navigate("/dashboard");
    }catch(err){
      toast.error("Upload failed");
    }

  }

  return (
    <div className="admin-container">

      <div className="dashboard-nav">
          <h2>Add Tasks (Upload CSV)</h2>
          <Link className="admin-link" to="/dashboard">
              Back to Dashboard
          </Link>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h2>Upload CSV File</h2>

          <input
            className="admin-input"
            type="file"
            onChange={e=>setFile(e.target.files[0])}
          />

          <button className="admin-btn" onClick={upload}>
            Upload File
          </button>
        </div>
      </div>
    

    </div>
  );

}
