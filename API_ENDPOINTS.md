# Survey Tracking System - API Endpoints Documentation

## 🎯 Base URL
```
Production: https://your-domain.com/survey_tracking/php/api
Development: http://localhost/survey_tracking/php/api
```

---

## 📍 Tracking Endpoints (For Company Integration)

### 1. Complete Survey Tracking
**Endpoint:** `/track`  
**Method:** `GET`  
**Purpose:** Track when a user completes a survey

**URL Format:**
```
http://localhost/survey_tracking/php/api/track?uid={USER_ID}&pid={PROJECT_ID}&action=Complete&redirect_url={OPTIONAL_REDIRECT}
```

**Parameters:**
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `uid` | Yes | String | Unique user identifier |
| `pid` | Yes | String | Project/Survey identifier |
| `action` | Yes | String | Must be "Complete" |
| `redirect_url` | No | String | URL to redirect user after tracking |

**Example:**
```
http://localhost/survey_tracking/php/api/track?uid=USER123&pid=SURVEY001&action=Complete&redirect_url=https://company.com/thankyou
```

**Response:** 
- If `redirect_url` provided: Redirects to company URL with parameters
- If no redirect: Shows success page with tracking details

---

### 2. Terminate Survey Tracking
**Endpoint:** `/track`  
**Method:** `GET`  
**Purpose:** Track when a user is terminated from survey

**URL Format:**
```
http://localhost/survey_tracking/php/api/track?uid={USER_ID}&pid={PROJECT_ID}&action=Terminate&redirect_url={OPTIONAL_REDIRECT}
```

**Parameters:**
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `uid` | Yes | String | Unique user identifier |
| `pid` | Yes | String | Project/Survey identifier |
| `action` | Yes | String | Must be "Terminate" |
| `redirect_url` | No | String | URL to redirect user after tracking |

**Example:**
```
http://localhost/survey_tracking/php/api/track?uid=USER456&pid=SURVEY001&action=Terminate&redirect_url=https://company.com/terminated
```

**Response:**
- If `redirect_url` provided: Redirects to company URL with parameters
- If no redirect: Shows termination page

---

### 3. Quotafull Survey Tracking
**Endpoint:** `/track`  
**Method:** `GET`  
**Purpose:** Track when survey quota is full

**URL Format:**
```
http://localhost/survey_tracking/php/api/track?uid={USER_ID}&pid={PROJECT_ID}&action=Quotafull&redirect_url={OPTIONAL_REDIRECT}
```

**Parameters:**
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `uid` | Yes | String | Unique user identifier |
| `pid` | Yes | String | Project/Survey identifier |
| `action` | Yes | String | Must be "Quotafull" |
| `redirect_url` | No | String | URL to redirect user after tracking |

**Example:**
```
http://localhost/survey_tracking/php/api/track?uid=USER789&pid=SURVEY001&action=Quotafull&redirect_url=https://company.com/quotafull
```

**Response:**
- If `redirect_url` provided: Redirects to company URL with parameters
- If no redirect: Shows quota full page

---

## 🔐 Authentication Endpoints (For Admin Dashboard)

### 1. Login
**Endpoint:** `/auth/login`  
**Method:** `POST`  
**Purpose:** Admin login

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "ujjwaltyagi9605@gmail.com",
    "role": "admin"
  }
}
```

---

### 2. Logout
**Endpoint:** `/auth/logout`  
**Method:** `POST`  
**Purpose:** Admin logout

**Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

### 3. Check Auth Status
**Endpoint:** `/auth/status`  
**Method:** `GET`  
**Purpose:** Check if user is authenticated

**Response (Authenticated):**
```json
{
  "status": "success",
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "status": "success",
  "authenticated": false
}
```

---

## 📊 Dashboard Endpoints (For Admin)

### 1. Get Tracking Records
**Endpoint:** `/dashboard/records`  
**Method:** `GET`  
**Purpose:** Retrieve tracking records with filters

**Query Parameters:**
| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| `page` | No | Integer | Page number (default: 1) |
| `limit` | No | Integer | Records per page (default: 20) |
| `status` | No | String | Filter by status (Complete/Terminate/Quotafull) |
| `search` | No | String | Search by UID or PID |
| `start_date` | No | Date | Filter from date (YYYY-MM-DD) |
| `end_date` | No | Date | Filter to date (YYYY-MM-DD) |

**Example:**
```
/dashboard/records?page=1&limit=20&status=Complete&search=USER123
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "uid": "USER123",
      "pid": "SURVEY001",
      "status": "Complete",
      "ip": "192.168.1.1",
      "created_at": "2025-12-29 02:30:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_records": 100,
    "per_page": 20
  }
}
```

---

### 2. Get Dashboard Statistics
**Endpoint:** `/dashboard/stats`  
**Method:** `GET`  
**Purpose:** Get summary statistics

**Response:**
```json
{
  "status": "success",
  "stats": {
    "total": 150,
    "complete": 100,
    "terminate": 30,
    "quotafull": 20
  }
}
```

---

## 📧 Contact Endpoint

### Submit Contact Form
**Endpoint:** `/contact`  
**Method:** `POST`  
**Purpose:** Submit contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello, I have a question..."
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Message sent successfully"
}
```

