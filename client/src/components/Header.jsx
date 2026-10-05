import React, { useState } from 'react';
import { Sparkles, Menu, Heart } from 'lucide-react';
import ServerStatusBadge from './ServerStatusBadge.jsx';
import MobileNav from './MobileNav.jsx';

export default function Header({ activeSection, onSelectSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'tell-later', label: 'Tell Later' },
    { id: 'memories', label: 'Memories' },
    { id: 'self-care', label: 'Self Care' },
  ];

  return (
    <>
      <header className="w-full border-b border-[#E8DED2]/80 bg-[#F8F3EA]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onSelectSection('top');
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFFDF8] border border-[#E8DED2] flex items-center justify-center text-[#B97868] shadow-2xs group-hover:border-[#B97868]/40 transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-display text-[#3B302B] tracking-tight">Lumi</span>
                <span className="text-[11px] font-normal text-[#8B7D74] hidden sm:inline">
                  for Ashmita
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onSelectSection(id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeSection === id
                    ? 'bg-[#F1E8DA] text-[#3B302B]'
                    : 'text-[#8B7D74] hover:text-[#3B302B] hover:bg-[#FFFDF8]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Status & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ServerStatusBadge />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-[#E8DED2] bg-[#FFFDF8] text-[#3B302B] md:hidden hover:bg-[#F1E8DA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B97868]/30"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />
    </>
  );
}
