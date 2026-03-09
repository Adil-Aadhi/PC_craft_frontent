import { motion } from "framer-motion";

const TotalEarningsCard = ({
  earnings = 0,
  componentTotal = 0,
  serviceTotal = 0,
  trend = 0,
  previousEarnings = 0
}) => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const isPositiveTrend = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full"
    >

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0 L0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">

          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2
                3 .895 3 2-1.343 2-3 2m0-8c1.11 0
                2.08.402 2.599 1M12 8V7m0 1v8m0
                0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>

          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPositiveTrend
                ? "bg-green-400/30 text-green-100"
                : "bg-red-400/30 text-red-100"
            }`}
          >
            {isPositiveTrend ? "↑" : "↓"} {Math.abs(trend)}%
          </div>

        </div>

        {/* Title */}
        <p className="text-sm font-medium text-white/80 mb-1">
          Total Earnings
        </p>

        {/* Total */}
        <p className="text-3xl font-bold text-white mb-4">
          {formatCurrency(earnings)}
        </p>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-sm">

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/70 text-xs">Components</p>
            <p className="font-semibold text-white">
              {formatCurrency(componentTotal)}
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/70 text-xs">Service Profit</p>
            <p className="font-semibold text-white">
              {formatCurrency(serviceTotal)}
            </p>
          </div>

        </div>

        {/* Previous Month */}
        <div className="mt-3 text-xs text-white/70">
          Last Month: {formatCurrency(previousEarnings)}
        </div>

      </div>

      {/* Animated bottom bar */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 h-1 bg-white/30"
      />

    </motion.div>
  );
};

export default TotalEarningsCard;