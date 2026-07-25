import React, { useState, useRef, useEffect, useMemo } from "react";
import { Flame, Coins, Search, Heart, Bookmark, User, Crown, HelpCircle, X, Clock, Trash2, Tag, Grid, ShoppingBag } from "lucide-react";
import { UserProfile } from "../types";
import { mockCatalog } from "../data/catalog";

interface HeaderProps {
  profile: UserProfile;
  wishlistCount: number;
  likesCount: number;
  onNavigate: (tab: "quest" | "catalog" | "mixmatch" | "redeem") => void;
  activeTab: string;
  onOpenPlayground: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  onExecuteSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  onRemoveRecentSearch: (query: string) => void;
}

export default function MyntraHeader({
  profile,
  wishlistCount,
  likesCount,
  onNavigate,
  activeTab,
  onOpenPlayground,
  searchQuery,
  setSearchQuery,
  recentSearches,
  onExecuteSearch,
  onClearRecentSearches,
  onRemoveRecentSearch
}: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute live suggestions (Brands, Categories, and Product Names matching searchQuery)
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const items: { label: string; type: "brand" | "category" | "product"; subtext?: string }[] = [];
    const seen = new Set<string>();

    // 1. Categories
    const categories = ["Sneakers", "Indian Wear", "Western Wear", "Accessories"];
    categories.forEach(cat => {
      if (cat.toLowerCase().includes(q) && !seen.has(cat)) {
        seen.add(cat);
        items.push({ label: cat, type: "category", subtext: "Category" });
      }
    });

    // 2. Brands
    const brands = Array.from(new Set(mockCatalog.map(p => p.brand)));
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(q) && !seen.has(brand)) {
        seen.add(brand);
        items.push({ label: brand, type: "brand", subtext: "Brand" });
      }
    });

    // 3. Products
    mockCatalog.forEach(p => {
      if (
        (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
        !seen.has(p.name)
      ) {
        seen.add(p.name);
        items.push({ label: p.name, type: "product", subtext: `${p.brand} · ${p.category}` });
      }
    });

    return items.slice(0, 6);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (activeTab !== "catalog") {
      onNavigate("catalog");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        onExecuteSearch(searchQuery.trim());
      }
      setIsFocused(false);
      if (activeTab !== "catalog") {
        onNavigate("catalog");
      }
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setIsFocused(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    onExecuteSearch(text);
    setIsFocused(false);
    if (activeTab !== "catalog") {
      onNavigate("catalog");
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <header id="myntra-main-header" className="sticky top-0 z-40 backdrop-blur-xl bg-white/40 border-b border-white/60 shadow-[0_4px_30px_rgba(255,63,108,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <div 
              onClick={() => onNavigate("quest")}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="relative w-12 h-10 flex items-center justify-center font-display font-black text-2xl tracking-tighter bg-gradient-myntra text-white rounded-xl shadow-md transform group-hover:scale-105 transition-transform">
                M
                <span className="absolute -bottom-1 -right-1 text-[10px] bg-black text-white px-1 py-0.2 rounded-full font-sans tracking-normal font-bold">Q</span>
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-display font-black tracking-wider text-gray-800">Myntra</span>
                <span className="block text-[11px] font-mono tracking-widest text-myntra-pink font-semibold uppercase">Quest 🎮</span>
              </div>
            </div>

            {/* Main Navigation links */}
            <nav className="hidden lg:flex space-x-6 text-[13px] font-bold text-gray-700 tracking-wider uppercase">
              <button 
                onClick={() => onNavigate("quest")}
                className={`hover:text-myntra-pink pb-2 border-b-2 ${activeTab === "quest" ? "border-myntra-pink text-myntra-pink" : "border-transparent"} transition-all cursor-pointer`}
              >
                Missions Dashboard
              </button>
              <button 
                onClick={() => onNavigate("catalog")}
                className={`hover:text-myntra-pink pb-2 border-b-2 ${activeTab === "catalog" ? "border-myntra-pink text-myntra-pink" : "border-transparent"} transition-all cursor-pointer`}
              >
                Fashion Catalog
              </button>
              <button 
                onClick={() => onNavigate("mixmatch")}
                className={`hover:text-myntra-pink pb-2 border-b-2 ${activeTab === "mixmatch" ? "border-myntra-pink text-myntra-pink" : "border-transparent"} transition-all cursor-pointer`}
              >
                Mix & Match 🎨
              </button>
              <button 
                onClick={() => onNavigate("redeem")}
                className={`hover:text-myntra-pink pb-2 border-b-2 ${activeTab === "redeem" ? "border-myntra-pink text-myntra-pink" : "border-transparent"} transition-all cursor-pointer`}
              >
                Redeem Rewards
              </button>
            </nav>
          </div>

          {/* Fully Functional Search Bar Container - ~320px Desktop, ~260px Tablet, Full Mobile */}
          <div className="hidden sm:block w-[260px] md:w-[320px] mx-4 relative shrink-0" ref={dropdownRef}>
            <div className="relative flex items-center h-12">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                <Search className={`h-4.5 w-4.5 transition-colors ${searchQuery ? "text-myntra-pink" : "text-gray-400"}`} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search brands, sneakers, outfits..."
                className="block w-full h-12 pl-10 pr-9 border border-gray-200/90 rounded-2xl bg-gray-50/90 text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-myntra-pink transition-all shadow-xs"
              />

              {/* Clear (×) button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Clear search (Esc)"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Interactive Dropdown (Matches Search Bar Width with 8px Gap) */}
            {isFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 w-full glass-panel bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 py-2.5 z-50 animate-scale-up overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
                {/* 1. Live Typing Suggestions */}
                {searchQuery.trim().length > 0 ? (
                  suggestions.length > 0 ? (
                    <div className="space-y-1">
                      <div className="px-4 py-1 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Search Suggestions</span>
                        <span className="text-[9px] text-gray-300">Press Enter</span>
                      </div>
                      {suggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectSuggestion(item.label)}
                          className="px-4 py-2 hover:bg-pink-50/70 flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            {item.type === "brand" && <Tag className="h-3.5 w-3.5 text-myntra-pink shrink-0" />}
                            {item.type === "category" && <Grid className="h-3.5 w-3.5 text-purple-500 shrink-0" />}
                            {item.type === "product" && <ShoppingBag className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                            <span className="text-xs font-semibold text-gray-800 group-hover:text-myntra-pink transition-colors truncate">
                              {item.label}
                            </span>
                          </div>
                          {item.subtext && (
                            <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">
                              {item.subtext}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-center text-xs text-gray-500">
                      No quick suggestions. Press Enter to search catalog.
                    </div>
                  )
                ) : (
                  /* 2. Recent Searches (Last 5) */
                  recentSearches.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-4 py-1 flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1.5 text-myntra-pink" />
                          Recent Searches
                        </span>
                        <button
                          type="button"
                          onClick={onClearRecentSearches}
                          className="hover:text-myntra-pink transition-colors cursor-pointer text-[9px] lowercase font-sans font-semibold"
                        >
                          Clear All
                        </button>
                      </div>

                      {recentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2 hover:bg-pink-50/60 flex items-center justify-between cursor-pointer transition-colors group"
                        >
                          <div
                            onClick={() => handleSelectSuggestion(term)}
                            className="flex-1 flex items-center space-x-2.5 min-w-0 text-xs font-semibold text-gray-700 group-hover:text-myntra-pink"
                          >
                            <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{term}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveRecentSearch(term);
                            }}
                            className="p-1 text-gray-300 hover:text-gray-600 rounded-full hover:bg-gray-200/50 transition-colors shrink-0 ml-2"
                            title="Remove search"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Gamified Stat badging */}
          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Flame Streak Indicator */}
            <div 
              onClick={() => onNavigate("quest")}
              className="flex items-center bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full border border-orange-100 cursor-pointer transition-all shadow-xs group"
              title="Daily Streak Counter"
            >
              <Flame className="h-5 w-5 fill-orange-500 text-orange-500 animate-pulse mr-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-mono font-bold">{profile.streak} Days</span>
            </div>

            {/* Sparks Balance Indicator */}
            <div 
              onClick={() => onNavigate("redeem")}
              className="flex items-center bg-pink-50 hover:bg-pink-100 text-myntra-pink px-3 py-1.5 rounded-full border border-pink-100 cursor-pointer transition-all shadow-xs group"
              title="Myntra Sparks Balance"
            >
              <Coins className="h-5 w-5 fill-myntra-pink text-myntra-pink mr-1 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-mono font-bold">{profile.sparks} Sparks</span>
            </div>

            {/* Quick action shortcuts */}
            <div className="flex items-center space-x-3 text-gray-600">
              <button 
                onClick={() => onNavigate("catalog")}
                className="relative p-1 hover:text-myntra-pink transition-colors cursor-pointer"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {likesCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-myntra-pink text-[9px] font-bold text-white">
                    {likesCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => onNavigate("catalog")}
                className="relative p-1 hover:text-myntra-pink transition-colors cursor-pointer"
                title="Wishlisted items"
              >
                <Bookmark className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-myntra-orange text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Avatar & badge indicator */}
              <div className="relative group">
                <div className="flex items-center space-x-2 p-1 cursor-pointer">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-8 w-8 rounded-full object-cover border-2 border-myntra-pink shadow-xs"
                  />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-gray-800 leading-none">{profile.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 flex items-center">
                      <Crown className="h-2.5 w-2.5 text-amber-500 fill-amber-500 mr-0.5" />
                      Insider Elite
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset Sandbox Panel */}
              <button
                onClick={onOpenPlayground}
                className="hidden lg:block text-xs text-gray-400 bg-gray-50 border border-gray-100 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md transition-all font-mono cursor-pointer"
              >
                Playground
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <div className="relative flex items-center h-12">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search products, brands, colors..."
              className="block w-full h-12 pl-10 pr-9 border border-gray-200 rounded-2xl bg-gray-50/90 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-myntra-pink transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Tab bar */}
      <div className="lg:hidden flex border-t border-gray-100 bg-white justify-around py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        <button 
          onClick={() => onNavigate("quest")}
          className={`flex flex-col items-center space-y-1 ${activeTab === "quest" ? "text-myntra-pink" : "hover:text-myntra-pink"}`}
        >
          <span>🎮 Quest</span>
        </button>
        <button 
          onClick={() => onNavigate("catalog")}
          className={`flex flex-col items-center space-y-1 ${activeTab === "catalog" ? "text-myntra-pink" : "hover:text-myntra-pink"}`}
        >
          <span>🛍️ Shop</span>
        </button>
        <button 
          onClick={() => onNavigate("mixmatch")}
          className={`flex flex-col items-center space-y-1 ${activeTab === "mixmatch" ? "text-myntra-pink" : "hover:text-myntra-pink"}`}
        >
          <span>🎨 Mix & Match</span>
        </button>
        <button 
          onClick={() => onNavigate("redeem")}
          className={`flex flex-col items-center space-y-1 ${activeTab === "redeem" ? "text-myntra-pink" : "hover:text-myntra-pink"}`}
        >
          <span>💎 Rewards</span>
        </button>
      </div>
    </header>
  );
}
