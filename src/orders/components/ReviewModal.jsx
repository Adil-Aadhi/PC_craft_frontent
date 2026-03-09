import { useState } from "react";
import api from "../../api/axios";
import { X, Star, Send, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function ReviewModal({ order, onClose , onReviewSuccess  }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warning("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/orders/rating/create/", {
        order: order.id,
        rating: rating,
        review_text: text
      });

      toast.success("Review submitted successfully!");

      if (onReviewSuccess) {
        onReviewSuccess();
    }

      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingMessages = {
    1: { text: "Poor", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
    2: { text: "Fair", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
    3: { text: "Good", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
    4: { text: "Very Good", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
    5: { text: "Excellent", color: "text-green-500", bg: "bg-green-50", border: "border-green-200" }
  };

  const currentRating = ratingMessages[rating];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

        {/* Header gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

        {/* Header */}
        <div className="relative px-6 pt-8 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-400 hover:text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-3 rounded-xl shadow-lg">
              <MessageSquare size={24} className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Rate Your Experience
              </h2>
              <p className="text-sm text-gray-500">
                Help us improve by sharing your feedback
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Order info */}
          {order && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">
                Order #{order.order_id}
              </p>

              <p className="text-sm font-medium text-gray-700">
                Service: {order.build.build_name || "Custom PC Build"}
              </p>
            </div>
          )}

          {/* Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Your Rating *
            </label>

            <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">

              {/* Stars */}
              <div className="flex gap-2">
                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer transition-all duration-200 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400 scale-110"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Rating label */}
              {rating > 0 && (
                <div className={`px-4 py-2 rounded-full ${currentRating.bg} border ${currentRating.border}`}>
                  <span className={`text-sm font-medium ${currentRating.color}`}>
                    {currentRating.text}
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* Review */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Write Your Review (optional)
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Share your experience..."
              className="w-full mt-2 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none text-dark"
            />

            <div className="text-xs text-gray-400 text-right mt-1">
              {text.length}/500
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border bg-gray-500 border-gray-200 rounded-xl hover:bg-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`flex-1 px-4 py-3 rounded-xl text-white flex items-center justify-center gap-2 ${
                isSubmitting || rating === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Review
                </>
              )}
            </button>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle size={12} />
          Your feedback helps us maintain quality service
        </div>

      </div>
    </div>
  );
}