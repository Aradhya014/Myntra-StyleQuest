export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Sneakers" | "Indian Wear" | "Western Wear" | "Accessories";
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sparks: number;
  streak: number;
  longestStreak: number;
  streakProgress: number; // 0 to 30 days
  badges: Badge[];
  lastActiveDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface DailyMission {
  id: string;
  title: string;
  emoji?: string;
  description: string;
  category: "likes" | "wishlist" | "outfit" | "review" | "upload" | "explore" | "follow" | "share";
  targetCount: number;
  currentCount: number;
  points: number;
  completed: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  iconName: string;
  personalizedReason?: string; // Why AI suggested this based on history
  rewardTitle?: string;
}

export interface RecommendedProductWithReason {
  product: Product;
  reason: string;
}

export interface BrandInsiderData {
  brandName: string;
  recommendedProducts: RecommendedProductWithReason[];
  similarBrands: string[];
  trendInsight: string;
  sparksEarned: number;
}

export interface AIStyleReport {
  overallScore: number; // 0 - 100
  occasion: string; // e.g. Casual Chic, Streetwear, Festive
  styleCategory: string; // e.g. Indo-Western Fusion, Classic Streetwear
  colorHarmony: string; // e.g. High Contrast Warm Palette
  confidence: string; // e.g. 96%
  fashionRating: number; // e.g. 4.8 / 5.0
  accessoriesRecommendation: string;
  footwearRecommendation: string;
  completeTheLook: Product[];
  personalStylingTip: string;
}


export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: "coupons" | "delivery" | "insider" | "limited";
  code?: string;
  image: string;
}

export interface RedemptionLog {
  id: string;
  rewardId: string;
  title: string;
  cost: number;
  code: string;
  redeemedAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: {
    top?: Product;
    bottom?: Product;
    shoes?: Product;
    accessory?: Product;
  };
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  status: "verified" | "spam_rejected" | "pending";
  aiAnalysis?: string;
}

export interface DailyQuestState {
  date: string; // toDateString() of the day this dailyQuest applies to
  completed: boolean; // true once all of today's missions are completed
  completedCount: number; // convenience mirror of missions.filter(completed).length
  personalizedMissionGenerated: boolean; // true once "AI Personalize" has been used today
}

export interface DatabaseState {
  profile: UserProfile;
  missions: DailyMission[];
  redemptions: RedemptionLog[];
  wishlist: string[]; // productIds
  likes: string[]; // productIds
  outfits: Outfit[];
  reviews: ProductReview[];
  followedBrands: string[];
  exploredProductIds: string[];
  sharedCount: number;
  lastMissionReset: string | null; // date string (kept for backward compatibility; dailyQuest.date is now the source of truth)
  dailyQuest: DailyQuestState;
  streakBroken: boolean; // true if the user missed a full day and hasn't restored yet
  previousStreak: number; // streak value at the moment it broke, used for restoration
}
