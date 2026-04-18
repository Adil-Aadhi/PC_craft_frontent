import { 
  X, CheckCircle, XCircle, User, Mail, Briefcase, Award, CreditCard,Shield,Eye,Phone,Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function WorkerKYCModalVerification({ worker, onClose, onApprove }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!worker) return null;

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(worker.id, 'approved');
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onApprove(worker.id, 'rejected');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {worker && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <h2 className="text-base md:text-xl font-bold text-gray-800">KYC Verification Details</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Worker Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">Username</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800">{worker.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800 break-all">{worker.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">Skills</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800">{worker.skills}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Award className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">Experience</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800">{worker.experience_years} years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">Contact</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800">{worker.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-600">DOB</p>
                        <p className="font-semibold text-xs md:text-base text-gray-800">{worker.date_of_birth || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* KYC Details */}
                {worker.kyc_details && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                      <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                      KYC Information
                    </h3>
                    
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 mb-3 md:mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <p className="text-[10px] md:text-sm text-gray-600">ID Type</p>
                          <p className="font-medium text-xs md:text-base text-gray-800 capitalize">{worker.kyc_details.id_type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-sm text-gray-600">ID Number</p>
                          <p className="font-medium text-xs md:text-base text-gray-800">{worker.kyc_details.id_number}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-sm text-gray-600">Submitted On</p>
                          <p className="font-medium text-xs md:text-base text-gray-800">
                            {new Date(worker.kyc_details.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ID Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {worker.kyc_details.id_front_url && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative group"
                        >
                          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4">
                            <p className="text-[10px] md:text-sm font-medium text-gray-700 mb-2">Front ID</p>
                            <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gray-100">
                              <img 
                                src={worker.kyc_details.id_front_url} 
                                alt="ID Front"
                                className="w-full h-32 md:h-48 object-cover cursor-pointer"
                                onClick={() => setImagePreview(worker.kyc_details.id_front_url)}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-6 h-6 md:w-8 md:h-8 text-white" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {worker.kyc_details.id_back_url && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative group"
                        >
                          <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4">
                            <p className="text-[10px] md:text-sm font-medium text-gray-700 mb-2">Back ID</p>
                            <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gray-100">
                              <img 
                                src={worker.kyc_details.id_back_url} 
                                alt="ID Back"
                                className="w-full h-32 md:h-48 object-cover cursor-pointer"
                                onClick={() => setImagePreview(worker.kyc_details.id_back_url)}
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-6 h-6 md:w-8 md:h-8 text-white" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {!worker.kyc_details.id_back_url && (
                        <motion.div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4">
                          <p className="text-[10px] md:text-sm font-medium text-gray-700 mb-2">Back ID</p>
                          <div className="h-32 md:h-48 rounded-lg md:rounded-xl bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-400 text-xs md:text-base">No back image provided</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-2 md:gap-3 py-1 pt-4 border-t border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base font-medium flex items-center justify-center space-x-2 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Approve KYC</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReject}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base font-medium flex items-center justify-center space-x-2 hover:from-red-600 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Reject KYC</span>
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Image Preview Modal */}
          <AnimatePresence>
            {imagePreview && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setImagePreview(null)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                >
                  <div className="relative max-w-4xl max-h-[90vh]">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-full h-full object-contain rounded-2xl"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setImagePreview(null)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}