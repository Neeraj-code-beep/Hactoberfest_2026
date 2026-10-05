import React, { useState } from 'react';
import { HeartHandshake, Utensils, Droplets, Check, Sparkles, Smile } from 'lucide-react';

export default function SelfCareCard() {
  const [meals, setMeals] = useState({
    breakfast: true,
    lunch: false,
    dinner: false,
    waterGlasses: 4,
  });

  const toggleMeal = (mealKey) => {
    setMeals((prev) => ({
      ...prev,
      [mealKey]: !prev[mealKey],
    }));
  };

  const addWater = () => {
    setMeals((prev) => ({
      ...prev,
      waterGlasses: Math.min(prev.waterGlasses + 1, 10),
    }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EFE7DE] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100/70 text-amber-700">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2E2523] font-['Outfit']">Gentle Care Check-in</h3>
            <p className="text-xs text-[#796E69]">Don't forget to eat and hydrate, Ashmita</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Meal tracker pills */}
        <div>
          <span className="text-xs font-semibold text-[#796E69] uppercase tracking-wider block mb-2">
            Today's Nourishment
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'breakfast', label: 'Breakfast', icon: '🥣' },
              { id: 'lunch', label: 'Lunch', icon: '🥗' },
              { id: 'dinner', label: 'Dinner', icon: '🍲' },
            ].map((meal) => {
              const isDone = meals[meal.id];
              return (
                <button
                  key={meal.id}
                  onClick={() => toggleMeal(meal.id)}
                  className={`p-2.5 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    isDone
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 shadow-xs'
                      : 'bg-[#FAF7F2] border-[#EFE7DE] text-[#695D57] hover:border-rose-200'
                  }`}
                >
                  <span className="text-base">{meal.icon}</span>
                  <span>{meal.label}</span>
                  <span className={`text-[10px] flex items-center gap-0.5 ${isDone ? 'text-emerald-600 font-semibold' : 'text-[#A89D98]'}`}>
                    {isDone ? <Check className="w-3 h-3" /> : 'Pending'}
                    {isDone ? 'Done' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Water tracker */}
        <div className="p-3.5 rounded-2xl bg-[#FFF9F6] border border-[#F4DDD5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2E2523]">Hydration Tracker</p>
              <p className="text-[11px] text-[#796E69]">{meals.waterGlasses} glasses tracked today</p>
            </div>
          </div>

          <button
            onClick={addWater}
            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition-all shadow-xs"
          >
            +1 Glass 💧
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900/80 flex items-start gap-2">
          <Smile className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <span className="font-semibold">Gentle reminder:</span> When you're deeply focused on work, take a short breath and stretch!
          </p>
        </div>
      </div>
    </div>
  );
}
