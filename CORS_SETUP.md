# CORS Setup for Laravel Backend

To allow your Vercel frontend to access your Laravel API, you need to configure CORS.

## Quick Fix (Laravel 10+)

If your Laravel backend is at `/Users/lakshitajawandhiya/Desktop/beyondchats-backend`:

### Option 1: Use Laravel's built-in CORS (Recommended)

1. **Install CORS package** (if not already installed):
   ```bash
   cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
   composer require fruitcake/laravel-cors
   ```

2. **Publish CORS config**:
   ```bash
   php artisan config:publish cors
   ```

3. **Edit `config/cors.php`**:
   ```php
   'allowed_origins' => ['*'], // Or specify: ['https://your-vercel-app.vercel.app']
   'allowed_origins_patterns' => [],
   'allowed_headers' => ['*'],
   'allowed_methods' => ['*'],
   'exposed_headers' => [],
   'max_age' => 0,
   'supports_credentials' => false,
   ```

4. **Clear config cache**:
   ```bash
   php artisan config:clear
   ```

### Option 2: Simple Middleware (If CORS package doesn't work)

Create `app/Http/Middleware/Cors.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}
```

Register it in `bootstrap/app.php` or `app/Http/Kernel.php`:

```php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\Cors::class,
];
```

Then restart your Laravel server:
```bash
php artisan serve
```

---

## Test CORS

After setting up, test from your browser console on the Vercel site:

```javascript
fetch('https://exosporous-jeana-hyperconfidently.ngrok-free.dev/api/articles')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If you see the articles JSON, CORS is working!

