import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';

function formatDate(timestamp) {
  if (!timestamp) return 'Recent Moment';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recent Moment';

  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MemoryCard({ memory }) {
  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E8DED2] shadow-xs hover:border-[#E8C7B8] hover:shadow-lumi transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F1E8DA]/60 border border-[#E8DED2] text-[#3B302B]">
            {memory.category || 'Memory'}
          </span>

          <span className="text-[11px] text-[#8B7D74] font-medium">
            {formatDate(memory.createdAt)}
          </span>
        </div>

        <p className="text-sm sm:text-base text-[#3B302B] leading-relaxed font-serif italic mb-2">
          "{memory.content}"
        </p>
      </div>

      <div className="pt-3 border-t border-[#E8DED2]/40 flex items-center gap-1.5 text-[11px] text-[#8B7D74]">
        <Sparkles className="w-3 h-3 text-[#B97868]" />
        <span>Kept in your little moments</span>
      </div>
    </motion.article>
  );
}
