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
    password VARCHAR(255) NOT NULL,
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
INSERT INTO admin_users (username, password) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

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
