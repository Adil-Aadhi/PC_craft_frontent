import { motion, AnimatePresence } from "framer-motion";
import {FaCheckCircle,FaMicrochip,FaMemory,FaHdd,FaFan,FaBoxOpen,FaBolt,} from "react-icons/fa";
import { GiComputerFan } from "react-icons/gi";
import { useMemo } from "react";

const COMPONENT_LABELS = {
  cpu: "CPU",
  motherboard: "Motherboard",
  ram: "RAM",
  gpu: "GPU",
  storage: "Storage",
  psu: "PSU",
  cooler: "Cooler",
  case: "Case",
  case_fan: "Case Fan",
};

const COMPONENT_ICONS = {
  cpu: FaMicrochip,
  motherboard: FaMicrochip,
  ram: FaMemory,
  gpu: FaMicrochip,
  storage: FaHdd,
  psu: FaBolt,
  cooler: GiComputerFan,
  case: FaBoxOpen,
  case_fan: FaFan,
};

export default function ExecutionProgressModal({
  isOpen,
  onClose,
  progressData,
}) {
  if (!isOpen) return null;

  // 🔥 Memoized steps (no recalculation on every render)
  const { sortedSteps, completedCount, progressPercent } = useMemo(() => {
    const allSteps = Object.keys(COMPONENT_LABELS).map((key) => ({
      key,
      label: COMPONENT_LABELS[key],
      completed: progressData?.[key] === true,
    }));

    const sorted = [
      ...allSteps.filter((s) => s.completed),
      ...allSteps.filter((s) => !s.completed),
    ];

    const completed = sorted.filter((s) => s.completed).length;
    const percent = sorted.length
      ? (completed / sorted.length) * 100
      : 0;

    return {
      sortedSteps: sorted,
      completedCount: completed,
      progressPercent: percent,
    };
  }, [progressData]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-5xl p-10 rounded-3xl 
                     bg-white/10 backdrop-blur-2xl 
                     border border-white/20 
                     shadow-[0_0_40px_rgba(0,0,0,0.4)]"
          initial={{ scale: 0.9, y: 60 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 60 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Execution Progress
          </h2>

          {/* Progress Bar */}
            <div className="mb-12">

            {/* Percentage Header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-white/70 text-sm">Overall Progress</span>
                <span className="text-emerald-400 font-semibold text-lg">
                {Math.round(progressPercent)}%
                </span>
            </div>

            <div className="relative flex justify-between items-center">

                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 -translate-y-1/2 rounded-full" />

                {/* Animated Gradient Line */}
                <motion.div
                className="absolute top-1/2 left-0 h-1 rounded-full 
                            bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 
                            shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.7 }}
                />

                {sortedSteps.map((step, index) => (
                <motion.div
                    key={step.key}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative z-10"
                >
                    <div
                    className={`w-6 h-6 rounded-full transition-all duration-300
                        ${
                        step.completed
                            ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                            : "bg-white/30 border border-white/40"
                        }`}
                    />
                </motion.div>
                ))}
            </div>
            </div>

          {/* Component Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
            {sortedSteps.map((step, index) => {
              const Icon = COMPONENT_ICONS[step.key] || FaMicrochip; // single icon fallback

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -3 }}
                  className={`relative p-4 rounded-xl transition-all
                    ${
                      step.completed
                        ? "bg-green-500/10 border border-green-400/30"
                        : "bg-white/10 border border-white/20"
                    }`}
                >
                  {step.completed && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                      <FaCheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3
                      ${
                        step.completed
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-gray-400"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <p
                    className={`text-sm font-medium ${
                      step.completed ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      step.completed
                        ? "text-green-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step.completed ? "Completed" : "Pending"}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/60 mb-6 text-sm">
              {completedCount} of {sortedSteps.length} components completed
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl 
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         text-white font-semibold
                         shadow-lg transition-all duration-300
                         hover:scale-105"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}