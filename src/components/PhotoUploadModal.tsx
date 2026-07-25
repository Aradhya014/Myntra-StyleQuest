import React, { useState, useRef } from "react";
import { Camera, X, UploadCloud, Sparkles, Loader2, CheckCircle2, AlertTriangle, Lightbulb, Star, ShieldCheck, Heart, Footprints } from "lucide-react";
import { AIStyleReport, Product } from "../types";

interface PhotoUploadProps {
  onClose: () => void;
  onSubmitPhoto: (base64: string) => Promise<{ success: boolean; aiAnalysis: string; aiStyleReport?: AIStyleReport }>;
}

export default function PhotoUploadModal({
  onClose,
  onSubmitPhoto
}: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ success: boolean; text: string; report?: AIStyleReport } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presets = [
    {
      id: "preset-fit-1",
      name: "Vintage OOTD Fit 👗",
      thumbnail: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=200",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "preset-fit-2",
      name: "Streetwear Sneakers 👟",
      thumbnail: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=200",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "preset-bad-1",
      name: "Coffee Mug (Trigger AI Reject) ☕",
      thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=200",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await convertFileToBase64(file);
      setPreview(base64);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const base64 = await convertFileToBase64(file);
      setPreview(base64);
    }
  };

  const handleVerify = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const res = await onSubmitPhoto(preview);
      setAiResponse({
        success: res.success,
        text: res.aiAnalysis,
        report: res.aiStyleReport
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setAiResponse(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-panel rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative animate-scale-up max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/60 bg-white/20">
          <div className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-myntra-pink" />
            <h3 className="text-sm font-display font-black text-gray-800 uppercase tracking-wider">
              ✨ AI Personal Stylist & OOTD Verifier
            </h3>
          </div>
          {!loading && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {!aiResponse ? (
            <div className="space-y-6">
              {!preview ? (
                <div className="space-y-4">
                  {/* File Upload Stage */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-56 ${
                      dragActive 
                        ? "border-myntra-pink bg-pink-50/20" 
                        : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                    }`}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <UploadCloud className="h-10 w-10 text-gray-400 mb-3 animate-pulse" />
                    <p className="text-xs font-bold text-gray-700">Drag and drop your OOTD selfie, or click to upload</p>
                    <p className="text-[10px] text-gray-400 mt-1">Receive an instant AI Style Report + Score</p>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">No photo? Select a sandbox preset:</span>
                    <div className="grid grid-cols-3 gap-3">
                      {presets.map((preset) => (
                        <div 
                          key={preset.id}
                          onClick={() => setPreview(preset.image)}
                          className="group border border-gray-100 hover:border-myntra-pink rounded-xl p-2 cursor-pointer transition-all flex flex-col items-center bg-gray-50 hover:bg-pink-50/30"
                        >
                          <img src={preset.thumbnail} alt={preset.name} className="h-16 w-full object-cover rounded-lg" />
                          <span className="block text-[9px] text-center font-bold text-gray-600 group-hover:text-myntra-pink mt-1 line-clamp-1">{preset.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                    <img src={preview} alt="Upload preview" className="max-h-64 object-contain" />
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full flex items-center justify-center bg-[#FF3F6C] hover:bg-[#E63960] text-white text-xs font-bold tracking-wider uppercase py-3.5 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer hover:shadow-lg hover:shadow-pink-100"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        AI Stylist Inspecting OOTD Fit...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
                        Generate AI Style Report
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* AI Style Report Output Stage */
            <div className="space-y-6">
              {aiResponse.success && aiResponse.report ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Score Banner */}
                  <div className="bg-gradient-myntra rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="space-y-1 text-center sm:text-left z-10">
                      <span className="bg-white/20 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ✨ AI Style Report
                      </span>
                      <h4 className="text-xl font-display font-black">
                        {aiResponse.report.occasion} Fit
                      </h4>
                      <p className="text-xs text-white/90">
                        Category: <span className="font-bold text-yellow-300">{aiResponse.report.styleCategory}</span> • Harmony: <span className="font-bold">{aiResponse.report.colorHarmony}</span>
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/20 text-center shrink-0">
                      <span className="text-[10px] text-white/80 uppercase font-mono font-bold block">Style Score</span>
                      <span className="text-3xl font-mono font-black text-yellow-300">{aiResponse.report.overallScore}</span>
                      <span className="text-[9px] text-white/90 block">Confidence {aiResponse.report.confidence}</span>
                    </div>
                  </div>

                  {/* Rating & Insights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Footwear Recommendation */}
                    <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center space-x-1.5 text-myntra-pink">
                        <Footprints className="h-4 w-4" />
                        <span className="text-xs font-mono font-bold uppercase">Footwear Pairing</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        {aiResponse.report.footwearRecommendation}
                      </p>
                    </div>

                    {/* Accessories Recommendation */}
                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-1">
                      <div className="flex items-center space-x-1.5 text-amber-700">
                        <Sparkles className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-mono font-bold uppercase">Accessory Guide</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        {aiResponse.report.accessoriesRecommendation}
                      </p>
                    </div>

                  </div>

                  {/* Personal Styling Tip */}
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center space-x-1.5 text-purple-700">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-mono font-bold uppercase">Personal Stylist Tip</span>
                    </div>
                    <p className="text-xs text-purple-900 leading-relaxed font-medium">
                      {aiResponse.report.personalStylingTip}
                    </p>
                  </div>

                  {/* Complete The Look Recommendations */}
                  {aiResponse.report.completeTheLook && aiResponse.report.completeTheLook.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="text-xs font-display font-extrabold text-gray-800 uppercase tracking-wider flex items-center">
                        <Heart className="h-3.5 w-3.5 text-myntra-pink mr-1" />
                        Complete The Look (Suggested Products)
                      </h5>

                      <div className="grid grid-cols-3 gap-3">
                        {aiResponse.report.completeTheLook.map((prod) => (
                          <div key={prod.id} className="bg-gray-50 border border-gray-100 rounded-xl p-2 text-left space-y-1">
                            <img src={prod.image} alt={prod.name} className="h-16 w-full object-cover rounded-lg" />
                            <span className="block text-[8px] font-mono font-bold text-gray-400 uppercase">{prod.brand}</span>
                            <span className="block text-[10px] font-bold text-gray-700 line-clamp-1">{prod.name}</span>
                            <span className="block text-[10px] font-mono font-bold text-myntra-pink">Rs. {prod.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Success Reward Chip */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-xs font-bold text-green-800 flex items-center justify-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Mission Verified! +20 Sparks Added to Your Vault 🪙</span>
                  </div>

                </div>
              ) : (
                /* Rejection stage */
                <div className="space-y-4 text-center">
                  <div className="h-14 w-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold text-gray-800">Apparel Verification Failed</h4>
                    <p className="text-xs text-gray-500">Our Vision Model rejected this upload as non-fashion related.</p>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-left space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-rose-700">Analysis Feedback</span>
                    <p className="text-xs text-rose-800 leading-relaxed font-semibold">{aiResponse.text}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all border border-gray-200 cursor-pointer"
                >
                  Upload Another Fit
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#FF3F6C] hover:bg-[#E63960] text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-pink-100 cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
