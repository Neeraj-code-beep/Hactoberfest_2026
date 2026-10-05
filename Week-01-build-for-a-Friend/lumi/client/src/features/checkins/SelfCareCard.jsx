import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HeartHandshake, Droplets, Utensils, Check, Heart, Smile } from 'lucide-react';
import { getSelfCareApi, updateSelfCareApi } from '../../services/api.js';

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', icon: '🥣' },
  { key: 'lunch', label: 'Lunch', icon: '🥗' },
  { key: 'dinner', label: 'Dinner', icon: '🍲' },
];

export default function SelfCareCard() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['self-care'],
    queryFn: getSelfCareApi,
  });

  const updateMutation = useMutation({
    mutationFn: (updateData) => updateSelfCareApi(updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['self-care'] });
    },
  });

  const selfCare = data?.data || {
    meals: { breakfast: false, lunch: false, dinner: false },
    waterGlasses: 0,
  };

  const handleToggleMeal = (mealKey) => {
    const updatedMeals = {
      ...selfCare.meals,
      [mealKey]: !selfCare.meals?.[mealKey],
    };
    updateMutation.mutate({ meals: updatedMeals });
  };

  const handleAddWater = () => {
    const nextCount = Math.min((selfCare.waterGlasses || 0) + 1, 12);
    updateMutation.mutate({ waterGlasses: nextCount });
  };

  const handleResetWater = () => {
    if (selfCare.waterGlasses > 0) {
      updateMutation.mutate({ waterGlasses: 0 });
    }
  };

  return (
    <section id="self-care" aria-labelledby="self-care-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#F1E8DA] flex items-center justify-center text-[#B97868]">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <h3 id="self-care-heading" className="text-lg sm:text-xl font-semibold text-[#3B302B] font-display">
              A little check-in
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#8B7D74] font-sans">
            Gentle nourishment and hydration reminders.
          </p>
        </div>
      </div>

      <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 border border-[#E8DED2] shadow-xs space-y-6">
        {/* Meal section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8B7D74] uppercase tracking-wider">
              Have you had something to eat?
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MEAL_CONFIG.map(({ key, label, icon }) => {
              const isEaten = Boolean(selfCare.meals?.[key]);
              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isEaten
                      ? 'bg-[#F1E8DA]/60 border-[#E8DED2] text-[#3B302B]'
                      : 'bg-[#F8F3EA]/60 border-[#E8DED2]/80 text-[#8B7D74]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-medium text-[#3B302B]">{label}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleMeal(key)}
                    disabled={updateMutation.isPending}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                      isEaten
                        ? 'bg-[#FFFDF8] text-[#7E9F88] border border-[#E8DED2] shadow-2xs hover:bg-[#F8F3EA]'
                        : 'bg-[#FFFDF8] text-[#B97868] border border-[#E8DED2] hover:bg-[#F1E8DA]'
                    }`}
                  >
                    {isEaten ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Yes, I did ♡</span>
                      </>
                    ) : (
                      <span>Not yet</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Water / Hydration Section */}
        <div className="pt-4 border-t border-[#E8DED2]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F3EA] border border-[#E8DED2] flex items-center justify-center text-[#B97868] shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#3B302B]">Hydration today</p>
              <p className="text-xs text-[#8B7D74]">
                {selfCare.waterGlasses || 0} glasses of water enjoyed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddWater}
              disabled={updateMutation.isPending}
              className="px-4 py-2 rounded-full bg-[#F1E8DA] hover:bg-[#E8C7B8]/40 border border-[#E8DED2] text-[#3B302B] text-xs font-medium transition-colors shadow-2xs"
            >
              +1 Glass 💧
            </button>
            {selfCare.waterGlasses > 0 && (
              <button
                type="button"
                onClick={handleResetWater}
                className="text-[11px] text-[#8B7D74] hover:text-[#3B302B] px-2 py-1"
                title="Reset water counter"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Gentle note */}
        <div className="p-3.5 rounded-2xl bg-[#F8F3EA]/70 border border-[#E8DED2] flex items-center gap-2.5 text-xs text-[#8B7D74]">
          <Smile className="w-4 h-4 text-[#B97868] shrink-0" />
          <span>Remember to take a peaceful breath between busy moments.</span>
        </div>
      </div>
    </section>
  );
}
