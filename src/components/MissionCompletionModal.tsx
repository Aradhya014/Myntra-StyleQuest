import React from "react";
import { Sparkles, CheckCircle2, ChevronRight, Trophy, Flame, PartyPopper, X } from "lucide-react";
import { DailyMission } from "../types";

interface MissionCompletionModalProps {
  mission: DailyMission;
  completedCount: number;
  totalMissions: number;
  onContinue: (goToDashboard: boolean) => void;
}

export default function MissionCompletionModal({
  mission,
  completedCount,
  totalMissions,
  onContinue
}: MissionCompletionModalProps) {
  const isDailyQuestComplete = completedCount >= totalMissions;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-panel rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col relative animate-scale-up text-center p-6 sm:p-8 space-y-6">
        
        {/* Explicit Close (X) Button */}
        <button
          onClick={() => onContinue(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer z-10"
          title="Close summary"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Animated Celebration Icon */}
        <div className="relative mx-auto pt-2">
          <div className="h-20 w-20 bg-gradient-myntra text-white rounded-3xl flex items-center justify-center shadow-lg shadow-pink-200 animate-bounce text-4xl">
            {mission.emoji || "🏆"}
          </div>
          <div className="absolute -top-1 -right-2 bg-yellow-400 text-gray-900 p-1.5 rounded-full shadow-md">
            <Sparkles className="h-5 w-5 fill-gray-900" />
          </div>
        </div>

        {/* Title & Celebration Banner */}
        <div className="space-y-2">
          <span className="bg-pink-100 text-myntra-pink text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center">
            <PartyPopper className="h-3.5 w-3.5 mr-1" />
            Mission Accomplished!
          </span>

          <h2 className="text-2xl font-display font-black text-gray-800 tracking-tight">
            {mission.title}
          </h2>

          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            {mission.description}
          </p>
        </div>

        {/* Spark Reward & Quest Progress Card */}
        <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 rounded-2xl p-4 border border-pink-100/80 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-600">Reward Earned</span>
            <span className="text-sm font-mono font-black text-yellow-600 flex items-center bg-white px-2.5 py-1 rounded-lg border border-yellow-200 shadow-xs">
              <Sparkles className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
              +{mission.points} Sparks
            </span>
          </div>

          <div className="h-px bg-gray-200/60" />

          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span className="flex items-center">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500 mr-1" />
              Daily Quest Progress
            </span>
            <span className="font-mono font-bold text-myntra-pink">
              {completedCount} / {totalMissions} Quests Finished
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 bg-white rounded-full overflow-hidden border border-gray-200">
            <div 
              className="h-full bg-gradient-myntra rounded-full transition-all duration-500"
              style={{ width: `${Math.min((completedCount / totalMissions) * 100, 100)}%` }}
            />
          </div>

          {isDailyQuestComplete && (
            <div className="bg-yellow-400/20 border border-yellow-400 text-yellow-900 rounded-xl p-2 text-xs font-bold flex items-center justify-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span>🎉 Daily Quest Complete! +30 Sparks Daily Bonus Awarded!</span>
            </div>
          )}
        </div>

        {/* AI Congratulatory Note */}
        {mission.personalizedReason && (
          <div className="bg-white/60 rounded-xl p-3 border border-gray-100 text-left text-xs text-gray-600 italic">
            💡 <span className="font-semibold text-myntra-pink">AI Stylist:</span> {mission.personalizedReason}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onContinue(false)}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-all border border-gray-200 cursor-pointer"
          >
            Close & Stay Here
          </button>
          
          <button
            onClick={() => onContinue(true)}
            className="w-full py-3 bg-[#FF3F6C] hover:bg-[#E63960] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all shadow-md shadow-pink-100 hover:shadow-pink-200 cursor-pointer flex items-center justify-center"
          >
            Go To Dashboard
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
