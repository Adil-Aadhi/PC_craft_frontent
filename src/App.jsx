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
import PublicRoute from './components/PublicRoute'
import KycPage from './Worker/components/kyc/KycPage'
import ChatHomePage from './Chat/pages/ChatHomePage'
import UserLayout from './Customer/layout/UserLayout'
import KycProtectedRoute from './Worker/layout/KYCProtectedRouter'
import WorkerNotifications from './Notifications/pages/NotificationPage'
import CartPage from './cart/pages/cartpage'
import UserNotifications from './Customer/pages/NotificationPage'
import ForgotPassword from './pages/ForgetPassword'
import OrdersPage from './orders/pages/OrderMainPage'
import WorkerProjects from './project/pages/ProjectMainPage'
import WorkerProjectDetail from './project/components/WorkerOrderDetails'
import WorkerProjectExecution from './project/components/WorkerOrderExecution'
import AdminLayout from './Admin/components/AdminLayout'
import AdminDashboard from './Admin/pages/AdminDashboard'
import AdminUsers from './Admin/pages/AdminUSer'
import AdminRevenue from './Admin/pages/AdminRevenue'
import WorkerVerification from './Admin/pages/AdminWorkerVerification'
import CompletionRequests from './Admin/pages/AdminWorkCompletion'
import NotFound from './pages/NotFound'
import { AdminStatsProvider } from './Admin/context/AdminStatsContext'
import AdminOrders from './Admin/pages/AdminOrderPage'
import WorkerRevenuePage from './Worker/pages/WorkerRevenuePage'
import Products from './Admin/pages/AdminProducts'

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

          {/* Public */}
          <Route element={<PublicRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<SelectRole />} />
            </Route>
          </Route>

          <Route path="/register/:role" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          
          

          {/* 👤 USER ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>

            <Route element={<UserLayout />}>
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/user/notifications" element={<UserNotifications />} />
              <Route path="/user/orders" element={<OrdersPage />} />
            </Route>

            <Route path="/build" element={<BuildPC />} />
                        
            <Route path="/chat" element={<ChatHomePage />} />
            <Route path="/chat/:receiverId" element={<ChatHomePage />} />
          </Route>

          {/* 🧑‍🔧 WORKER ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>

            <Route path="/worker" element={<WorkerLayout />}>

              <Route path="dashboard" element={<WorkerDashboard />} />
              <Route path="profile" element={
                <KycProtectedRoute>
                  <WorkerProfile />
                </KycProtectedRoute>
              } />

              <Route path="notifications" element={<WorkerNotifications />} />
              <Route path="kyc/page" element={<KycPage />} />

              <Route path="chat" element={
                <KycProtectedRoute>
                  <ChatHomePage />
                </KycProtectedRoute>
              } />

              <Route path="chat/:receiverId" element={
                <KycProtectedRoute>
                  <ChatHomePage />
                </KycProtectedRoute>
              } />

              <Route path="projects" element={<WorkerProjects />} />
              <Route path="projects/:id" element={<WorkerProjectDetail />} />
              <Route path="execution/:id" element={<WorkerProjectExecution />} />

              <Route path="revenue" element={<WorkerRevenuePage />} />
              

              {/* 🔥 THIS WILL START WORKING */}

            </Route>

          </Route>



         {/* 🛠 ADMIN ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>

            <Route
                  element={
                    <AdminStatsProvider>
                      <AdminLayout />
                    </AdminStatsProvider>
                  }
                >

              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/admin/users" element={<AdminUsers />} />

              <Route path="/admin/workers" element={<WorkerVerification />} />

              <Route path="/admin/completions" element={<CompletionRequests />} />

              <Route path="/admin/orders" element={<AdminOrders />} />

              <Route path="/admin/revenue" element={<AdminRevenue />} />

               <Route path="/admin/products" element={<Products />} />

            </Route>

          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
    </>
  )
}

export default App
