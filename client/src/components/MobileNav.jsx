import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircleHeart, BookOpen, HeartHandshake, Sparkles } from 'lucide-react';
import ServerStatusBadge from './ServerStatusBadge.jsx';

export default function MobileNav({ isOpen, onClose, activeSection, onSelectSection }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3B302B]/20 backdrop-blur-xs z-50 md:hidden"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 bg-[#FFFDF8] border-b border-[#E8DED2] p-6 shadow-lumi z-50 md:hidden"
            aria-label="Mobile Navigation"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DED2]">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display text-[#3B302B]">Lumi</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F1E8DA] text-[#8B7D74] font-sans">
                  for Ashmita
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#F8F3EA] text-[#3B302B] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {[
                { id: 'quick-capture', label: 'Quick Capture', icon: Sparkles },
                { id: 'tell-later', label: 'Things to tell Dheeraj', icon: MessageCircleHeart },
                { id: 'memories', label: 'Memories', icon: BookOpen },
                { id: 'self-care', label: 'Self Care', icon: HeartHandshake },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onSelectSection(id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-left transition-colors ${
                    activeSection === id
                      ? 'bg-[#F1E8DA] text-[#3B302B]'
                      : 'text-[#8B7D74] hover:bg-[#F8F3EA] hover:text-[#3B302B]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#B97868]" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8DED2] flex items-center justify-between">
              <span className="text-xs text-[#8B7D74]">Status</span>
              <ServerStatusBadge />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
