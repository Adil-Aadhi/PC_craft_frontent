const SkeletonBox = ({ className }) => (
  <div
    className={`relative overflow-hidden rounded-lg bg-gray-800/40 ${className}`}
  >
    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

const LeftPanelSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      <SkeletonBox className="h-6 w-32" />

      {/* category tabs */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBox key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>

      {/* search */}
      <SkeletonBox className="h-10 w-full" />

      {/* list items */}
      <div className="space-y-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export default LeftPanelSkeleton;