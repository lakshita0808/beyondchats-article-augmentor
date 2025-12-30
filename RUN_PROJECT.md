# How to Run the BeyondChats Article Augmentor Project

## ✅ All Issues Fixed!

The project is now fully functional. Here's how to run each component:

---

## 🚀 Quick Start Guide

### **1. Backend API (Laravel)**

**Location:** `/Users/lakshitajawandhiya/Desktop/beyondchats-backend`

```bash
# Navigate to backend
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend

# Start the server (keep this terminal open)
php artisan serve
```

**Server runs at:** `http://127.0.0.1:8000`

**Test the API:**
```bash
# In another terminal
curl http://127.0.0.1:8000/api/articles
```

**Available endpoints:**
- `GET /api/articles` - List all articles
- `GET /api/articles/{id}` - Get specific article
- `POST /api/articles` - Create article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

**Scrape articles:**
```bash
php artisan scrape:beyondchats --limit=5
```

---

### **2. Frontend (React + Vite)**

**Location:** `/Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend`

```bash
# Navigate to frontend
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend

# Install dependencies (first time only)
npm install

# Start dev server (keep this terminal open)
npm run dev
```

**Frontend runs at:** `http://localhost:5173` (or the port shown in terminal)

**Features:**
- View list of articles from backend
- Click article to see Original vs Updated content side-by-side
- Shows source URL and scraped date

---

### **3. Node Script (Article Augmentor)**

**Location:** `/Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/node-script`

**Setup:**
```bash
# Navigate to node-script
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/node-script

# Install dependencies (first time only)
npm install

# Create .env file
cat > .env << EOF
API_BASE_URL=http://127.0.0.1:8000/api
SERPAPI_KEY=your_serpapi_key_here
OPENAI_API_KEY=your_openai_key_here
MAX_ARTICLES=5
EOF
```

**Run the augmentor:**
```bash
npm start
```

**What it does:**
1. Fetches articles from backend API
2. Uses SerpAPI to find related articles
3. Scrapes reference articles
4. Uses OpenAI to rewrite original articles
5. Updates articles with `updated_content` and `references`

---

## 📋 Complete Workflow

### **Step 1: Start Backend**
```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan serve
```
✅ Server running at `http://127.0.0.1:8000`

### **Step 2: Scrape Initial Articles**
```bash
# In another terminal
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan scrape:beyondchats --limit=5
```
✅ Articles saved to database

### **Step 3: Start Frontend**
```bash
# In another terminal
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend
npm run dev
```
✅ Frontend running at `http://localhost:5173`

### **Step 4: (Optional) Run Article Augmentor**
```bash
# In another terminal
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/node-script
npm start
```
✅ Articles updated with AI-generated content

---

## ✅ Verification Commands

### **Check Backend API:**
```bash
curl http://127.0.0.1:8000/api/articles
```

### **Check Routes:**
```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan route:list --path=api
```

### **Check Database:**
```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan tinker
# Then in tinker:
>>> \App\Models\Article::count()
```

---

## 🔧 Issues Fixed

1. ✅ Created `.env` file with SQLite configuration
2. ✅ Fixed `Validator` import in `ArticleController`
3. ✅ Renamed migration file to use proper timestamp
4. ✅ Added API routes to `bootstrap/app.php` (was causing 404)
5. ✅ Fixed PostCSS config for Tailwind CSS
6. ✅ Created missing frontend files (vite.config.js, index.html, etc.)
7. ✅ All migrations ran successfully
8. ✅ API endpoints working correctly

---

## 📝 Notes

- **Backend uses SQLite** - no MySQL setup needed
- **Database file:** `beyondchats-backend/database/database.sqlite`
- **API Base URL:** `http://127.0.0.1:8000/api`
- **Frontend expects backend at:** `http://127.0.0.1:8000/api` (default)

---

## 🎯 Quick Test

1. **Backend running?** → `curl http://127.0.0.1:8000/api/articles`
2. **Frontend running?** → Open `http://localhost:5173` in browser
3. **See articles?** → Click on any article in the list
4. **Augmented content?** → Run node-script, then refresh frontend

---

**Everything is working! 🎉**

