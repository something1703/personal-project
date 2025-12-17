# Survey Tracking System

A professional survey traffic tracking platform for panel network partners. Track survey completions, terminations, and quota full responses in real-time.

## Features

### Public Website
- **Homepage**: Hero section, features overview, statistics, and CTA
- **Services**: Detailed information about tracking, analytics, API, and security services
- **About**: Company mission, values, and statistics
- **Contact**: Contact form with email submission

### Admin Dashboard
- Real-time tracking data display
- Advanced filtering (by Project ID, Status, Search)
- Pagination support
- Statistics cards (Total, Complete, Terminate, Quotafull)
- CSV export functionality
- Secure authentication

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (Port 5433)
- bcryptjs for password hashing
- express-session for authentication

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hooks

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=survey_tracking
DB_USER=postgres
DB_PASSWORD=Tyagi@2209
SESSION_SECRET=your-secret-key-here
PORT=5000
```

4. Create database and tables:
```bash
# Connect to PostgreSQL
psql -U postgres -p 5433

# Run the SQL from database.sql
\i database.sql
```

5. Start the server:
```bash
npm start
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login to admin panel

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful"
}
```

#### POST /api/auth/logout
Logout from admin panel

**Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

#### GET /api/auth/status
Check authentication status

**Response:**
```json
{
  "status": "success",
  "loggedIn": true,
  "username": "admin"
}
```

### Tracking Endpoints

#### GET /api/track
Track survey completion/termination/quotafull

**Query Parameters:**
- `uid` (required): User ID
- `pid` (required): Project ID
- `status` (required): Complete | Terminate | Quotafull

**Example:**
```
http://localhost:5000/api/track?uid=user123&pid=PROJECT001&status=Complete
```

**Response:**
Returns HTML page with status message and color-coded design

### Dashboard Endpoints

#### GET /api/dashboard/records
Get all tracking records with filtering and pagination

**Query Parameters:**
- `pid` (optional): Filter by Project ID
- `status` (optional): Filter by status (Complete/Terminate/Quotafull)
- `search` (optional): Search in UID or PID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "uid": "user123",
      "pid": "PROJECT001",
      "status": "Complete",
      "ip": "192.168.1.1",
      "created_at": "2025-11-26T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### GET /api/dashboard/stats
Get tracking statistics

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": "150",
    "complete": "100",
    "terminate": "30",
    "quotafull": "20"
  }
}
```

#### POST /api/dashboard/callback
Generate callback URL (for future implementation)

**Request Body:**
```json
{
  "uid": "user123",
  "pid": "PROJECT001",
  "baseUrl": "https://yoursurvey.com/callback"
}
```

### Contact Endpoints

#### POST /api/contact/submit
Submit contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "I would like to know more..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Thank you for contacting us! We will get back to you soon."
}
```

## Database Schema

### tracking table
```sql
id            SERIAL PRIMARY KEY
uid           VARCHAR(255) NOT NULL
pid           VARCHAR(255) NOT NULL
status        VARCHAR(20) CHECK (status IN ('Complete', 'Terminate', 'Quotafull'))
ip            VARCHAR(45) NOT NULL
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### admin_users table
```sql
id            SERIAL PRIMARY KEY
username      VARCHAR(50) UNIQUE NOT NULL
password      VARCHAR(255) NOT NULL (bcrypt hashed)
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### contact_submissions table
```sql
id            SERIAL PRIMARY KEY
name          VARCHAR(100) NOT NULL
email         VARCHAR(255) NOT NULL
subject       VARCHAR(255) NOT NULL
message       TEXT NOT NULL
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Usage

### For Panel Network Partners

1. Company provides survey link: `https://surveyplatform.com/survey?uid=`
2. Admin manually adds UID: `https://surveyplatform.com/survey?uid=user123`
3. User completes survey
4. Survey platform redirects to tracking endpoint:
   ```
   http://localhost:5000/api/track?uid=user123&pid=PROJECT001&status=Complete
   ```
5. System records tracking data and shows status page

### Admin Dashboard Access

1. Visit: http://localhost:3000/login
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123`
3. View dashboard with:
   - Statistics overview
   - Filtering options
   - Search functionality
   - CSV export

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── dashboard.js         # Dashboard API routes
│   │   ├── track.js             # Tracking routes
│   │   └── contact.js           # Contact form routes
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Homepage
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── services/
│   │   │   └── page.tsx         # Services page
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   ├── contact/
│   │   │   └── page.tsx         # Contact page
│   │   └── admin/
│   │       ├── layout.tsx       # Admin layout with auth
│   │       └── dashboard/
│   │           └── page.tsx     # Dashboard page
│   ├── components/
│   │   ├── Header.tsx           # Header component
│   │   └── Footer.tsx           # Footer component
│   └── package.json
│
└── database.sql                 # Database schema
```

## Development

### Run Backend
```bash
cd backend
npm run dev  # or npm start
```

### Run Frontend
```bash
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/login

## Security Notes

1. Change default admin credentials in production
2. Update `SESSION_SECRET` in .env
3. Enable HTTPS for production
4. Set `secure: true` in session cookie settings for HTTPS
5. Implement rate limiting for API endpoints
6. Add CORS whitelist for production domains

## Performance Optimization Endpoints

### Get Performance Metrics
Get system performance metrics including database stats and cache statistics.

**Endpoint**: `GET /api/admin/performance`

**Authentication**: Admin role required

**Response**:
```json
{
  "status": "success",
  "data": {
    "database": {
      "tracking": {
        "size": "1024 kB",
        "live_rows": 1500,
        "dead_rows": 10
      },
      "activeConnections": 3
    },
    "cache": {
      "statsCache": { "keys": 2, "hits": 150, "misses": 10 },
      "dashboardCache": { "keys": 5, "hits": 500, "misses": 25 }
    }
  }
}
```

### Get Index Suggestions
Get recommendations for database indexes to improve query performance.

**Endpoint**: `GET /api/admin/performance/indexes/:table`

**Authentication**: Admin role required

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "column": "status",
      "distinctValues": 3,
      "correlation": 0.3,
      "suggestion": "CREATE INDEX idx_tracking_status ON tracking(status);"
    }
  ]
}
```

### Clear Cache
Clear application caches to free memory or force data refresh.

**Endpoint**: `POST /api/admin/performance/cache/clear`

**Authentication**: Admin role required

**Request Body**:
```json
{
  "cacheType": "all"  // Options: "all", "statsCache", "dashboardCache", "userCache", "generalCache"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Cache cleared successfully"
}
```

## Future Enhancements

- [x] Email notifications for contact form
- [x] Multi-admin user support with roles
- [x] API rate limiting
- [x] Performance optimization (caching, compression)
- [ ] Export data in multiple formats (Excel, PDF)
- [ ] Real-time dashboard updates with WebSocket
- [ ] Advanced analytics and charts
- [ ] Webhook integration for automated tracking

## Support

For issues or questions, please contact:
- Email: support@surveytracking.com
- Phone: +1 (555) 123-4567

## License

Proprietary - All rights reserved
