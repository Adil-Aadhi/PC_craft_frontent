import { FiBell, FiChevronDown, FiLogOut,FiMessageSquare } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useKycGuard from  "../hooks/useKycGuard"
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function WorkerNavbar() {
  const navigate = useNavigate();
  const { checkKyc } = useKycGuard();
  const { handleLogout,user } = useAuth();
  const[image,setImage]=useState(null)


  const HanndleProfileView=()=>{
      navigate("/worker/profile")
  }
  const HanndleMessageView=()=>{
      navigate('/worker/chat')
  }
  const HanndleNotificationView=()=>{
      navigate("/worker/notifications")
  }

   const fetchImage = async () => {
      try {
        const res = await api.get("workers/profile-image/");
        setImage(res.data.profile_image);
      } catch (err) {
        console.error("Image fetch failed", err);
      }
    };

  useEffect(()=>{
    fetchImage()
  },[])

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-md border border-white/30 rounded-xl px-5 py-3 flex items-center justify-between shadow-md">

        {/* Left */}
        <Link to="/worker/dashboard" className="flex items-center gap-1">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-md opacity-30" />
            <Zap className="relative w-5 h-5 text-purple-500" />
          </div>
          <span className="text-md font-bold text-gray-900">
            PC<span className="text-purple-500">craft</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <button
              onClick={(HanndleNotificationView)}
              className="relative p-1 rounded-lg hover:bg-white/40 transition"
            >
              <FiBell className="text-xl text-gray-700" />

              {/* unread badge (dynamic later) */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </button>

          <button className="relative p-1 rounded-lg hover:bg-white/40 transition" onClick={()=>checkKyc(HanndleMessageView)}>
            <FiMessageSquare className="text-xl text-gray-700" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile section (NOT a button) */}
          <div className="relative group flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/40 transition">

            {/* Avatar + info → navigate */}
            <div
              onClick={() =>checkKyc(HanndleProfileView) }
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden 
                bg-gradient-to-r from-blue-500 to-purple-600 
                flex items-center justify-center 
                text-white text-xs font-semibold">

                {image ? (
                  <img
                    src={image}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.username?.charAt(0).toUpperCase()
                )}

              </div>

              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-gray-800">{user?.username}</p>
                <p className="text-[10px] text-gray-500">PC Builder</p>
              </div>
            </div>

            {/* Dropdown trigger */}
            <FiChevronDown className="text-gray-600 text-sm cursor-pointer" />

            {/* Dropdown */}
            <div
              className="
                absolute right-0 top-full mt-2 w-32
                bg-white border border-gray-200
                rounded-md shadow-lg
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-150
              "
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={14} />
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
