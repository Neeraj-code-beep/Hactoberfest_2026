import React from 'react';
import { MessageCircleHeart, CheckCircle2, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_ITEMS = [
  {
    id: 1,
    content: "Tell him about the cat video we both laughed at during lunch break",
    tag: "Funny",
    time: "2 hours ago",
    told: false
  },
  {
    id: 2,
    content: "Ask him if he's free on Saturday evening for that café we bookmarked",
    tag: "Plans",
    time: "Yesterday",
    told: false
  },
  {
    id: 3,
    content: "Remind him to take his jacket because it gets chilly at night",
    tag: "Care",
    time: "Yesterday",
    told: true
  }
];

export default function TellLaterPreview() {
  const [items, setItems] = React.useState(INITIAL_ITEMS);

  const toggleTold = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, told: !item.told } : item))
    );
  };

  const pendingCount = items.filter((i) => !i.told).length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100/70 text-rose-600">
            <MessageCircleHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2E2523] font-['Outfit']">Tell Dheeraj Later</h3>
            <p className="text-xs text-[#796E69]">Little things saved for your next chat</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          {pendingCount} to share
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.01 }}
            className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
              item.told
                ? 'bg-[#FDFCFA] border-[#ECE4DC] opacity-60'
                : 'bg-[#FFF9F6] border-[#F5E2DA] hover:border-rose-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleTold(item.id)}
                className={`mt-0.5 rounded-full p-1 transition-colors ${
                  item.told
                    ? 'text-emerald-600 bg-emerald-100'
                    : 'text-[#A89D98] hover:text-rose-600 hover:bg-rose-100'
                }`}
                title={item.told ? 'Marked as told' : 'Mark as told'}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div>
                <p
                  className={`text-sm leading-relaxed ${
                    item.told ? 'line-through text-[#796E69]' : 'text-[#2E2523] font-medium'
                  }`}
                >
                  {item.content}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#A89D98]">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-[#EFE7DE] text-[#695D57]">
                    {item.tag}
                  </span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
