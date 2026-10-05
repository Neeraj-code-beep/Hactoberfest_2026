import React from 'react';
import { useHealth } from '../hooks/useHealth.js';
import { Sparkles, WifiOff } from 'lucide-react';

export default function ServerStatusBadge() {
  const { data, isLoading, isError } = useHealth();

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-normal text-[#8B7D74] bg-[#F1E8DA]/60 border border-[#E8DED2] rounded-full animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B97868]"></span>
        <span>Connecting...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-normal text-[#8B7D74] bg-[#FFFDF8] border border-[#E8DED2] rounded-full shadow-xs" title="Lumi server running in local preview mode">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8C7B8]"></span>
        <span>Offline Preview</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-normal text-[#3B302B] bg-[#FFFDF8] border border-[#E8DED2] rounded-full shadow-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9AB4A2] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7E9F88]"></span>
      </span>
      <span className="font-medium text-[#3B302B]">Lumi Ready</span>
    </div>
  );
}
