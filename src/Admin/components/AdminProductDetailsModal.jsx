import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Package, 
  DollarSign, 
  Layers,
  Image as ImageIcon,
  Cpu,
  HardDrive,
  Monitor,
  Wind,
  Zap,
  CircuitBoard,
  CheckCircle,
  XCircle,
  Hash,
  Gauge,
  Ruler,
  Thermometer,
  Clock
} from "lucide-react"
import api from "../../api/axios"

// Icon mapping for spec fields
const specIconMap = {
  // CPU
  socket: Cpu,
  cores: Hash,
  threads: Hash,
  base_clock: Clock,
  boost_clock: Gauge,
  tdp: Thermometer,
  has_integrated_graphics: Monitor,
  series: Layers,
  l3_cache: HardDrive,
  
  // GPU
  memory_gb: HardDrive,
  memory_type: CircuitBoard,
  base_clock_mhz: Clock,
  boost_clock_mhz: Gauge,
  length_mm: Ruler,
  recommended_psu_watt: Zap,
  gpu_chipset: Cpu,
  
  // RAM
  ram_type: CircuitBoard,
  capacity_gb: HardDrive,
  frequency_mhz: Gauge,
  stick_count: Layers,
  voltage: Zap,
  
  // Motherboard
  chipset: CircuitBoard,
  max_ram_gb: HardDrive,
  ram_slots: Layers,
  form_factor: Monitor,
  pcie_version: CircuitBoard,
  m2_slots: HardDrive,
  sata_ports: HardDrive,
  
  // Storage
  storage_type: HardDrive,
  interface: CircuitBoard,
  read_speed: Gauge,
  write_speed: Gauge,
  
  // PSU
  wattage: Zap,
  modular_type: Layers,
  efficiency_rating: CheckCircle,
  
  // Case
  supported_form_factors: Monitor,
  max_gpu_length_mm: Ruler,
  max_cpu_cooler_height_mm: Ruler,
  has_rgb: Wind,
  side_panel: Monitor,
  supported_fan_sizes: Wind,
  
  // Cooler
  cooler_type: Wind,
  supported_sockets: Cpu,
  cooler_height_mm: Ruler,
  fan_size: Wind,
  
  // Case Fan
  rpm: Gauge
}

export default function ProductDetailsModal({ productId, close }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/admin/products/${productId}/`)
        setProduct(res.data)
        setImageError(false)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (productId) loadProduct()
  }, [productId])

  const formatSpecKey = (key) => {
    return key
      .replaceAll("_", " ")
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatSpecValue = (key, value) => {
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }
    
    // Add units to certain fields
    if (key.includes("price") || key.includes("watt")) return `₹${value}`
    if (key.includes("clock") && !key.includes("mhz")) return `${value} GHz`
    if (key.includes("mhz")) return `${value} MHz`
    if (key.includes("gb") || key.includes("capacity")) return `${value} GB`
    if (key.includes("mm")) return `${value} mm`
    if (key.includes("tdp")) return `${value} W`
    
    return value
  }

  const getSpecIcon = (key) => {
    return specIconMap[key] || Package
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.images || (product.image ? [product.image] : [])
  const hasImages = images.length > 0 && !imageError

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Product Details & Specifications</p>
            </div>
            <button
              onClick={close}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6 overflow-y-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - Image */}
              <div className="col-span-1">
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                    <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
                    Product Image
                  </h3>
                  
                  {hasImages ? (
                    <div className="space-y-3">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <img
                          src={images[activeImageIndex]}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={() => setImageError(true)}
                        />
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex(idx)}
                              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                                activeImageIndex === idx 
                                  ? 'border-blue-500' 
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={img}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
                      <span className="text-sm text-gray-400 font-medium">No Image Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                {/* Basic Information Card */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                    <Package className="w-4 h-4 md:w-5 md:h-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Category</p>
                        <p className="font-medium text-xs md:text-sm text-gray-900">{product.category?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Brand</p>
                        <p className="font-medium text-xs md:text-sm text-gray-900">{product.brand?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Price</p>
                        <p className="font-medium text-xs md:text-sm text-green-600">₹{product.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-1.5 md:gap-2">
                      <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] md:text-xs text-gray-500">Stock Quantity</p>
                        <p className={`font-medium text-xs md:text-sm ${
                          product.stock_quantity > 10 
                            ? 'text-green-600'
                            : product.stock_quantity > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {product.stock_quantity} units
                        </p>
                      </div>
                    </div>

                    {product.model_number && (
                      <div className="flex items-start gap-1.5 md:gap-2 col-span-2">
                        <Hash className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-500">Model Number</p>
                          <p className="font-medium text-xs md:text-sm text-gray-900">{product.model_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications Card */}
                {product.spec && Object.keys(product.spec).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                      <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {Object.entries(product.spec)
                        .filter(([key, value]) => 
                          value !== null && 
                          value !== "" && 
                          !["id", "name", "price", "brand", "image", "created_at", "updated_at"].includes(key)
                        )
                        .map(([key, value]) => {
                          const Icon = getSpecIcon(key)
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-lg p-2.5 md:p-3 border border-gray-100 hover:border-blue-200 transition-colors"
                            >
                              <div className="flex items-start gap-1.5 md:gap-2">
                                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] md:text-xs text-gray-500 truncate">
                                    {formatSpecKey(key)}
                                  </p>
                                  <p className="font-medium text-xs md:text-sm text-gray-900 break-words">
                                    {formatSpecValue(key, value)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(product.created_at || product.updated_at) && (
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                      <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                      {product.created_at && (
                        <div>
                          <p className="text-gray-500 text-[10px] md:text-xs">Created</p>
                          <p className="font-medium text-gray-900">
                            {new Date(product.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {product.updated_at && (
                        <div>
                          <p className="text-gray-500 text-[10px] md:text-xs">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {new Date(product.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={close}
              className="px-4 py-2 md:px-6 md:py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}