import axios from 'axios';
import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

dotenv.config();

const {
  API_BASE_URL = 'http://127.0.0.1:8000/api',
  SERPAPI_KEY,
  OPENAI_API_KEY,
  MAX_ARTICLES = 5
} = process.env;

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set — LLM call will fail until provided.');
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function fetchArticles() {
  const res = await axios.get(`${API_BASE_URL}/articles?per_page=${MAX_ARTICLES}`);
  return res.data.data || res.data; // Laravel paginator or plain array
}

async function searchSerpapi(query) {
  if (!SERPAPI_KEY) throw new Error('SERPAPI_KEY not configured for SerpAPI.');
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&num=5&api_key=${SERPAPI_KEY}`;
  const r = await axios.get(url);
  return r.data.organic_results || [];
}

async function fetchAndExtract(url) {
  try {
    const resp = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 });
    const dom = new JSDOM(resp.data, { url });
    const doc = dom.window.document;
    // Attempt Readability
    const reader = new Readability(doc);
    const article = reader.parse();
    if (article && article.content) {
      return { title: article.title || doc.querySelector('title')?.textContent, content: article.content };
    }
    // Fallback: use cheerio to extract main content heuristically
    const $ = cheerio.load(resp.data);
    let candidates = ['article', '.post-content', '#content', '.article-body', '.entry-content'];
    let html = '';
    for (let sel of candidates) {
      if ($(sel).length) { html = $(sel).first().html(); break; }
    }
    if (!html) html = $('body').html();
    const title = $('h1').first().text() || $('title').text();
    return { title: title.trim(), content: html };
  } catch (e) {
    console.error('fetchAndExtract error for', url, e.message);
    return null;
  }
}

async function callLLMRewrite(original, reference1, reference2, title) {
  const system = `You are a professional content editor. Rewrite the ORIGINAL article so its formatting, headings, flow, and style closely match the two REFERENCE articles while preserving the facts in ORIGINAL. Keep important content and citation links at bottom. Do not invent facts. Include a small 'References' section at the end with the two reference URLs.`;

  const prompt = `
TITLE: ${title}

ORIGINAL ARTICLE:
${original}

REFERENCE 1 (content):
${reference1.content}

REFERENCE 2 (content):
${reference2.content}

INSTRUCTIONS:
- Rewrite ORIGINAL to match structure/tone of references.
- Use clear headings and short paragraphs.
- Keep length similar (+/- 30%).
- Preserve factual claims; if you can't verify a claim, keep it but don't assert new facts.
- Add "References" section at the bottom listing the two reference URLs.
- Return only the generated article in HTML format.
`;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // change to available model
    messages: [
      {role:'system', content: system},
      {role:'user', content: prompt}
    ],
    max_tokens: 2500,
    temperature: 0.2
  });
  const out = response.choices?.[0]?.message?.content || '';
  return out;
}

async function updateArticleInAPI(id, updatedContent, references) {
  try {
    const url = `${API_BASE_URL}/articles/${id}`;
    const res = await axios.put(url, { updated_content: updatedContent, references });
    return res.data;
  } catch (e) {
    console.error('Failed to update article in API', e.response?.data || e.message);
    throw e;
  }
}

async function main() {
  const articles = await fetchArticles();
  for (const a of articles) {
    console.log('Processing:', a.title);
    // 1) Search via SerpAPI
    let serpResults = [];
    try {
      serpResults = await searchSerpapi(a.title);
    } catch (e) {
      console.error('SerpAPI error', e.message);
      continue;
    }

    // pick first two external blog/article results (not beyondchats.com)
    const chosen = [];
    for (const r of serpResults) {
      const link = r.link || r.url || r.displayed_link;
      if (!link) continue;
      if (link.includes('beyondchats.com')) continue; // skip same site
      chosen.push({ link, snippet: r.snippet || r.snippet });
      if (chosen.length >= 2) break;
    }
    if (chosen.length < 1) { console.warn('No external results found for', a.title); continue; }

    // 2) fetch and extract the two chosen pages
    const refs = [];
    for (const c of chosen) {
      const extracted = await fetchAndExtract(c.link);
      if (extracted) refs.push({ url: c.link, title: extracted.title, content: extracted.content });
      if (refs.length >= 2) break;
    }
    if (refs.length === 0) { console.warn('No reference content extracted'); continue; }

    // 3) call LLM to rewrite
    const originalHtml = a.original_content || a.updated_content || '';
    let rewrittenHtml = '';
    try {
      const ref1 = refs[0];
      const ref2 = refs[1] || refs[0];
      rewrittenHtml = await callLLMRewrite(originalHtml, ref1, ref2, a.title);
    } catch (e) {
      console.error('LLM call failed', e.message);
      continue;
    }

    // 4) append references at bottom (explicit)
    const references = refs.map(r => ({ url: r.url, title: r.title || r.url }));
    const finalHtml = `${rewrittenHtml}<hr/><h3>References</h3><ul>${references.map(r=>`<li><a href="${r.url}" target="_blank" rel="noopener">${r.title}</a></li>`).join('')}</ul>`;

    // 5) update to API
    try {
      const updated = await updateArticleInAPI(a.id, finalHtml, references);
      console.log('Updated article', a.id);
    } catch (e) {
      console.error('Failed to update article', e.message);
    }
  }
}

main().catch(err => {
  console.error('Fatal', err);
  process.exit(1);
});
