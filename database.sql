-- Survey Traffic Tracking System Database (PostgreSQL)

-- Create database
-- Run this command in psql or your PostgreSQL client:
-- CREATE DATABASE survey_tracking;

-- Connect to the database
\c survey_tracking;

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tracking table
CREATE TABLE IF NOT EXISTS tracking (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) NOT NULL,
    pid VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Complete', 'Terminate', 'Quotafull')) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
-- Password is hashed using bcryptjs
INSERT INTO admin_users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (username) DO UPDATE SET role = 'admin';

-- Create indexes for better performance
CREATE INDEX idx_tracking_pid ON tracking(pid);
CREATE INDEX idx_tracking_status ON tracking(status);
CREATE INDEX idx_tracking_created_at ON tracking(created_at);

-- Create contact submissions table (optional)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for contact submissions
CREATE INDEX idx_contact_created_at ON contact_submissions(created_at);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for password reset tokens
CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_expires ON password_reset_tokens(expires_at);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit logs
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);

-- Create user sessions table (for session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user sessions
CREATE INDEX idx_session_id ON user_sessions(session_id);
CREATE INDEX idx_session_user_id ON user_sessions(user_id);
CREATE INDEX idx_session_expires ON user_sessions(expires_at);
