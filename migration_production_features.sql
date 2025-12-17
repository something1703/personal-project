-- Migration Script: Add Password Reset, Audit Logs, and Session Management
-- Run this on your existing database to add missing production features

-- Connect to database
\c survey_tracking;

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for password reset tokens
CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_expires ON password_reset_tokens(expires_at);

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
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);

-- Create user sessions table
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
CREATE INDEX IF NOT EXISTS idx_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_session_expires ON user_sessions(expires_at);

-- Display results
\echo ''
\echo '✅ Migration completed successfully!'
\echo ''
\echo 'Created tables:'
\echo '  - password_reset_tokens (for password reset functionality)'
\echo '  - audit_logs (for tracking user actions)'
\echo '  - user_sessions (for session management)'
\echo ''
\echo 'Summary:'
SELECT 
    'password_reset_tokens' as table_name,
    COUNT(*) as record_count
FROM password_reset_tokens
UNION ALL
SELECT 
    'audit_logs' as table_name,
    COUNT(*) as record_count
FROM audit_logs
UNION ALL
SELECT 
    'user_sessions' as table_name,
    COUNT(*) as record_count
FROM user_sessions;

\echo ''
\echo 'New features enabled:'
\echo '  ✅ Password reset functionality'
\echo '  ✅ Audit logging'
\echo '  ✅ Session timeout handling'
\echo '  ✅ Session tracking'
\echo ''
