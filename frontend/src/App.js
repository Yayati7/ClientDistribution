import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Upload from "./pages/Upload";
import WithAuth from "./utils/withAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<WithAuth><Dashboard/></WithAuth>}/>
          <Route path="/agents" element={<WithAuth><Agents/></WithAuth>}/>
          <Route path="/upload" element={<WithAuth><Upload/></WithAuth>}/>
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
