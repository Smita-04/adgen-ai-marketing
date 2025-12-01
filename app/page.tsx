'use client';

import { useState } from 'react';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  
  // We store the result AND the ready-to-share file
  const [result, setResult] = useState<{ caption: string; imageUrl: string } | null>(null);
  const [shareFile, setShareFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!productName || !audience) return;
    
    setLoading(true);
    setResult(null);
    setShareFile(null); // Reset previous file

    try {
      // Step 1: Call API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, audience }),
      });
      
      const data = await res.json();
      if (!data.imagePrompt) throw new Error("Failed to get prompt");

      // Step 2: Generate Image URL
      const encodedPrompt = encodeURIComponent(data.imagePrompt);
      const seed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux`;

      // Set visible result
      setResult({
        caption: data.caption,
        imageUrl: imageUrl
      });

      // --- CRITICAL FIX: PRE-DOWNLOAD THE IMAGE ---
      // We download it now (in background) so it is ready when user clicks "Share"
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(imageUrl)}`;
      fetch(proxyUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], "ad-creative.jpg", { type: "image/jpeg" });
          setShareFile(file); // Save file to state
        })
        .catch(err => console.error("Background download failed", err));

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;

    // Check if we have the file ready from the background download
    if (shareFile) {
        try {
            // Try Native Share (Mobile)
            if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
                await navigator.share({
                    title: 'AdGen AI Creative',
                    text: result.caption,
                    files: [shareFile],
                });
                return; // Stop here if share worked
            }
        } catch (error) {
            console.log("Native share failed or closed, trying fallback...");
        }
    }

    // --- FALLBACK (Desktop or if Share fails) ---
    // If native share didn't work, we do the Desktop flow
    try {
        await navigator.clipboard.writeText(result.caption);
        alert("Caption copied! Opening image in new tab...");
        window.open(result.imageUrl, '_blank');
        setTimeout(() => {
            window.open('https://www.instagram.com/', '_blank');
        }, 1000);
    } catch (err) {
        console.error("Fallback failed", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-violet-50 via-purple-50 to-fuchsia-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="inline-block mb-3">
                <div className="text-5xl animate-bounce">🚀</div>
              </div>
              <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                AdGen AI
              </h1>
              <p className="text-purple-100 font-medium tracking-wide">
                Your Instant Marketing Studio
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                ✨ Product Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Neon Energy Drink"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium bg-white shadow-sm hover:shadow-md"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                🎯 Target Audience
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gamers late at night"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-800 placeholder-gray-400 font-medium bg-white shadow-sm hover:shadow-md"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !productName || !audience}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${
                loading || !productName || !audience
                  ? 'bg-linear-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
                  : 'bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    Crafting...
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    Generate Magic
                  </>
                )}
              </span>
              {!loading && productName && audience && (
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>

          {/* Results Display */}
          {result && (
            <div className="border-t-2 border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative aspect-square w-full bg-linear-to-r from-gray-100 to-gray-200 overflow-hidden group">
                <img 
                  src={result.imageUrl} 
                  alt="Generated Ad" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 bg-linear-to-r from-gray-50 to-purple-50/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">💬</span>
                  <h3 className="text-xs font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 uppercase tracking-widest">
                    Generated Caption
                  </h3>
                </div>
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                  <p className="relative text-gray-800 leading-relaxed font-medium bg-white p-5 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {result.caption}
                  </p>
                </div>

                {/* SHARE BUTTON */}
                <button
                  onClick={handleShare}
                  className="w-full py-3 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>📱</span>
                  {shareFile ? 'Share / Post to Instagram' : 'Copy & Open Instagram'}
                </button>

              </div>
            </div>
          )}
        </div>
        
        {/* Footer credit */}
        <p className="text-center mt-6 text-sm text-purple-600/60 font-medium">
          Powered by AI • Built with passion
        </p>
      </div>
    </div>
  );
}