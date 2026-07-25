import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { mockCatalog } from "./src/data/catalog";
import { DatabaseState, DailyMission, DailyQuestState, UserProfile, RedemptionLog, ProductReview, Outfit, RewardItem, Badge } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

// Use JSON body parser with increased limit for base64 photo uploads
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API Client safely (Lazy / Graceful mode to prevent crashes if key is missing)
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is not configured. Running in rule-based verification fallback mode.");
}

// Local File Database Persistence path
const DB_FILE = path.join(process.cwd(), "db.json");

// ---------------------------------------------------------------------------
// Gameplay constants (centralized so reward math lives in exactly one place)
// ---------------------------------------------------------------------------
const DAILY_COMPLETION_BONUS_SPARKS = 30;
const STREAK_MILESTONE_INTERVAL = 30;
const STREAK_MILESTONE_BONUS_SPARKS = 150;
const STREAK_RESTORE_COST_SPARKS = 250;
const SHUFFLE_MISSIONS_COST_SPARKS = 10;

// Initial DB template
const defaultProfile: UserProfile = {
  id: "user-myntra-1",
  name: "Alara Sharma",
  email: "bronika2005@gmail.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  sparks: 140, // Start with some initial sparks
  streak: 5,   // Start with a 5-day streak
  longestStreak: 12,
  streakProgress: 5,
  badges: [
    {
      id: "badge-welcome",
      name: "Quest Starter",
      description: "Began the fashion journey on Myntra Quest.",
      icon: "Sparkles",
      unlockedAt: new Date().toISOString()
    }
  ],
  lastActiveDate: new Date().toISOString()
};


const initialMissions: DailyMission[] = [
  {
    id: "mis-1",
    title: "Brand Explorer: Follow 3 Brands",
    emoji: "⭐",
    description: "Follow 3 unique fashion brands to discover new styles and unlock AI recommendations.",
    category: "follow",
    targetCount: 3,
    currentCount: 0,
    points: 20,
    completed: false,
    difficulty: "Easy",
    iconName: "UserPlus",
    personalizedReason: "AI Suggestion: Follow 3 unique brands to get customized style feeds and insider perks."
  },
  {
    id: "mis-2",
    title: "Outfit Mix & Match",
    emoji: "🎨",
    description: "Create an elegant combination of Top, Bottom, and Shoes.",
    category: "outfit",
    targetCount: 1,
    currentCount: 0,
    points: 20,
    completed: false,
    difficulty: "Medium",
    iconName: "Palette",
    personalizedReason: "AI Suggestion: Unleash your style using Zara and Roadstar products."
  },
  {
    id: "mis-3",
    title: "Detailed Review",
    emoji: "🛍️",
    description: "Write a high-quality review of an Indian Wear product.",
    category: "review",
    targetCount: 1,
    currentCount: 0,
    points: 20,
    completed: false,
    difficulty: "Hard",
    iconName: "MessageSquareText",
    personalizedReason: "AI Suggestion: Let others know how the Anouk Kurta fits."
  }
];

function freshDailyQuest(dateStr: string): DailyQuestState {
  return {
    date: dateStr,
    completed: false,
    completedCount: 0,
    personalizedMissionGenerated: false
  };
}

const defaultState: DatabaseState = {
  profile: defaultProfile,
  missions: initialMissions,
  redemptions: [],
  wishlist: ["snk-1"],
  likes: [],
  outfits: [],
  reviews: [],
  followedBrands: ["Nike", "Zara"],
  exploredProductIds: [],
  sharedCount: 0,
  lastMissionReset: new Date().toDateString(),
  dailyQuest: freshDailyQuest(new Date().toDateString()),
  streakBroken: false,
  previousStreak: 0
};

// Database helper functions
function readDb(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return migrateState(parsed);
    }
  } catch (err) {
    console.error("Error reading database file, returning default:", err);
  }
  // Write default state if file doesn't exist
  writeDb(defaultState);
  return defaultState;
}

