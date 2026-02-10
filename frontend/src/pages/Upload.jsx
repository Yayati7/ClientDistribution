import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../styles/admin.css";
import "../styles/dashboard.css";

export default function Upload(){

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("File selected:", selectedFile);
    
    if (selectedFile) {
      // Check if it's a CSV file
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error("Please select a CSV file");
        setFile(null);
        e.target.value = "";
        return;
      }
      
      console.log("File details:");
      console.log("  - Name:", selectedFile.name);
      console.log("  - Size:", selectedFile.size, "bytes");
      console.log("  - Type:", selectedFile.type);
      
      setFile(selectedFile);
    }
  };

  const upload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file...");
    console.log("FormData contents:", file.name);

    try {
      const response = await API.post("/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Upload response:", response.data);
      
      toast.success(response.data.message || "CSV uploaded successfully");
      toast.info(`${response.data.tasksAdded} tasks added`);
      
      // Clear file input
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">

      <div className="dashboard-nav">
          <h2>Add Tasks (Upload CSV)</h2>
          <Link className="admin-link" to="/dashboard">
              ← Back to Dashboard
          </Link>
      </div>

      <div className="admin-content">
        <div className="admin-card">
          <h2>Upload CSV File</h2>
          
          <p style={{color: '#8b8680', fontSize: '13px', marginBottom: '20px'}}>
            CSV should have columns: FirstName, Phone, Notes
          </p>

          <input
            className="admin-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          
          {file && (
            <p style={{color: '#2c2c2c', fontSize: '14px', marginTop: '10px'}}>
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          <button 
            className="admin-btn" 
            onClick={upload}
            disabled={!file || uploading}
            style={{opacity: !file || uploading ? 0.5 : 1}}
          >
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>

    </div>
  );
}