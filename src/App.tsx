import React, { useState, useEffect, useRef } from "react";
import MyntraHeader from "./components/MyntraHeader";
import QuestDashboard from "./components/QuestDashboard";
import CatalogSection from "./components/CatalogSection";
import MixMatchCreator from "./components/MixMatchCreator";
import RedeemSection from "./components/RedeemSection";
import ReviewModal from "./components/ReviewModal";
import PhotoUploadModal from "./components/PhotoUploadModal";
import BrandInsiderModal from "./components/BrandInsiderModal";
import MissionCompletionModal from "./components/MissionCompletionModal";
import SparkConfetti from "./components/SparkConfetti";
import MotivationalToast, { ToastData } from "./components/MotivationalToast";
import { DatabaseState, Product, DailyMission, ProductReview, BrandInsiderData, AIStyleReport } from "./types";
import { mockCatalog } from "./data/catalog";
import { Sparkles, RefreshCw, AlertTriangle, Play, HelpCircle } from "lucide-react";

const KNOWN_BRANDS = Array.from(new Set(mockCatalog.map(p => p.brand)));

const CATEGORY_KEYWORDS: Record<string, Product["category"]> = {
  sneaker: "Sneakers",
  sneakers: "Sneakers",
  shoe: "Sneakers",
  shoes: "Sneakers",
  footwear: "Sneakers",
  kurta: "Indian Wear",
  ethnic: "Indian Wear",
  anarkali: "Indian Wear",
  "indian wear": "Indian Wear",
  nehru: "Indian Wear",
  saree: "Indian Wear",
  dress: "Western Wear",
  dresses: "Western Wear",
  jeans: "Western Wear",
  western: "Western Wear",
  tee: "Western Wear",
  "t-shirt": "Western Wear",
  jhumka: "Accessories",
  jhumkas: "Accessories",
  accessory: "Accessories",
  accessories: "Accessories",
  watch: "Accessories",
  sunglasses: "Accessories",
  backpack: "Accessories",
};

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesWord(text: string, word: string): boolean {
  return new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`).test(text);
}

function resolveCatalogFilter(mission: DailyMission): { category?: Product["category"]; brand?: string } {
  const text = `${mission.title} ${mission.description}`.toLowerCase();

  const matchedBrand = KNOWN_BRANDS.find(brand => includesWord(text, brand));

  const categories: Product["category"][] = ["Sneakers", "Indian Wear", "Western Wear", "Accessories"];
  let matchedCategory = categories.find(cat => includesWord(text, cat));

  if (!matchedCategory) {
    for (const [keyword, cat] of Object.entries(CATEGORY_KEYWORDS)) {
      if (includesWord(text, keyword)) {
        matchedCategory = cat;
        break;
      }
    }
  }

  if (!matchedCategory && matchedBrand) {
    matchedCategory = mockCatalog.find(p => p.brand === matchedBrand)?.category;
  }

  return { category: matchedCategory, brand: matchedBrand };
}

export default function App() {
  // Navigation: "quest" | "catalog" | "mixmatch" | "redeem"
  const [activeTab, setActiveTab] = useState<"quest" | "catalog" | "mixmatch" | "redeem">("quest");
  
  // App state
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Confetti & Toast trigger
  const [confettiActive, setConfettiActive] = useState(false);
  const [toastData, setToastData] = useState<ToastData | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("myntra_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleExecuteSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(t => t.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem("myntra_recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recent search:", err);
      }
      return updated;
    });
    setSearchQuery(clean);
    setActiveTab("catalog");
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("myntra_recent_searches");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveRecentSearch = (term: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term);
      try {
        localStorage.setItem("myntra_recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };
  
  // Modals state
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPlaygroundInfo, setShowPlaygroundInfo] = useState(false);

  // Newly completed mission modal state (intermediate celebration page!)
  const [completedMissionModal, setCompletedMissionModal] = useState<DailyMission | null>(null);

  // Brand Insider AI Modal State
  const [brandInsiderData, setBrandInsiderData] = useState<BrandInsiderData | null>(null);
  const [loadingBrandInsider, setLoadingBrandInsider] = useState(false);

  // Smart catalog filter resolved from the mission that triggered navigation
  const [catalogFilter, setCatalogFilter] = useState<{ category?: Product["category"]; brand?: string } | null>(null);

  // Streak restore loading + error state
  const [restoringStreak, setRestoringStreak] = useState(false);
  const [streakRestoreError, setStreakRestoreError] = useState<string | null>(null);

  // Ref tracking completed mission IDs to avoid double triggers / auto-closing
  const prevCompletedMissionIdsRef = useRef<Set<string> | null>(null);

  // Unified state updater that triggers MissionCompletionModal when a mission completes
  const updateDbState = (newState: DatabaseState, skipCompletionModal: boolean = false) => {
    const currentCompleted = new Set(newState.missions.filter(m => m.completed).map(m => m.id));

    if (prevCompletedMissionIdsRef.current !== null && !skipCompletionModal) {
      const newlyDone = newState.missions.find(
        m => m.completed && !prevCompletedMissionIdsRef.current!.has(m.id)
      );
      if (newlyDone) {
        setCompletedMissionModal(newlyDone);
        setConfettiActive(true);
      }
    }

    prevCompletedMissionIdsRef.current = currentCompleted;
    setDbState(newState);
  };

  // Sync / fetch state from server-side database
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      if (!res.ok) throw new Error("Could not load backend state");
      const data: DatabaseState = await res.json();
      
      updateDbState(data, true);
      setErrorMsg(null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to sync with full-stack container. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync changes directly (from catalog likes, wishlist, explore)
  const syncWithServer = async (updates: Partial<DatabaseState>) => {
    if (!dbState) return;
    try {
      const merged = {
        likes: updates.likes ?? dbState.likes,
        wishlist: updates.wishlist ?? dbState.wishlist,
        followedBrands: updates.followedBrands ?? dbState.followedBrands,
        exploredProductIds: updates.exploredProductIds ?? dbState.exploredProductIds,
        sharedCount: updates.sharedCount ?? dbState.sharedCount
      };

      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      const data = await res.json();
      updateDbState(data, false);
    } catch (err) {
      console.error("Failed to sync updates with backend:", err);
    }
  };

  // Follow Brand trigger (handles unique count progress, toasts, and Brand Insider modal)
  const handleFollowBrand = async (brandName: string) => {
    setLoadingBrandInsider(true);
    try {
      const res = await fetch("/api/brand/follow-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName })
      });
      const data = await res.json();
      if (data.success) {
        const isNew = data.isNewFollow;
        const count = data.followedBrandsCount ?? data.state.followedBrands.length;
        
        updateDbState(data.state, false);

        if (!isNew) {
          setToastData({
            id: `toast-${Date.now()}`,
            message: `You are already following ${brandName}! Try following a new brand to advance your mission.`,
            type: "warning"
          });
        } else {
          if (count === 1) {
            setToastData({
              id: `toast-${Date.now()}`,
              message: "Nice! 1 of 3 brands followed.",
              countText: "1/3 Progress",
              type: "info"
            });
          } else if (count === 2) {
            setToastData({
              id: `toast-${Date.now()}`,
              message: "Great! Keep exploring new brands. Almost there! One more brand to unlock your reward.",
              countText: "2/3 Progress",
              type: "info"
            });
          } else if (count >= 3) {
            setToastData({
              id: `toast-${Date.now()}`,
              message: "Brand Explorer Completed! 3 of 3 brands followed.",
              countText: "3/3 Complete",
              type: "success"
            });
          }
        }

        setBrandInsiderData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch brand recommendations:", err);
    } finally {
      setLoadingBrandInsider(false);
    }
  };

  // 1. Toggling likes
  const handleToggleLike = async (productId: string) => {
    if (!dbState) return;
    const isLiked = dbState.likes.includes(productId);
    const newLikes = isLiked 
      ? dbState.likes.filter(id => id !== productId)
      : [...dbState.likes, productId];
    
    setDbState({
      ...dbState,
      likes: newLikes
    });

    await syncWithServer({ likes: newLikes });
  };

  // 2. Toggling wishlists
  const handleToggleWishlist = async (productId: string) => {
    if (!dbState) return;
    const isWishlisted = dbState.wishlist.includes(productId);
    const newWishlist = isWishlisted 
      ? dbState.wishlist.filter(id => id !== productId)
      : [...dbState.wishlist, productId];
    
    setDbState({
      ...dbState,
      wishlist: newWishlist
    });

    await syncWithServer({ wishlist: newWishlist });
  };

  // 3. Exploring a product
  const handleExploreProduct = async (productId: string) => {
    if (!dbState) return;
    if (dbState.exploredProductIds.includes(productId)) return;
    
    const newExplored = [...dbState.exploredProductIds, productId];
    setDbState({
      ...dbState,
      exploredProductIds: newExplored
    });

    await syncWithServer({ exploredProductIds: newExplored });
  };

  // 4. Mix & Match Outfit Submission & Verification
  const handleVerifyOutfit = async (outfitName: string, top: Product, bottom: Product, shoes: Product, accessory: Product) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/missions/verify-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outfitName, top, bottom, shoes, accessory })
      });
      const data = await res.json();
      if (data.success) {
        updateDbState(data.state, false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Submit Review
  const handleSubmitReview = async (productId: string, rating: number, reviewText: string): Promise<{ success: boolean; review: ProductReview }> => {
    const res = await fetch("/api/missions/verify-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, reviewText })
    });
    const data = await res.json();
    if (data.success) {
      updateDbState(data.state, true);
    }
    return { success: data.success, review: data.review };
  };

  // 6. Upload Photo & AI Style Report
  const handleSubmitPhoto = async (imageBase64: string): Promise<{ success: boolean; aiAnalysis: string; aiStyleReport?: AIStyleReport }> => {
    const res = await fetch("/api/missions/verify-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 })
    });
    const data = await res.json();
    if (data.success) {
      updateDbState(data.state, true);
    }
    return { success: data.success, aiAnalysis: data.aiAnalysis, aiStyleReport: data.aiStyleReport };
  };

  // 7. Redeem Rewards from Spark store
  const handleRedeemReward = async (rewardId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to redeem");
      }
      const data = await res.json();
      setDbState(data.state);
      setConfettiActive(true);
    } catch (err: any) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // 8. Regenerate personalized daily missions
  const handleRegenerateMissions = async () => {
    setLoadingMissions(true);
    try {
      const res = await fetch("/api/missions/generate-new", {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setDbState(prev => prev ? { ...prev, missions: data.missions, dailyQuest: data.dailyQuest, profile: { ...prev.profile, sparks: data.sparks } } : null);
      } else {
        console.warn(data.message);
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMissions(false);
    }
  };

  // 9. Reset Playground / Sandbox database to initial defaults
  const handlePlaygroundReset = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/playground/reset", { method: "POST" });
      const data = await res.json();
      setDbState(data);
      setShowPlaygroundInfo(false);
      setConfettiActive(false);
      setActiveTab("quest");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Triggering actions from Mission cards inside Dashboard
  const handleActionTrigger = (mission: DailyMission) => {
    switch (mission.category) {
      case "likes":
      case "wishlist":
      case "review":
      case "explore": {
        const filter = resolveCatalogFilter(mission);
        setCatalogFilter(filter);
        setActiveTab("catalog");
        break;
      }
      case "outfit":
        setActiveTab("mixmatch");
        break;
      case "upload":
        setShowPhotoModal(true);
        break;
      case "follow": {
        setCatalogFilter(null);
        setActiveTab("catalog");
        break;
      }
      case "share":
        if (dbState) {
          syncWithServer({ sharedCount: dbState.sharedCount + 1 });
        }
        break;
    }
  };

  // Restore a broken streak by spending 250 Sparks
  const handleRestoreStreak = async () => {
    setRestoringStreak(true);
    setStreakRestoreError(null);
    try {
      const res = await fetch("/api/streak/restore", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setDbState(data.state);
        setConfettiActive(true);
      } else {
        setStreakRestoreError(data.message || "Unable to restore streak.");
      }
    } catch (err) {
      console.error(err);
      setStreakRestoreError("Unable to restore streak. Please try again.");
    } finally {
      setRestoringStreak(false);
    }
  };

  if (loading || !dbState) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="relative h-16 w-16 bg-gradient-myntra text-white flex items-center justify-center font-display font-black text-3xl rounded-2xl shadow-lg animate-bounce">
          M
        </div>
        <div className="flex items-center space-x-2 text-gray-500 font-mono text-xs">
          <RefreshCw className="h-4 w-4 animate-spin text-myntra-pink" />
          <span>Booting Myntra Quest Server Environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-radial-frosted text-gray-900 font-sans selection:bg-pink-100 selection:text-myntra-pink pb-12 transition-colors duration-500">
      
      {/* High-quality Celebratory Confetti */}
      <SparkConfetti 
        active={confettiActive} 
        onComplete={() => setConfettiActive(false)} 
      />

      {/* Motivational & Progress Toast System */}
      <MotivationalToast
        toast={toastData}
        onClose={() => setToastData(null)}
      />

      {/* Global Brand Header */}
      <MyntraHeader
        profile={dbState.profile}
        wishlistCount={dbState.wishlist.length}
        likesCount={dbState.likes.length}
        onNavigate={(tab) => {
          if (tab === "catalog") setCatalogFilter(null);
          setActiveTab(tab);
        }}
        activeTab={activeTab}
        onOpenPlayground={() => setShowPlaygroundInfo(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentSearches={recentSearches}
        onExecuteSearch={handleExecuteSearch}
        onClearRecentSearches={handleClearRecentSearches}
        onRemoveRecentSearch={handleRemoveRecentSearch}
      />

      {/* Main Container with Frosted Glass look */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 glass-panel p-6 sm:p-8 rounded-[32px] md:rounded-[40px] shadow-[0_32px_64px_-16px_rgba(255,63,108,0.12)]">
        
        {/* Sandbox Indicator & Quick Reset Banner */}
        {showPlaygroundInfo && (
          <div className="bg-gray-900 text-white rounded-2xl p-6 border border-gray-850 shadow-xl space-y-4 mb-8 animate-scale-up relative">
            <button 
              onClick={() => setShowPlaygroundInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="space-y-1">
              <span className="bg-pink-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                Interactive Testing Sandbox
              </span>
              <h3 className="text-md font-display font-bold">Quest Simulator Controls</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
                This applet contains a full-stack Node.js server. Likes, wishlist changes, and outfit creations are written to a persistent file database. You can test vision rejection or NLP spam reviews using the presets inside the modals. If you've completed all missions and want to start over from scratch to test the visual confetti and progression curves again, click the reset button below.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePlaygroundReset}
                className="bg-myntra-pink hover:bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Reset Database to Defaults
              </button>
              <button
                onClick={() => setShowPlaygroundInfo(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Keep Playing
              </button>
            </div>
          </div>
        )}

        {/* Modular Screen Router */}
        <div id="quest-content-viewport" className="min-h-[500px]">
          {activeTab === "quest" && (
            <QuestDashboard
              profile={dbState.profile}
              missions={dbState.missions}
              onActionTrigger={handleActionTrigger}
              onRegenerateMissions={handleRegenerateMissions}
              loadingMissions={loadingMissions}
              isAI={dbState.missions.some(m => m.id.startsWith("mis-ai"))}
              dailyQuest={dbState.dailyQuest}
              streakBroken={dbState.streakBroken}
              previousStreak={dbState.previousStreak}
              onRestoreStreak={handleRestoreStreak}
              restoringStreak={restoringStreak}
              streakRestoreError={streakRestoreError}
            />
          )}

          {activeTab === "catalog" && (
            <CatalogSection
              wishlist={dbState.wishlist}
              likes={dbState.likes}
              followedBrands={dbState.followedBrands}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
              onToggleLike={handleToggleLike}
              onToggleWishlist={handleToggleWishlist}
              onExploreProduct={handleExploreProduct}
              onOpenReviewModal={(product) => setReviewProduct(product)}
              onFollowBrand={handleFollowBrand}
              preSelectedCategory={catalogFilter?.category ?? null}
              preSelectedBrand={catalogFilter?.brand ?? null}
            />
          )}

          {activeTab === "mixmatch" && (
            <MixMatchCreator
              onVerifyOutfit={handleVerifyOutfit}
              loading={actionLoading}
              outfitsCount={dbState.outfits.length}
            />
          )}

          {activeTab === "redeem" && (
            <RedeemSection
              profile={dbState.profile}
              redemptions={dbState.redemptions}
              onRedeemReward={handleRedeemReward}
              loading={actionLoading}
            />
          )}
        </div>

      </main>

      {/* Review Modal Backdrop Layer */}
      {reviewProduct && (
        <ReviewModal
          product={reviewProduct}
          onClose={() => setReviewProduct(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Photo Upload Modal Backdrop Layer */}
      {showPhotoModal && (
        <PhotoUploadModal
          onClose={() => setShowPhotoModal(false)}
          onSubmitPhoto={handleSubmitPhoto}
        />
      )}

      {/* Mission Accomplished Celebration Backdrop Layer */}
      {completedMissionModal && dbState && !showPhotoModal && !reviewProduct && (
        <MissionCompletionModal
          mission={completedMissionModal}
          completedCount={dbState.missions.filter(m => m.completed).length}
          totalMissions={dbState.missions.length}
          onContinue={(goToDashboard) => {
            setCompletedMissionModal(null);
            if (goToDashboard) {
              setActiveTab("quest");
            }
          }}
        />
      )}

      {/* Brand Insider AI Modal Backdrop Layer (shows after completion modal or during follow exploration) */}
      {(brandInsiderData || loadingBrandInsider) && !completedMissionModal && (
        <BrandInsiderModal
          data={brandInsiderData}
          loading={loadingBrandInsider}
          onClose={() => setBrandInsiderData(null)}
          onSelectProduct={(product) => {
            setBrandInsiderData(null);
            setCatalogFilter({ category: product.category, brand: product.brand });
            setActiveTab("catalog");
          }}
          onSelectBrand={(brandName) => {
            setBrandInsiderData(null);
            handleFollowBrand(brandName);
          }}
        />
      )}

    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
