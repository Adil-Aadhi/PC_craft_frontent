import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiLock } from "react-icons/fi";
import api from "../api/axios"
import GoogleAuthButton from "../components/GoogleButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";



const Login = () => {
  const { login, loading, error } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const navigate=useNavigate()


  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    try {
        const data = await login(form);

        toast(
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-white">
              Welcome back
            </div>
            <div className="text-sm text-green-300 mt-0.5">
              You’re logged in successfully
            </div>
          </div>
        );

    } catch (err) {
        console.log("LOGIN ERROR:", err);
    }
  };


  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-screen flex items-center justify-center bg-slate-100 px-4"
        >
      <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          >

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Login to continue
          </p>
        </div>
        <button
              type="button"
              onClick={() => navigate("/")}
              className="
                absolute top-4 right-4
                w-9 h-9
                flex items-center justify-center
                rounded-full
                text-slate-500
                hover:text-red-500
                hover:bg-slate-100
                transition
              "
              aria-label="Close"
            >
              ✕
          </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => setOpenRoleModal(true)}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-lg hover:bg-slate-100 transition mb-5"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-slate-700">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-300" />
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

           <div className="text-center mt-12 text-slate-500">
              <p className="text-sm">
                Don't have an account?{" "}
                <button 
                  type="button" 
                  onClick={() => navigate("/register")}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Sign up here
                </button>
              </p>
            </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
          
      </motion.div>

      {openRoleModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-xl space-y-4 w-64">

              {/* ❌ Close button */}
              <button
                type="button"
                onClick={() => setOpenRoleModal(false)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>

              <h3 className="text-lg font-semibold text-center">
                Select role
              </h3>

              <button
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition"
                onClick={() => {
                  setSelectedRole("user");
                  setOpenRoleModal(false);
                }}
              >
                User
              </button>

              <button
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition"
                onClick={() => {
                  setSelectedRole("worker");
                  setOpenRoleModal(false);
                }}
              >
                Worker
              </button>
            </div>
          </div>
        )}


          <GoogleAuthButton
            role={selectedRole}
            trigger={!!selectedRole}
            mode="login"
          />

    </motion.div>
  );
};

export default Login;
