## BeyondChats Article Augmentor

An end-to-end demo of an **autonomous article augmentor** for BeyondChats:

- **Laravel backend** exposes an `Article` API and a custom scraper command.
- **Node agent (Node.js script)** enriches articles using SerpAPI + OpenAI and writes back to the backend.
- **React + Vite frontend** lets you browse articles and compare **original vs updated** content.

This README is structured to match the assignment requirements: **local setup**, **data-flow / architecture diagram**, and a placeholder for the **live link**.

---

## Live Link (Frontend)

> Replace this section with your actual deployed URL before submission.

- **Deployed frontend URL:** `https://your-deployment-url-here.com`
- The live app should:
  - Fetch articles from your backend (or a hosted API).
  - Show **original article** and **updated article** in the same UI (already implemented in the React app).

Suggested hosting options:

- **Vercel** (recommended for Vite/React)
- **Netlify**
- **GitHub Pages** (with a small Vite config tweak if needed)

---

## High-Level Architecture & Data Flow

### Components

- **Backend (Laravel – separate project directory `beyondchats-backend`):**
  - Stores articles in SQLite.
  - Exposes REST API: `GET/POST/PUT/DELETE /api/articles`.
  - Has an artisan command `scrape:beyondchats` to scrape seed articles.

- **Node Agent (`node-script/`):**
  - Fetches articles from the backend API.
  - Uses SerpAPI to search for related pages.
  - Scrapes reference articles and calls OpenAI to generate improved content.
  - Sends updated content + references back to the backend via API.

- **Frontend (`frontend/`):**
  - Calls backend API to list articles.
  - Lets you select one article and view **Original** vs **Updated** content in a clean UI.

### Architecture / Data Flow Diagram

```mermaid
flowchart LR
    subgraph Web[Browser]
        UI[React + Vite\nArticleList & ArticleView]
    end

    subgraph Laravel[Laravel Backend\n(beyondchats-backend)]
        API[REST API\n/api/articles]
        DB[(SQLite DB\narticles table)]
        CMD[Artisan Command\nscrape:beyondchats]
    end

    subgraph Agent[Node Agent\n(node-script)]
        FETCH[Fetch articles\nfrom API]
        SERP[SerpAPI\nsearch]
        SCRAPE[Scrape reference\narticles]
        OPENAI[OpenAI\nrewrite]
        UPDATE[PUT updated_content\nback to API]
    end

    CMD --> DB
    DB <--> API

    UI <--> API

    FETCH --> SERP --> SCRAPE --> OPENAI --> UPDATE
    UPDATE --> API --> DB
```

**End-to-end flow:**

1. **Seed data**: Laravel command `php artisan scrape:beyondchats --limit=5` scrapes original articles into the DB.
2. **Agent run**: Node script reads articles from `/api/articles`, finds references via SerpAPI, calls OpenAI, then updates `updated_content` and `references`.
3. **User view**: React frontend reads from `/api/articles` and lets the user compare original vs updated content.

---

## Local Setup Instructions

> These summarize `SETUP.md` and `RUN_PROJECT.md` so reviewers can get running quickly.

### 1. Backend API (Laravel)

> The full Laravel project lives in a separate directory (created by you): `/Users/lakshitajawandhiya/Desktop/beyondchats-backend`.

#### 1.1 Create Laravel project (if not already created)

```bash
cd /Users/lakshitajawandhiya/Desktop
composer create-project laravel/laravel beyondchats-backend
```

#### 1.2 Copy this repo’s backend code into the Laravel app

```bash
# From your Desktop
cp -r beyondchats-article-augmentor/backend/app/* beyondchats-backend/app/
cp -r beyondchats-article-augmentor/backend/routes/* beyondchats-backend/routes/
cp -r beyondchats-article-augmentor/backend/database/migrations/* beyondchats-backend/database/migrations/

cd beyondchats-backend
composer require guzzlehttp/guzzle symfony/dom-crawler symfony/css-selector
```

#### 1.3 Configure SQLite

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
touch database/database.sqlite
```

Edit `.env`:

- **DB_CONNECTION=sqlite**
- **DB_DATABASE=database/database.sqlite**
- Comment/remove `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`.

#### 1.4 Migrate and start backend

```bash
php artisan key:generate
php artisan migrate

# Start the server
php artisan serve
```

- Backend base URL: `http://127.0.0.1:8000`
- API base URL: `http://127.0.0.1:8000/api`

