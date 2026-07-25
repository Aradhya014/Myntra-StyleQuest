import React, { useState } from "react";
import { Coins, Sparkles, CheckCircle, Copy, Check, Ticket, Truck, Crown, ShieldAlert } from "lucide-react";
import { UserProfile, RewardItem, RedemptionLog } from "../types";

interface RedeemProps {
  profile: UserProfile;
  redemptions: RedemptionLog[];
  onRedeemReward: (rewardId: string) => Promise<void>;
  loading: boolean;
}

export default function RedeemSection({
  profile,
  redemptions,
  onRedeemReward,
  loading
}: RedeemProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rewardsList: RewardItem[] = [
    {
      id: "rew-1",
      title: "🎟️ 15% Off Extra Myntra Coupon",
      description: "Applicable on Sneakers & Western wear. No minimum order limit.",
      cost: 50,
      category: "coupons",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "rew-2",
      title: "🚚 Free Delivery Voucher",
      description: "Get absolutely free shipping on your next 3 purchases.",
      cost: 30,
      category: "delivery",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "rew-3",
      title: "👑 Myntra Insider Gold Upgrade",
      description: "Instant upgrade to Gold level status with 2x points on orders.",
      cost: 100,
      category: "insider",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "rew-4",
      title: "👟 Exclusive Adidas Samba Lace Pack",
      description: "Limited-edition designer custom shoe-laces set. Sent to your delivery address.",
      cost: 150,
      category: "limited",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const handleCopy = (code: string, logId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(logId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRedeem = async (reward: RewardItem) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (profile.sparks < reward.cost) {
      setErrorMsg(`You need ${reward.cost - profile.sparks} more Sparks to redeem this item!`);
      setTimeout(() => setErrorMsg(null), 5000);
      return;
    }

    try {
      await onRedeemReward(reward.id);
      setSuccessMsg(`Successfully redeemed ${reward.title}! Check your unique code in the logs below.`);
      setTimeout(() => setSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to redeem reward.");
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  return (
    <div id="rewards-redemption-room" className="space-y-8 animate-fade-in">
      
      {/* Spark Header Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 glass-card-light rounded-3xl p-6 border-white/85 items-center shadow-sm">
        <div className="md:col-span-2 space-y-1">
          <h2 className="text-xl font-display font-black text-amber-800 flex items-center">
            <Coins className="h-6 w-6 text-amber-500 fill-amber-500 mr-2 animate-bounce" />
            Myntra Sparks Redemption Vault
          </h2>
          <p className="text-xs text-amber-700/80">
            Convert your hard-earned Sparks into valuable vouchers, free shipping, elite level upgrades, and exclusive collector-tier merchandise.
          </p>
        </div>

        <div className="bg-amber-400 text-white rounded-xl p-4 flex flex-col justify-center items-center text-center shadow-md">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-900 leading-none">Your balance</span>
          <span className="text-3xl font-mono font-black mt-1">{profile.sparks}</span>
          <span className="text-[10px] font-semibold text-amber-800/90 mt-0.5">Sparks Sparkles 🪙</span>
        </div>
      </div>

      {/* Global Status Notifications */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-xs flex items-start space-x-2.5 shadow-sm">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex items-start space-x-2.5 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Reward Cards Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-md font-display font-extrabold text-gray-800 uppercase tracking-wider">Available Rewards</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rewardsList.map((reward) => {
            const isAffordable = profile.sparks >= reward.cost;

            return (
              <div 
                key={reward.id}
                className="glass-card-light rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:scale-[1.01] hover:border-white/100"
              >
                {/* Visual Stage */}
                <div className="relative aspect-video bg-gray-50">
                  <img src={reward.image} alt={reward.title} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3 bg-gray-900/80 text-white font-mono font-bold text-[10px] py-1 px-2.5 rounded-full flex items-center space-x-1 backdrop-blur-xs">
                    <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300 mr-0.5" />
                    <span>{reward.cost} Sparks</span>
                  </div>
                </div>

                {/* Info and action */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-800 leading-snug">{reward.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{reward.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={loading}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer ${
                      isAffordable 
                        ? "bg-[#FF3F6C] hover:bg-[#E63960] text-white hover:shadow-md hover:shadow-pink-100 active:scale-98" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Redeem Code
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Redemption History Table / List */}
      <div className="glass-card-light rounded-3xl p-6 shadow-sm space-y-4 border-white/85">
        <h3 className="text-md font-display font-extrabold text-gray-800 uppercase tracking-wider">Redeemed Vouchers</h3>
        
        {redemptions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs italic">
            You haven't redeemed any rewards yet. Accumulate sparks and check this log!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {redemptions.map((log) => {
              const isCopied = copiedId === log.id;

              return (
                <div key={log.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-3.5 gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-gray-800 leading-snug">{log.title}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Redeemed on {new Date(log.redeemedAt).toLocaleString()} • Cost: {log.cost} Sparks
                    </p>
                  </div>

                  {/* Coupon Code copy trigger */}
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-gray-700 select-all">
                      {log.code}
                    </div>
                    <button
                      onClick={() => handleCopy(log.code, log.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        isCopied 
                          ? "bg-green-50 border-green-200 text-green-600" 
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-800"
                      }`}
                      title="Copy Coupon Code"
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
