# Hostinger VPS Deployment Guide for theinfinityresearch.com
# All-in-one: Frontend + Backend + Database on single Hostinger VPS

---

## Step 1: Connect via SSH

```bash
ssh -i your-private-key user@your-hostinger-vps-ip
# OR
ssh user@your-hostinger-vps-ip
# Enter password when prompted
```

---

## Step 2: Update System & Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

---

## Step 3: Set Up PostgreSQL Database

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Connect as postgres user
sudo -u postgres psql

# In psql prompt:
CREATE DATABASE event_management;
CREATE USER survey_user WITH PASSWORD 'strong-password-here';
GRANT ALL PRIVILEGES ON DATABASE event_management TO survey_user;
\q
```

---

## Step 4: Upload Project Code

```bash
# Clone from GitHub (recommended)
cd /home/user
git clone https://github.com/your-github/survey_tracking.git
cd survey_tracking

# OR upload via SFTP/SCP
# scp -r ./survey_tracking user@your-vps-ip:/home/user/
```

---

## Step 5: Deploy Backend

```bash
cd /home/user/survey_tracking

# Copy production .env
cp backend.env.production backend/.env

# Edit .env with actual values
nano backend/.env
# Update: DB_PASSWORD, SESSION_SECRET

# Install dependencies
cd backend
npm install --production

# Test backend
npm start
# Should see: "Server is running on port 5000"
# Press Ctrl+C to stop

# Start with PM2
pm2 start server.js --name "survey-backend"
pm2 save
pm2 startup
# Follow the command output to enable auto-start on reboot
```

---

## Step 6: Deploy Frontend

```bash
cd /home/user/survey_tracking/frontend

# Ensure .env.local is set
cat .env.local
# Should show: NEXT_PUBLIC_API_URL=https://api.theinfinityresearch.com

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "survey-frontend" -- start
pm2 save
```

---

## Step 7: Configure Nginx Reverse Proxy

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/theinfinityresearch.com
```

Paste this configuration:

```nginx
# Backend API
server {
    listen 80;
    server_name api.theinfinityresearch.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name theinfinityresearch.com www.theinfinityresearch.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/theinfinityresearch.com /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t
# Should show: nginx: configuration file test is successful

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 8: Add DNS Records in Hostinger

Go to **Hostinger → Your Domain → DNS Management**:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your VPS IP | 3600 |
| A | www | Your VPS IP | 3600 |
| A | api | Your VPS IP | 3600 |

---

## Step 9: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d theinfinityresearch.com -d www.theinfinityresearch.com -d api.theinfinityresearch.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose auto-redirect to HTTPS

# Auto-renewal setup
sudo certbot renew --dry-run
```

---

## Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs survey-backend
pm2 logs survey-frontend

# Test endpoints
curl https://api.theinfinityresearch.com/api/health
curl https://theinfinityresearch.com
```

---

## Ongoing Management

### Monitor Services
```bash
pm2 monit
```

### Update Application
```bash
cd /home/user/survey_tracking
git pull origin main
cd frontend && npm run build
cd ../backend && npm install
pm2 restart all
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Restart Services
```bash
pm2 restart all
sudo systemctl restart nginx
```

---

## Troubleshooting

**Backend not responding:**
```bash
pm2 logs survey-backend
# Check error messages
```

**Frontend not loading:**
```bash
sudo tail -f /var/log/nginx/error.log
pm2 logs survey-frontend
```

**Database connection error:**
```bash
sudo -u postgres psql -d event_management -c "SELECT NOW();"
# Verify PostgreSQL is running
sudo systemctl status postgresql
```

**SSL certificate issues:**
```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## File Locations

- Backend code: `/home/user/survey_tracking/backend`
- Frontend build: `/home/user/survey_tracking/frontend/.next`
- PostgreSQL data: `/var/lib/postgresql/13/main`
- Nginx config: `/etc/nginx/sites-available/theinfinityresearch.com`
- SSL certs: `/etc/letsencrypt/live/theinfinityresearch.com/`

---

## Final Notes

✅ All services on **one Hostinger VPS** (~$3.99-7.99/month)  
✅ **SSL/HTTPS** enabled automatically  
✅ **PostgreSQL** for data storage  
✅ **PM2** for process management  
✅ **Nginx** for reverse proxy & load balancing  
✅ **Auto-restart** on server reboot  
✅ Production-ready!