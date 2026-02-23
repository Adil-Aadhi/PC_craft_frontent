import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { FiCopy, FiCheck, FiAlertCircle, FiSmartphone } from "react-icons/fi";
import { BiRupee } from "react-icons/bi";

const WorkerUpiCard = () => {
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    const fetchUpi = async () => {
      try {
        const res = await api.get("/workers/profile/kyc/payout/");
        setUpi(res.data.upi_id || "");
      } catch (err) {
        console.error("Failed to fetch UPI", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpi();
  }, []);

  const handleCopy = async () => {
    if (!upi) return;
    
    try {
      await navigator.clipboard.writeText(upi);
      setCopied(true);
      setCopyError(false);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  };

  // Format UPI ID to show masked version (optional - you can remove if not needed)
  const formatUpiDisplay = (upiId) => {
    if (!upiId) return "";
    if (upiId.length > 15) {
      const parts = upiId.split('@');
      if (parts.length === 2) {
        const maskedName = parts[0].substring(0, 3) + '***' + parts[0].slice(-2);
        return `${maskedName}@${parts[1]}`;
      }
    }
    return upiId;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Header with gradient */}
      <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg shadow-sm ring-1 ring-purple-100">
            <FiSmartphone className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">UPI Payment Details</h4>
            <p className="text-xs text-gray-500 mt-0.5">Receive payments directly to UPI</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <BiRupee className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              UPI ID
            </span>
          </div>
          
          {/* Verification badge (optional - based on your data) */}
          {upi && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
              Verified
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2 mt-2 animate-pulse"></div>
            </div>
          </div>
        ) : upi ? (
          <div className="space-y-3">
            {/* UPI Display */}
            <div className="group relative">
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl px-4 py-3.5 group-hover:border-purple-200 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                    <span className="text-sm font-bold text-purple-600">@</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-mono font-medium text-gray-800 break-all block">
                      {formatUpiDisplay(upi)}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      UPI ID
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className={`relative p-2.5 rounded-lg transition-all ${
                    copied 
                      ? 'bg-green-50 text-green-600' 
                      : copyError 
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                  title={copied ? "Copied!" : copyError ? "Copy failed" : "Copy UPI ID"}
                >
                  {copied ? (
                    <FiCheck size={16} className="animate-in zoom-in" />
                  ) : (
                    <FiCopy size={16} />
                  )}
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {copied ? 'Copied!' : copyError ? 'Failed to copy' : 'Copy to clipboard'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <FiAlertCircle className="w-3.5 h-3.5" />
                <span>Payments are processed instantly</span>
              </div>
              
              <button 
                onClick={handleCopy}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline transition-all"
              >
                Copy ID
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FiSmartphone className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-medium">No UPI ID added yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
              Add your UPI ID to start receiving payments directly
            </p>
            
            {/* Placeholder for add UPI button - you can implement this */}
            <button className="mt-4 text-xs px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
              + Add UPI ID
            </button>
          </div>
        )}
      </div>

      {/* Footer with payment partners (optional) */}
      {upi && (
        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Accepted UPI apps</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">Google Pay</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 font-medium">PhonePe</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 font-medium">Paytm</span>
            </div>
          </div>
        </div>
      )}

      {/* Copy success/failure toast notification */}
      {(copied || copyError) && (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
          copied ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        } animate-in slide-in-from-bottom-5 duration-300`}>
          {copied ? (
            <>
              <FiCheck className="w-4 h-4" />
              <span className="text-sm">UPI ID copied to clipboard!</span>
            </>
          ) : (
            <>
              <FiAlertCircle className="w-4 h-4" />
              <span className="text-sm">Failed to copy UPI ID</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerUpiCard;