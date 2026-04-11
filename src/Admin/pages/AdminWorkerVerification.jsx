import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Mail, Briefcase, Clock, DollarSign,ChevronRight,Eye,Users} from "lucide-react";
import api from "../../api/axios";
import { WorkerKYCModalVerification } from "../components/AdminKycVerificationModal";

export default function WorkerVerification() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const fetchWorkers = async () => {
    try {
      const res = await api.get("admin/workers/pending/");
      setWorkers(res.data);
    } catch (error) {
      console.error("Failed to fetch workers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const approveWorker = async (id, status) => {
    try {
      await api.patch(`admin/workers/${id}/kyc-update/`, {
        kyc_status: status,
      });
      setWorkers(workers.filter((w) => w.id !== id));
      setSelectedWorker(null);
    } catch (error) {
      console.error("Failed to update worker KYC", error);
    }
  };

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
          <p className="text-gray-600 font-medium">Loading workers...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="ms-3 me-3">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center justify-between"
          >

            {/* Left Side - Title */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Worker Verification
              </h1>

              <p className="text-gray-600 mt-2">
                Review and verify pending KYC submissions
              </p>
            </div>

            {/* Bigger Card */}
              <div className="bg-white shadow-lg rounded-xl px-6 py-4 flex items-center space-x-4 border">

                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Pending Workers</p>

                  <p className="text-2xl font-bold text-gray-800">
                    {workers.length}
                  </p>
                </div>
              </div>

          </motion.div>

        {workers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending workers to verify at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {workers.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {worker.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{worker.username}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {worker.email}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        worker.kyc_status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : worker.kyc_status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {worker.kyc_status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Skills:</span> 
                        <span className="ml-1 truncate">{worker.skills}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Experience:</span> 
                        <span className="ml-1">{worker.experience_years} years</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Hourly Rate:</span> 
                        <span className="ml-1">${worker.hourly_rate}</span>
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedWorker(worker)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View KYC Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <WorkerKYCModalVerification
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onApprove={approveWorker}
        />
      </div>
    </div>
  );
}