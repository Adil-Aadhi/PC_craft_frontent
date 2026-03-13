import { useDispatch, useSelector } from "react-redux";
import { addComponent } from "../../redux/components/selectedBuildSlice";
import { selectSelectedByCategory } from "../../redux/components/buildSelectors";
import { closeComponentModal } from "../../redux/components/componentModalSlice";
import { useCompatibility } from "../../hooks/useCompatibility";
import {XMarkIcon,CheckCircleIcon,ExclamationTriangleIcon,ShoppingBagIcon,} from "@heroicons/react/24/outline";
import {Cpu,CircuitBoard,MemoryStick,HardDrive,Monitor,Power,Box,Fan,Snowflake} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

import { useState } from "react";
import CPUSpec from "./cpuspec";
import GPUSpec from "./gpuspec";
import RAMSpec from "./ramspec";
import MotherboardSpec from "./motherboardspec";
import StorageSpec from "./storagespec";
import PSUSpec from "./psuspec";
import CaseSpec from "./casespec";
import CaseFanSpec from "./casefanspec";
import CoolerSpec from "./coolerspec";

const ModalContent = ({ category, component }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const {user}=useAuth()
  const isWorker=user?.role==="worker"
  const selectedItem = useSelector(selectSelectedByCategory(category));
  const isSelected = selectedItem?.id === component.id;

  const { issuesByCategory } = useCompatibility();
  const issue = issuesByCategory?.[category];

  const handleAddToBuild = () => {
    dispatch(addComponent({ category, item: component }));
    dispatch(closeComponentModal());
  };

  const getCategoryIcon = () => {
    const icons = {
        cpu: <Cpu size={20} />,
        motherboard: <CircuitBoard size={20} />,
        ram: <MemoryStick size={20} />,
        storage: <HardDrive size={20} />,
        gpu: <Monitor size={20} />,
        psu: <Power size={20} />,
        case: <Box size={20} />,
        casefan: <Fan size={20} className="animate-spin-slow" />,
        cooler: <Snowflake size={20} />,
        default: <Box size={20} />
      };
    return icons[category] || icons.default;
  };

  const formatCategoryName = (cat) =>
    cat.charAt(0).toUpperCase() + cat.slice(1);

  return (
    <div className="relative">

      {/* Close Button */}
      <button
        onClick={() => dispatch(closeComponentModal())}
        className="absolute top-4 right-4 z-30 p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg backdrop-blur-sm"
      >
        <XMarkIcon className="w-5 h-5 text-zinc-400 hover:text-white" />
      </button>

      {/* Header */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-full">
            <span className="text-cyan-400">{getCategoryIcon()}</span>
            <span className="text-xs font-medium text-cyan-400">
              {formatCategoryName(category)}
            </span>
          </div>

          {isSelected && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-400">
                Currently Selected
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 pr-12">
          <h2 className="text-2xl font-bold text-white">{component.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-zinc-400">{component.brand}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-xl font-semibold text-cyan-400">
              ₹{component.price?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="px-6 pt-6">
        <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900 rounded-xl border border-zinc-800">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50">
              <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          )}

          <div className="aspect-video flex items-center justify-center p-6">
            <img
              src={component.image}
              alt={component.name}
              onLoad={() => setImageLoaded(true)}
              className={`max-h-full max-w-full object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Compatibility Warning */}
      {issue && (
        <div className="px-6 pt-6">
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-400 mb-1">
                Compatibility Issue Detected
              </h4>
              <p className="text-sm text-red-300/90">{issue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Specifications */}
      <div className="px-6 py-6">
        <div className="bg-zinc-800/30 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            Technical Specifications
          </h3>

          <div className="space-y-6">
            {category === "cpu" && <CPUSpec component={component} />}
            {category === "gpu" && <GPUSpec component={component} />}
            {category === "ram" && <RAMSpec component={component} />}
            {category === "motherboard" && (
              <MotherboardSpec component={component} />
            )}
            {category === "storage" && <StorageSpec component={component} />}
            {category === "psu" && <PSUSpec component={component} />}
            {category === "case" && <CaseSpec component={component} />}
            {category === "casefan" && <CaseFanSpec component={component} />}
            {category === "cooler" && <CoolerSpec component={component} />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex justify-end gap-3">
        <button
          onClick={() => dispatch(closeComponentModal())}
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Cancel
        </button>
        {
          !isWorker && (
            <button
            disabled={isSelected}
            onClick={handleAddToBuild}
            className={`relative overflow-hidden group px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
              isSelected
                ? "bg-green-600 cursor-not-allowed opacity-90"
                : "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-black"
            }`}
          >
            {!isSelected && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            <span className="relative flex items-center gap-2">
              {isSelected ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Selected
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="w-5 h-5" />
                  Add to Build
                </>
              )}
            </span>
          </button>
            )
          }
          
      </div>
    </div>
  );
};

export default ModalContent;