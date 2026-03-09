import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  User, 
  DollarSign, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Hash,
  TrendingUp
} from "lucide-react";
import api from "../../api/axios";
import OrderComponentsModal from "../components/AdminOrderComponentModal";

export default function CompletionRequests() {
  const [completionRequests, setCompletionRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/completion-requests/");
      setCompletionRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch completion requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleView = (item) => {
    setSelectedOrder(item);
    setModalOpen(true);
  };

  const handlePayment = async (id) => {
      try{
        const res=await api.post(`/admin/approve-payment/${id}/`)
        console.log("Payment approved:", res.data);
        fetchRequests();
      }catch(err){
        console.log("Failed to relese amount",err)
      }
    };

  // Calculate statistics
  const pendingCount = completionRequests.filter(o => !o.payout_approved).length;

  // Filter requests based on status (you can implement actual status filtering based on your data)
 const filteredRequests =
  filter === "pending"
    ? completionRequests.filter(item => !item.payout_approved)
    : completionRequests.filter(item => item.payout_approved);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading completion requests...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="ms-3 me-3">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Completion Requests
              </h1>
              <p className="text-gray-600 mt-2">Review and process worker completion requests</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-lg p-4 min-w-[140px]"
              >
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Package className="w-4 h-4 text-blue-500" />
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </motion.div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-6">
            {['pending', 'completed'].map((filterOption) => (
              <motion.button
                key={filterOption}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Completion Requests</h3>
            <p className="text-gray-600">All worker completion requests have been processed.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRequests.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium">Order #{item.order_id}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="w-5 h-5 text-yellow-300" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Worker Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Worker</p>
                        <p className="font-semibold text-gray-800">{item.worker_name}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Order ID</span>
                        </div>
                        <span className="font-medium text-gray-800">#{item.order_id}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">Earning</span>
                        </div>
                        <span className="font-bold text-lg text-green-600">
                          ₹{parseFloat(item.total_price).toLocaleString()}
                        </span>
                      </div>

                      {/* Status Badge - You can customize based on your actual status field */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">Status</span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.payout_approved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.payout_approved ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleView(item)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Footer with Timestamp - Add if you have timestamp field */}
                  {item.created_at && (
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

       
      </div>

      {/* Modal */}
      <OrderComponentsModal
        order={selectedOrder}
        isOpen={modalOpen}
        payment={!selectedOrder?.payout_approved ? handlePayment : null}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}