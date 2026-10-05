import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names conditionally
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get dynamic greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: '🌅', note: 'Start your day with a gentle sip of water.' };
  if (hour < 17) return { text: 'Good afternoon', icon: '☀️', note: 'Remember to have a nourishing lunch and stretch.' };
  if (hour < 21) return { text: 'Good evening', icon: '🌇', note: 'Unwind and jot down any lingering thoughts.' };
  return { text: 'Good night', icon: '🌙', note: 'Time to rest your mind for tomorrow.' };
}
