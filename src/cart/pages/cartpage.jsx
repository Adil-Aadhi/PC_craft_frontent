import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Trash2, 
  Pencil, 
  CheckCircle, 
  AlertTriangle,
  Cpu,
  Gpu,
  MemoryStick,
  HardDrive,
  Eye,
  ShoppingCart,
  CreditCard,
  Package,
  X,
  Image as ImageIcon,
  Box,
  Monitor,
  Zap,
  Thermometer,
  Fan,
  Wallet,
  Layers
} from "lucide-react";
import { useCart } from "../context/cartcontext";
import BuildDetailsModal from "../components/cartcomponentmodel";
import { useNavigate } from "react-router-dom";
import BuildSummaryPanel from "../components/buildsummarycomponent";
import SendBuildModal from "../components/sendbuildmodal";

const CartPage = () => {
  const { cart, fetchCart, deleteBuild } = useCart();
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate=useNavigate()
  const [sendBuild, setSendBuild] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleImageError = (buildId) => {
    setImageErrors(prev => ({ ...prev, [buildId]: true }));
  };

  const getComponentIcon = (type) => {
    switch(type) {
      case 'cpu': return <Cpu size={16} className="text-blue-400" />;
      case 'gpu': return <Gpu size={16} className="text-purple-400" />;
      case 'ram': return <MemoryStick size={16} className="text-green-400" />;
      case 'storage': return <HardDrive size={16} className="text-yellow-400" />;
      case 'cooler': return <Fan size={16} className="text-cyan-400" />;
      default: return <Box size={16} className="text-zinc-400" />;
    }
  };
  useEffect(() => {
  console.log("CART DATA:", cart);
  console.log(cart.items.map(b => typeof b.is_compatible));
}, [cart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4 md:p-6">
      
      {/* Header */}
      <div className="mt-20 max-w-7xl mx-auto mb-6 flex items-start justify-between">
  
  {/* Left: Title + Subtitle */}
          <div>
            <h1 className="mt-6 text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingCart className="text-cyan-400" />
              Your PC Builds
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage and customize your custom PC configurations
            </p>
          </div>

          {/* Right: Cross Button */}
          <button
            onClick={() => navigate(-1)}
            className="mt-10 flex items-center justify-center w-9 h-9 rounded-full
                      bg-zinc-800 hover:bg-zinc-700
                      text-zinc-300 hover:text-white
                      border border-zinc-700
                      transition"
            aria-label="Close"
          >
            ✕
          </button>

        </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 🧱 Build List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center backdrop-blur-sm"
            >
              <Package size={48} className="mx-auto text-zinc-700 mb-4" />
              <p className="text-zinc-400 text-lg">Your cart is empty</p>
              <p className="text-zinc-600 text-sm mt-2">Start building your dream PC!</p>
            </motion.div>
          ) : (
            cart.items.map((build, index) => (
              <motion.div
                key={build.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 backdrop-blur-sm"
                onClick={() => setSelectedBuild(build)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-48 h-48 md:h-auto bg-zinc-800/50 relative overflow-hidden">
                    {build.image_url && !imageErrors[build.id] ? (
                      <img 
                        src={build.image_url} 
                        alt={build.build_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(build.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <div className="text-center">
                          <Layers size={32} className="mx-auto text-zinc-700 mb-2" />
                          <p className="text-xs text-zinc-700">No Image</p>
                        </div>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-5">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">
                        {build.build_name || "Custom PC Build"}
                      </h2>
                      {/* Compatibility + Send */}
                        <div className="flex gap-2 items-center justify-between mb-3">
                          {build.is_compatible ? (
                            <span className="flex items-center gap-1 bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">
                              <CheckCircle size={12} /> Compatible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/20">
                              <AlertTriangle size={12} /> Warning
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSendBuild(build);
                            }}
                            className="text-xs bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-3 py-1.5 rounded-lg transition"
                          >
                            Send
                          </button>
                        </div>
                    </div>

                    {/* Key Components */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {build.cpu && (
                        <div className="flex items-center gap-2 text-xs bg-zinc-800/50 p-2 rounded-lg">
                          {getComponentIcon('cpu')}
                          <span className="truncate text-zinc-300">{build.cpu.name}</span>
                        </div>
                      )}
                      {build.gpu && (
                        <div className="flex items-center gap-2 text-xs bg-zinc-800/50 p-2 rounded-lg">
                          {getComponentIcon('gpu')}
                          <span className="truncate text-zinc-300">{build.gpu.name}</span>
                        </div>
                      )}
                      {build.ram && (
                        <div className="flex items-center gap-2 text-xs bg-zinc-800/50 p-2 rounded-lg">
                          {getComponentIcon('ram')}
                          <span className="truncate text-zinc-300">{build.ram.name}</span>
                        </div>
                      )}
                      {build.storage && (
                        <div className="flex items-center gap-2 text-xs bg-zinc-800/50 p-2 rounded-lg">
                          {getComponentIcon('storage')}
                          <span className="truncate text-zinc-300">{build.storage.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Component Count */}
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
                      <Box size={12} />
                      <span>{Object.keys(build.components || {}).length} components</span>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
                      <div>
                        <p className="text-xs text-zinc-500">Total Price</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          ₹{build.total_price?.toLocaleString()}
                        </p>
                      </div>

                      <div
                        className="flex gap-2 w-full sm:w-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-all duration-200 group/edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/build?edit=${build.id}`)
                          }}
                        >
                          <Pencil size={14} className="group-hover/edit:text-cyan-400" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBuild(build.id);
                          }}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-sm bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 group/remove"
                        >
                          <Trash2 size={14} className="group-hover/remove:rotate-12 transition-transform" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBuild(build);
                          }}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-sm bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 lg:hidden"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* 📊 Build Summary */}
            <div className="lg:col-span-1">
            <BuildSummaryPanel cart={cart} />
            </div>
      </div>

      {/* 🔍 Build Details Modal */}
      {selectedBuild && (
        <BuildDetailsModal
          build={selectedBuild}
          location="cart"
          onClose={() => setSelectedBuild(null)}
        />
      )}

      {sendBuild && (
        <SendBuildModal
            build={sendBuild}
            onClose={() => setSendBuild(null)}
        />
        )}
    </div>
  );
};

export default CartPage;