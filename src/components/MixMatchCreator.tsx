import React, { useState } from "react";
import { Palette, Sparkles, Plus, Trash2, CheckCircle, Info, Loader2 } from "lucide-react";
import { Product } from "../types";
import { mockCatalog } from "../data/catalog";

interface CreatorProps {
  onVerifyOutfit: (outfitName: string, top: Product, bottom: Product, shoes: Product, accessory: Product) => Promise<void>;
  loading: boolean;
  outfitsCount: number;
}

export default function MixMatchCreator({
  onVerifyOutfit,
  loading,
  outfitsCount
}: CreatorProps) {
  const [outfitName, setOutfitName] = useState("");
  const [topSlot, setTopSlot] = useState<Product | null>(null);
  const [bottomSlot, setBottomSlot] = useState<Product | null>(null);
  const [shoesSlot, setShoesSlot] = useState<Product | null>(null);
  const [accessorySlot, setAccessorySlot] = useState<Product | null>(null);
  const [selectedDrawerCategory, setSelectedDrawerCategory] = useState<"Tops" | "Bottoms" | "Shoes" | "Accessories">("Tops");
  const [showStatus, setShowStatus] = useState<string | null>(null);

  // Group catalog items appropriately
  const tops = mockCatalog.filter(p => p.category === "Indian Wear" || p.name.includes("Tee") || p.name.includes("Dress"));
  const bottoms = mockCatalog.filter(p => p.category === "Western Wear" && (p.name.includes("Jeans") || p.name.includes("Chino")));
  const shoes = mockCatalog.filter(p => p.category === "Sneakers");
  const accessories = mockCatalog.filter(p => p.category === "Accessories");

  const getDrawerItems = () => {
    switch (selectedDrawerCategory) {
      case "Tops": return tops;
      case "Bottoms": return bottoms;
      case "Shoes": return shoes;
      case "Accessories": return accessories;
    }
  };

  const handleSelectItem = (prod: Product) => {
    switch (selectedDrawerCategory) {
      case "Tops":
        setTopSlot(prod);
        break;
      case "Bottoms":
        setBottomSlot(prod);
        break;
      case "Shoes":
        setShoesSlot(prod);
        break;
      case "Accessories":
        setAccessorySlot(prod);
        break;
    }
  };

  const handleRemoveItem = (slot: "top" | "bottom" | "shoes" | "accessory") => {
    if (slot === "top") setTopSlot(null);
    if (slot === "bottom") setBottomSlot(null);
    if (slot === "shoes") setShoesSlot(null);
    if (slot === "accessory") setAccessorySlot(null);
  };

  const isOutfitComplete = topSlot && bottomSlot && shoesSlot && accessorySlot && outfitName.trim().length > 0;

  const handleSubmitOutfit = async () => {
    if (!isOutfitComplete) return;

    try {
      await onVerifyOutfit(
        outfitName,
        topSlot,
        bottomSlot,
        shoesSlot,
        accessorySlot
      );
      setShowStatus("Outfit compiled! Mission verified and +20 Sparks added.");
      
      // Clear Slots
      setOutfitName("");
      setTopSlot(null);
      setBottomSlot(null);
      setShoesSlot(null);
      setAccessorySlot(null);
      
      setTimeout(() => setShowStatus(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="mix-match-creator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      {/* Title block */}
      <div className="lg:col-span-12">
        <h2 className="text-xl font-display font-black text-gray-800 flex items-center">
          <Palette className="h-5.5 w-5.5 text-myntra-pink mr-2" />
          Style Room: Mix & Match Outfit Creator
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Select items to populate each wardrobe slot, give your outfit an elegant style name, and submit to verify the Quest outfit mission.
        </p>
      </div>

      {/* Left Column: Virtual Canvas Slots */}
      <div className="lg:col-span-7 glass-card-light rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
        
        {/* Outfit Name Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Outfit Style Name</label>
          <input
            type="text"
            placeholder="e.g. Street Vintage, Summer Wedding look..."
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl text-xs focus:ring-1 focus:ring-myntra-pink focus:outline-none focus:border-myntra-pink transition-all"
          />
        </div>

        {/* 4 Virtual Slots Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Top Slot */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white/45 backdrop-blur-xs relative flex flex-col items-center justify-center min-h-44 text-center hover:bg-white/65 transition-all">
            {topSlot ? (
              <div className="space-y-2 w-full">
                <img src={topSlot.image} alt={topSlot.name} className="h-20 w-20 object-cover rounded-lg mx-auto shadow-xs" />
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{topSlot.name}</p>
                <p className="text-[9px] text-gray-400">{topSlot.brand}</p>
                <button 
                  onClick={() => handleRemoveItem("top")}
                  className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => setSelectedDrawerCategory("Tops")} className="cursor-pointer space-y-1">
                <div className="h-10 w-10 bg-pink-50 text-myntra-pink rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-600">Select Top</p>
                <p className="text-[9px] text-gray-400">Kurta, Jacket, Dress, Tee</p>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-100/80 backdrop-blur-xs text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 px-1.5 py-0.5 rounded">Slot 1: Top</span>
          </div>

          {/* Bottom Slot */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white/45 backdrop-blur-xs relative flex flex-col items-center justify-center min-h-44 text-center hover:bg-white/65 transition-all">
            {bottomSlot ? (
              <div className="space-y-2 w-full">
                <img src={bottomSlot.image} alt={bottomSlot.name} className="h-20 w-20 object-cover rounded-lg mx-auto shadow-xs" />
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{bottomSlot.name}</p>
                <p className="text-[9px] text-gray-400">{bottomSlot.brand}</p>
                <button 
                  onClick={() => handleRemoveItem("bottom")}
                  className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => setSelectedDrawerCategory("Bottoms")} className="cursor-pointer space-y-1">
                <div className="h-10 w-10 bg-pink-50 text-myntra-pink rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-600">Select Bottom</p>
                <p className="text-[9px] text-gray-400">Jeans, Chinos, Pants</p>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-100/80 backdrop-blur-xs text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 px-1.5 py-0.5 rounded">Slot 2: Bottom</span>
          </div>

          {/* Shoes Slot */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white/45 backdrop-blur-xs relative flex flex-col items-center justify-center min-h-44 text-center hover:bg-white/65 transition-all">
            {shoesSlot ? (
              <div className="space-y-2 w-full">
                <img src={shoesSlot.image} alt={shoesSlot.name} className="h-20 w-20 object-cover rounded-lg mx-auto shadow-xs" />
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{shoesSlot.name}</p>
                <p className="text-[9px] text-gray-400">{shoesSlot.brand}</p>
                <button 
                  onClick={() => handleRemoveItem("shoes")}
                  className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => setSelectedDrawerCategory("Shoes")} className="cursor-pointer space-y-1">
                <div className="h-10 w-10 bg-pink-50 text-myntra-pink rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-600">Select Shoes</p>
                <p className="text-[9px] text-gray-400">Sneakers, Footwear</p>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-100/80 backdrop-blur-xs text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 px-1.5 py-0.5 rounded">Slot 3: Shoes</span>
          </div>

          {/* Accessory Slot */}
          <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-white/45 backdrop-blur-xs relative flex flex-col items-center justify-center min-h-44 text-center hover:bg-white/65 transition-all">
            {accessorySlot ? (
              <div className="space-y-2 w-full">
                <img src={accessorySlot.image} alt={accessorySlot.name} className="h-20 w-20 object-cover rounded-lg mx-auto shadow-xs" />
                <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{accessorySlot.name}</p>
                <p className="text-[9px] text-gray-400">{accessorySlot.brand}</p>
                <button 
                  onClick={() => handleRemoveItem("accessory")}
                  className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div onClick={() => setSelectedDrawerCategory("Accessories")} className="cursor-pointer space-y-1">
                <div className="h-10 w-10 bg-pink-50 text-myntra-pink rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-600">Select Accessory</p>
                <p className="text-[9px] text-gray-400">Watch, Sunglasses, Bags</p>
              </div>
            )}
            <span className="absolute bottom-2 left-2 bg-gray-100/80 backdrop-blur-xs text-[8px] font-mono font-bold uppercase tracking-wider text-gray-400 px-1.5 py-0.5 rounded">Slot 4: Accessory</span>
          </div>

        </div>

        {/* Verification Trigger Button */}
        <div className="space-y-2">
          {showStatus && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-3 text-xs flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{showStatus}</span>
            </div>
          )}

          <button
            onClick={handleSubmitOutfit}
            disabled={!isOutfitComplete || loading}
            className={`w-full flex items-center justify-center text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md ${
              isOutfitComplete && !loading
                ? "bg-gradient-myntra text-white hover:shadow-lg active:scale-98 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Compiling Outfit...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Verify outfit (Complete Mission)
              </>
            )}
          </button>
        </div>

      </div>

      {/* Right Column: Drawer Selector */}
      <div className="lg:col-span-5 glass-card-light rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
        
        <div className="space-y-2">
          <span className="bg-pink-50 text-myntra-pink text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
            Wardrobe Drawer
          </span>
          <h3 className="text-md font-display font-bold text-gray-800">Assign Items</h3>
          
          {/* Drawer Category Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200/50">
            {(["Tops", "Bottoms", "Shoes", "Accessories"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedDrawerCategory(tab)}
                className={`py-1.5 text-[10px] font-bold rounded-md transition-all ${
                  selectedDrawerCategory === tab
                    ? "bg-white text-myntra-pink shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Item Listing Grid */}
        <div className="flex-1 overflow-y-auto max-h-72 pr-1 space-y-2">
          {getDrawerItems().map((prod) => (
            <div 
              key={prod.id}
              onClick={() => handleSelectItem(prod)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl cursor-pointer transition-all group"
            >
              <img src={prod.image} alt={prod.name} className="h-12 w-12 object-cover rounded-lg" />
              <div className="flex-1 text-left">
                <span className="block text-[9px] font-bold text-gray-400 uppercase leading-none">{prod.brand}</span>
                <span className="block text-xs font-bold text-gray-700 group-hover:text-myntra-pink transition-colors leading-normal">{prod.name}</span>
                <span className="block text-[11px] font-mono text-gray-500 mt-0.5">Rs. {prod.price}</span>
              </div>
              <div className="h-7 w-7 bg-pink-50 text-myntra-pink rounded-full flex items-center justify-center font-bold text-xs group-hover:bg-myntra-pink group-hover:text-white transition-all">
                +
              </div>
            </div>
          ))}
        </div>

        {/* Informative Help Footer */}
        <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex items-start space-x-2.5 text-blue-800 text-[11px] leading-relaxed">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <span>Need 1 Top, 1 Bottom, 1 Footwear, and 1 Accessory together to build a valid catalog combo and unlock your sparks!</span>
        </div>

      </div>

    </div>
  );
}
