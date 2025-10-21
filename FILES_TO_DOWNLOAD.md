# MS TEX - Files to Download for Deployment

## 📦 Required Files

### Option 1: Download Everything (Recommended)

**Single Package File:**
Create this package on Emergent:
```bash
cd /app
tar -czf mstex-complete.tar.gz backend/ frontend/ README.md *.md
```

**Download:**
- `mstex-complete.tar.gz` (Contains everything you need)

---

### Option 2: Download Individual Components

#### 1. Backend Files
**Folder:** `/app/backend/`

**Essential Files:**
- `server.py` - Main FastAPI application
- `seed_user_images.py` - Database seeding script
- `requirements.txt` - Python dependencies
- `.env` - Environment configuration (create new on server)
- `uploads/` - Folder with product images

**Download command:**
```bash
cd /app
tar -czf backend.tar.gz backend/
```

#### 2. Frontend Files (Built Version)
**Folder:** `/app/frontend/build/`

**First build it:**
```bash
cd /app/frontend
npm run build
```

**Then download:**
```bash
cd /app/frontend
tar -czf frontend-build.tar.gz build/
```

This contains:
- All optimized React files
- Static HTML, CSS, JS
- Images and assets
- Ready to deploy

#### 3. Documentation Files
**Files to download:**
- `/app/README.md` - Project overview
- `/app/MANUAL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `/app/QUICK_DEPLOYMENT_CHECKLIST.md` - Quick reference
- `/app/ADMIN_IMAGE_UPLOAD_GUIDE.md` - How to upload images
- `/app/DEPLOYMENT_GUIDE.md` - SpidyHost specific guide
- `/app/FILES_TO_DOWNLOAD.md` - This file

---

## 📂 Complete File Structure

After extraction on server, you should have:

```
/home/username/mstex/
├── backend/
│   ├── server.py
│   ├── seed_user_images.py
│   ├── requirements.txt
│   ├── .env (create this)
│   └── uploads/
│       └── products/
│           ├── product_001.jpg
│           ├── product_002.jpg
│           └── ... (31 images)
│
├── frontend/
│   └── build/
│       ├── index.html
│       ├── static/
│       │   ├── css/
│       │   ├── js/
│       │   └── media/
│       ├── manifest.json
│       └── ... (all built files)
│
└── docs/ (optional)
    ├── README.md
    ├── MANUAL_DEPLOYMENT_GUIDE.md
    ├── QUICK_DEPLOYMENT_CHECKLIST.md
    └── ADMIN_IMAGE_UPLOAD_GUIDE.md
```

---

## 💾 File Sizes (Approximate)

- **Backend:** ~50 MB (with images)
- **Frontend Build:** ~5 MB
- **Documentation:** ~1 MB
- **Total:** ~56 MB

---

## 📥 How to Download from Emergent

### Method 1: Using File Explorer (If Available)
1. Navigate to `/app/` directory
2. Select folders/files
3. Download via UI

### Method 2: Using Terminal Commands

**Create single package:**
```bash
cd /app

# Complete package
tar -czf ~/mstex-deployment.tar.gz backend/ frontend/build/ *.md

# Package will be in home directory
ls -lh ~/mstex-deployment.tar.gz
```

### Method 3: Using SCP (From Your Local Machine)

If you have SSH access to Emergent:
```bash
# From your local computer
scp user@emergent-server:/app/mstex-deployment.tar.gz ~/Downloads/
```

---

## 📤 How to Upload to Your Server

### Using FileZilla (Recommended):
1. Open FileZilla
2. Connect to your server:
   - Host: `your-server-ip` or `ftp.yourdomain.com`
   - Username: your username
   - Password: your password
   - Port: 22 (SFTP)
3. Navigate to `/home/username/` on server
4. Create folder `mstex`
5. Upload `mstex-deployment.tar.gz`
6. Connect via SSH and extract:
   ```bash
   cd /home/username/mstex
   tar -xzf mstex-deployment.tar.gz
   ```

### Using WinSCP:
1. Open WinSCP
2. Session → New Session
3. File protocol: SFTP
4. Host name: your-server-ip
5. Port: 22
6. Username & Password
7. Login and drag-drop files

### Using Command Line SCP:
```bash
# From your local computer
scp mstex-deployment.tar.gz username@server-ip:/home/username/mstex/
```

---

## ✅ Pre-Deployment Checklist

Before downloading, ensure:

- [ ] Frontend is built: `cd /app/frontend && npm run build`
- [ ] Backend images are present: `ls /app/backend/uploads/products/`
- [ ] All documentation files updated
- [ ] Create complete package with all files

---

## 🔑 Important Files to Create on Server

These files should be created NEW on your server (don't upload):

### 1. Backend `.env` File
**Location:** `/home/username/mstex/backend/.env`

```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=mstex_ecommerce
CORS_ORIGINS=https://yourdomain.com
```

### 2. Frontend `.env` File (If needed)
**Location:** `/home/username/mstex/frontend/.env`

```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

**Note:** If you already built frontend with correct URL, you don't need this.

---

## 🚨 Files to NEVER Upload

Don't upload these if they exist:
- `node_modules/` - Install fresh on server
- `venv/` or `env/` - Create fresh on server
- `.git/` - Version control (optional)
- `__pycache__/` - Python cache
- `.DS_Store` - Mac system files
- `*.pyc` - Python bytecode

---

## 📋 What's Already Included

Your current setup already has:
- ✅ 31 products with your uploaded images
- ✅ MS TEX branding and logo
- ✅ Complete e-commerce functionality
- ✅ Admin panel with image upload
- ✅ Indian Rupee (₹) pricing
- ✅ Proper categories (Men's/Women's)
- ✅ All documentation

**Everything is ready to deploy!** 🚀

---

## 💡 Quick Start

**Fastest way to deploy:**

1. **On Emergent:**
   ```bash
   cd /app
   tar -czf ~/mstex-ready.tar.gz backend/ frontend/build/
   ```

2. **Download** `mstex-ready.tar.gz`

3. **Upload** to your server at `/home/username/mstex/`

4. **Extract** on server:
   ```bash
   tar -xzf mstex-ready.tar.gz
   ```

5. **Follow** `QUICK_DEPLOYMENT_CHECKLIST.md`

**Done!** 🎉

---

## 📞 Need Help?

- Check: `MANUAL_DEPLOYMENT_GUIDE.md` for detailed steps
- Check: `QUICK_DEPLOYMENT_CHECKLIST.md` for quick reference
- Check: Troubleshooting section in deployment guides

---

**Your MS TEX e-commerce website is ready to deploy!** 🚀
