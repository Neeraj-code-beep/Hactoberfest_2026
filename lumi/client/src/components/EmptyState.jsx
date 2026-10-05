import React from 'react';
import { Heart, Sparkles, Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Heart,
  title = 'Nothing here yet ♡',
  message = 'Your little moments will appear here once you start saving them.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="py-12 px-6 rounded-3xl bg-[#FFFDF8] border border-[#E8DED2]/80 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F8F3EA] border border-[#E8DED2] flex items-center justify-center text-[#B97868] mb-3 shadow-xs">
        <Icon className="w-5 h-5 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-medium text-[#3B302B] font-display mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-[#8B7D74] max-w-sm leading-relaxed mb-4">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-medium px-4 py-2 rounded-full bg-[#F1E8DA] hover:bg-[#E8C7B8]/40 text-[#3B302B] border border-[#E8DED2] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
