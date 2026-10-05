import React, { useState } from 'react';
import { Sparkles, Send, MessageCircleHeart, BookmarkPlus, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  'Neha ne aaj class mein ek mast joke sunaya, Dheeraj ko batana hai',
  'Ate my afternoon lunch on time today ✨',
  'Remember to buy that matcha iced tea next week',
  'Dheeraj ko batao that the presentation went really well!'
];

export default function QuickCaptureCard() {
  const [input, setInput] = useState('');
  const [capturedItems, setCapturedItems] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsCapturing(true);
    setTimeout(() => {
      setCapturedItems((prev) => [
        {
          id: Date.now(),
          text: input,
          category: input.toLowerCase().includes('dheeraj') ? 'Tell Dheeraj' : 'Memory',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setInput('');
      setIsCapturing(false);
    }, 400);
  };

  const selectSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-3 text-rose-600">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Quick Capture</span>
      </div>

      <h2 className="text-xl font-bold text-[#2E2523] mb-1 font-['Outfit']">What's on your mind right now?</h2>
      <p className="text-sm text-[#796E69] mb-4">
        Type freely in Hindi, Hinglish, or English. Gemma will organize what to tell Dheeraj, save memories, or track self-care.
      </p>

      <form onSubmit={handleSubmit} className="relative mb-4">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Aaj Dheeraj ko batana hai ki prof ne kya bola... or Drank water!"
          className="w-full rounded-2xl p-4 pr-12 text-sm bg-[#FAF7F2] border border-[#E8DFD5] text-[#2E2523] placeholder-[#A89D98] focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 resize-none transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isCapturing}
          className="absolute right-3 bottom-4 p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rose-500 text-white transition-all shadow-sm"
          title="Capture thought"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Suggested Quick Starters */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-[#A89D98]">Or tap an example thought:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectSuggestion(sug)}
              className="text-xs text-left px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-[#EFE7DE] text-[#695D57] transition-all"
            >
              💭 {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Local captured preview list if any */}
      {capturedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-4 border-t border-[#EFE7DE]"
        >
          <span className="text-xs font-semibold text-[#796E69] uppercase tracking-wider mb-2 block">
            Just Captured in this session
          </span>
          <div className="space-y-2">
            {capturedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start justify-between text-xs"
              >
                <div className="space-y-1">
                  <span className="inline-block font-semibold px-2 py-0.5 rounded-md bg-white text-rose-700 border border-rose-200 text-[10px]">
                    {item.category}
                  </span>
                  <p className="text-[#3D3430] font-medium">{item.text}</p>
                </div>
                <span className="text-[#A89D98] text-[10px] ml-2 shrink-0">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
