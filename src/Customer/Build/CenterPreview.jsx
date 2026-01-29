import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Gpu,
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
  Cctv
} from "lucide-react";

const CenterPreview = ({ build = {} }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [activePart, setActivePart] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState("default");

  /** component positions */
  const componentPositions = {
    cpu: { x: 45, y: 40, label: "CPU", icon: <Cpu size={20} /> },
    gpu: { x: 45, y: 70, label: "GPU", icon: <Gpu size={20} /> },
    ram: { x: 30, y: 45, label: "RAM", icon: <MemoryStick size={20} /> },
    storage: { x: 25, y: 75, label: "Storage", icon: <HardDrive size={20} /> },
    psu: { x: 70, y: 85, label: "PSU", icon: <Power size={20} /> },
    cooling: { x: 60, y: 25, label: "Cooling", icon: <Wind size={20} /> },
  };

  /** completed components count */
  const completedCount = useMemo(
    () => Object.values(build || {}).filter(Boolean).length,
    [build]
  );

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

  /** highlight timeout */
  useEffect(() => {
    if (!activePart) return;
    const t = setTimeout(() => setActivePart(null), 2000);
    return () => clearTimeout(t);
  }, [activePart]);

  /** auto rotate */
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
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 bg-gray-800 rounded-lg">
            <Minus size={18} />
          </button>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 bg-gray-800 rounded-lg">
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
                const hasComponent = build?.[key];

                return (
                  <motion.div
                    key={key}
                    onClick={() => setActivePart(key)}
                    className={`absolute w-14 h-14 flex items-center justify-center rounded-lg ${
                      hasComponent ? "bg-cyan-500/20 border border-cyan-400" : "bg-gray-700"
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {pos.icon}
                    {showLabels && hasComponent && (
                      <div className="absolute -bottom-6 text-xs text-white bg-black/70 px-2 py-1 rounded">
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
            <div className="text-white font-bold">{completedCount}/6</div>
            <div className="text-xs text-cyan-300">Completed</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterPreview;