#### 1.5 Seed articles via scraper

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan scrape:beyondchats --limit=5
```

---

### 2. Node Agent (Article Augmentor)

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/node-script
npm install
```

Create `.env`:

```bash
API_BASE_URL=http://127.0.0.1:8000/api
SERPAPI_KEY=your_serpapi_key_here
OPENAI_API_KEY=your_openai_key_here
MAX_ARTICLES=5
```

Run the agent:

```bash
npm start
```

What it does:

- Fetches articles from the backend.
- Calls SerpAPI + OpenAI to enrich content.
- Updates each article’s `updated_content` and `references`.

---

### 3. Frontend (React + Vite + Tailwind)

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend
npm install
npm run dev
```

- Default dev URL: `http://localhost:5173`
- It expects the backend at `http://127.0.0.1:8000/api` (configurable via `VITE_API_BASE_URL`).

Optional `.env` for frontend:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## How to Deploy the Frontend (for Live Link)

You can use any static hosting provider; here’s a **Vercel**-friendly flow:

1. **Build the app locally:**

   ```bash
   cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend
   npm install
   npm run build
   ```

2. **Create a GitHub repo** (public) for this project and push:

   ```bash
   cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor
   git init
   git remote add origin git@github.com:YOUR_USERNAME/beyondchats-article-augmentor.git
   git add .
   git commit -m "Initial commit: BeyondChats Article Augmentor"
   git push -u origin main
   ```

   - Commit frequently with meaningful messages (e.g. `feat: add article comparison UI`, `docs: add architecture diagram`).

3. **On Vercel:**

   - Import the GitHub repo.
   - Framework preset: **Vite** (React).
   - Build command: `npm run build`.
   - Output directory: `dist`.
   - Add env var `VITE_API_BASE_URL` pointing to your backend (local tunnel or hosted).

4. After deploy, paste the generated URL into the **Live Link** section above.

You can follow a similar flow for **Netlify** (build: `npm run build`, publish: `dist`).

---

## Code Structure Overview

- `backend/`
  - `app/Console/Commands/ScrapeBeyondChats.php` – scrapes seed articles into DB.
  - `app/Http/Controllers/ArticleController.php` – REST API for `Article`.
  - `app/Models/Article.php` – Eloquent model.
  - `database/migrations/*create_articles_table.php` – schema for articles.
  - Used as a **module** inside a full Laravel app (`beyondchats-backend`).

- `frontend/`
  - `src/App.jsx` – app shell and layout.
  - `src/components/ArticleList.jsx` – sidebar list of articles, selects one.
  - `src/components/ArticleView.jsx` – original vs updated tabbed view.
  - `tailwind.config.js`, `index.css` – styling.

- `node-script/`
  - `index.js` – orchestrates SerpAPI + scraping + OpenAI, updates backend.

---

## UI/UX Notes

- **ArticleList**:
  - Sidebar shows a **knowledge queue** with each article’s title and source URL.
  - Uses subtle gradients and badges (`Enhanced` / `Pending`) for status.

- **ArticleView**:
  - Clean header with source link and scraped date.
  - **Tabs** to switch between “Updated 🤖” and “Original 📄”.
  - Renders HTML via `dangerouslySetInnerHTML` to preserve rich content from the agent.

These choices are documented here so reviewers can see the deliberate UX decisions behind the implementation.

---

## Submission Checklist (for You)

- **Completeness**
  - [ ] Backend API works and returns articles.
  - [ ] Node agent successfully updates `updated_content`.
  - [ ] Frontend shows original vs updated article clearly.

- **ReadMe & Setup Docs**
  - [x] Root `README.md` with setup + architecture diagram + live link placeholder.
  - [x] Additional details in `SETUP.md` and `RUN_PROJECT.md`.

- **UI/UX**
  - [x] Modern UI with gradient background, clear typography, and status badges.
  - [x] Intuitive flow: select article → compare original vs updated.

- **Live Link**
  - [ ] Frontend deployed (Vercel/Netlify/etc.).
  - [ ] URL added to the **Live Link** section above.

- **Code Quality**
  - [x] Clear separation of concerns: backend / agent / frontend.
  - [x] Components are small and focused (`ArticleList`, `ArticleView`).
  - [x] Environment variables used for configurable URLs and API keys.


