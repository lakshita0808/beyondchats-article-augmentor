# CORS Setup for Laravel Backend

To allow your Vercel frontend to access your Laravel API, you need to configure CORS.

## Quick Fix (Laravel 11+)

Laravel 11+ has **built-in CORS support** - no package needed!

If your Laravel backend is at `/Users/lakshitajawandhiya/Desktop/beyondchats-backend`:

### Step 1: Publish CORS config (if not already done)

```bash
cd /Users/lakshitajawandhiya/Desktop/beyondchats-backend
php artisan config:publish cors
```

### Step 2: Verify `config/cors.php`

Make sure it has:
```php
'allowed_origins' => ['*'], // Allows all origins (or specify: ['https://your-vercel-app.vercel.app'])
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

### Step 3: Clear config cache

```bash
php artisan config:clear
php artisan config:cache
```

**That's it!** Laravel 11+ handles CORS automatically via middleware.

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

