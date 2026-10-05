import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, MessageCircleQuestion, Send, ArrowRight, BookOpen, Clock, Heart } from 'lucide-react';
import { askLumiApi } from '../../services/api.js';

const SAMPLE_QUESTIONS = [
  'What did I want to tell Neeraj recently?',
  'What have I saved about college?',
  'Show me the things I wanted to remember.',
  'What memories do I have so far?',
];

export default function AskLumiCard() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const askMutation = useMutation({
    mutationFn: (q) => askLumiApi(q),
    onSuccess: (data) => {
      setResult({
        question,
        answer: data.answer,
        sources: data.sources || [],
      });
      setErrorMessage('');
    },
    onError: (err) => {
      setErrorMessage(
        err?.response?.data?.message ||
        "I couldn't look that up right now. Please try again in a moment."
      );
    },
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || askMutation.isPending) return;
    setErrorMessage('');
    askMutation.mutate(trimmed);
  };

  const handleSelectSample = (sample) => {
    setQuestion(sample);
    setErrorMessage('');
    askMutation.mutate(sample);
  };

  return (
    <section id="ask-lumi" aria-labelledby="ask-lumi-heading" className="w-full">
      <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E8DED2] shadow-lumi hover:border-[#E8C7B8]/70 transition-all duration-300 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#F1E8DA]/40 rounded-full blur-2xl pointer-events-none -ml-16 -mt-16" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B97868]">
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider text-[11px] font-semibold">Ask Lumi</span>
            </div>
          </div>

          <h3 id="ask-lumi-heading" className="text-xl sm:text-2xl font-semibold text-[#3B302B] font-display mb-1.5">
            Ask about your memories & notes
          </h3>
          <p className="text-xs sm:text-sm text-[#8B7D74] mb-5 font-sans leading-relaxed">
            Lumi will search your database and summarize what you've saved using local Gemma.
          </p>

          <form onSubmit={handleSubmit} className="relative mb-4">
            <input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Ask anything about what you've saved..."
              disabled={askMutation.isPending}
              className="w-full rounded-2xl py-3.5 px-4 pr-12 text-sm sm:text-base bg-[#F8F3EA]/70 border border-[#E8DED2] text-[#3B302B] placeholder-[#8B7D74]/60 focus:bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#B97868]/30 focus:border-[#B97868] transition-all"
            />
            <button
              type="submit"
              disabled={!question.trim() || askMutation.isPending}
              className="absolute right-2 top-2 p-2 rounded-xl bg-[#B97868] hover:bg-[#A66657] disabled:opacity-40 text-white transition-all shadow-xs"
              aria-label="Submit question"
            >
              {askMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          {/* Sample quick question chips */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SAMPLE_QUESTIONS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="text-[11px] text-[#8B7D74] hover:text-[#3B302B] bg-[#F1E8DA]/60 hover:bg-[#F1E8DA] border border-[#E8DED2]/80 px-3 py-1.5 rounded-full transition-colors text-left"
              >
                💬 {sample}
              </button>
            ))}
          </div>

          {/* Answer Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#F8F3EA]/80 border border-[#E8DED2] space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#B97868]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lumi's Answer</span>
                </div>

                <p className="text-sm sm:text-base text-[#3B302B] font-serif leading-relaxed whitespace-pre-line">
                  {result.answer}
                </p>

                {result.sources?.length > 0 && (
                  <div className="pt-3 border-t border-[#E8DED2]/60">
                    <span className="text-[11px] font-medium text-[#8B7D74] block mb-2">
                      Based on {result.sources.length} saved {result.sources.length === 1 ? 'item' : 'items'}:
                    </span>
                    <div className="space-y-1.5">
                      {result.sources.slice(0, 4).map((src) => (
                        <div
                          key={src.id}
                          className="text-xs p-2 rounded-xl bg-[#FFFDF8] border border-[#E8DED2] text-[#3B302B] flex items-center justify-between"
                        >
                          <span className="truncate max-w-[80%]">"{src.content}"</span>
                          <span className="text-[10px] text-[#8B7D74] shrink-0 ml-2">
                            {src.intent === 'tell_later' && src.recipient ? `For ${src.recipient}` : src.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-[#FFF5F2] border border-[#E8C7B8] text-xs text-[#8B7D74]">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
