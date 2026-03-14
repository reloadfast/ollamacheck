import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModelList } from './features/models/ModelList';
import { CategoryTabs } from './features/categories/CategoryTabs';
import { FilterSidebar } from './components/FilterSidebar';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 p-4">
        <h1 className="text-2xl font-bold">OllamaCheck</h1>
        <p className="text-gray-400">Ranked Ollama models for 40GB GPU environments</p>
      </header>

      <main className="container mx-auto p-4">
        <CategoryTabs />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <FilterSidebar />
          </div>
          <div className="md:w-3/4">
            <ModelList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;