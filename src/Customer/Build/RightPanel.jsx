import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Gift
} from "lucide-react";

const RightCart = ({ build, onRemove, onUpdateQuantity }) => {
  const totalPrice = Object.values(build).reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("3-5 days");

  const calculateSavings = () => {
    // Mock savings calculation
    return totalPrice > 50000 ? totalPrice * 0.1 : 0;
  };

  const savings = calculateSavings();

  const components = [
    { key: "cpu", label: "Processor", color: "cyan" },
    { key: "gpu", label: "Graphics Card", color: "emerald" },
    { key: "ram", label: "Memory", color: "purple" },
    { key: "storage", label: "Storage", color: "pink" },
    { key: "psu", label: "Power Supply", color: "yellow" },
    { key: "case", label: "Case", color: "gray" },
  ];

  return (
    <div className="col-span-3 bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl shadow-xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50" />
            <ShoppingCart className="h-6 w-6 text-white relative z-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Build</h3>
            <p className="text-sm text-cyan-300/70">
              {Object.keys(build).length} of 6 components selected
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-cyan-500/30">
            <span className="text-white font-bold">
              {Object.keys(build).length}
            </span>
          </div>
          <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
            <Package className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      {/* Build Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Build Progress</span>
          <span>{Math.round((Object.keys(build).length / 6) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(build).length / 6) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Component List */}
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {Object.keys(build).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No components selected</p>
              <p className="text-sm text-gray-500 mt-1">
                Start building your dream PC!
              </p>
            </motion.div>
          ) : (
            Object.entries(build).map(([key, item]) => {
              const component = components.find(c => c.key === key);
              
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group bg-gradient-to-r from-gray-800/40 to-gray-900/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${component?.color}-500/20 to-${component?.color}-600/20 flex items-center justify-center`}>
                          <div className={`text-${component?.color}-400`}>
                            {component?.icon}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {component?.label}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(key, Math.max(1, (item.quantity || 1) - 1))}
                            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm text-white w-6 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(key, (item.quantity || 1) + 1)}
                            className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString()}
                          </div>
                          {(item.quantity || 1) > 1 && (
                            <div className="text-xs text-gray-500">
                              ₹{item.price.toLocaleString()} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(key)}
                      className="ml-4 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Promo Code Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowPromo(!showPromo)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 hover:border-cyan-500/30 transition"
        >
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-cyan-400" />
            <span className="text-sm text-white">Add promo code</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
            showPromo ? "rotate-90" : ""
          }`} />
        </button>
        
        <AnimatePresence>
          {showPromo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition">
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Bundle Savings
            </span>
            <span className="text-emerald-400">-₹{savings.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Assembly Fee</span>
          <span className="text-white">₹{totalPrice > 0 ? "2,499" : "0"}</span>
        </div>
        
        <div className="pt-3 border-t border-cyan-500/20">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <div className="text-right">
              <div className="text-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                ₹{(totalPrice - savings + (totalPrice > 0 ? 2499 : 0)).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Including all taxes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>3-Year Warranty on Complete Build</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Truck className="h-4 w-4 text-cyan-400" />
          <span>Free Shipping with Tracking</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>Estimated Delivery: {estimatedDelivery}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={Object.keys(build).length === 0}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            Object.keys(build).length === 0
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40"
          }`}
        >
          <CreditCard className="h-5 w-5" />
          Proceed to Checkout
          <ChevronRight className="h-5 w-5" />
        </motion.button>
        
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-900/20 border border-cyan-500/30 text-white font-semibold hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-900/40 transition">
          Save Build for Later
        </button>
      </div>

      {/* Compatibility Warning */}
      {Object.keys(build).length > 0 && Object.keys(build).length < 6 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">
              Incomplete Build
            </span>
          </div>
          <p className="text-xs text-yellow-300/80">
            Add {6 - Object.keys(build).length} more components for expert assembly
          </p>
        </motion.div>
      )}

      {Object.keys(build).length === 6 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-300">
              Build Complete!
            </span>
          </div>
          <p className="text-xs text-emerald-300/80">
            Your PC is ready for expert assembly
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RightCart;