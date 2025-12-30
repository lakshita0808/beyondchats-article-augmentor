#!/bin/bash

# Setup script for BeyondChats Backend
# This creates a proper Laravel installation with your application code

set -e

echo "🚀 Setting up BeyondChats Backend..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install it first."
    exit 1
fi

# Check if php is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install it first."
    exit 1
fi

BACKEND_DIR="/Users/lakshitajawandhiya/Desktop/beyondchats-article-augmentor/backend"
TEMP_LARAVEL="/Users/lakshitajawandhiya/Desktop/beyondchats-backend-temp"

echo "📦 Creating new Laravel project..."
cd /Users/lakshitajawandhiya/Desktop
composer create-project laravel/laravel beyondchats-backend-temp --prefer-dist

echo "📋 Copying your application files..."
# Copy app files
cp -r "$BACKEND_DIR/app/"* "$TEMP_LARAVEL/app/" 2>/dev/null || true

# Copy routes
cp -r "$BACKEND_DIR/routes/"* "$TEMP_LARAVEL/routes/" 2>/dev/null || true

# Copy migrations
cp -r "$BACKEND_DIR/database/migrations/"* "$TEMP_LARAVEL/database/migrations/" 2>/dev/null || true

echo "📦 Installing additional dependencies..."
cd "$TEMP_LARAVEL"
composer require guzzlehttp/guzzle symfony/dom-crawler symfony/css-selector

echo "🗄️  Setting up SQLite database..."
touch database/database.sqlite

echo "⚙️  Configuring .env file..."
# Update .env for SQLite
sed -i '' 's/DB_CONNECTION=mysql/DB_CONNECTION=sqlite/' .env
sed -i '' 's|DB_DATABASE=laravel|DB_DATABASE=database/database.sqlite|' .env
sed -i '' '/^DB_HOST=/d' .env
sed -i '' '/^DB_PORT=/d' .env
sed -i '' '/^DB_USERNAME=/d' .env
sed -i '' '/^DB_PASSWORD=/d' .env

echo "🔑 Generating application key..."
php artisan key:generate

echo "🗃️  Running migrations..."
php artisan migrate

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. cd $TEMP_LARAVEL"
echo "2. php artisan scrape:beyondchats --limit=5"
echo "3. php artisan serve"
echo ""
echo "Your API will be available at: http://127.0.0.1:8000/api/articles"

