import React from "react";
import { Star, Sparkles, X, CheckCircle2, ChevronRight, TrendingUp, Compass, Loader2 } from "lucide-react";
import { BrandInsiderData, Product } from "../types";

interface BrandInsiderModalProps {
  data: BrandInsiderData | null;
  loading: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectBrand: (brandName: string) => void;
}

export default function BrandInsiderModal({
  data,
  loading,
  onClose,
  onSelectProduct,
  onSelectBrand
}: BrandInsiderModalProps) {
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="glass-panel rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="h-16 w-16 bg-pink-100 text-myntra-pink rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-display font-bold text-gray-800">Unlocking Brand Insider AI...</h3>
          <p className="text-xs text-gray-500">Gemini AI is picking personalized catalog recommendations & trend insights...</p>
          <div className="flex items-center justify-center space-x-2 text-xs font-mono text-myntra-pink">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing style match...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-panel rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative animate-scale-up max-h-[90vh]">
        
        {/* Header */}
        <div className="relative bg-gradient-myntra p-6 text-white overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ⭐ Brand Insider Complete!
              </span>
              <span className="bg-yellow-400 text-gray-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center shadow-xs">
                <Sparkles className="h-3 w-3 mr-1 fill-gray-900" />
                +{data.sparksEarned} Sparks
              </span>
            </div>
            <h2 className="text-2xl font-display font-black tracking-tight">
              AI recommendations for {data.brandName}
            </h2>
            <p className="text-xs text-white/90">
              You followed <span className="font-bold text-yellow-300">{data.brandName}</span>! Our AI stylist curated these personalized picks based on your fashion preferences.
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* AI Recommended Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-extrabold text-gray-800 uppercase tracking-wider flex items-center">
                <Sparkles className="h-4 w-4 text-myntra-pink mr-1.5" />
                AI Picked These Just For You
              </h3>
              <span className="text-[10px] font-mono text-gray-400">3 Top Matches</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.recommendedProducts.map(({ product, reason }) => (
                <div 
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group glass-card-light rounded-2xl p-3 border border-gray-100 hover:border-myntra-pink/50 cursor-pointer transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-gray-50">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-800 flex items-center shadow-xs">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5" />
                        {product.rating}
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono font-bold text-gray-400 uppercase">{product.brand}</span>
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-myntra-pink transition-colors">{product.name}</h4>
                      <p className="text-xs font-mono font-bold text-myntra-pink mt-0.5">Rs. {product.price}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 bg-pink-50/50 rounded-lg p-2 text-[10px] text-pink-800 leading-tight italic">
                    💡 <span className="font-semibold">{reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fashion Trend Insights */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100 space-y-1.5 shadow-inner">
            <div className="flex items-center space-x-1.5 text-purple-700">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Fashion Trend Insights</span>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed font-medium">
              {data.trendInsight}
            </p>
          </div>

          {/* Similar Brands to Explore */}
          {data.similarBrands && data.similarBrands.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-gray-700">
                <Compass className="h-4 w-4 text-myntra-orange" />
                <span className="text-xs font-display font-bold uppercase tracking-wider">Explore Similar Brands</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.similarBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => onSelectBrand(brand)}
                    className="bg-gray-50 hover:bg-myntra-pink hover:text-white border border-gray-200 text-gray-700 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    + Follow {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#FF3F6C] hover:bg-[#E63960] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-pink-100 cursor-pointer"
          >
            Explore Brand Collection
          </button>
        </div>

      </div>
    </div>
  );
}
