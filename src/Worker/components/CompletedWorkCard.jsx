import { motion } from "framer-motion";

const CompletedWorkCard = ({
  completedJobs = 0,
  inProgress = 0,
  cancelled = 0,
  totalJobs = 0,
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden bg-gradient-to-br  from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full"
    >

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Decorative Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-16 -right-16 w-32 h-32 border-8 border-white/5 rounded-full"
      />

      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">

          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0
                11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <span className="text-xs text-white/80">
            {totalJobs} total jobs
          </span>

        </div>

        <p className="text-sm font-medium text-white/80 mb-2">
          Completed Work
        </p>

        <motion.p
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-3xl font-bold text-white mb-4"
        >
          {completedJobs}
        </motion.p>

        {/* Job Stats */}
        <div className="flex justify-between text-xs text-white/80">

          <span className="flex items-center gap-1">
            🟡 {inProgress} in progress
          </span>

          <span className="flex items-center gap-1">
            ❌ {cancelled} cancelled
          </span>

        </div>

      </div>

    </motion.div>
  );
};

export default CompletedWorkCard;