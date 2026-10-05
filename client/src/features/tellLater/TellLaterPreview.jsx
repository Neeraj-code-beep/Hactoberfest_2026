import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircleHeart, Heart } from 'lucide-react';
import { getTellLaterItemsApi, completeTellLaterApi } from '../../services/api.js';
import TellLaterCard from './TellLaterCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function TellLaterPreview() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tell-later'],
    queryFn: getTellLaterItemsApi,
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => completeTellLaterApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tell-later'] });
    },
  });

  const items = data?.items || [];
  const pendingCount = items.filter((i) => !i.isCompleted).length;

  return (
    <section id="tell-later" aria-labelledby="tell-later-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#F1E8DA] flex items-center justify-center text-[#B97868]">
              <MessageCircleHeart className="w-3.5 h-3.5" />
            </div>
            <h3 id="tell-later-heading" className="text-lg sm:text-xl font-semibold text-[#3B302B] font-display">
              Things to tell Dheeraj
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#8B7D74] font-sans">
            Little things you wanted to share later.
          </p>
        </div>

        {items.length > 0 && (
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F1E8DA] text-[#3B302B] border border-[#E8DED2]">
            {pendingCount} to share
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
              <div className="h-4 bg-[#F1E8DA] rounded-full w-24" />
              <div className="h-4 bg-[#F8F3EA] rounded-full w-3/4" />
              <div className="h-3 bg-[#F8F3EA] rounded-full w-1/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-4 rounded-3xl bg-[#FFFDF8] border border-[#E8DED2] text-xs text-[#8B7D74]">
          Could not load items right now.
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={MessageCircleHeart}
          title="No pending thoughts for Dheeraj"
          message="When something funny or interesting happens, type it in Quick Capture above."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <TellLaterCard
              key={item._id}
              item={item}
              onToggleComplete={(id) => toggleMutation.mutate(id)}
              isPending={toggleMutation.isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
}
