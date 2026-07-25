import React, { useState } from "react";
import { Star, X, Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Product, ProductReview } from "../types";

interface ReviewModalProps {
  product: Product | null;
  onClose: () => void;
  onSubmitReview: (productId: string, rating: number, text: string) => Promise<{ success: boolean; review: ProductReview }>;
}

export default function ReviewModal({
  product,
  onClose,
  onSubmitReview
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductReview | null>(null);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewText.trim().length < 5) return;

    setLoading(true);
    try {
      const res = await onSubmitReview(product.id, rating, reviewText);
      setResult(res.review);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    setRating(5);
    setReviewText("");
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-panel rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative animate-scale-up">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/60 bg-white/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4.5 w-4.5 text-myntra-pink" />
            <h3 className="text-sm font-display font-black text-gray-800 uppercase tracking-wider">AI Quality Review</h3>
          </div>
          {!loading && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/40 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Brief */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded-lg" />
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide leading-none">{product.brand}</span>
                  <p className="text-xs font-bold text-gray-800 leading-normal mt-0.5">{product.name}</p>
                </div>
              </div>

              {/* Star Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Product Rating</label>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-gray-300 hover:text-amber-400 transition-colors"
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-200"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea review */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Your Review Comments</label>
                  <span className="text-[10px] text-gray-400">Min 15 chars</span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about fit, design fabric quality, look, style, and sizing..."
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-myntra-pink focus:border-myntra-pink bg-white leading-relaxed"
                />
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                disabled={loading || reviewText.trim().length < 5}
                className="w-full flex items-center justify-center bg-[#FF3F6C] hover:bg-[#E63960] text-white text-xs font-bold tracking-wider uppercase py-3 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-pink-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    AI Analyzing Quality...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                    Submit & Verify
                  </>
                )}
              </button>

            </form>
          ) : (
            // Results screen
            <div className="space-y-6 text-center py-4">
              
              {result.status === "verified" ? (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold text-gray-800">Genuine Review Approved!</h4>
                    <p className="text-xs text-gray-500">Your points and daily mission rewards have been synced successfully.</p>
                  </div>

                  {/* AI Feedback */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-green-700">Gemini AI Audit Result</span>
                    <p className="text-xs text-green-800 leading-relaxed font-semibold">{result.aiAnalysis}</p>
                    <span className="inline-block text-[10px] font-mono text-yellow-600 font-bold mt-1">🪙 Awarded +20 Sparks Points</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <AlertTriangle className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold text-gray-800">Review Rejected as Spam</h4>
                    <p className="text-xs text-gray-500">Our NLP filter flagged the review text as incomplete or artificial.</p>
                  </div>

                  {/* AI Feedback */}
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-left space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-rose-700">Gemini AI Reason</span>
                    <p className="text-xs text-rose-800 leading-relaxed font-semibold">{result.aiAnalysis}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleDone}
                className="w-full py-2.5 bg-[#FF3F6C] hover:bg-[#E63960] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-pink-100 cursor-pointer"
              >
                Return to Shop
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
