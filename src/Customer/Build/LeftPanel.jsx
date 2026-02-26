import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Cpu,MemoryStick,HardDrive,Monitor,Power,Box,Check,Zap,ChevronRight,Sparkles,Filter,CircuitBoard,Fan,Snowflake,AlertCircle,ShieldCheck,Info    } from "lucide-react";
import { useCompatibility } from "./hooks/useCompatibility";
import { useMemo } from "react";
import React from "react";
import LeftPanelSkeleton from "./LeftPanelSkeleton";
import { useDispatch } from "react-redux";
import { openComponentModal } from "./redux/components/componentModalSlice";
import { EyeIcon } from "lucide-react";

const components = [
  { key: "cpu", label: "Processor", icon: <Cpu size={18} />, color: "from-cyan-500 to-blue-500" },
  { key: "motherboard", label: "Motherboard", icon: <CircuitBoard  size={18} />, color: "from-indigo-500 to-blue-500" },
  { key: "ram", label: "Memory", icon: <MemoryStick size={18} />, color: "from-emerald-500 to-green-500" },
  { key: "storage", label: "Storage", icon: <HardDrive size={18} />, color: "from-purple-500 to-pink-500" },
  { key: "gpu", label: "Graphics", icon: <Monitor size={18} />, color: "from-orange-500 to-red-500" },
  { key: "psu", label: "Power Supply", icon: <Power size={18} />, color: "from-yellow-500 to-amber-500" },
  { key: "case", label: "Case", icon: <Box size={18} />, color: "from-gray-500 to-slate-500" },
  { key: "casefan", label: "Case Fan", icon: <Fan  size={18} className="animate-spin-slow" />, color: "from-purple-500 via-pink-500 to-cyan-500" },
  { key: "cooler", label: "Cooler", icon: <Snowflake  size={18} />, color: "from-blue-900 to-cyan-400" },
];

