const KycProgressBar = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm text-gray-500">
        <span>KYC Progress</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default KycProgressBar;
