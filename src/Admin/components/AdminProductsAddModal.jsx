import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Save, Image as ImageIcon,Package,Hash,DollarSign,Layers,Cpu,HardDrive,Monitor,Wind,Zap,CircuitBoard,CheckCircle,AlertCircle} from "lucide-react"
import api from "../../api/axios"

const specFields = {
  cpu: [
    { name: "socket", placeholder: "Socket", type: "text", icon: Cpu },
    { name: "cores", placeholder: "Cores", type: "number", icon: Hash },
    { name: "threads", placeholder: "Threads", type: "number", icon: Hash },
    { name: "base_clock", placeholder: "Base Clock (GHz)", type: "number", icon: Cpu },
    { name: "boost_clock", placeholder: "Boost Clock (GHz)", type: "number", icon: Cpu },
    { name: "tdp", placeholder: "TDP (W)", type: "number", icon: Zap },
    { name: "has_integrated_graphics", placeholder: "Has iGPU", type: "boolean", icon: Monitor },
    { name: "series", placeholder: "Series", type: "text", icon: Layers },
    { name: "l3_cache", placeholder: "L3 Cache", type: "text", icon: HardDrive }
  ],

  gpu: [
    { name: "memory_gb", placeholder: "Memory (GB)", type: "number", icon: HardDrive },
    { name: "memory_type", placeholder: "Memory Type", type: "text", icon: CircuitBoard },
    { name: "base_clock_mhz", placeholder: "Base Clock (MHz)", type: "number", icon: Cpu },
    { name: "boost_clock_mhz", placeholder: "Boost Clock (MHz)", type: "number", icon: Cpu },
    { name: "length_mm", placeholder: "Length (mm)", type: "number", icon: Monitor },
    { name: "tdp", placeholder: "TDP (W)", type: "number", icon: Zap },
    { name: "recommended_psu_watt", placeholder: "Recommended PSU (W)", type: "number", icon: Zap },
    { name: "gpu_chipset", placeholder: "GPU Chipset", type: "text", icon: Cpu }
  ],

  ram: [
    { name: "ram_type", placeholder: "RAM Type", type: "text", icon: CircuitBoard },
    { name: "capacity_gb", placeholder: "Capacity (GB)", type: "number", icon: HardDrive },
    { name: "frequency_mhz", placeholder: "Frequency (MHz)", type: "number", icon: Cpu },
    { name: "stick_count", placeholder: "Stick Count", type: "number", icon: Layers },
    { name: "voltage", placeholder: "Voltage", type: "number", icon: Zap }
  ],

  motherboard: [
    { name: "socket", placeholder: "Socket", type: "text", icon: Cpu },
    { name: "chipset", placeholder: "Chipset", type: "text", icon: CircuitBoard },
    { name: "ram_type", placeholder: "RAM Type", type: "text", icon: CircuitBoard },
    { name: "max_ram_gb", placeholder: "Max RAM (GB)", type: "number", icon: HardDrive },
    { name: "ram_slots", placeholder: "RAM Slots", type: "number", icon: Layers },
    { name: "form_factor", placeholder: "Form Factor", type: "text", icon: Monitor },
    { name: "pcie_version", placeholder: "PCIe Version", type: "text", icon: CircuitBoard },
    { name: "m2_slots", placeholder: "M.2 Slots", type: "number", min: 0, icon: HardDrive },
    { name: "sata_ports", placeholder: "SATA Ports", type: "number", min: 0, icon: HardDrive }
  ],

  storage: [
    { name: "storage_type", placeholder: "Storage Type", type: "text", icon: HardDrive },
    { name: "interface", placeholder: "Interface", type: "text", icon: CircuitBoard },
    { name: "capacity_gb", placeholder: "Capacity (GB)", type: "number", icon: HardDrive },
    { name: "read_speed", placeholder: "Read Speed (MB/s)", type: "number", icon: Cpu },
    { name: "write_speed", placeholder: "Write Speed (MB/s)", type: "number", icon: Cpu },
    { name: "form_factor", placeholder: "Form Factor", type: "text", icon: Monitor }
  ],

  psu: [
    { name: "wattage", placeholder: "Wattage", type: "number", icon: Zap },
    { name: "modular_type", placeholder: "Modular Type", type: "text", icon: Layers },
    { name: "efficiency_rating", placeholder: "Efficiency Rating", type: "text", icon: CheckCircle },
    { name: "form_factor", placeholder: "Form Factor", type: "text", icon: Monitor }
  ],

  case: [
    { name: "supported_form_factors", placeholder: "Supported Form Factors", type: "text", icon: Monitor },
    { name: "max_gpu_length_mm", placeholder: "Max GPU Length (mm)", type: "number", icon: Monitor },
    { name: "max_cpu_cooler_height_mm", placeholder: "Max CPU Cooler Height (mm)", type: "number", icon: Cpu },
    { name: "has_rgb", placeholder: "Has RGB", type: "boolean", icon: Wind },
    { name: "side_panel", placeholder: "Side Panel Type", type: "text", icon: Monitor },
    { name: "supported_fan_sizes", placeholder: "Supported Fan Sizes", type: "text", icon: Wind }
  ],

  cooler: [
    { name: "cooler_type", placeholder: "Cooler Type", type: "text", icon: Wind },
    { name: "supported_sockets", placeholder: "Supported Sockets", type: "text", icon: Cpu },
    { name: "cooler_height_mm", placeholder: "Cooler Height (mm)", type: "number", icon: Monitor },
    { name: "fan_size", placeholder: "Fan Size", type: "text", icon: Wind }
  ],

  "case-fan": [
    { name: "fan_size", placeholder: "Fan Size", type: "text", icon: Wind },
    { name: "rpm", placeholder: "RPM", type: "number", icon: Cpu },
    { name: "has_rgb", placeholder: "Has RGB", type: "boolean", icon: Wind }
  ]
}

