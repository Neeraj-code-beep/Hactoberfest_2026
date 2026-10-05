import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { getGreeting } from '../lib/utils.js';
import QuickCaptureCard from '../features/quickCapture/QuickCaptureCard.jsx';
import AskLumiCard from '../features/ask/AskLumiCard.jsx';
import TellLaterPreview from '../features/tellLater/TellLaterPreview.jsx';
import MemoriesPreview from '../features/memories/MemoriesPreview.jsx';
import SelfCareCard from '../features/checkins/SelfCareCard.jsx';

export default function HomePage() {
  const greeting = getGreeting();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14"
    >
      {/* Hero / Greeting Section */}
      <motion.section variants={itemVariants} className="text-center sm:text-left space-y-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#E8DED2] text-xs text-[#8B7D74] shadow-2xs mb-1">
          <Heart className="w-3 h-3 text-[#B97868] fill-[#B97868]/40" />
          <span>Your personal little space</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-semibold text-[#3B302B] font-display tracking-tight leading-tight">
          {greeting.text} ♡
        </h2>

        <p className="text-sm sm:text-base text-[#8B7D74] max-w-xl font-sans leading-relaxed">
          A little space for the things you don't want to forget — thoughts, little moments, things to tell Neeraj later, all in one place.
        </p>
      </motion.section>

      {/* 1. Quick Capture (Main Focus) */}
      <motion.div variants={itemVariants}>
        <QuickCaptureCard />
      </motion.div>

      {/* 2. Ask Lumi (AI Brain & Memory Assistant) */}
      <motion.div variants={itemVariants}>
        <AskLumiCard />
      </motion.div>

      {/* 3. Things to tell Neeraj */}
      <motion.div variants={itemVariants}>
        <TellLaterPreview />
      </motion.div>

      {/* 4. Memories */}
      <motion.div variants={itemVariants}>
        <MemoriesPreview />
      </motion.div>

      {/* 5. Self Care */}
      <motion.div variants={itemVariants}>
        <SelfCareCard />
      </motion.div>

      {/* Subtle Footer */}
      <motion.footer
        variants={itemVariants}
        className="pt-6 pb-12 border-t border-[#E8DED2]/60 text-center text-xs text-[#8B7D74] flex flex-col sm:flex-row items-center justify-between gap-2"
      >
        <div className="flex items-center gap-1.5">
          <span>Lumi</span>
          <span>•</span>
          <span>Little Things Companion</span>
        </div>
        <div className="text-[11px] text-[#8B7D74]/80">
          DEV Weekend Challenge: Build for a Friend
        </div>
      </motion.footer>
    </motion.div>
  );
}
