import { motion } from "framer-motion";

const SkeletonBox = ({ className }) => (
  <div
    className={`relative overflow-hidden rounded-lg bg-gray-800/40 ${className}`}
  >
    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

const PCBuilderLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="h-8 w-48" />
        <SkeletonBox className="h-8 w-8 rounded-lg" />
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* LEFT PANEL */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10 p-4 space-y-4">
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

        {/* CENTER PREVIEW */}
        <div className="col-span-6 bg-gray-900/70 rounded-2xl border border-cyan-500/10 p-6 space-y-4">
          <SkeletonBox className="h-6 w-40" />
          <SkeletonBox className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBox key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* RIGHT CART */}
        <div className="col-span-3 bg-gray-900/70 rounded-2xl border border-cyan-500/10 p-4 space-y-4">
          <SkeletonBox className="h-6 w-32" />
          <SkeletonBox className="h-4 w-24" />

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBox key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>

          <SkeletonBox className="h-24 w-full rounded-xl" />
          <SkeletonBox className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default PCBuilderLoader;