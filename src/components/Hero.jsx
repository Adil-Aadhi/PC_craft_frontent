import { motion } from "framer-motion";
import {Cpu,Wrench,Truck,Shield,Zap,ArrowRight} from "lucide-react";
import LoginRequiredToast from "./LoginRequiredToast";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {

  // const user = JSON.parse(localStorage.getItem("user"));
  const { user,authLoading  } = useAuth();
  
  console.log("render user:", user);
  const navigate=useNavigate()


 const handleBuildClick = () => {
  console.log("CLICKED USER:", user, "LOADING:", authLoading);

  if (authLoading) return; // wait until auth restore completes

  if (!user) {
    toast(<LoginRequiredToast />, {
      autoClose: false,
      closeOnClick: false,
      toastId: "login-required",
      draggable: false,
    });
    return;
  }

  navigate("/build");
};

  return (
    <section className="relative min-h-screen bg-[#05080f] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-emerald-500/20 blur-3xl rounded-full" />

      <div className="relative container mx-auto mt-10 px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-gradient-to-r from-cyan-500/20 to-emerald-500/20
            border border-cyan-500/30 text-sm mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            Premium Custom PC Builder
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Build Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Ultimate Gaming PC
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-300 max-w-xl text-lg">
            Hand-picked components, zero bottlenecks, expert cable
            management and guaranteed performance.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              className="px-8 py-4 rounded-xl text-lg font-semibold
              bg-gradient-to-r from-cyan-500 to-emerald-500
              hover:from-cyan-400 hover:to-emerald-400
              shadow-[0_0_40px_rgba(34,211,238,0.35)]
              transition flex items-center gap-2"
              onClick={handleBuildClick}
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              className="px-8 py-4 rounded-xl text-lg font-semibold
              bg-white/5 border border-white/10
              hover:bg-white/10 transition"
            >
              View Gallery
            </button>
          </div>

          {/* Trust Row */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" /> 3-Year Warranty
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" /> PAN-India Delivery
            </span>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow Border */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r
            from-cyan-500 to-emerald-500 blur opacity-60" />

          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/hero.png"
              alt="Gaming PC"
              className="w-full h-auto object-cover"
            />

            {/* Bottom Fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* FEATURE STRIP */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">

         <Feature
              icon={<Cpu />}
              title="Top-Tier Parts"
              description="Only premium, high-performance components from trusted brands."
            />

            <Feature
              icon={<Wrench />}
              title="Expert Assembly"
              description="Professionally built and cable-managed by experienced technicians."
            />

            <Feature
              icon={<Zap />}
              title="Performance Tested"
              description="Every system is stress-tested to ensure peak performance."
            />

            <Feature
              icon={<Shield />}
              title="Warranty Covered"
              description="Comprehensive warranty and reliable post-purchase support."
            />


        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title,description }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white/5 border border-white/10 rounded-xl p-6
               hover:border-cyan-500/40 transition"
  >
    <div className="text-cyan-400 mb-3 mx-auto w-fit">{icon}</div>
    <p className="font-semibold">{title}</p>
    <p className="font-semibold text-grey-200">{description}</p>
  </motion.div>
);

export default Hero;
