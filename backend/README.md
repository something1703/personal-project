# Survey Traffic Tracking System - Backend

Node.js/Express backend for the Survey Traffic Tracking System.

## Installation

```bash
npm install
```

## Configuration

Update `.env` file with your database credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=survey_tracking
PORT=5000
SESSION_SECRET=your-secret-key
```

## Run

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Track
- `GET /api/track?pid=XXX&uid=XXX&action=Complete`

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/status` - Check auth status

### Dashboard
- `GET /api/dashboard/records` - Get all tracking records
- `GET /api/dashboard/stats` - Get statistics
- `POST /api/dashboard/callback` - Generate callback URL

Default credentials:
- Username: `admin`
- Password: `admin123`
