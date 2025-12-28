# 🚀 Deployment Guide: Static Frontend + PHP Backend

This guide explains how to deploy your "Survey Tracking System" which consists of two parts:
1.  **Static Frontend:** A pure HTML/CSS/JS site (built with Next.js).
2.  **PHP Backend:** A set of PHP files and MySQL database.

---

## 🏗️ 1. Build the Frontend (Local Machine)

You have already configured the frontend for static export.

1.  **Generate Static Files:**
    ```bash
    cd frontend
    npm run build
    ```

2.  **Locate Output:**
    The build process creates an `out` folder in your `frontend` directory.
    - Path: `frontend/out`
    - Contains: `index.html`, `login.html`, `_next/` folder, etc.

    **This `out` folder is your entire website frontend.**

---

## 🌐 2. Prepare Production Server

You need a web hosting that supports **PHP** and **MySQL** (e.g., Hostinger, Bluehost, cPanel hosting, or a VPS with Apache/Nginx).

### File Structure on Server
You should organize your server like this (recommended):

```text
public_html/              (Web Root)
├── api/                  (PHP Backend - renamed from 'php')
│   ├── config/
│   ├── includes/
│   ├── index.php
│   └── ...
├── _next/                (Frontend Assets)
├── index.html            (Frontend Home)
├── login.html            (Frontend Login)
└── ...                   (Other frontend files)
```

*Note: You can keep the `php` folder name if you prefer, just ensure your frontend configuration points to the right URL.*

---

## 🚀 3. Deploy the Backend (PHP)

1.  **Upload Files:**
    - Upload the contents of your local `php/` folder to the `api/` (or `php/`) folder on your server.
    - **Exclude:** `migration`, `tests`, or any non-production documentation.

2.  **Update Configuration (`api/config/config.php`):**
    - Edit this file on the server.
    - Update `BASE_URL` to your real domain (e.g., `https://yourdomain.com/api`).
    - Update `FRONTEND_URL` to your real domain (e.g., `https://yourdomain.com`).
    - set `$allowed_origins` to include your domain (e.g., `https://yourdomain.com`).

3.  **Update Database Config (`api/config/database.php`):**
    - Edit this file on the server.
    - Set your production database credentials (Host, DB Name, User, Password).

4.  **Import Database:**
    - Use phpMyAdmin or CLI to import `php/database_mysql.sql` into your production database.

---

## 🎨 4. Deploy the Frontend (Static)

1.  **Configure Environment (BEFORE Build):**
    - Create/Edit `frontend/.env.production`.
    - Set the API URL to your production backend:
      ```env
      NEXT_PUBLIC_API_URL=https://yourdomain.com/api
      ```

2.  **Build Again:**
    ```bash
    npm run build
    ```

3.  **Upload:**
    - Upload **everything** inside the `frontend/out/` folder to your server's public root (e.g., `public_html/`).

---

## 🧪 5. Verification

1.  **Visit your site:** `https://yourdomain.com`
2.  **Test API:** Try to login. Check the network tab to see if it calls `https://yourdomain.com/api/auth/login`.
3.  **Test CORS:** If login fails, check your `api/includes/cors.php` and `api/options.php` settings.
4.  **Test Deep Links:** Reset password links should work (`https://yourdomain.com/reset-password?token=...`).

---

## 🔧 Troubleshooting 404s on Refresh

Since this is a Single Page Application (SPA) deployed as static files, refreshing a page like `https://yourdomain.com/dashboard` might cause a 404 error because the server looks for a folder named `dashboard`.

**Fix for Apache (.htaccess in root):**
Create a `.htaccess` file in your `public_html/` folder (alongside index.html):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Note:** Ensure this doesn't conflict with your `api/` folder. You might need to exclude the API folder from this rewrite rule if it's nested inside.
