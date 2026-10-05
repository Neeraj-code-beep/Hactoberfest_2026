import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MEMORIES = [
  {
    id: 1,
    date: 'Yesterday, 6:40 PM',
    content: 'Finished the design draft ahead of schedule. Felt peaceful having tea while watching the sunset.',
    category: 'Little Moment',
    accent: 'border-rose-100 bg-rose-50/40'
  },
  {
    id: 2,
    date: 'Oct 03, 2:15 PM',
    content: 'Discovered a tiny cozy bakery nearby that plays soft acoustic songs.',
    category: 'Places',
    accent: 'border-amber-100 bg-amber-50/40'
  }
];

export default function MemoriesPreview() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100/70 text-purple-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2E2523] font-['Outfit']">Memories & Moments</h3>
            <p className="text-xs text-[#796E69]">Little things worth keeping</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MEMORIES.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -2 }}
            className={`p-4 rounded-2xl border ${m.accent} transition-all`}
          >
            <div className="flex items-center justify-between mb-1 text-[11px] text-[#796E69]">
              <span className="font-semibold px-2 py-0.5 rounded bg-white text-[#5E514B] border border-[#EFE7DE]">
                {m.category}
              </span>
              <span>{m.date}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#2E2523] leading-relaxed mt-2 font-['Lora'] italic">
              "{m.content}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
