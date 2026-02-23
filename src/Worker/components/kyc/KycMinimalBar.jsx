const KycLinearProgress = ({ progress }) => {
  return (
    <div className="w-full mb-5">
      
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          KYC Progress
        </span>
        <span
          className={`text-sm font-semibold ${
            progress === 100 ? "text-green-600" : "text-blue-600"
          }`}
        >
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full transition-all duration-700 rounded-full"
          style={{
            width: `${progress}%`,
            background:
              progress === 100
                ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
          }}
        />
      </div>

      {/* Optional small text */}
      <p className="text-xs text-gray-500 mt-1">
        {progress === 100
          ? "KYC completed"
          : `${100 - progress}% remaining`}
      </p>
    </div>
  );
};

export default KycLinearProgress;