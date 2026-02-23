const steps = [
  "Basic Details",
  "Worker Details",
  "Identity",
  "UPI",
];

const KycProgressBar = ({ step, progress }) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-5 border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800">KYC Progress</h3>
        <span
          className={`text-sm font-semibold ${
            progress === 100 ? "text-green-600" : "text-blue-600"
          }`}
        >
          {progress}%
        </span>
      </div>

      {/* Percentage Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background:
              progress === 100
                ? "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)"
                : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
          }}
        />
      </div>

      {/* Stepper */}
      <div className="flex items-center">
          {steps.map((label, index) => {
            const isCompleted = step > index;
            const isCurrent = step === index;

            return (
              <div key={index} className="flex items-center flex-1">
                
                {/* Circle + label */}
                <div className="flex flex-col items-center min-w-[60px]">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 z-10
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isCurrent
                          ? "border-blue-500 text-blue-500"
                          : "border-gray-300 text-gray-400"
                      }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                          0l-4-4a1 1 0 011.414-1.414L8 
                          12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  <p
                    className={`text-xs mt-2 text-center ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                        ? "text-blue-600 font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {label}
                  </p>
                </div>

                {/* Connector line (only between steps) */}
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 rounded bg-gray-200">
                    <div
                      className={`h-1 rounded ${
                        step > index ? "bg-green-500" : "bg-gray-200"
                      }`}
                      style={{
                        width: step > index ? "100%" : "0%",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      {/* Bottom text */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        {progress === 100
          ? "KYC verification completed 🎉"
          : `${100 - progress}% remaining to complete KYC`}
      </p>
    </div>
  );
};

export default KycProgressBar;