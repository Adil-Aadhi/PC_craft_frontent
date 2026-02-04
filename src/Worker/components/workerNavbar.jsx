import { FiBell, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";


export default function WorkerNavbar() {

  const navigate=useNavigate()

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center">
      
      {/* Navbar Container */}
      <div className="
        w-full 
        max-w-3xl 
        bg-white/70
        backdrop-blur-md
        border border-white/30
        rounded-xl 
        px-5 py-3 
        flex items-center justify-between 
        shadow-md
      ">
        
        {/* Left */}
        <Link to="/worker/dashboard" className="flex items-center gap-1 cursor-pointer">
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
          <button className="relative p-2 rounded-lg hover:bg-white/40 transition">
            <FiBell className="text-lg text-gray-700" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 hover:bg-white/40 px-2 py-1 rounded-lg transition">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              JD
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold text-gray-800">John Doe</p>
              <p className="text-[10px] text-gray-500">PC Builder</p>
            </div>

            <FiChevronDown className="text-gray-600 text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
