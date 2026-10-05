import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import ServerStatusBadge from './ServerStatusBadge.jsx';

export default function Header() {
  return (
    <header className="w-full border-b border-[#EFE7DE] bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white shadow-sm shadow-rose-200">
            <Sparkles className="w-5 h-5 fill-white/30" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-[#2E2523] font-['Outfit']">Lumi</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium font-sans">
                for Ashmita
              </span>
            </div>
            <p className="text-xs text-[#796E69] font-sans">Little Things Companion</p>
          </div>
        </div>

        {/* Status / Meta */}
        <div className="flex items-center gap-3">
          <ServerStatusBadge />
        </div>
      </div>
    </header>
  );
}
