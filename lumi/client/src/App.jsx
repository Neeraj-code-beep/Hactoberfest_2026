import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 15,
      retry: 1,
    },
  },
});

export default function App() {
  const [activeSection, setActiveSection] = useState('top');

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F8F3EA] text-[#3B302B] flex flex-col font-sans selection:bg-[#E8C7B8]/40 selection:text-[#3B302B]">
        <Header activeSection={activeSection} onSelectSection={handleSelectSection} />
        <main id="top" className="flex-1">
          <HomePage />
        </main>
      </div>
    </QueryClientProvider>
  );
}