const LeftPanel = ({
  activeCategory,
  setActiveCategory,
  componentData,
  build,
  onSelect,
  loading,
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  onLoadMore,
}) => {

  const activeComponentMeta = components.find(c => c.key === activeCategory);
  const { checkCompatibility } = useCompatibility();
  const dispatch = useDispatch();

  const items = componentData[activeCategory]?.items || [];
  const next = componentData[activeCategory]?.next;

  return (
    <div className="col-span-2 bg-gradient-to-br from-gray-900/40 to-gray-900/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            PC Components
          </h3>
          <p className="text-sm text-cyan-300/70 mt-1">Select your dream specs</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-400">
            {build[activeCategory] ? "✓ Selected" : "Choose"}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {components.map((comp) => {
          const isActive = activeCategory === comp.key;
          const selectedItem = build[comp.key];
            const isSelected = !!selectedItem;

            let isBadSelected = false;

            if (selectedItem) {
              const { compatibility } = checkCompatibility(comp.key, selectedItem);
              isBadSelected = compatibility === "bad";
            }
          
          return (
            <motion.button
              key={comp.key}
              onClick={() => setActiveCategory(comp.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-br ${comp.color} border-0 shadow-lg` 
                  : 'bg-white/5 hover:bg-white/10 border border-cyan-500/10'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && !isBadSelected && (
                  <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
                    <ShieldCheck  className="h-3 w-3 text-white" />
                  </div>
                )}

                {isSelected && isBadSelected && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              
              <div className={`p-2 rounded-lg mb-2 ${
                isActive ? 'bg-white/20' : 'bg-gradient-to-br from-gray-800 to-gray-900'
              }`}>
                <div className={isActive ? 'text-white' : 'text-cyan-400'}>
                  {comp.icon}
                </div>
              </div>
              
              <span className={`text-xs font-medium ${
                isActive ? 'text-white' : 'text-gray-300'
              }`}>
                {comp.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${activeCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
          />
          <div className="absolute right-3 top-3 text-gray-500">
            {items.length} items
          </div>
        </div>

        <div className="flex gap-2">
          {["all", "budget", "mid", "high"].map((filter) => (
            <button
              key={filter}
              onClick={() => setPriceFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                priceFilter === filter
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {filter === "all" && "All"}
              {filter === "budget" && "₹<20k"}
              {filter === "mid" && "₹20-50k"}
              {filter === "high" && "₹50k+"}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-cyan-400" />
            Available {activeComponentMeta?.label}
          </h4>
          <span className="text-xs text-cyan-300">
            {items.length} options
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
            {loading && items.length === 0 && !next? (
              <LeftPanelSkeleton />
            ) : (
              <>
                <AnimatePresence>
                  {items.map((item, index) => {
                    const selected = build[activeCategory]?.id === item.id;
                    const ComponentIcon = activeComponentMeta?.icon;
                    const { compatibility, message } = checkCompatibility(activeCategory, item);

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(activeCategory, item)}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`w-full text-left rounded-xl p-4 transition-all duration-300 ${
                          selected && compatibility === "bad"
                            ? "bg-red-500/10 border border-red-500/50"
                            : selected
                            ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border-2 border-cyan-500/50"
                            : compatibility === "bad"
                            ? "bg-gray-900/40 border border-red-500/30"
                            : "bg-gray-800/30 border border-cyan-500/10"
                        } cursor-pointer`}
                      >
                       <div className="flex items-start justify-between">
                                {/* LEFT SIDE → KEEP YOUR ORIGINAL CONTENT */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div
                                      className={`p-2 rounded-lg ${
                                        selected ? "bg-cyan-500/20" : "bg-gray-700/50"
                                      }`}
                                    >
                                      {ComponentIcon}
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{item.name}</div>
                                      {item.description && (
                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                          {item.description}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-4">
                                      {item.benchmark && (
                                        <div className="flex items-center gap-1">
                                          <Sparkles className="h-3 w-3 text-yellow-400" />
                                          <span className="text-xs text-yellow-400 font-medium">
                                            {item.benchmark}
                                          </span>
                                        </div>
                                      )}
                                      {item.wattage && (
                                        <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">
                                          {item.wattage}W
                                        </span>
                                      )}
                                    </div>

                                    <div className="text-right">
                                      <div className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                                        ₹{Number(item.price).toLocaleString()}
                                      </div>
                                      {item.originalPrice && (
                                        <div className="text-xs text-gray-500 line-through">
                                          ₹{Number(item.originalPrice).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* RIGHT SIDE → ICON + SELECTION */}
                                <div className="ml-4 flex items-start gap-2">
                                  {/* MODAL ICON */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        openComponentModal({
                                          category: activeCategory,
                                          componentId: item.id,
                                        })
                                      );
                                    }}
                                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 transition"
                                  >
                                    <EyeIcon className="h-4 w-4 text-cyan-400" />
                                  </button>

                                  {/* SELECTION INDICATOR */}
                                  {selected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className={`flex items-center gap-2 ${
                                        compatibility === "bad" ? "animate-pulse" : ""
                                      }`}
                                    >
                                      {compatibility === "bad" ? (
                                        <>
                                          <div className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-red-400" />
                                          </div>
                                          <span className="text-xs text-red-400 font-semibold">
                                            Incompatible
                                          </span>
                                        </>
                                      ) : (
                                        <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg">
                                          <Check className="h-4 w-4 text-white" />
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </div>
                            </div>

                        {compatibility !== "good" && (
                          <div className="mt-3 pt-3 border-t border-cyan-500/10">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2 w-2 rounded-full bg-red-500" />
                              <span className="text-red-400">{message}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {items.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-gray-500 mb-2">No components found</div>
                    <div className="text-sm text-gray-400">
                      Try a different filter or search term
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
      </div>
            {next && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="w-full py-2 mt-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        )}

      
    </div>
  );
};

export default React.memo(LeftPanel);