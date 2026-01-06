# Production Deployment Configuration for theinfinityresearch.com
# Using: Vercel (Frontend) + Render (Backend) + Hostinger (Domain/DNS)

## DNS Records in Hostinger

### For Root Domain & WWW
- **Type**: CNAME
- **Name**: `@` (root) or `www`
- **Value**: `cname.vercel-dns.com`
- **TTL**: 300-600 seconds

### For API Subdomain
- **Type**: CNAME
- **Name**: `api`
- **Value**: `<your-render-service>.onrender.com`
- **TTL**: 300-600 seconds

---

## Backend Environment Variables (.env for Render)

Use the values from `backend.env.production` and update:
- `DB_HOST`: Your Render PostgreSQL host
- `DB_PASSWORD`: Your Render PostgreSQL password
- `SESSION_SECRET`: Generate a strong 64+ character random string
- `ALLOWED_ORIGINS`: ✅ Set to production domains
- `FRONTEND_URL`: ✅ Set to https://theinfinityresearch.com

---

## Frontend Environment Variables (.env.local for Vercel)

```env
NEXT_PUBLIC_API_URL=https://api.theinfinityresearch.com
```

✅ Already updated!

---

## Deployment Steps

### 1. Push to GitHub (Both repos)
```bash
# Backend repo
git add .env
git commit -m "Production config for theinfinityresearch.com"
git push origin main

# Frontend repo (if separate)
git add .env.local
git commit -m "Production API URL"
git push origin main
```

### 2. Deploy Backend to Render
- Connect GitHub repo in Render dashboard
- Set environment variables (copy from `backend.env.production`)
- Auto-deploy on push
- Custom domain: `api.theinfinityresearch.com`

### 3. Deploy Frontend to Vercel
- Connect GitHub repo in Vercel dashboard
- Build settings: `npm run build` (default)
- Domains: `theinfinityresearch.com`, `www.theinfinityresearch.com`

### 4. Add DNS Records in Hostinger
- Go to Domain → DNS Management
- Add CNAME records (see above)
- Wait for propagation (5-30 minutes)

### 5. Verify Deployment
```bash
# Test API
curl https://api.theinfinityresearch.com/api/health

# Test Frontend
open https://theinfinityresearch.com
```

---

## Security Notes

✅ Use strong SESSION_SECRET (64+ random chars)  
✅ Keep .env files in .gitignore  
✅ Enable HTTPS (automatic with Vercel + Render)  
✅ Configure CORS correctly (done ✅)  
✅ Set EMAIL credentials securely  

---

## File References

- Backend config: `backend.env.production` (in root)
- Frontend config: `frontend/.env.local` (updated ✅)
- Production docs: `PRODUCTION_DEPLOYMENT.md`