import { motion, AnimatePresence } from "framer-motion";
import {ShoppingCart,Trash2,Package,ShieldCheck,Truck,Clock,ChevronRight,Sparkles,AlertCircle,CheckCircle2,CreditCard,} from "lucide-react";
import { useCompatibility } from "./hooks/useCompatibility";
import React from "react";


const RightCart = ({ build, onRemove,onSaveClick }) => {
 const totalPrice = Object.values(build).reduce((sum, item) => {
  if (!item) return sum; // skip null
  return sum + item.price * (item.quantity || 1);
}, 0);

const { checkCompatibility } = useCompatibility();

  const selectedCount = Object.values(build).filter(Boolean).length;

  const incompatibleItems = Object.entries(build).filter(([category, item]) => {
  if (!item) return false;
  const { compatibility } = checkCompatibility(category, item);
  return compatibility === "bad";
});

const hasIssues = incompatibleItems.length > 0;

  const TOTAL_COMPONENTS = 9;

  const components = [
    { key: "cpu", label: "Processor", color: "cyan" },
    { key: "motherboard", label: "MotherBoard", color: "cyan" },
    { key: "gpu", label: "Graphics Card", color: "emerald" },
    { key: "ram", label: "Memory", color: "purple" },
    { key: "storage", label: "Storage", color: "pink" },
    { key: "psu", label: "Power Supply", color: "yellow" },
    { key: "case", label: "Case", color: "gray" },
    { key: "casefan", label: "Case Fan", color: "sky" },
    { key: "cooler", label: "Cooler", color: "blue" },
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
              {selectedCount} of {TOTAL_COMPONENTS} components selected
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 flex items-center justify-center border border-cyan-500/30">
            <span className="text-white font-bold">
              {selectedCount}
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
          <span>{Math.round((selectedCount / TOTAL_COMPONENTS) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${(selectedCount / TOTAL_COMPONENTS) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Component List */}
      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        <AnimatePresence>
          {selectedCount === 0 ? (
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
            Object.entries(build)
                .filter(([_, item]) => item) // 🚀 skip null components
                .map(([key, item]) => {
              const component = components.find(c => c.key === key);
              const { compatibility } = checkCompatibility(key, item);
              const isBad = compatibility === "bad";
              
              return (
                <motion.div
                  key={key}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`group bg-gradient-to-r from-gray-800/40 to-gray-900/20 backdrop-blur-sm rounded-xl p-4 border transition-all ${
                  isBad
                    ? "border-red-500/40"
                    : "border-cyan-500/10 hover:border-cyan-500/30"
                }`}
                  >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-white">
                                {component?.label}
                              </div>

                              {isBad && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-400 font-semibold">
                                  Incompatible
                                </span>
                              )}
                            </div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
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

      {hasIssues && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-300">
                  Compatibility Issues Detected
                </span>
              </div>

              <ul className="space-y-1 text-xs text-red-300/90">
                {incompatibleItems.map(([category, item]) => {
                  const { message } = checkCompatibility(category, item);

                  return (
                    <li key={category} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span>
                        <strong className="capitalize">{category}</strong>: {message}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}

      {/* Price Summary */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Subtotal</span>
          <span className="text-white">₹{totalPrice.toLocaleString()}</span>
        </div>      
        <div className="pt-3 border-t border-cyan-500/20">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">Total</span>
            <div className="text-right">
              <div className="text-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                ₹{(totalPrice).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">Including all taxes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">

        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-500/30">
  <div className="flex items-start gap-2">
    <AlertCircle className="h-4 w-4 text-amber-400 mt-[2px]" />
    <p className="text-xs text-amber-50/50 leading-relaxed">
      Assembly fee will be calculated after selecting a worker.  
      Final price may vary based on service charges.
    </p>
  </div>
</div>

        {/* Compatibility Warning */}
      {selectedCount > 0 && selectedCount < TOTAL_COMPONENTS && (
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
            Add {TOTAL_COMPONENTS - selectedCount} more components for expert assembly
          </p>
        </motion.div>
      )}
        
       <motion.button
          whileHover={selectedCount === 0 || selectedCount < TOTAL_COMPONENTS ? {} : { scale: 1.02 }}
          whileTap={selectedCount === 0 || selectedCount < TOTAL_COMPONENTS ? {} : { scale: 0.98 }}
          disabled={selectedCount === 0 || selectedCount < TOTAL_COMPONENTS}
          onClick={onSaveClick}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all
            ${
              selectedCount === 0 || selectedCount < TOTAL_COMPONENTS
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/30"
            }
          `}
        >
          Save Build
        </motion.button>
      </div>

      

      {selectedCount === TOTAL_COMPONENTS && (
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

export default React.memo(RightCart);