import './App.css'
import { Route,Routes } from 'react-router-dom'
import SelectRole from './pages/SelectRole'
import Register from './pages/Registartion'
import Login from './pages/Login'
import WorkerDashboard from './Worker/pages/dashboard'
import Home from './pages/Home'
import PublicLayout from './components/PublicLayout'
import BuildPC from './Customer/Build/Build-pc'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from './Customer/pages/UserProfile'

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
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<SelectRole />} />
          <Route path='/user/profile' element={<Profile/>}/>
        </Route>
        
        <Route path="/register/:role" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path='/worker/dashboard' element={<WorkerDashboard/>}/>
        


        <Route path='/build' element={<BuildPC/>}/>

      </Routes>
    </>
  )
}

export default App
