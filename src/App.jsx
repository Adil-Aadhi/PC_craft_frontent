import './App.css'
import { Route,Routes } from 'react-router-dom'
import SelectRole from './pages/SelectRole'
import Register from './pages/Registartion'
import Login from './pages/Login'
import Home from './pages/Home'
import PublicLayout from './components/PublicLayout'
import BuildPC from './Customer/Build/Build-pc'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from './Customer/pages/UserProfile'
import WorkerDashboard from './Worker/pages/WorkerDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import WorkerProfile from './Worker/pages/workerProfile'
import WorkerLayout from './Worker/layout/workerLayout'

function App() {

  return (
    <>

   <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="dark"
      limit={3}
      style={{
        width: "420px",
        maxWidth: "92vw",
      }}
      toastStyle={{
        borderRadius: "18px",
        background: "rgba(15, 18, 30, 0.55)", // pure glass
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "#F3F4F6",
        padding: "18px 20px",
        marginBottom: "14px",
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.45), inset 0 0 1px rgba(255,255,255,0.25)",
      }}
    />





     <Routes>

          {/* 🌐 Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SelectRole />} />
            <Route path="/user/profile" element={<Profile />} />
          </Route>

          <Route path="/register/:role" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          

          {/* 👤 USER ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/build" element={<BuildPC />} />
          </Route>

          {/* 🧑‍🔧 WORKER ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>

            <Route element={<WorkerLayout />}>
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
              <Route path="/worker/profile" element={<WorkerProfile />} />
            </Route>
            
          </Route>

          {/* 👑 ADMIN ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            {/* admin routes here */}
          </Route>

        </Routes>
    </>
  )
}

export default App
