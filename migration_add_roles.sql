-- Migration Script: Add Role and Security Features
-- Run this on your existing database to add new security features

-- Connect to database
\c survey_tracking;

-- Add role column if it doesn't exist
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Add CHECK constraint for role
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'admin_users_role_check'
    ) THEN
        ALTER TABLE admin_users 
        ADD CONSTRAINT admin_users_role_check 
        CHECK (role IN ('admin', 'user', 'viewer'));
    END IF;
END $$;

-- Add is_active column if it doesn't exist
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing admin user to have admin role
UPDATE admin_users SET role = 'admin' WHERE username = 'admin';

-- Update any other existing users to have 'user' role by default
UPDATE admin_users SET role = 'user' WHERE role IS NULL;

-- Display results
SELECT id, username, email, role, is_active, created_at FROM admin_users;

\echo 'Migration completed successfully!'
\echo 'All users now have roles assigned.'
\echo 'Default admin user has been set to admin role.'