---

## 🔄 Redirect Flow (With redirect_url)

When using `redirect_url` parameter, the system will redirect to your URL with these parameters:

**Redirect URL Format:**
```
{redirect_url}?uid={USER_ID}&status={STATUS}&timestamp={UNIX_TIMESTAMP}
```

**Example:**
```
https://company.com/callback?uid=USER123&status=Complete&timestamp=1735427400
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Missing required parameters: uid and pid"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid username or password"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Failed to save tracking data"
}
```

---

## 🧪 Testing the Endpoints

### Test Complete Tracking
```bash
curl "http://localhost/survey_tracking/php/api/track?uid=TEST001&pid=PROJ001&action=Complete"
```

### Test Terminate Tracking
```bash
curl "http://localhost/survey_tracking/php/api/track?uid=TEST002&pid=PROJ001&action=Terminate"
```

### Test Quotafull Tracking
```bash
curl "http://localhost/survey_tracking/php/api/track?uid=TEST003&pid=PROJ001&action=Quotafull"
```

### Test with Redirect
```bash
curl "http://localhost/survey_tracking/php/api/track?uid=TEST004&pid=PROJ001&action=Complete&redirect_url=https://company.com/thankyou"
```

---

## 📝 Integration Example

### For Survey Platform

At the end of your survey, redirect users to:

**Complete:**
```
https://your-domain.com/survey_tracking/php/api/track?uid={UNIQUE_USER_ID}&pid={PROJECT_ID}&action=Complete&redirect_url=https://yourcompany.com/thankyou
```

**Terminate:**
```
https://your-domain.com/survey_tracking/php/api/track?uid={UNIQUE_USER_ID}&pid={PROJECT_ID}&action=Terminate&redirect_url=https://yourcompany.com/terminated
```

**Quotafull:**
```
https://your-domain.com/survey_tracking/php/api/track?uid={UNIQUE_USER_ID}&pid={PROJECT_ID}&action=Quotafull&redirect_url=https://yourcompany.com/quotafull
```

---

## 🔒 Security Notes

1. **CORS:** Configured for `localhost:3000` and `localhost:3001` in development
2. **Session:** Uses secure session management with httpOnly cookies
3. **IP Tracking:** Automatically captures user IP for tracking
4. **Input Validation:** All parameters are validated before processing

---

## 📞 Support

**Admin Contact:**
- Name: Ujjwal Tyagi
- Email: ujjwaltyagi9605@gmail.com

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## ✅ Endpoint Status

| Endpoint | Status | Tested |
|----------|--------|--------|
| `/track?action=Complete` | ✅ Working | Yes |
| `/track?action=Terminate` | ✅ Working | Yes |
| `/track?action=Quotafull` | ✅ Working | Yes |
| `/auth/login` | ✅ Working | Yes |
| `/auth/logout` | ✅ Working | Yes |
| `/auth/status` | ✅ Working | Yes |
| `/dashboard/records` | ✅ Working | Yes |
| `/dashboard/stats` | ✅ Working | Yes |
| `/contact` | ✅ Working | Yes |

**Last Verified:** December 29, 2025
