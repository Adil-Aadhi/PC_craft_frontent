import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Power,
  Box,
  Zap,
  Thermometer,
  Wind,
  RotateCw,
  Minus,
  Plus,
  Eye,
  EyeOff,
  Sparkles,
  Cctv,
  CircuitBoard,
} from "lucide-react";
import { useCompatibility } from "./hooks/useCompatibility";
import React from "react";
import PCScene from "./components/3dModal/PCScene";

const CenterPreview = ({ build = {} }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [activePart, setActivePart] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const { checkCompatibility } = useCompatibility();

  const componentPositions = {
    case: { x: 50, y: 50, label: "Case", icon: <Box size={20} /> },
    motherboard: { x: 50, y: 50, label: "Motherboard", icon: <CircuitBoard size={20} /> },
    cpu: { x: 50, y: 45, label: "CPU", icon: <Cpu size={20} /> },
    cooler: { x: 50, y: 30, label: "Cooler", icon: <Thermometer size={20} /> },
    ram: { x: 65, y: 42, label: "RAM", icon: <MemoryStick size={20} /> },
    gpu: { x: 50, y: 65, label: "GPU", icon: <Monitor size={20} /> },
    storage: { x: 25, y: 75, label: "Storage", icon: <HardDrive size={20} /> },
    psu: { x: 75, y: 85, label: "PSU", icon: <Power size={20} /> },
    casefan: { x: 80, y: 20, label: "Case Fan", icon: <Wind size={20} /> },
  };

  const completedCount = useMemo(
    () => Object.values(build || {}).filter(Boolean).length,
    [build]
  );

  const TOTAL_COMPONENTS = Object.keys(componentPositions).length;

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setRotation({
      x: Math.max(-30, Math.min(30, y * 30)),
      y: Math.max(-30, Math.min(30, x * 30)),
    });
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  useEffect(() => {
    if (!activePart) return;
    const t = setTimeout(() => setActivePart(null), 2000);
    return () => clearTimeout(t);
  }, [activePart]);

  useEffect(() => {
    const i = setInterval(() => {
      if (!activePart) {
        setRotation((r) => ({ ...r, y: r.y + 0.5 }));
      }
    }, 50);
    return () => clearInterval(i);
  }, [activePart]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-dark to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gray-900/70">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cctv className="text-cyan-400" />
            PC Visualization
          </h3>
          <p className="text-sm text-cyan-300/70">Interactive Preview</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowLabels(!showLabels)} className="p-2 bg-gray-800 rounded-lg">
            {showLabels ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button onClick={resetView} className="p-2 bg-gray-800 rounded-lg">
            <RotateCw size={18} />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="p-2 bg-gray-800 rounded-lg">
            <Minus size={18} />
          </button>
          <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-2 bg-gray-800 rounded-lg">
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* PREVIEW */}

      <div className="relative h-[500px] flex items-center justify-center">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setRotation({ x: 0, y: 0 })}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            animate={{ rotateX: rotation.x, rotateY: rotation.y, scale: zoom }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="relative w-80 h-60 rounded-2xl bg-gray-800 border border-cyan-500/30">
              {Object.entries(componentPositions).map(([key, pos]) => {
                const item = build?.[key];
                const hasComponent = !!item;

                let isBad = false;
                if (item) {
                  const { compatibility } = checkCompatibility(key, item);
                  isBad = compatibility === "bad";
                }

                
                let sizeClass = "w-14 h-14";
                if (key === "motherboard") sizeClass = "w-64 h-44";
                if (key === "case") sizeClass = "w-72 h-52 opacity-30";
                if (key === "gpu") sizeClass = "w-24 h-10";
                if (key === "ram") sizeClass = "w-10 h-16";
                if (key === "psu") sizeClass = "w-16 h-10";
                if (key === "storage") sizeClass = "w-12 h-8";
                if (key === "casefan") sizeClass = "w-10 h-10";

                
                let baseZ = "z-20";
                if (key === "motherboard") baseZ = "z-10";
                if (key === "case") baseZ = "z-0";

                const hoverZ = activePart === key ? "z-50" : baseZ;

                return (
                  <motion.div
                    key={key}
                    onClick={() => setActivePart(key)}
                    className={`group absolute ${sizeClass} flex items-center justify-center rounded-lg border transition-all origin-center will-change-transform
                      ${
                        isBad
                          ? "bg-red-500/20 border-red-500 animate-pulse"
                          : hasComponent
                          ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                          : "bg-gray-700 border-gray-600"
                      }
                      ${activePart === key ? " ring-2 ring-cyan-400" : ""}
                      ${hoverZ}
                    `}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={
                      key === "motherboard" || key === "case" || isBad
                        ? {}
                        : { scale: 1.08 }
                    }
                  >
                   
                    {key !== "motherboard" && key !== "case" && pos.icon}

                    
                    {showLabels && hasComponent && (
                      <div
                        className={`pointer-events-none absolute -bottom-6 text-xs px-2 py-1 rounded ${
                          isBad ? "bg-red-600/80 text-white" : "bg-black/70 text-white"
                        }`}
                      >
                        {build[key]?.name || pos.label}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>


      {/* STATS */}
      {showStats && (
        <div className="border-t border-cyan-500/20 p-4 grid grid-cols-3 gap-4 bg-gray-900/70">
          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Zap className="text-cyan-400 mb-1" />
            <div className="text-white font-bold">95%</div>
            <div className="text-xs text-cyan-300">Performance</div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Thermometer className="text-cyan-400 mb-1" />
            <div className="text-white font-bold">A+</div>
            <div className="text-xs text-cyan-300">Cooling</div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Sparkles className="text-cyan-400 mb-1" />
            <div className="text-white font-bold">
              {completedCount}/{TOTAL_COMPONENTS}
            </div>
            <div className="text-xs text-cyan-300">Completed</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CenterPreview);