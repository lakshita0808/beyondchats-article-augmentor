# Setup Guide for BeyondChats Article Augmentor

## Quick Setup (Recommended)

Your backend directory only contains application code, not a full Laravel installation. Follow these steps:

### Step 1: Create a New Laravel Project

```bash
cd /Users/lakshitajawandhiya/Desktop
composer create-project laravel/laravel beyondchats-backend
```

### Step 2: Copy Your Application Files

```bash
# Copy your app files
cp -r beyondchats-article-augmentor/backend/app/* beyondchats-backend/app/

# Copy routes
cp -r beyondchats-article-augmentor/backend/routes/* beyondchats-backend/routes/

# Copy migrations
cp -r beyondchats-article-augmentor/backend/database/migrations/* beyondchats-backend/database/migrations/

# Copy composer.json dependencies (add these packages)
cd beyondchats-backend
composer require guzzlehttp/guzzle symfony/dom-crawler symfony/css-selector
```

### Step 3: Configure Database (SQLite - Simplest)

```bash
cd beyondchats-backend

# Create SQLite database file
touch database/database.sqlite

# Edit .env file - set these lines:
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite
# (Remove or comment out DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD)
```

### Step 4: Generate App Key and Run Migrations

```bash
php artisan key:generate
php artisan migrate
```

### Step 5: Test the Scraper

```bash
php artisan scrape:beyondchats --limit=5
```

### Step 6: Start the API Server

```bash
php artisan serve
```

The API will be available at: `http://127.0.0.1:8000/api/articles`

---

## Alternative: Use Existing Backend Directory

If you want to keep using the existing `backend` directory, you need to initialize it as a Laravel project:

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/backend

# Install Laravel dependencies
composer install

# This will fail because artisan doesn't exist yet
# You need to copy artisan from a fresh Laravel install or create it manually
```

**This approach is more complex** - I recommend the "Quick Setup" above.

---

## Frontend Setup (Already Working)

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/frontend
npm install
npm run dev
```

## Node Script Setup

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/node-script
npm install

# Create .env file with:
# API_BASE_URL=http://127.0.0.1:8000/api
# SERPAPI_KEY=your_key
# OPENAI_API_KEY=your_key
# MAX_ARTICLES=5

npm start
```

