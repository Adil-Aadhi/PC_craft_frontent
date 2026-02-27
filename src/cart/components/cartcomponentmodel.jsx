import { motion } from "framer-motion";
import { 
  X, 
  CheckCircle, 
  AlertTriangle,
  Cpu,
  Gpu,
  MemoryStick,
  HardDrive,
  Fan,
  Box,
  Zap,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ComponentCard = ({ title, item, icon: Icon }) => {
  if (!item) return null;
  const [imageError, setImageError] = useState(false);
   
  const getSpecs = () => {
    const specs = [];
    
    // Common specs based on component type
    if (item.socket) specs.push({ label: "Socket", value: item.socket });
    if (item.cores) specs.push({ label: "Cores", value: `${item.cores} cores` });
    if (item.threads) specs.push({ label: "Threads", value: `${item.threads} Threads` });
    if (item.base_clock) specs.push({ label: "Base", value: `${item.base_clock} GHz` });
    if (item.boost_clock) specs.push({ label: "Boost", value: `${item.boost_clock} GHz` });
    if (item.tdp) specs.push({ label: "TDP", value: `${item.tdp}W` });
    if (item.memory_gb) specs.push({ label: "Memory", value: `${item.memory_gb} GB` });
    if (item.gpu_chipset) specs.push({ label: "Chipset", value: item.gpu_chipset });
    if (item.capacity_gb) specs.push({ label: "Capacity", value: `${item.capacity_gb} GB` });
    if (item.ram_type) specs.push({ label: "Type", value: item.ram_type });
    if (item.frequency_mhz) specs.push({ label: "Speed", value: `${item.frequency_mhz} MHz` });
    if (item.stick_count) specs.push({ label: "Sticks", value: item.stick_count });
    if (item.wattage) specs.push({ label: "Wattage", value: `${item.wattage}W` });
    if (item.efficiency_rating) specs.push({ label: "Efficiency", value: item.efficiency_rating });
    if (item.cooler_type) specs.push({ label: "Type", value: item.cooler_type });
    if (item.storage_type) specs.push({ label: "Type", value: item.storage_type });
    if (item.interface) specs.push({ label: "Interface", value: item.interface });
    if (item.supported_form_factors) specs.push({ label: "Form Factor", value: item.supported_form_factors });
    if (item.fan_size) specs.push({ label: "Fan Size", value: item.fan_size });
    if (item.rpm) specs.push({ label: "RPM", value: item.rpm });

    return specs.slice(0, 3); // Show only top 3 specs for compactness
  };

  const specs = getSpecs();
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 hover:border-cyan-500/30 transition-all duration-200 group">
      <div className="flex items-start gap-3">
        {/* Component Icon with Image Placeholder */}
        <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
          {item.image_url && !imageError ? (
            <img 
              src={item.image_url} 
              alt={item.name || title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Icon size={20} className="text-zinc-600" />
            </div>
          )}
        </div>

        {/* Component Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-300 truncate group-hover:text-cyan-400 transition-colors">
            {item.name || title}
          </h4>
          
          {/* Specs Chips */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {specs.map((spec, index) => (
                <span 
                  key={index}
                  className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-md border border-zinc-700"
                  title={`${spec.label}: ${spec.value}`}
                >
                  {spec.value}
                </span>
              ))}
            </div>
          )}

          {/* Price if available */}
          {item.price && (
            <p className="text-xs font-semibold text-cyan-400 mt-1.5">
              ₹{item.price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon, count }) => (
  <div className="col-span-2 flex items-center gap-2 mt-3 first:mt-0 mb-1">
    <div className="p-1.5 bg-cyan-500/10 rounded-lg">
      <Icon size={14} className="text-cyan-400" />
    </div>
    <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
    {count > 0 && (
      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

const BuildDetailsModal = ({ build, onClose,isWorker,currentStatus,onAccept,onReject,location }) => {
    const navigate=useNavigate()

  // Group components by category with safety checks
  const components = [
    { 
      title: "Core Components", 
      icon: Cpu, 
      items: [
        { name: "CPU", data: build?.cpu, icon: Cpu },
        { name: "Motherboard", data: build?.motherboard, icon: Layers },
        { name: "RAM", data: build?.ram, icon: MemoryStick },
        { name: "GPU", data: build?.gpu, icon: Gpu }
      ]
    },
    { 
      title: "Storage & Cooling", 
      icon: HardDrive, 
      items: [
        { name: "Storage", data: build?.storage, icon: HardDrive },
        { name: "Cooler", data: build?.cooler, icon: Fan },
        { name: "Case Fan", data: build?.case_fan, icon: Fan }
      ]
    },
    { 
      title: "Power & Chassis", 
      icon: Zap, 
      items: [
        { name: "PSU", data: build?.psu, icon: Zap },
        { name: "Case", data: build?.case, icon: Box }
      ]
    }
  ];

  // Calculate total components safely
  const totalComponents = [
    build?.cpu,
    build?.motherboard,
    build?.ram,
    build?.gpu,
    build?.storage,
    build?.cooler,
    build?.case_fan,
    build?.psu,
    build?.case
  ].filter(Boolean).length;

  // If no build data, don't render
  if (!build) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {build.build_name || "PC Build Details"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {totalComponents} components 
                {/* {build?.id && `• Build ID: ${getBuildIdDisplay()}`} */}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Compatibility Banner - Compact */}
          {build.is_compatible ? (
            <div className="flex items-center gap-1.5 text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg mt-3 text-xs">
              <CheckCircle size={14} /> 
              <span>Fully Compatible ✓ All components work together</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg mt-3 text-xs">
              <AlertTriangle size={14} /> 
              <span className="truncate">{build.compatibility_notes || "Compatibility warning"}</span>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {components.map((section) => {
            const availableItems = section.items.filter(item => item.data);
            if (availableItems.length === 0) return null;

            return (
              <div key={section.title}>
                <SectionHeader 
                  title={section.title} 
                  icon={section.icon} 
                  count={availableItems.length}
                />
                <div className="grid grid-cols-2 gap-2">
                  {availableItems.map((item) => (
                    <ComponentCard
                      key={item.name}
                      title={item.name}
                      item={item.data}
                      icon={item.icon}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State if no components */}
          {totalComponents === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Box size={32} className="text-zinc-800 mb-2" />
              <p className="text-zinc-500 text-sm">No components in this build</p>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-zinc-500">Total Build Value</p>
              <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ₹{build.total_price?.toLocaleString() || '0'}
              </p>
            </div>
            
            <div className="flex gap-2">
              {currentStatus === "accepted" && (
                <p className="text-green-400 text-sm font-semibold mt-1">
                   Accepted
                </p>
              )}

              {currentStatus === "rejected" && (
                <p className="text-red-400 text-sm font-semibold mt-1">
                   Rejected
                </p>
              )}
              {!isWorker && location === "cart" &&(
                  <button
                    onClick={() => navigate(`/build?edit=${build.id}`)}
                    className="bg-white/55 hover:bg-white/100 text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 border border-zinc-800"
                  >
                    <span>Edit</span>
                  </button>
                )}

              {isWorker && currentStatus === "draft" && (
                <div className="flex gap-2">
                  <button
                    onClick={onAccept}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Accept
                  </button>

                  <button
                    onClick={onReject}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BuildDetailsModal;