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
export function getGreetingForAshmita() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: '🌅', note: 'Start your day with a sip of water!' };
  if (hour < 17) return { text: 'Good afternoon', icon: '☀️', note: 'Have you eaten lunch yet, Ashmita?' };
  if (hour < 21) return { text: 'Good evening', icon: '🌇', note: 'Unwind and jot down any thoughts.' };
  return { text: 'Good night', icon: '🌙', note: 'Time to rest your mind for tomorrow.' };
}
