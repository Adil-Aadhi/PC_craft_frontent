import { Wallet, Package, Layers, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const BuildSummaryPanel = ({ cart }) => {
  const items = cart?.items || [];

  const totalBuilds = items.length;

  const totalComponents = items.reduce((sum, build) => {
    const count = [
      build.cpu,
      build.motherboard,
      build.ram,
      build.gpu,
      build.storage,
      build.cooler,
      build.case_fan,
      build.psu,
      build.case,
    ].filter(Boolean).length;

    return sum + count;
  }, 0);

  // ✅ Count only explicit incompatible builds
  const needsFixCount = items.filter(
    (b) => b.is_compatible === false
  ).length;

  // ✅ Always use backend total price
  const totalPrice = cart?.cart_total_price || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Wallet size={20} className="text-cyan-400" />
        Build Summary
      </h3>

      <div className="space-y-4">

        {/* Total Builds */}
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-2">
            <Package size={16} />
            Total Builds
          </span>
          <span className="text-white font-semibold">
            {totalBuilds}
          </span>
        </div>

        {/* Total Components */}
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-2">
            <Layers size={16} />
            Total Components
          </span>
          <span className="text-white font-semibold">
            {totalComponents}
          </span>
        </div>

        {/* Needs Fix */}
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} />
            Needs Fix
          </span>
          <span className="text-yellow-400 font-semibold">
            {needsFixCount}
          </span>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
          <span className="text-zinc-400">Total Price</span>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ₹{Number(totalPrice).toLocaleString()}
          </span>
        </div>

      </div>
    </motion.div>
  );
};

export default BuildSummaryPanel;