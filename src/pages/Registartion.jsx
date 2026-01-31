import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import GoogleAuthButton from "../components/GoogleButton";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { role } = useParams();
  const { register, loading, error } = useAuth();
  const navigate=useNavigate()

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user=await register(role, form);
       if (user.role === "user") {
      navigate("/");
    } else if (user.role === "worker") {
      navigate("/worker/dashboard");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
    } catch (err) {}
  };

  // 🎨 Softer role-based theme
  const theme =
    role === "user"
      ? {
          gradient: "from-blue-100 via-blue-50 to-cyan-100",
          ring: "focus:ring-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          title: "text-blue-600",
        }
      : {
          gradient: "from-orange-100 via-orange-50 to-amber-100",
          ring: "focus:ring-orange-400",
          button: "bg-orange-500 hover:bg-orange-600",
          title: "text-orange-500",
        };

  return (
    <div
      className={`h-screen flex items-center justify-center bg-gradient-to-br ${theme.gradient} px-4`}
    >
      <div className=" relative w-full max-w-md bg-white rounded-2xl shadow-xl p-5 animate-cardIn">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold capitalize ${theme.title}`}>
            Register as {role}
          </h2>
          <p className="text-slate-600 mt-2 text-sm">
            Create your account in minutes
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


        {/* Google Button */}
        <GoogleAuthButton role={role}  mode="register" />

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-300" />
          <span className="text-sm text-slate-500">OR</span>
          <div className="flex-1 h-px bg-slate-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">

          {/* Full Name */}
          <div className="relative animate-inputIn">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${theme.ring}`}
            />
          </div>

          {/* Email */}
          <div className="relative animate-inputIn">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${theme.ring}`}
            />
          </div>

          {/* Username */}
          <div className="relative animate-inputIn">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${theme.ring}`}
            />
          </div>

          {/* Password */}
          <div className="relative animate-inputIn">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${theme.ring}`}
            />
          </div>

          {/* Confirm Password */}
          <div className="relative animate-inputIn">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${theme.ring}`}
            />
          </div>

          <div className="text-center mt-12 text-slate-500">
          <p className="text-sm">
            Already have an account?{" "}
            <button 
              type="button" 
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Sign in here
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
            className={`w-full py-3 text-white font-semibold rounded-lg transition ${theme.button} disabled:opacity-60`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
