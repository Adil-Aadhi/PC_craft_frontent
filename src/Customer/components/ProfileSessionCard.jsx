import { FiMonitor } from "react-icons/fi";

const SessionsCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FiMonitor /> Active Sessions
      </h2>

      <div className="flex justify-between p-3 rounded-lg bg-slate-50 border mb-2">
        <span>Chrome • Windows</span>
        <span className="text-xs text-slate-500">Just now</span>
      </div>

      <div className="flex justify-between p-3 rounded-lg bg-slate-50 border">
        <span>Mobile • Android</span>
        <span className="text-xs text-slate-500">2 days ago</span>
      </div>
    </div>
  );
};

export default SessionsCard;
