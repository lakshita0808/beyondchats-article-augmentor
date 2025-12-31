import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleView from './ArticleView';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}/articles?per_page=50`;
    axios
      .get(apiUrl)
      .then(r => {
        const articlesData = r.data.data || r.data || [];
        setArticles(Array.isArray(articlesData) ? articlesData : []);
      })
      .catch(err => {
        console.error('Failed to fetch articles:', err);
        console.error('API URL was:', apiUrl);
        setArticles([]);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

      {/* Sidebar */}
      <aside className="rounded-2xl bg-white/70 backdrop-blur shadow-lg border overflow-hidden h-[78vh]">
        <div className="p-5 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <h2 className="font-semibold text-lg">Knowledge Queue</h2>
          <p className="text-xs opacity-90 mt-1">
            Articles monitored by AI Agent
          </p>
        </div>

        <ul className="divide-y overflow-y-auto h-full">
          {articles.map(a => {
            const active = selected?.id === a.id;
            return (
              <li key={a.id}>
                <button
                  onClick={() => setSelected(a)}
                  className={`w-full px-4 py-4 text-left transition-all
                    ${active
                      ? 'bg-indigo-50 border-l-4 border-indigo-500'
                      : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-sm font-semibold leading-snug">
                        {a.title || 'Untitled'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {a.source_url}
                      </p>
                    </div>

                    {a.updated_content ? (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                        Enhanced
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Content */}
      <section>
        {selected ? (
          <ArticleView article={selected} />
        ) : (
          <div className="h-[78vh] rounded-2xl border bg-white/60 backdrop-blur flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-medium text-gray-600">
                🧠 Awaiting selection
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Choose an article to inspect AI decisions
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
