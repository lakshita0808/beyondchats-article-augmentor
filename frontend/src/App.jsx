import React from 'react';
import ArticleList from './components/ArticleList';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BeyondChats AI Agent
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Autonomous article enrichment & comparison
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
            🤖 Agent Active
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <ArticleList />
      </main>
    </div>
  );
}