function writeDb(state: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Backfills any db.json written before the dailyQuest/streakBroken/previousStreak
// fields existed, so older save files never crash the server.
function migrateState(state: DatabaseState): DatabaseState {
  const todayStr = new Date().toDateString();

  if (!state.dailyQuest) {
    const completedCount = Array.isArray(state.missions)
      ? state.missions.filter(m => m.completed).length
      : 0;
    state.dailyQuest = {
      date: state.lastMissionReset || todayStr,
      completed: Array.isArray(state.missions) && state.missions.length > 0 && completedCount === state.missions.length,
      completedCount,
      personalizedMissionGenerated: false
    };
  }

  if (typeof state.streakBroken !== "boolean") {
    state.streakBroken = false;
  }

  if (typeof state.previousStreak !== "number") {
    state.previousStreak = 0;
  }

  return state;
}

// ---------------------------------------------------------------------------
// Reusable gameplay helpers (single source of truth for Sparks + streak logic)
// ---------------------------------------------------------------------------

// Keeps dailyQuest.completedCount in sync with the missions array.
// NOTE: this intentionally does NOT set dailyQuest.completed — that flag is
// only ever set inside completeDailyQuest(), which uses it as an idempotency
// guard. Setting it here first would make that guard fire immediately and
// silently skip the Sparks bonus + streak increment.
function recomputeDailyQuestStatus(state: DatabaseState) {
  state.dailyQuest.completedCount = state.missions.filter(m => m.completed).length;
}

function areAllMissionsCompleted(state: DatabaseState): boolean {
  return state.missions.length > 0 && state.missions.every(m => m.completed);
}

// Awards the +30 Sparks daily bonus, increments the streak, and handles the
// 30-day milestone badge. Idempotent — guarded so it can only ever fire once
// per day, no matter how many callers ask for it.
function completeDailyQuest(state: DatabaseState) {
  if (state.dailyQuest.completed) return;

  state.dailyQuest.completed = true;
  state.profile.sparks += DAILY_COMPLETION_BONUS_SPARKS;

  state.profile.streak += 1;
  state.profile.streakProgress = state.profile.streak % STREAK_MILESTONE_INTERVAL;
  if (state.profile.streakProgress === 0) {
    state.profile.streakProgress = STREAK_MILESTONE_INTERVAL;
  }
  if (state.profile.streak > state.profile.longestStreak) {
    state.profile.longestStreak = state.profile.streak;
  }

  // 30-day milestone badge
  if (state.profile.streak > 0 && state.profile.streak % STREAK_MILESTONE_INTERVAL === 0) {
    state.profile.sparks += STREAK_MILESTONE_BONUS_SPARKS;
    const badgeId = `badge-milestone-${state.profile.streak}`;
    const hasBadge = state.profile.badges.some(b => b.id === badgeId);
    if (!hasBadge) {
      state.profile.badges.push({
        id: badgeId,
        name: `${state.profile.streak}-Day Legend`,
        description: `Maintained a perfect Myntra daily streak for ${state.profile.streak} days!`,
        icon: "Flame",
        unlockedAt: new Date().toISOString()
      });
    }
  }
}

// Marks a single mission as complete, awards its Sparks, and triggers the
// daily-completion bonus exactly once when it's the 3rd mission to finish.
// This is the ONLY place a mission should ever be marked completed.
function completeMission(state: DatabaseState, mission: DailyMission) {
  if (mission.completed) return; // already completed — never double-award

  mission.completed = true;
  state.profile.sparks += mission.points;

  recomputeDailyQuestStatus(state);
  if (areAllMissionsCompleted(state)) {
    completeDailyQuest(state);
  }
}

// Updates a mission's progress toward an absolute count (used by /api/sync,
// where the client reports total likes/wishlist/follows/etc.) and completes
// the mission automatically once the target is reached.
function updateMissionProgress(state: DatabaseState, mission: DailyMission, newCount: number) {
  if (mission.completed) return;

  mission.currentCount = Math.min(newCount, mission.targetCount);
  if (mission.currentCount >= mission.targetCount) {
    completeMission(state, mission);
  }
}

// Increments-by-1 all incomplete missions of a given category (used by the
// verify-outfit / verify-review / verify-upload endpoints, which each report
// a single new action rather than an absolute count).
function incrementMissionProgress(state: DatabaseState, category: DailyMission["category"]) {
  state.missions.forEach(mission => {
    if (mission.category === category && !mission.completed) {
      updateMissionProgress(state, mission, mission.currentCount + 1);
    }
  });
}

// Called once per calendar day (see checkAndResetMissions). Evaluates whether
// yesterday's quest was left incomplete (breaking the streak), then builds a
// fresh dailyQuest + a new set of exactly 3 missions for today.
// NOTE: this function must NEVER increment the streak itself — that only ever
// happens once, in real time, inside completeDailyQuest(). Incrementing it
// again here on the following day was the source of the double-counting bug.
function resetDailyQuest(state: DatabaseState, todayStr: string) {
  if (!state.dailyQuest.completed && state.profile.streak > 0) {
    // A full day passed without finishing all 3 missions — the streak breaks.
    state.previousStreak = state.profile.streak;
    state.profile.streak = 0;
    state.profile.streakProgress = 0;
    state.streakBroken = true;
  }

  state.dailyQuest = freshDailyQuest(todayStr);

  // Reset per-day counters used by /api/sync's auto-verification
  state.exploredProductIds = [];
  state.sharedCount = 0;
  state.lastMissionReset = todayStr; // kept for backward compatibility

  state.missions = generateMissionsSync(state);
}

// Check and trigger auto-reset at day boundary (date change)
function checkAndResetMissions(state: DatabaseState, force: boolean = false): boolean {
  const todayStr = new Date().toDateString();
  if (state.dailyQuest.date !== todayStr || force) {
    console.log("Daily reset triggered. Generating new personalized missions...");
    resetDailyQuest(state, todayStr);
    writeDb(state);
    return true;
  }
  return false;
}


// Smart local fallback mission generator based on user state
function generateMissionsSync(state: DatabaseState): DailyMission[] {
  const allTemplates: DailyMission[] = [
    {
      id: "mis-sneaker",
      title: "Sneaker Scout",
      emoji: "👟",
      description: "Discover AI-picked sneakers that match your style. Like 3 sneakers.",
      category: "likes",
      targetCount: 3,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Easy",
      iconName: "Heart",
      personalizedReason: "AI Suggestion: Curated based on your love for Nike and Adidas street looks.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-closet",
      title: "Dream Closet",
      emoji: "💖",
      description: "Wishlist outfits you'll love later. Save 1 item to your wishlist.",
      category: "wishlist",
      targetCount: 1,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Easy",
      iconName: "Bookmark",
      personalizedReason: "AI Suggestion: Keep track of price drops on top-rated Western & Indian wear.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-trend",
      title: "Trend Hunter",
      emoji: "✨",
      description: "Explore trending styles before everyone else. Check details of 5 items.",
      category: "explore",
      targetCount: 5,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Easy",
      iconName: "Eye",
      personalizedReason: "AI Suggestion: Fresh summer collections & trending arrivals handpicked for you.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-ootd",
      title: "OOTD Challenge",
      emoji: "📸",
      description: "Upload today's outfit and receive a full AI Style Report & tips.",
      category: "upload",
      targetCount: 1,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Hard",
      iconName: "Camera",
      personalizedReason: "AI Suggestion: Get a professional Vision AI assessment & footwear pairing recommendation.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-brand",
      title: "Brand Explorer: Follow 3 Brands",
      emoji: "⭐",
      description: "Follow 3 unique fashion brands to discover new styles and unlock AI recommendations.",
      category: "follow",
      targetCount: 3,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Easy",
      iconName: "UserPlus",
      personalizedReason: "AI Suggestion: Unlock VIP brand insights & personalized catalog recommendations.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-creator",
      title: "Outfit Creator",
      emoji: "🎨",
      description: "Mix and match top, bottom, shoes, & accessories for your look.",
      category: "outfit",
      targetCount: 1,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Medium",
      iconName: "Palette",
      personalizedReason: "AI Suggestion: Combine Zara & Roadstar items for a chic streetwear aesthetic.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-gems",
      title: "Hidden Gems",
      emoji: "🛍️",
      description: "Write a high-quality review for an item to help fashion lovers.",
      category: "review",
      targetCount: 1,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Hard",
      iconName: "MessageSquareText",
      personalizedReason: "AI Suggestion: Your genuine sizing & fabric feedback empowers the Myntra community.",
      rewardTitle: "+20 Sparks"
    },
    {
      id: "mis-accessory",
      title: "Accessory Explorer",
      emoji: "👜",
      description: "Find accessories like watches & bags that complete your wardrobe.",
      category: "explore",
      targetCount: 3,
      currentCount: 0,
      points: 20,
      completed: false,
      difficulty: "Easy",
      iconName: "Eye",
      personalizedReason: "AI Suggestion: Elevate your outfit with statement watches & premium leather bags.",
      rewardTitle: "+20 Sparks"
    }
  ];

  // Randomly select 3 non-duplicate missions
  const selected: DailyMission[] = [];
  const pool = [...allTemplates];
  while (selected.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const item = pool.splice(idx, 1)[0];
    // Ensure no category duplicate if possible
    if (!selected.some(m => m.category === item.category)) {
      selected.push({
        ...item,
        id: `mis-gen-${selected.length + 1}-${Date.now()}`
      });
    }
  }

  // Fallback if category constraint left us with fewer than 3
  while (selected.length < 3 && allTemplates.length > 0) {
    const item = allTemplates[selected.length];
    if (!selected.some(m => m.id === item.id)) {
      selected.push({
        ...item,
        id: `mis-gen-${selected.length + 1}-${Date.now()}`
      });
    }
  }

  return selected;
}

// AI-powered mission generation via Gemini
async function generateAIPersonalizedMissions(state: DatabaseState): Promise<DailyMission[]> {
  if (!ai) {
    return generateMissionsSync(state);
  }

  try {
    const userSummary = {
      likes: state.likes.map(id => mockCatalog.find(p => p.id === id)?.name || id),
      wishlist: state.wishlist.map(id => mockCatalog.find(p => p.id === id)?.name || id),
      followedBrands: state.followedBrands,
      streak: state.profile.streak,
    };

    const prompt = `You are the Myntra Quest Gamification AI Engine. Generate exactly 3 personalized, highly creative, non-duplicate daily fashion missions for user ${state.profile.name}.
User Summary:
- Wishlist: ${JSON.stringify(userSummary.wishlist)}
- Liked Items: ${JSON.stringify(userSummary.likes)}
- Followed Brands: ${JSON.stringify(userSummary.followedBrands)}
- Streak: ${state.profile.streak} days

Provide response as raw JSON matching an array of 3 distinct objects:
- title: string (Must choose from: "Sneaker Scout", "Dream Closet", "Trend Hunter", "Accessory Explorer", "OOTD Challenge", "Brand Explorer: Follow 3 Brands", "Outfit Creator", "Hidden Gems")
- emoji: string (e.g. 👟, 💖, ✨, 👜, 📸, ⭐, 🎨, 🛍️)
- description: string (Short energetic prompt)
- category: string ("likes", "wishlist", "outfit", "review", "upload", "explore", "follow", "share")
- targetCount: number (e.g. 3, 1, 5)
- points: number (strictly 20)
- difficulty: string ("Easy", "Medium", "Hard")
- iconName: string ("Heart", "Bookmark", "Palette", "MessageSquareText", "Camera", "Eye", "UserPlus", "Share2")
- personalizedReason: string (A witty fashion line starting with "AI Suggestion: ...")

Ensure NO duplicate titles or categories are returned.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              emoji: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              targetCount: { type: Type.INTEGER },
              points: { type: Type.INTEGER },
              difficulty: { type: Type.STRING },
              iconName: { type: Type.STRING },
              personalizedReason: { type: Type.STRING }
            },
            required: ["title", "emoji", "description", "category", "targetCount", "points", "difficulty", "iconName", "personalizedReason"]
          }
        }
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length === 3) {
      return parsed.map((m, idx) => ({
        ...m,
        id: `mis-ai-${idx + 1}-${Date.now()}`,
        currentCount: 0,
        completed: false
      }));
    }
  } catch (err) {
    console.error("Failed to generate AI missions via Gemini. Falling back to rule-based:", err);
  }

  return generateMissionsSync(state);
}

// Reward list
const rewardsCatalog: RewardItem[] = [
  {
    id: "rew-1",
    title: "15% Off Extra Myntra Coupon",
    description: "Applicable on Sneakers & Western wear. No minimum order limit.",
    cost: 50,
    category: "coupons",
    image: "🎟️"
  },
  {
    id: "rew-2",
    title: "Free Delivery Voucher",
    description: "Get absolutely free shipping on your next 3 purchases.",
    cost: 30,
    category: "delivery",
    image: "🚚"
  },
  {
    id: "rew-3",
    title: "Myntra Insider Gold Upgrade",
    description: "Instant upgrade to Gold level status with 2x points on orders.",
    cost: 100,
    category: "insider",
    image: "👑"
  },
  {
    id: "rew-4",
    title: "Exclusive Adidas Samba Lace Pack",
    description: "Limited-edition designer shoelaces set. Sent to your address.",
    cost: 150,
    category: "limited",
    image: "👟"
  }
];

// Server API Routes

// Get user profile, missions, and other stats
app.get("/api/state", (req, res) => {
  const state = readDb();
  checkAndResetMissions(state);
  res.json(state);
});

// Force refresh daily missions with AI/Gemini or fallback.
// Guarded so this can only ever run ONCE per day, and never after today's
// quest is already fully completed — even if called directly (e.g. via
// Postman), bypassing the disabled frontend button.
// app.post("/api/missions/generate-new", async (req, res) => {
//   const state = readDb();
//   checkAndResetMissions(state);

//   if (state.dailyQuest.completed) {
//     return res.status(400).json({
//       success: false,
//       message: "Today's missions are already completed."
//     });
//   }

//   if (state.dailyQuest.personalizedMissionGenerated) {
//     return res.status(400).json({
//       success: false,
//       message: "You've already personalized today's missions. Come back tomorrow!"
//     });
//   }

//   try {
//     const newMissions = await generateAIPersonalizedMissions(state);
//     state.missions = newMissions;
//     state.dailyQuest.personalizedMissionGenerated = true;
//     recomputeDailyQuestStatus(state);
//     writeDb(state);
//     res.json({
//       success: true,
//       missions: newMissions,
//       isAI: !!ai,
//       dailyQuest: state.dailyQuest
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Failed to generate new missions" });
//   }
// });
app.post("/api/missions/generate-new", async (req, res) => {
  const state = readDb();
  checkAndResetMissions(state);

  if (state.dailyQuest.completed) {
    return res.status(400).json({
      success: false,
      message: "Today's missions are already completed."
    });
  }

  if (state.dailyQuest.personalizedMissionGenerated) {
    return res.status(400).json({
      success: false,
      message: "You've already personalized today's missions. Come back tomorrow!"
    });
  }

  // NEW: Sparks cost check — refuse (no deduction) if the user can't afford it
  if (state.profile.sparks < SHUFFLE_MISSIONS_COST_SPARKS) {
    return res.status(400).json({
      success: false,
      message: `You need ${SHUFFLE_MISSIONS_COST_SPARKS} Sparks to shuffle your missions.`
    });
  }

  try {
    const newMissions = await generateAIPersonalizedMissions(state);

    // NEW: only deduct once generation actually succeeds
    state.profile.sparks -= SHUFFLE_MISSIONS_COST_SPARKS;

    state.missions = newMissions;
    state.dailyQuest.personalizedMissionGenerated = true;
    recomputeDailyQuestStatus(state);
    writeDb(state);
    res.json({
      success: true,
      missions: newMissions,
      isAI: !!ai,
      dailyQuest: state.dailyQuest,
      sparksSpent: SHUFFLE_MISSIONS_COST_SPARKS,   // NEW: lets the frontend show what was spent
      sparks: state.profile.sparks                 // NEW: updated balance
    });
  } catch (err) {
    // NEW: if generation throws, nothing was deducted — sparks stay exactly as they were (no change / "come back to original")
    res.status(500).json({ success: false, message: "Failed to generate new missions" });
  }
});
// Sync client state (e.g., product interactions, brand follows, likes)
app.post("/api/sync", (req, res) => {
  const { likes, wishlist, followedBrands, exploredProductIds, sharedCount } = req.body;
  const state = readDb();

  if (Array.isArray(likes)) state.likes = likes;
  if (Array.isArray(wishlist)) state.wishlist = wishlist;
  if (Array.isArray(followedBrands)) state.followedBrands = followedBrands;
  if (Array.isArray(exploredProductIds)) state.exploredProductIds = exploredProductIds;
  if (typeof sharedCount === "number") state.sharedCount = sharedCount;

  // Auto-verify missions associated with likes, wishlist, follow, explore, and share
  state.missions.forEach(mission => {
    if (mission.completed) return;

    if (mission.category === "likes") {
      // e.g. "Like 3 Sneakers" or similar
      const sneakerLikes = state.likes.filter(pid => {
        const product = mockCatalog.find(p => p.id === pid);
        return product?.category === "Sneakers";
      }).length;
      updateMissionProgress(state, mission, sneakerLikes);
    }
    else if (mission.category === "wishlist") {
      updateMissionProgress(state, mission, state.wishlist.length);
    }
    else if (mission.category === "follow") {
      updateMissionProgress(state, mission, state.followedBrands.length);
    }
    else if (mission.category === "explore") {
      updateMissionProgress(state, mission, state.exploredProductIds.length);
    }
    else if (mission.category === "share") {
      updateMissionProgress(state, mission, state.sharedCount);
    }
  });

  writeDb(state);
  res.json(state);
});

// Verify Outfit creation mission
app.post("/api/missions/verify-outfit", (req, res) => {
  const { outfitName, top, bottom, shoes, accessory } = req.body;
  const state = readDb();

  const newOutfit: Outfit = {
    id: `outfit-${Date.now()}`,
    name: outfitName || "Dynamic Look",
    items: { top, bottom, shoes, accessory },
    createdAt: new Date().toISOString()
  };

  state.outfits.push(newOutfit);

  incrementMissionProgress(state, "outfit");

  writeDb(state);
  res.json({ success: true, state, outfit: newOutfit });
});

// Submit a review & Verify using AI/NLP to detect spam/meaningless reviews
app.post("/api/missions/verify-review", async (req, res) => {
  const { productId, rating, reviewText } = req.body;
  const state = readDb();

  if (!productId || !reviewText) {
    return res.status(400).json({ error: "Product ID and review text are required" });
  }

  let status: "verified" | "spam_rejected" = "verified";
  let aiAnalysis = "Successfully verified via rule-based AI pattern matcher.";

  if (reviewText.trim().length < 15) {
    status = "spam_rejected";
    aiAnalysis = "Rejected: Review text is too short. Please provide constructive feedback with at least 15 characters.";
  } else {
    // If Gemini is active, let's analyze the review for constructive content or spam
    if (ai) {
      try {
        const product = mockCatalog.find(p => p.id === productId);
        const prompt = `You are a professional Content Quality Auditor at Myntra.
Analyze this user review for product "${product?.name || 'Fashion Wear'}" (${product?.brand || 'Myntra brand'}):
Review Text: "${reviewText}"
Rating: ${rating}/5

Determine if this is a genuine, meaningful review or spam/meaningless text (like repeating random words, keyboard smash, purely offensive, or completely unrelated comments).
Return a JSON object with:
{
  "isGenuine": boolean,
  "reason": "Short summary explaining your decision. Praise the customer if genuine, or politely explain what makes it look like spam/meaningless."
}`;

        const result = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isGenuine: { type: Type.BOOLEAN },
                reason: { type: Type.STRING }
              },
              required: ["isGenuine", "reason"]
            }
          }
        });

        const resData = JSON.parse(result.text || "{}");
        status = resData.isGenuine ? "verified" : "spam_rejected";
        aiAnalysis = resData.reason || "Verified by Gemini AI Content Moderator.";
      } catch (err) {
        console.error("Gemini Review AI moderation failed, falling back to local heuristic:", err);
      }
    }
  }

  const reviewRecord: ProductReview = {
    id: `rev-${Date.now()}`,
    productId,
    rating,
    reviewText,
    createdAt: new Date().toISOString(),
    status,
    aiAnalysis
  };

  state.reviews.push(reviewRecord);

  if (status === "verified") {
    incrementMissionProgress(state, "review");
  }

  writeDb(state);
  res.json({ success: status === "verified", review: reviewRecord, state });
});

// Upload Outfit photo & verify using Vision AI
app.post("/api/missions/verify-upload", async (req, res) => {
  const { imageBase64 } = req.body; // base64 data string
  const state = readDb();

  if (!imageBase64) {
    return res.status(400).json({ error: "Image data is required" });
  }

  let isVerified = true;
  let aiAnalysis = "Vision AI inspects and verifies your OOTD looks.";
  let aiStyleReport: any = null;

  // Pick 2-3 matching catalog products for "Complete The Look"
  const suggestedProducts = mockCatalog.slice(0, 3);

  if (ai) {
    try {
      const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `You are the Myntra Senior AI Stylist.
Look at this uploaded outfit image. Determine if it contains a clothing item, footwear, accessory, flatlay, or person wearing fashionable apparel.
If it is NOT an outfit/apparel (e.g. coffee mug, blank wall, car), set isApparel: false.

If it IS apparel, generate a comprehensive AI STYLE REPORT with:
- overallScore: number (between 82 and 98)
- occasion: string (e.g. "Casual Chic", "Festive Evening", "Streetwear Urban", "Smart Casual")
- styleCategory: string (e.g. "Indo-Western Fusion", "Contemporary Minimalist", "Retro Streetwear")
- colorHarmony: string (e.g. "Balanced Earth Tones", "Monochromatic Neutral", "Vibrant Contrast")
- confidence: string (e.g. "95%")
- fashionRating: number (e.g. 4.8)
- accessoriesRecommendation: string (e.g. "Pair with minimal silver hoops or a tan leather tote")
- footwearRecommendation: string (e.g. "White chunky sneakers or nude block heels")
- personalStylingTip: string (Expert tip for elevating this exact fit)

Return raw JSON matching this schema:
{
  "isApparel": boolean,
  "clothingDetails": string,
  "overallScore": number,
  "occasion": string,
  "styleCategory": string,
  "colorHarmony": string,
  "confidence": string,
  "fashionRating": number,
  "accessoriesRecommendation": string,
  "footwearRecommendation": string,
  "personalStylingTip": string
}`;

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanedBase64,
        },
      };

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, { text: prompt }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isApparel: { type: Type.BOOLEAN },
              clothingDetails: { type: Type.STRING },
              overallScore: { type: Type.INTEGER },
              occasion: { type: Type.STRING },
              styleCategory: { type: Type.STRING },
              colorHarmony: { type: Type.STRING },
              confidence: { type: Type.STRING },
              fashionRating: { type: Type.NUMBER },
              accessoriesRecommendation: { type: Type.STRING },
              footwearRecommendation: { type: Type.STRING },
              personalStylingTip: { type: Type.STRING }
            },
            required: ["isApparel", "clothingDetails"]
          }
        }
      });

      const data = JSON.parse(result.text || "{}");
      isVerified = data.isApparel !== false;
      if (isVerified) {
        aiAnalysis = `Vision AI verified: ${data.clothingDetails || "Apparel outline detected."}`;
        aiStyleReport = {
          overallScore: data.overallScore || 92,
          occasion: data.occasion || "Casual Chic",
          styleCategory: data.styleCategory || "Indo-Western Fusion",
          colorHarmony: data.colorHarmony || "Balanced Warm Palette",
          confidence: data.confidence || "96%",
          fashionRating: data.fashionRating || 4.8,
          accessoriesRecommendation: data.accessoriesRecommendation || "Pair with a sleek leather watch & minimalist tote.",
          footwearRecommendation: data.footwearRecommendation || "Combine with crisp white retro sneakers.",
          completeTheLook: suggestedProducts,
          personalStylingTip: data.personalStylingTip || "Layer with a lightweight denim or trench jacket for added depth."
        };
      } else {
        aiAnalysis = `Rejected by Vision AI: Upload does not appear to contain clothing or fashion apparel.`;
      }
    } catch (err) {
      console.error("Gemini Vision verification failed, using local AI Stylist fallback:", err);
    }
  }

  // Local fallback AI Style Report if AI client was offline or failed
  if (isVerified && !aiStyleReport) {
    aiAnalysis = "Verified by Myntra Vision AI Stylist algorithm.";
    aiStyleReport = {
      overallScore: 94,
      occasion: "Smart Casual & Urban Streetwear",
      styleCategory: "Indo-Western Fusion",
      colorHarmony: "Balanced Earth Tones & High-Contrast Accents",
      confidence: "95%",
      fashionRating: 4.8,
      accessoriesRecommendation: "Add a gold-tone classic watch and structured shoulder bag.",
      footwearRecommendation: "Match with low-top leather retro sneakers.",
      completeTheLook: suggestedProducts,
      personalStylingTip: "Tuck in slightly at the front to define your waistline and complement the overall silhouette."
    };
  }

  if (isVerified) {
    incrementMissionProgress(state, "upload");
  }

  writeDb(state);
  res.json({ success: isVerified, aiAnalysis, aiStyleReport, state });
});

// Brand Insider Follow AI recommendations endpoint
app.post("/api/brand/follow-recommendations", async (req, res) => {
  const { brandName } = req.body;
  const state = readDb();

  const brand = brandName || "Fabindia";
  let isNewFollow = false;
  if (!state.followedBrands.includes(brand)) {
    state.followedBrands.push(brand);
    isNewFollow = true;
  }

  // Update progress based on total unique followed brands
  state.missions.forEach(mission => {
    if (mission.category === "follow" && !mission.completed) {
      updateMissionProgress(state, mission, state.followedBrands.length);
    }
  });

  writeDb(state);

  const brandProducts = mockCatalog.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  const selectedPicks = brandProducts.length >= 3 
    ? brandProducts.slice(0, 3) 
    : [...brandProducts, ...mockCatalog.filter(p => p.brand.toLowerCase() !== brand.toLowerCase())].slice(0, 3);

  const reasons = [
    `Curated by AI based on your preference for ${brand}'s signature aesthetic.`,
    `Trending #1 in ${selectedPicks[1]?.category || 'Western Wear'} on Myntra this week.`,
    `Highly recommended pairing with items in your active wishlist.`
  ];

  const recommendedProducts = selectedPicks.map((product, idx) => ({
    product,
    reason: reasons[idx % reasons.length]
  }));

  const brandData = {
    brandName: brand,
    recommendedProducts,
    similarBrands: ["Fabindia", "Roadster", "Nike", "Zara", "Anouk"].filter(b => b.toLowerCase() !== brand.toLowerCase()).slice(0, 3),
    trendInsight: `🔥 ${brand} collections are seeing a +45% surge in engagement this week among fashion insiders!`,
    sparksEarned: 20
  };

  res.json({
    success: true,
    data: brandData,
    state,
    isNewFollow,
    followedBrandsCount: state.followedBrands.length
  });
});

