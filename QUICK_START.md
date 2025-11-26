# Quick Start Guide

## 🚀 Getting Started

### Step 1: Database Setup

1. **Create the database:**
```bash
# Open PostgreSQL terminal (port 5433)
psql -U postgres -p 5433

# Run the following:
CREATE DATABASE survey_tracking;
\c survey_tracking
```

2. **Run the schema:**
```bash
# Inside psql, run:
\i database.sql
```

Or manually copy and paste the SQL from `database.sql` file.

### Step 2: Start Backend

```bash
cd backend
npm install
npm start
```

✅ Backend should be running on **http://localhost:5000**

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend should be running on **http://localhost:3000**

## 📱 Accessing the Application

### Public Website
- **Homepage**: http://localhost:3000
- **Services**: http://localhost:3000/services
- **About**: http://localhost:3000/about
- **Contact**: http://localhost:3000/contact

### Admin Panel
- **Login**: http://localhost:3000/login
  - Username: `admin`
  - Password: `admin123`
- **Dashboard**: http://localhost:3000/admin/dashboard (after login)

## 🧪 Testing Tracking Endpoint

Test the tracking system by visiting:
```
http://localhost:5000/api/track?uid=testuser&pid=PROJECT123&status=Complete
```

You should see a colorful status page (green for Complete).

Try other statuses:
```
http://localhost:5000/api/track?uid=user2&pid=PROJECT123&status=Terminate
http://localhost:5000/api/track?uid=user3&pid=PROJECT123&status=Quotafull
```

## 🔍 Viewing Tracked Data

1. Login to admin panel
2. View all tracked surveys in the dashboard
3. Use filters to search by Project ID, Status, or UID
4. Export data to CSV

## 📊 Available Endpoints

### Tracking
- `GET /api/track?uid=USER&pid=PROJECT&status=STATUS`

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/status`

### Dashboard
- `GET /api/dashboard/records` (with filters)
- `GET /api/dashboard/stats`
- `POST /api/dashboard/callback`

### Contact
- `POST /api/contact/submit`

## 🛠️ Troubleshooting

### Backend won't start
- Check if PostgreSQL is running on port 5433
- Verify `.env` file exists in backend folder
- Check database credentials

### Frontend won't connect to backend
- Make sure backend is running on port 5000
- Check CORS settings
- Verify API URLs in frontend code

### Database connection error
- Confirm database `survey_tracking` exists
- Check PostgreSQL port (should be 5433)
- Verify username/password in `.env`

## 📝 Next Steps

1. ✅ Test all public pages
2. ✅ Test login functionality
3. ✅ Test tracking endpoint
4. ✅ Test dashboard filters
5. ✅ Test CSV export
6. ✅ Test contact form
7. 🔄 Create callback generator UI (optional)
8. 🔒 Re-enable authentication in production

## 🎨 Customization

### Change Logo/Branding
- Edit `frontend/components/Header.tsx` (line with "Survey Tracking" text)
- Edit `frontend/components/Footer.tsx`

### Change Colors
- Modify Tailwind classes in components
- Primary color: `blue-600` (change to your brand color)

### Add More Pages
- Create new folder in `frontend/app/`
- Add `page.tsx` file
- Include Header and Footer components

Enjoy your new survey tracking system! 🎉
