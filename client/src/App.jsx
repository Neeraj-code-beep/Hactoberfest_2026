import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 10,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#FAF7F2] text-[#2E2523] flex flex-col font-['Plus_Jakarta_Sans']">
        <Header />
        <main className="flex-1">
          <HomePage />
        </main>
      </div>
    </QueryClientProvider>
  );
}
