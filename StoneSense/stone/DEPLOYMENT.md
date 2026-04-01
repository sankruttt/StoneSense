# StoneSense Deployment Guide

## Architecture Overview

Your application has two parts that need to be deployed separately:
1. **Frontend (React)** → Vercel ✅
2. **Backend (Flask + YOLO)** → Render/Railway/Heroku 🔄

---

## 1. Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Push your code to GitHub

### Steps:

1. **Push to GitHub** (if not already done):
```bash
cd /Users/sankrut/Projects/kidneystone/NH04_SatSan/stone
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Add Environment Variables** in Vercel dashboard:
   - `REACT_APP_API_URL` = Your backend URL (from step 2)

4. **Deploy!** Vercel will automatically deploy.

---

## 2. Backend Deployment Options

### Option A: Render (Recommended - Free Tier Available)

1. **Create `render.yaml`** (already in project root)
2. **Go to https://render.com**
3. **Create New Web Service**
   - Connect GitHub repository
   - Select Python environment
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. **Add Environment Variables**:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`
   - `BASE_URL` (your Render app URL)
5. **Add Disk Storage** for uploads/outputs (Render Dashboard → Disks)

### Option B: Railway

1. **Go to https://railway.app**
2. **New Project → Deploy from GitHub**
3. **Configure**:
   - Root Directory: leave empty (railway.json will handle it)
   - Start Command: `gunicorn app:app`
4. **Add Environment Variables** (same as above)
5. **Deploy**

### Option C: Heroku

1. **Install Heroku CLI**
2. **Create Heroku app**:
```bash
heroku create stonesense-api
```
3. **Add Python buildpack**:
```bash
heroku buildpacks:add heroku/python
```
4. **Deploy**:
```bash
git push heroku main
```
5. **Set environment variables**:
```bash
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
```

---

## 3. Post-Deployment Configuration

### Update Firebase Settings
Add your deployed domains to Firebase Console:
- Authentication → Authorized domains
- Add: `your-app.vercel.app` and `your-backend.render.com`

### Update CORS in Backend
In `app.py`, update CORS:
```python
CORS(app, origins=[
    'https://your-app.vercel.app',
    'http://localhost:3000'
])
```

### Update Frontend API URL
Create `.env.production` in frontend:
```
REACT_APP_API_URL=https://your-backend.render.com
```

---

## 4. Quick Deploy Commands

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (if using Railway)
```bash
railway up
```

---

## Important Notes

⚠️ **Model File Size**: YOLO model (`yolo11m.pt`) is large (~40MB). Some platforms have file size limits.

⚠️ **Cold Starts**: Free tier servers may have cold starts (2-5 seconds delay on first request).

⚠️ **File Storage**: Use cloud storage (AWS S3, Cloudinary) for production instead of local filesystem.

⚠️ **Database**: Firebase Firestore is already cloud-based, so no changes needed.

---

## Monitoring & Logs

- **Vercel**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Service → Logs
- **Railway**: Dashboard → Deployments → View Logs

---

## Troubleshooting

### Issue: "Module not found"
- Check `requirements.txt` has all dependencies
- Verify Python version in deployment config

### Issue: "CORS error"
- Update CORS origins in `app.py`
- Add frontend domain to allowed origins

### Issue: "502 Bad Gateway"
- Backend server not responding
- Check logs for Python errors
- Verify gunicorn is installed

---

## Cost Estimates (Monthly)

- **Vercel**: Free tier (100GB bandwidth, unlimited deployments)
- **Render**: Free tier (750 hours/month, sleeps after 15min inactivity)
- **Railway**: $5 credit/month free tier
- **Firebase**: Free tier (50k reads, 20k writes per day)

---

## Need Help?

Check logs first, then:
1. Vercel logs: `vercel logs`
2. Backend logs: Platform dashboard
3. Browser console: F12 → Console tab