export function AddProductModal({ close, productId, onSuccess }) {
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    name: "",
    model_number: "",
    price: "",
    stock_quantity: ""
  })

  const [spec, setSpec] = useState({})
  const isEdit = !!productId

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("admin/products/categories/")
        setCategories(res.data)

        if (res.data.length > 0 && !productId) {
          setCategory(res.data[0].id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    const loadProduct = async () => {
      if (!productId) return

      try {
        setLoading(true)
        const res = await api.get(`/admin/products/${productId}/`)
        const data = res.data

        setForm({
          name: data.name || "",
          model_number: data.model_number || "",
          price: data.price || "",
          stock_quantity: data.stock_quantity || ""
        })

        setCategory(data.category.id)
        setSpec(data.spec || {})

        // Set image preview if exists
        if (data.images && data.images[0]) {
          setImagePreview(data.images[0].image)
        }

      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
    loadProduct()
  }, [productId])

  const handleForm = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleSpec = (e, type) => {
    let value = e.target.value
    const fieldName = e.target.name

    if (type === "number") {
      value = value === "" ? "" : Number(value)
    }
    if (type === "boolean") {
      value = value === "true"
    }

    // convert MHz → GHz for CPU clocks
    if (fieldName === "base_clock" || fieldName === "boost_clock") {
      if (value > 50) {
        value = value / 1000
      }
    }

    setSpec({ ...spec, [fieldName]: value })
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Product name is required"
    if (!form.price) newErrors.price = "Price is required"
    if (form.price <= 0) newErrors.price = "Price must be greater than 0"
    if (!category) newErrors.category = "Category is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const selectedCategory = categories.find(c => c.id == category)?.slug

  const submitProduct = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      const formData = new FormData()

      formData.append("name", form.name)
      formData.append("model_number", form.model_number || "")
      formData.append("price", form.price)
      formData.append("stock_quantity", form.stock_quantity || 0)
      formData.append("category", category)
      formData.append("brand", 1)

      if (image instanceof File) {
        formData.append("image", image)
      }

      const cleanSpec = { ...spec }
      delete cleanSpec.image

      formData.append("spec", JSON.stringify(cleanSpec))

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }

      if (isEdit) {
        await api.patch(`/admin/products/${productId}/`, formData)
      } else {
        await api.post(`/admin/products/`, formData)
      }

      if (onSuccess) onSuccess()
      close()

    } catch (err) {
      console.error(err)
      setErrors({ submit: "Failed to save product. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? "Update product details below" : "Fill in the product details below"}
              </p>
            </div>
            <button
              onClick={close}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {loading && !isEdit ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleForm}
                          placeholder="e.g., Intel Core i7-13700K"
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                            errors.name ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Number
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          name="model_number"
                          value={form.model_number}
                          onChange={handleForm}
                          placeholder="e.g., BX8071513700K"
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          name="stock_quantity"
                          type="number"
                          value={form.stock_quantity}
                          onChange={handleForm}
                          placeholder="0"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          name="price"
                          type="number"
                          value={form.price}
                          onChange={handleForm}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                            errors.price ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Image</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value)
                            if (errors.category) {
                              setErrors({ ...errors, category: null })
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white ${
                            errors.category ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex items-center justify-center w-full h-10 px-4 border border-gray-200 border-dashed rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {image ? image.name : 'Choose image'}
                          </span>
                        </label>
                      </div>
                      {imagePreview && (
                        <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Specifications Section */}
                {selectedCategory && specFields[selectedCategory] && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {specFields[selectedCategory].map(field => {
                        const Icon = field.icon || Package

                        if (field.type === "boolean") {
                          return (
                            <div key={field.name}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.placeholder}
                              </label>
                              <div className="relative">
                                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                  name={field.name}
                                  value={spec[field.name] ?? ""}
                                  onChange={(e) => handleSpec(e, "boolean")}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                                >
                                  <option value="">Select</option>
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </select>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.placeholder}
                            </label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                name={field.name}
                                type={field.type || "text"}
                                value={spec[field.name] || ""}
                                onChange={(e) => handleSpec(e, field.type)}
                                placeholder={field.placeholder}
                                min={field.min}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            {errors.submit && (
              <p className="text-sm text-red-500 flex items-center gap-1 mr-auto">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}
            <button
              onClick={close}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={submitProduct}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? "Update" : "Add"} Product</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}