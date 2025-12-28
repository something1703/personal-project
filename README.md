# 📊 Survey Tracking System

A full-stack tracking application with a **Next.js Static Frontend** and a **PHP Backend**.

## 📁 Project Structure

```text
survey_tracking/
├── frontend/             # Next.js Frontend (Source code)
│   ├── out/              # STATIC BUILD OUTPUT (Deploy this!)
│   └── ...
├── php/                  # PHP Backend (API Source code)
│   ├── api/              # API Endpoints
│   ├── config/           # Database & App Config
│   ├── database_mysql.sql # Main Database Schema
│   └── ...
├── API_ENDPOINTS.md      # API definitions for integration
├── DEPLOYMENT_GUIDE.md   # Step-by-step Hostinger deployment guide
├── PRODUCTION_READINESS.md # Pre-launch checklist
└── README.md             # This file
```

## 🚀 Quick Start (Local Development)

### 1. Backend (PHP)
*   Ensure XAMPP/Apache is running.
*   Place the `php/` folder contents accessible at `http://localhost/survey_tracking/php`.
*   Import `php/database_mysql.sql` into MySQL database `survey_tracking`.
*   Update `php/config/database.php` with credentials.

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

## 🌍 Deployment (Hostinger)

This project is optimized for **Static Hosting** (Frontend) + **PHP/MySQL** (Backend).

**👉 READ THE GUIDE:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

1.  **Frontend:** Upload `frontend/out/` content to `public_html`.
2.  **Backend:** Upload `php/` content to `public_html/api`.
3.  **Database:** Import SQL and update config.

## 🔑 Default Credentials

*   **Username:** `admin`
*   **Password:** `admin123`
*   **Role:** Administrator

---

**Developed for Hostinger Single Web Hosting (No Node.js required!)**
