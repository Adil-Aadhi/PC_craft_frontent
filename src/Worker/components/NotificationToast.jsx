import { Bell } from "lucide-react";

const NotificationToast = ({ title, body }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
        <Bell/>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-sm text-gray-900 dark:text-white">
          {title}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {body}
        </span>
      </div>
    </div>
  );
};

export default NotificationToast