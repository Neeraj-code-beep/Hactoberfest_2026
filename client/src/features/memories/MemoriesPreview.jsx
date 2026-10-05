import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { getMemoriesApi } from '../../services/api.js';
import MemoryCard from './MemoryCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function MemoriesPreview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['memories'],
    queryFn: getMemoriesApi,
  });

  const memories = data?.memories || [];

  return (
    <section id="memories" aria-labelledby="memories-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#F1E8DA] flex items-center justify-center text-[#B97868]">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <h3 id="memories-heading" className="text-lg sm:text-xl font-semibold text-[#3B302B] font-display">
              Little memories
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#8B7D74] font-sans">
            Little moments saved along the way.
          </p>
        </div>

        {memories.length > 0 && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F1E8DA] text-[#3B302B] border border-[#E8DED2]">
            {memories.length} saved
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((k) => (
            <div
              key={k}
              className="p-5 rounded-3xl bg-[#FFFDF8] border border-[#E8DED2] animate-pulse space-y-3"
            >
              <div className="h-4 bg-[#F1E8DA] rounded-full w-20" />
              <div className="h-5 bg-[#F8F3EA] rounded-full w-4/5" />
              <div className="h-3 bg-[#F8F3EA] rounded-full w-1/4" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 rounded-3xl bg-[#FFFDF8] border border-[#E8DED2] text-xs text-[#8B7D74]">
          Could not load memories right now.
        </div>
      ) : memories.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No memories recorded yet"
          message="Capture sweet moments, peaceful views, or notes in Quick Capture."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {memories.map((memory) => (
            <MemoryCard key={memory._id} memory={memory} />
          ))}
        </div>
      )}
    </section>
  );
}
