import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Check, AlertCircle, Heart } from 'lucide-react';
import { captureThoughtApi } from '../../services/api.js';

const QUICK_STARTERS = [
  'Neha said something funny in class today, tell Neeraj later',
  'Had lunch on time and drank plenty of water ✨',
  'Found a quiet library corner with perfect sunlight',
  'Ask Neeraj about that podcast he recommended',
];

export default function QuickCaptureCard() {
  const [thought, setThought] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();

  const captureMutation = useMutation({
    mutationFn: (text) => captureThoughtApi(text),
    onSuccess: (data) => {
      setLastSaved({
        content: thought,
        message: data?.friendlyMessage || 'Saved for later ♡',
        intent: data?.intent,
      });
      setThought('');
      setErrorMessage('');

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tell-later'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['self-care'] });

      // Clear success notification banner after 6 seconds
      setTimeout(() => {
        setLastSaved((current) => (current?.content === data?.item?.content ? null : current));
      }, 6000);
    },
    onError: (err) => {
      setErrorMessage(
        err?.response?.data?.message ||
        "I couldn't save that right now. Please try again in a moment."
      );
    },
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = thought.trim();
    if (!trimmed || captureMutation.isPending) return;
    setErrorMessage('');
    captureMutation.mutate(trimmed);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <section aria-labelledby="quick-capture-heading" className="w-full">
      <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E8DED2] shadow-lumi hover:border-[#E8C7B8]/70 transition-all duration-300 relative overflow-hidden">
        {/* Soft decorative background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F1E8DA]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B97868]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[11px] font-semibold">Quick Capture</span>
            </div>

            <span className="text-[11px] text-[#8B7D74] hidden sm:inline">
              Ctrl + Enter to save
            </span>
          </div>

          <h3 id="quick-capture-heading" className="text-xl sm:text-2xl font-semibold text-[#3B302B] font-display mb-1.5">
            What do you want to remember?
          </h3>
          <p className="text-xs sm:text-sm text-[#8B7D74] mb-5 font-sans leading-relaxed">
            Jot down a fleeting thought, something funny for Neeraj, or a little self-care moment.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label htmlFor="thought-input" className="sr-only">
                What do you want to remember?
              </label>
              <textarea
                id="thought-input"
                rows={4}
                value={thought}
                onChange={(e) => {
                  setThought(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Tell me anything..."
                disabled={captureMutation.isPending}
                className="w-full rounded-2xl p-4 sm:p-5 text-sm sm:text-base bg-[#F8F3EA]/70 border border-[#E8DED2] text-[#3B302B] placeholder-[#8B7D74]/60 focus:bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#B97868]/30 focus:border-[#B97868] transition-all resize-none font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              {/* Quick suggestion prompt chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[11px] text-[#8B7D74] shrink-0 mr-1 hidden sm:inline">Ideas:</span>
                {QUICK_STARTERS.slice(0, 2).map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThought(starter)}
                    className="text-[11px] text-[#8B7D74] hover:text-[#3B302B] bg-[#F1E8DA]/60 hover:bg-[#F1E8DA] border border-[#E8DED2]/80 px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px] text-left"
                    title={starter}
                  >
                    "{starter}"
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!thought.trim() || captureMutation.isPending}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B97868] hover:bg-[#A66657] disabled:opacity-40 disabled:hover:bg-[#B97868] text-[#FFFDF8] text-xs sm:text-sm font-medium transition-all shadow-sm shrink-0 active:scale-98"
              >
                {captureMutation.isPending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Gemma is understanding your thought...</span>
                  </>
                ) : (
                  <>
                    <span>Save thought</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Success Feedback Banner */}
          <AnimatePresence>
            {lastSaved && (
              <motion.div
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 p-4 rounded-2xl bg-[#F1E8DA]/80 border border-[#E8C7B8] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#B97868] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs sm:text-sm text-[#3B302B] space-y-1">
                  <p className="font-semibold text-[#B97868] font-display text-sm">
                    {lastSaved.message}
                  </p>
                  <p className="text-[#3B302B] italic font-serif">
                    "{lastSaved.content}"
                  </p>
                  <p className="text-[#8B7D74] text-xs">
                    I'll keep this here for you.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3.5 rounded-2xl bg-[#FFF5F2] border border-[#E8C7B8] flex items-center gap-2.5 text-xs text-[#8B7D74]"
              >
                <AlertCircle className="w-4 h-4 text-[#B97868] shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
