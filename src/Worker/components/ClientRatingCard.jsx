import { motion } from "framer-motion";

const ClientRatingCard = ({
  rating = 0,
  totalReviews = 0,
  ratingCounts = {}
}) => {

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      } else if (hasHalfStar && i === fullStars + 1) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="#D1D5DB"/>
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      }
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 h-full"
    >

      <div className="relative z-10">

        <div className="flex items-center justify-between mb-4">

          <div className="p-2 bg-white/20 rounded-xl">⭐</div>

          <div className="px-2 py-1 bg-white/20 rounded-full">
            <span className="text-xs text-white font-medium">
              {totalReviews} reviews
            </span>
          </div>

        </div>

        <p className="text-sm font-medium text-white/80 mb-1">
          Client Rating
        </p>

        <div className="flex items-end gap-3 mb-4">

          <p className="text-4xl font-bold text-white">
            {rating}
          </p>

          <div className="flex mb-1">
            {renderStars(rating)}
          </div>

        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">

          {[5,4,3,2,1].map((star) => {

            const count = ratingCounts?.[star] || 0;
            const percent = totalReviews
              ? (count / totalReviews) * 100
              : 0;

            return (
              <div key={star} className="flex items-center gap-2">

                <span className="text-xs text-white w-8">
                  {star}★
                </span>

                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-yellow-400"
                  />

                </div>

                <span className="text-xs text-white/80 w-6 text-right">
                  {count}
                </span>

              </div>
            );

          })}

        </div>

      </div>

    </motion.div>
  );
};

export default ClientRatingCard;