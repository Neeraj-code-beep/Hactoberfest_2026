import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Smile,
  Sparkles,
  Coffee,
  Heart,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';

const CATEGORY_ICONS = {
  college: GraduationCap,
  conversation: Smile,
  funny: Smile,
  plans: Coffee,
  care: Heart,
  general: Sparkles,
};

function formatTime(timestamp) {
  if (!timestamp) return 'Earlier';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return isToday ? `Today · ${timeStr}` : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${timeStr}`;
}

export default function TellLaterCard({ item, onToggleComplete, isPending }) {
  const catKey = (item.category || 'general').toLowerCase();
  const IconComponent = CATEGORY_ICONS[catKey] || Sparkles;

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-3xl border transition-all ${
        item.isCompleted
          ? 'bg-[#F8F3EA]/50 border-[#E8DED2]/60 opacity-60'
          : 'bg-[#FFFDF8] border-[#E8DED2] shadow-xs hover:border-[#E8C7B8] hover:shadow-lumi'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1E8DA]/60 border border-[#E8DED2] text-[11px] font-medium text-[#3B302B]">
          <Heart className="w-3 h-3 text-[#B97868] fill-[#B97868]/30" />
          <span>{item.category || 'Thought'}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#8B7D74]">
          <Clock className="w-3 h-3" />
          <span>{formatTime(item.createdAt)}</span>
        </div>
      </div>

      <p
        className={`text-sm sm:text-base leading-relaxed mb-4 font-sans ${
          item.isCompleted ? 'line-through text-[#8B7D74]' : 'text-[#3B302B]'
        }`}
      >
        {item.content}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-[#E8DED2]/50">
        <span className="text-[11px] text-[#8B7D74]">
          {item.isCompleted ? 'Shared with Dheeraj ♡' : 'Saved for next chat'}
        </span>

        <button
          type="button"
          onClick={() => onToggleComplete(item._id)}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
            item.isCompleted
              ? 'text-[#8B7D74] hover:text-[#3B302B] bg-[#F1E8DA]/40'
              : 'text-[#B97868] hover:text-[#A66657] hover:bg-[#F1E8DA]/80'
          }`}
        >
          {item.isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7E9F88]" />
              <span>Mark as unread</span>
            </>
          ) : (
            <>
              <span>Mark as told</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
