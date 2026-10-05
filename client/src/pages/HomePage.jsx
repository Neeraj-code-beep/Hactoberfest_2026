import React from 'react';
import { motion } from 'framer-motion';
import { getGreetingForAshmita } from '../lib/utils.js';
import QuickCaptureCard from '../features/quickCapture/QuickCaptureCard.jsx';
import TellLaterPreview from '../features/tellLater/TellLaterPreview.jsx';
import SelfCareCard from '../features/checkins/SelfCareCard.jsx';
import MemoriesPreview from '../features/memories/MemoriesPreview.jsx';
import { Heart, Sparkles } from 'lucide-react';

export default function HomePage() {
  const greeting = getGreetingForAshmita();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8"
    >
      {/* Personalized Welcoming Banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFF5F2] via-[#FFF8F5] to-[#FDF3ED] border border-[#F4E2D8] shadow-xs relative overflow-hidden"
      >
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-rose-700 text-xs font-medium border border-rose-200/60 mb-3 shadow-2xs">
            <span>{greeting.icon}</span>
            <span>{greeting.text}, Ashmita</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2E2523] tracking-tight font-['Outfit']">
            Your space for the little things.
          </h2>
          <p className="text-sm sm:text-base text-[#695D57] mt-2 font-['Lora'] italic">
            "{greeting.note}"
          </p>
        </div>

        {/* Decorative soft circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-36 h-36 rounded-full bg-amber-200/30 blur-xl pointer-events-none" />
      </motion.div>

      {/* Main Quick Capture natural input */}
      <motion.div variants={itemVariants}>
        <QuickCaptureCard />
      </motion.div>

      {/* Grid of Core Modules */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tell Dheeraj Later */}
        <TellLaterPreview />

        {/* Gentle Self Care Status */}
        <SelfCareCard />
      </motion.div>

      {/* Memories & Moments Timeline */}
      <motion.div variants={itemVariants}>
        <MemoriesPreview />
      </motion.div>

      {/* Footer message */}
      <motion.footer
        variants={itemVariants}
        className="pt-8 pb-12 text-center text-xs text-[#A89D98] flex items-center justify-center gap-1.5"
      >
        <span>Built with care for Ashmita</span>
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
        <span>• Hacktoberfest 2026</span>
      </motion.footer>
    </motion.div>
  );
}