// Redeem Sparks for Reward coupons / benefits
app.post("/api/redeem", (req, res) => {
  const { rewardId } = req.body;
  const state = readDb();

  const reward = rewardsCatalog.find(r => r.id === rewardId);
  if (!reward) {
    return res.status(404).json({ error: "Reward item not found" });
  }

  if (state.profile.sparks < reward.cost) {
    return res.status(400).json({ error: "Insufficient Myntra Sparks balance" });
  }

  // Deduct sparks
  state.profile.sparks -= reward.cost;

  // Generate randomized coupon code or success token
  const codes = ["MYNTRA15QUEST", "FREEDELQST", "INSIDEGOLD9", "SAMBALACE30"];
  const randomCode = codes[Math.floor(Math.random() * codes.length)] + "-" + Math.floor(Math.random() * 9000 + 1000);

  const redemption: RedemptionLog = {
    id: `red-${Date.now()}`,
    rewardId: reward.id,
    title: reward.title,
    cost: reward.cost,
    code: randomCode,
    redeemedAt: new Date().toISOString()
  };

  state.redemptions.unshift(redemption);
  writeDb(state);

  res.json({ success: true, redemption, state });
});

// Restore a broken streak by spending Sparks
app.post("/api/streak/restore", (req, res) => {
  const state = readDb();

  if (!state.streakBroken) {
    return res.status(400).json({ success: false, message: "There is no broken streak to restore." });
  }

  if (state.profile.sparks < STREAK_RESTORE_COST_SPARKS) {
    return res.status(400).json({
      success: false,
      message: `You need ${STREAK_RESTORE_COST_SPARKS} Sparks to restore your streak.`
    });
  }

  state.profile.sparks -= STREAK_RESTORE_COST_SPARKS;
  state.profile.streak = state.previousStreak;
  state.profile.streakProgress = state.previousStreak % STREAK_MILESTONE_INTERVAL || (state.previousStreak > 0 ? STREAK_MILESTONE_INTERVAL : 0);
  if (state.profile.streak > state.profile.longestStreak) {
    state.profile.longestStreak = state.profile.streak;
  }
  state.streakBroken = false;
  state.previousStreak = 0;

  writeDb(state);
  res.json({ success: true, state });
});

