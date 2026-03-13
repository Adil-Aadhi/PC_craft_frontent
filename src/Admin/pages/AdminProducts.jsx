import { useState, useEffect } from "react"
import { AddProductModal } from "../components/AdminProductsAddModal"
import api from "../../api/axios"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Image as ImageIcon,
  Cpu,
  HardDrive,
  Monitor,
  Wind,
  Zap,
  CircuitBoard,
  Layers,
  Eye
} from "lucide-react"
import ProductDetailsModal from "../components/AdminProductDetailsModal"

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [viewProductId, setViewProductId] = useState(null)

  const fetchProducts = (params) => api.get("/admin/products/", { params })

  const categories = [
    { label: "All", value: "All", icon: Layers },
    { label: "CPU", value: "cpu", icon: Cpu },
    { label: "GPU", value: "gpu", icon: Monitor },
    { label: "RAM", value: "ram", icon: CircuitBoard },
    { label: "Storage", value: "storage", icon: HardDrive },
    { label: "PSU", value: "psu", icon: Zap },
    { label: "Cooler", value: "cooler", icon: Wind },
    { label: "Case", value: "case", icon: Package },
    { label: "Fan", value: "case-fan", icon: Wind },
    { label: "Motherboard", value: "motherboard", icon: CircuitBoard }
  ]

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = { page }
      if (debouncedSearch) params.search = debouncedSearch
      if (category !== "All") params.category = category.toLowerCase()

      const res = await fetchProducts(params)
      setProducts(res.data.results)
      setCount(res.data.count)
      setImageErrors({}) // Reset image errors on new load
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [debouncedSearch, category, page])

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/admin/products/${id}/delete/`)
      if (res) {
        setDeleteModal(null)
        loadProducts()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  const ProductImage = ({ product }) => {
    const hasError = imageErrors[product.id]
    const imageUrl = product.image

    if (!imageUrl || hasError) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex flex-col items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 font-medium">No Image</span>
        </div>
      )
    }

    return (
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={() => handleImageError(product.id)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <p className="text-gray-600 mt-2">Manage your product inventory</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name, brand, or category..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const Icon = c.icon
            const isActive = category === c.value
            return (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <ProductImage product={product} />
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {product.category?.name}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    {product.brand?.name}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.stock !== undefined && (
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-50 text-green-600'
                          : product.stock > 0
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">

                    {/* View */}
                    <button
                      onClick={() => setViewProductId(product.id)}
                      className="p-2 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-md transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowModal(true)
                      }}
                      className="p-2 bg-gray-100 hover:bg-yellow-100 text-yellow-600 rounded-md transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteModal(product.id)}
                      className="p-2 bg-gray-100 hover:bg-red-100 text-red-600 rounded-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <div className="flex items-center justify-between mt-8 bg-white rounded-lg shadow-sm p-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${page === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page <span className="font-semibold">{page}</span> of{' '}
                <span className="font-semibold">{Math.ceil(count / 10)}</span>
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={products.length === 0}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${products.length === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setSelectedProduct(null)
          setShowModal(true)
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center group"
      >
        <Plus className="w-6 h-6" />
        <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Add Product
        </span>
      </motion.button>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <AddProductModal 
            close={() => setShowModal(false)}
            productId={selectedProduct?.id}
            onSuccess={loadProducts}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl w-[400px] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
                <button
                  onClick={() => setDeleteModal(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {viewProductId && (
      <ProductDetailsModal
        productId={viewProductId}
        close={() => setViewProductId(null)}
      />
    )} 
    </div>
  )
}