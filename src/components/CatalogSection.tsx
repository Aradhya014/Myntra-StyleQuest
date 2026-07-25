import React, { useState, useMemo } from "react";
import { Heart, Bookmark, Star, MessageSquarePlus, Eye, ShoppingBag, X, UserPlus, Check, PackageSearch, Search } from "lucide-react";
import { Product, ProductReview } from "../types";
import { mockCatalog } from "../data/catalog";

interface CatalogProps {
  wishlist: string[]; // productIds
  likes: string[]; // productIds
  followedBrands?: string[];
  searchQuery?: string;
  onClearSearch?: () => void;
  onToggleLike: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onExploreProduct: (productId: string) => void;
  onOpenReviewModal: (product: Product) => void;
  onFollowBrand?: (brandName: string) => void;
  preSelectedCategory?: string | null;
  preSelectedBrand?: string | null;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded font-bold px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function CatalogSection({
  wishlist,
  likes,
  followedBrands = [],
  searchQuery = "",
  onClearSearch,
  onToggleLike,
  onToggleWishlist,
  onExploreProduct,
  onOpenReviewModal,
  onFollowBrand,
  preSelectedCategory,
  preSelectedBrand
}: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(preSelectedCategory || "All");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(preSelectedBrand || null);
  const [activeDetailsProduct, setActiveDetailsProduct] = useState<Product | null>(null);

  const categories = ["All", "Sneakers", "Indian Wear", "Western Wear", "Accessories"];

  // Memoized filter logic combining Category, Brand, and Search Query
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockCatalog.filter(p => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesBrand = !selectedBrand || p.brand === selectedBrand;
      const matchesSearch = !q || (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
      return matchesCategory && matchesBrand && matchesSearch;
    });
  }, [selectedCategory, selectedBrand, searchQuery]);

  const handleProductExplore = (product: Product) => {
    setActiveDetailsProduct(product);
    onExploreProduct(product.id);
  };

  const handleResetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand(null);
    if (onClearSearch) onClearSearch();
  };

  return (
    <div id="catalog-section" className="space-y-6 animate-fade-in">
      
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-display font-black text-gray-800 flex items-center space-x-2">
            <span>Myntra Fashion Studio</span>
            {searchQuery && (
              <span className="text-xs font-mono font-normal bg-pink-50 text-myntra-pink border border-pink-100 px-2.5 py-0.5 rounded-full">
                Searching: "{searchQuery}"
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500">
            Explore premium designs, like your favorites, follow brands, or submit reviews to complete daily quests.
          </p>
        </div>

        {/* Categories Selector & Active Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedBrand(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-myntra-pink text-white shadow-md shadow-pink-100"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}

          {selectedBrand && (
            <button
              onClick={() => setSelectedBrand(null)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all bg-myntra-pink text-white shadow-md shadow-pink-100 cursor-pointer flex items-center space-x-1"
              title="Clear brand filter"
            >
              <span>{selectedBrand}</span>
              <X className="h-3 w-3" />
            </button>
          )}

          {searchQuery && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-3 py-2 rounded-full text-xs font-bold transition-all bg-gray-900 hover:bg-black text-white cursor-pointer flex items-center space-x-1 shadow-sm"
              title="Clear search query"
            >
              <Search className="h-3 w-3 mr-0.5" />
              <span>"{searchQuery}"</span>
              <X className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Product Grid or Modern Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isLiked = likes.includes(product.id);
            const isWishlisted = wishlist.includes(product.id);
            const isBrandFollowed = followedBrands.includes(product.brand);
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div 
                key={product.id}
                className="group glass-card-light rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:scale-[1.01] hover:border-white/100"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-4/5 overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                  />

                  {/* Rating overlay badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md flex items-center space-x-1 text-[11px] font-bold text-gray-800 shadow-sm">
                    <span>{product.rating}</span>
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  </div>

                  {/* Like floating button */}
                  <button
                    onClick={() => onToggleLike(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all cursor-pointer ${
                      isLiked 
                        ? "bg-pink-50 text-myntra-pink scale-110" 
                        : "bg-white/80 hover:bg-white text-gray-600 hover:text-myntra-pink"
                    }`}
                    title={isLiked ? "Unlike product" : "Like product"}
                  >
                    <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-myntra-pink text-myntra-pink" : ""}`} />
                  </button>

                  {/* Wishlist floating button */}
                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className={`absolute top-14 right-3 p-2 rounded-full shadow-sm transition-all cursor-pointer ${
                      isWishlisted 
                        ? "bg-orange-50 text-myntra-orange scale-110" 
                        : "bg-white/80 hover:bg-white text-gray-600 hover:text-myntra-orange"
                    }`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Bookmark className={`h-4.5 w-4.5 ${isWishlisted ? "fill-myntra-orange text-myntra-orange" : ""}`} />
                  </button>
                </div>

                {/* Product Info Block */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-display font-extrabold text-[13px] text-gray-800 uppercase tracking-wide">
                        <HighlightText text={product.brand} query={searchQuery} />
                      </span>
                      {onFollowBrand && (
                        <button
                          onClick={() => onFollowBrand(product.brand)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
                            isBrandFollowed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-pink-50 hover:bg-myntra-pink text-myntra-pink hover:text-white border border-pink-100"
                          }`}
                          title={isBrandFollowed ? `Following ${product.brand}` : `Follow ${product.brand}`}
                        >
                          {isBrandFollowed ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-3 w-3" />
                              <span>+ Follow</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <h3 className="text-xs text-gray-500 line-clamp-1 mt-0.5" title={product.name}>
                      <HighlightText text={product.name} query={searchQuery} />
                    </h3>

                    {/* Pricing line */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-mono font-bold text-gray-800">Rs. {product.price}</span>
                      <span className="text-xs font-mono text-gray-400 line-through">Rs. {product.originalPrice}</span>
                      <span className="text-xs font-bold text-myntra-orange">({discount}% OFF)</span>
                    </div>
                  </div>

                  {/* Interactive Actions footer */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50 mt-3">
                    <button
                      onClick={() => handleProductExplore(product)}
                      className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-myntra-pink" />
                      <span>Explore</span>
                    </button>
                    <button
                      onClick={() => onOpenReviewModal(product)}
                      className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 bg-gray-900 hover:bg-black text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5 text-orange-400" />
                      <span>Review AI</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Modern Empty State */
        <div className="glass-card-light rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto border border-gray-150 animate-scale-up">
          <div className="h-16 w-16 bg-pink-50 text-myntra-pink rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-pink-100">
            <PackageSearch className="h-8 w-8 text-myntra-pink" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-black text-gray-800">
              No matching products found.
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Try searching for another product or brand.
            </p>
          </div>
          <button
            onClick={handleResetAllFilters}
            className="inline-flex items-center justify-center bg-[#FF3F6C] hover:bg-[#E63960] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-pink-100 cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

      {/* Product Detail & Exploration Modal */}
      {activeDetailsProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-scale-up">
            
            <button 
              onClick={() => setActiveDetailsProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 z-10 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left Column Image */}
            <div className="md:w-1/2 bg-gray-50 h-64 md:h-auto">
              <img
                src={activeDetailsProduct.image}
                alt={activeDetailsProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Column Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="bg-pink-50 text-myntra-pink text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    Quest Explored ✓
                  </span>
                  {onFollowBrand && (
                    <button
                      onClick={() => onFollowBrand(activeDetailsProduct.brand)}
                      className={`text-xs font-bold px-3 py-1 rounded-full transition-all cursor-pointer flex items-center space-x-1 ${
                        followedBrands.includes(activeDetailsProduct.brand)
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-myntra-pink text-white shadow-xs"
                      }`}
                    >
                      {followedBrands.includes(activeDetailsProduct.brand) ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>+ Follow {activeDetailsProduct.brand}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <h3 className="text-xl font-display font-black text-gray-800 mt-2 uppercase tracking-wide">
                  <HighlightText text={activeDetailsProduct.brand} query={searchQuery} />
                </h3>
                <p className="text-sm text-gray-600">
                  <HighlightText text={activeDetailsProduct.name} query={searchQuery} />
                </p>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mt-2 text-xs font-bold text-gray-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{activeDetailsProduct.rating} / 5 Rating</span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mt-4">
                  <HighlightText text={activeDetailsProduct.description} query={searchQuery} />
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-semibold text-gray-500">Price</span>
                  <span className="text-xl font-mono font-bold text-myntra-pink">Rs. {activeDetailsProduct.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onToggleWishlist(activeDetailsProduct.id);
                      setActiveDetailsProduct(null);
                    }}
                    className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-myntra-orange font-bold text-xs rounded-xl border border-orange-100 uppercase transition-all cursor-pointer"
                  >
                    {wishlist.includes(activeDetailsProduct.id) ? "Wishlisted ✓" : "Add Wishlist"}
                  </button>
                  <button
                    onClick={() => {
                      onToggleLike(activeDetailsProduct.id);
                      setActiveDetailsProduct(null);
                    }}
                    className="w-full py-2 bg-pink-50 hover:bg-pink-100 text-myntra-pink font-bold text-xs rounded-xl border border-pink-100 uppercase transition-all cursor-pointer"
                  >
                    {likes.includes(activeDetailsProduct.id) ? "Liked ✓" : "Like Item"}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
