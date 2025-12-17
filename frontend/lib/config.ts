// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/api/auth/login`,
    LOGOUT: `${API_URL}/api/auth/logout`,
    REGISTER: `${API_URL}/api/auth/register`,
    STATUS: `${API_URL}/api/auth/status`,
  },
  DASHBOARD: {
    RECORDS: `${API_URL}/api/dashboard/records`,
    STATS: `${API_URL}/api/dashboard/stats`,
  },
  CONTACT: {
    SUBMIT: `${API_URL}/api/contact/submit`,
  },
  PASSWORD: {
    REQUEST_RESET: `${API_URL}/api/password/request-reset`,
    VERIFY_TOKEN: `${API_URL}/api/password/verify-token`,
    RESET: `${API_URL}/api/password/reset-password`,
  },
  TRACK: `${API_URL}/api/track`,
};
