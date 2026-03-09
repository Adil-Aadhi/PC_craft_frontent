import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { openComponentModal } from "../../Customer/Build/redux/components/componentModalSlice";
import ComponentModal from "../../Customer/Build/components/details modal/ComponentModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateOrderStatus } from "../../orders/services/orderService";

export default function WorkerProjectDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const componentKeys = [
    "cpu",
    "motherboard",
    "ram",
    "gpu",
    "psu",
    "cooler",
    "storage",
    "case",
    "case_fan",
  ];

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/worker-project/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);


  const startBuild = async (statusValue) => {
    const success= await  updateOrderStatus(order.order_id,statusValue)
    if (success){
      toast.success("Build started!");
      navigate(`/worker/execution/${order.order_id}`);
    }
    else{
      toast.error("Something is wrong")
    }
  };


  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    return status?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Project</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Not Found</h3>
          <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const build = order.build || {};
  const componentData = {
    cpu: { items: build.cpu ? [build.cpu] : [] },
    motherboard: { items: build.motherboard ? [build.motherboard] : [] },
    ram: { items: build.ram ? [build.ram] : [] },
    gpu: { items: build.gpu ? [build.gpu] : [] },
    psu: { items: build.psu ? [build.psu] : [] },
    cooler: { items: build.cooler ? [build.cooler] : [] },
    storage: { items: build.storage ? [build.storage] : [] },
    case: { items: build.case ? [build.case] : [] },
    case_fan: { items: build.case_fan ? [build.case_fan] : [] },
    };
  const canStartBuild = order.status === "CONFIRMED";
  const canViewBuild = order.status === "BUILD_IN_PROGRESS" || order.status === "COMPLETED";

  return (
    <div className=" -50 py-8 px-4 sm:px-6 lg:px-8">
      <div >
         {/* Back Button */}
        <div className="mt-5 mb-5">
          <button
            onClick={() => window.history.back()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Projects
          </button>
        </div>
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {build.build_name || 'Untitled Build'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
              </div>
              <p className="text-md text-gray-800 mb-4">
                Client: {order.username}
              </p>
              <p className="text-sm text-gray-500">
                OrderID: {order.order_id}
              </p>
            </div>

            {canStartBuild && (
              <button
                onClick={()=>startBuild("BUILD_IN_PROGRESS")}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Starting..." : "Start Project"}
              </button>
            )}

            {canViewBuild && (
              <button
                onClick={()=>navigate(`/worker/execution/${order.order_id}`)}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Project
              </button>
            )}
          </div>
        </div>

        {/* Compatibility Warning */}
        {build.is_compatible === false && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              ⚠ {build.compatibility_notes || "Compatibility issues detected"}
            </p>
          </div>
        )}

        {/* Components List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Components</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {componentKeys.map((key) => {
              const part = build?.[key];

              return (
                <div key={key} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    {part ? (
                      <p className="text-sm text-gray-600 mt-0.5">{part.name}</p>
                    ) : (
                      <p className="text-sm text-gray-400 mt-0.5">Not selected</p>
                    )}
                  </div>
                  
                  {part && (
                    <button
                      onClick={() =>
                        dispatch(
                            openComponentModal({
                            category: key,
                            componentId: part.id,
                            })
                        )
                        }
                      className="ml-4 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      View Details →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

       
        <ComponentModal componentData={componentData} />
      </div>
    </div>
  );
}