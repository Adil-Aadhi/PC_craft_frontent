import { motion } from "framer-motion";
import {
  Clock,
  Loader2,
  XCircle,
  PackageCheck,
} from "lucide-react";

const StatusCard = ({ title, count, color = "gray", icon }) => {
  const getStyleConfigs = () => {
    switch (color) {
      case "yellow":
        return {
          bg: "bg-amber-500/5",
          border: "border-amber-500/20",
          iconBg: "bg-amber-500/10",
          iconColor: "text-amber-400",
          glow: "group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]",
          glowColor: "bg-amber-500",
          icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />
        };
      case "blue":
        return {
          bg: "bg-blue-500/5",
          border: "border-blue-500/20",
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-400",
          glow: "group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]",
          glowColor: "bg-blue-500",
          icon: <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin-slow" />
        };
      case "green":
        return {
          bg: "bg-emerald-500/5",
          border: "border-emerald-500/20",
          iconBg: "bg-emerald-500/10",
          iconColor: "text-emerald-400",
          glow: "group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]",
          glowColor: "bg-emerald-500",
          icon: <PackageCheck className="w-4 h-4 md:w-5 md:h-5" />
        };
      case "red":
        return {
          bg: "bg-rose-500/5",
          border: "border-rose-500/20",
          iconBg: "bg-rose-500/10",
          iconColor: "text-rose-400",
          glow: "group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)]",
          glowColor: "bg-rose-500",
          icon: <XCircle className="w-4 h-4 md:w-5 md:h-5" />
        };
      default:
        return {
          bg: "bg-zinc-500/5",
          border: "border-zinc-500/20",
          iconBg: "bg-zinc-500/10",
          iconColor: "text-zinc-400",
          glow: "group-hover:shadow-[0_0_30px_-5px_rgba(113,113,122,0.2)]",
          glowColor: "bg-zinc-500",
          icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />
        };
    }
  };

  const config = getStyleConfigs();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl md:rounded-[24px] p-4 md:p-6 ${config.bg} border ${config.border} backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04] ${config.glow}`}
    >
      <div className="relative z-10 flex flex-col gap-3 md:gap-5">
        <div className="flex justify-between items-start">
          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${config.iconBg} ${config.iconColor} border border-white/5`}>
            {config.icon}
          </div>
          <p className="text-2xl md:text-4xl font-black font-mono tracking-tighter bg-gradient-to-br from-white via-white/80 to-white/20 bg-clip-text text-transparent">
            {count}
          </p>
        </div>
        <div>
          <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
            {title}
          </h3>
        </div>
      </div>
      {/* Decorative gradient orb */}
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 ${config.glowColor}`} />
    </motion.div>
  );
};

export default StatusCard;