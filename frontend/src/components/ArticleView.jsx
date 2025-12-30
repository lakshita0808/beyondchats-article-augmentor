import React, { useState } from 'react';

export default function ArticleView({ article }) {
  const [tab, setTab] = useState('updated');

  return (
    <div className="h-[78vh] rounded-2xl bg-white/70 backdrop-blur border shadow-lg flex flex-col">

      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold leading-tight">
          {article.title}
        </h2>

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
          <a href={article.source_url} target="_blank" rel="noreferrer" className="underline">
            Original Source
          </a>
          <span>
            Scraped {new Date(article.scraped_at).toLocaleDateString()}
          </span>

          {article.updated_content && (
            <span className="px-2 py-1 text-xs rounded bg-emerald-100 text-emerald-700">
              AI Enhanced
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 pt-4">
        {[
          { id: 'updated', label: 'Updated 🤖' },
          { id: 'original', label: 'Original 📄' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${tab === t.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              tab === 'updated'
                ? article.updated_content || '<em>AI agent has not enhanced this article yet.</em>'
                : article.original_content || '<em>No original content available.</em>',
          }}
        />
      </div>
    </div>
  );
}
