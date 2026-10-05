import React from 'react';
import { useHealth } from '../hooks/useHealth.js';
import { Sparkles, Wifi, WifiOff } from 'lucide-react';

export default function ServerStatusBadge() {
  const { data, isLoading, isError } = useHealth();

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-[#796E69] bg-[#F5EFEB] border border-[#EFE7DE] rounded-full animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        Connecting to Lumi Engine...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-full" title="Server is unreachable or offline">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Backend Standby (Offline Mode)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#4A3E39] bg-[#FFF8F6] border border-[#F4DDD5] rounded-full shadow-xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-medium text-[#5E514B]">Lumi Backend Connected</span>
      <span className="text-[#A89D98] text-[10px] hidden sm:inline">• {data.aiEngine?.provider || 'Gemma Ready'}</span>
    </div>
  );
}