// Reset streak and missions to initial (for playground / testing purposes)
app.post("/api/playground/reset", (req, res) => {
  const todayStr = new Date().toDateString();
  const state: DatabaseState = {
    ...defaultState,
    profile: {
      ...defaultProfile,
      sparks: 140,
      streak: 5,
      streakProgress: 5,
      badges: [...defaultProfile.badges],
    },
    missions: initialMissions.map(m => ({ ...m })),
    redemptions: [],
    wishlist: ["snk-1"],
    likes: [],
    outfits: [],
    reviews: [],
    followedBrands: ["Nike", "Zara"],
    exploredProductIds: [],
    sharedCount: 0,
    lastMissionReset: todayStr,
    dailyQuest: freshDailyQuest(todayStr),
    streakBroken: false,
    previousStreak: 0
  };
  writeDb(state);
  res.json(state);
});

// Vite & Express setup
async function startServer(initialPort: number = Number(process.env.PORT) || 3000) {
  if (process.env.NODE_ENV !== "production") {
    // const vite = await createViteServer({
    //   server: { middlewareMode: true },
    //   appType: "spa",
    // });
    const vite = await createViteServer({
  server: {
    middlewareMode: true,
    watch: {
      ignored: [
        "**/db.json",
      ],
    },
  },
  appType: "spa",
});
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(initialPort, "0.0.0.0", () => {
    console.log(`Myntra Quest Full-Stack server booted at http://localhost:${initialPort}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${initialPort} is already in use. Retrying on port ${initialPort + 1}...`);
      startServer(initialPort + 1);
    } else {
      console.error("Server error:", err);
    }
  });
}

startServer();
