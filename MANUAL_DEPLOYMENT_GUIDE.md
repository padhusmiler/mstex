# MS TEX - Complete Manual Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Prepare Files](#prepare-files)
3. [Upload to Server](#upload-to-server)
4. [Setup MongoDB](#setup-mongodb)
5. [Setup Backend (FastAPI)](#setup-backend)
6. [Setup Frontend (React)](#setup-frontend)
7. [Configure Web Server (Nginx)](#configure-web-server)
8. [Setup SSL Certificate](#setup-ssl)
9. [Final Testing](#final-testing)
10. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisites

### What You Need:
- ✅ Server with SSH access (SpidyHost or any VPS)
- ✅ Domain name (e.g., mstex.com)
- ✅ FTP/SFTP client (FileZilla, WinSCP) OR SSH access
- ✅ Server Requirements:
  - Ubuntu 20.04/22.04 or CentOS 7/8
  - 2GB RAM minimum (4GB recommended)
  - 20GB disk space
  - Root or sudo access

### Software to Install on Server:
- Python 3.9+
- Node.js 18+ and npm/yarn
- MongoDB 5.0+
- Nginx or Apache
- Supervisor (for process management)

---

## 2️⃣ Prepare Files for Upload

### On Your Current Machine (Emergent):

**Step 1: Build Frontend**
```bash
cd /app/frontend
npm run build
# or
yarn build
```

This creates `/app/frontend/build/` folder with optimized files.

**Step 2: Package Backend**
```bash
cd /app/backend
# Backend files are ready as-is
```

**Step 3: Create Deployment Package**
```bash
cd /app
tar -czf mstex-deployment.tar.gz backend/ frontend/build/ README.md ADMIN_IMAGE_UPLOAD_GUIDE.md
```

**Step 4: Download the Package**
Download `mstex-deployment.tar.gz` from the `/app/` directory to your local computer.

---

## 3️⃣ Upload to Server

### Option A: Using FTP/SFTP (Recommended for Shared Hosting)

**Using FileZilla or WinSCP:**

1. Connect to your server:
   - Host: `your-server-ip` or `ftp.yourdomain.com`
   - Username: Your hosting username
   - Password: Your hosting password
   - Port: 22 (SFTP) or 21 (FTP)

2. Upload Files:
   - Create directory: `/home/yourusername/mstex/`
   - Upload `mstex-deployment.tar.gz` to this directory
   - Upload individual files if tar is not supported

3. Extract Files (via SSH or File Manager):
   ```bash
   cd /home/yourusername/mstex
   tar -xzf mstex-deployment.tar.gz
   ```

### Option B: Using SCP (Command Line)

From your local machine:
```bash
scp mstex-deployment.tar.gz username@your-server-ip:/home/username/mstex/
```

Then SSH into server and extract:
```bash
ssh username@your-server-ip
cd /home/username/mstex
tar -xzf mstex-deployment.tar.gz
```

### Option C: Using Git (If Available)

1. On Emergent machine:
   ```bash
   cd /app
   git init
   git add .
   git commit -m "MS TEX E-Commerce Site"
   git remote add origin YOUR_REPO_URL
   git push origin main
   ```

2. On your server:
   ```bash
   cd /home/username
   git clone YOUR_REPO_URL mstex
   cd mstex/frontend
   npm install
   npm run build
   ```

---

## 4️⃣ Setup MongoDB

### Option A: Install MongoDB on Server

**For Ubuntu 20.04/22.04:**

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
sudo systemctl status mongod
```

**For CentOS 7/8:**

```bash
# Create MongoDB repo file
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << 'EOF'
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

# Install MongoDB
sudo yum install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option B: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create FREE account
3. Create FREE cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
6. Save this for later use in `.env` file

---

## 5️⃣ Setup Backend (FastAPI)

**Step 1: Install Python and Dependencies**

```bash
# Connect to your server via SSH
ssh username@your-server-ip

# Navigate to backend directory
cd /home/username/mstex/backend

# Install Python3 and pip (if not already installed)
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Step 2: Configure Environment Variables**

Create/Edit `.env` file:
```bash
nano /home/username/mstex/backend/.env
```

Add these lines (replace with your values):
```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/
# OR for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/

# Database Name
DB_NAME=mstex_ecommerce

# CORS Origins (your domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Save file: `Ctrl+X`, then `Y`, then `Enter`

**Step 3: Seed Database with Products**

```bash
cd /home/username/mstex/backend
source venv/bin/activate
python seed_user_images.py
```

You should see:
```
✓ Created admin: admin@mstex.com
✓ 31 products created
```

**Step 4: Test Backend**

```bash
# Start backend temporarily to test
python -m uvicorn server:app --host 0.0.0.0 --port 8001
```

Open another terminal and test:
```bash
curl http://localhost:8001/api/products
```

If you see JSON with products, it's working! Press `Ctrl+C` to stop.

**Step 5: Setup Supervisor (Process Manager)**

Install Supervisor:
```bash
sudo apt-get install -y supervisor
```

Create supervisor config:
```bash
sudo nano /etc/supervisor/conf.d/mstex-backend.conf
```

Add this content (replace `username` with your actual username):
```ini
[program:mstex-backend]
command=/home/username/mstex/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/home/username/mstex/backend
user=username
autostart=true
autorestart=true
stderr_logfile=/var/log/mstex-backend.err.log
stdout_logfile=/var/log/mstex-backend.out.log
environment=PATH="/home/username/mstex/backend/venv/bin"
```

Save and reload supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mstex-backend
sudo supervisorctl status mstex-backend
```

Should show: `mstex-backend RUNNING`

---

## 6️⃣ Setup Frontend (React)

**Frontend is already built!** The `build` folder contains all static files.

Your frontend files are in:
```
/home/username/mstex/frontend/build/
```

**Update Backend URL in Frontend:**

Before deploying, update the `.env` file:
```bash
nano /home/username/mstex/frontend/.env
```

Change to your domain:
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

Then rebuild frontend:
```bash
cd /home/username/mstex/frontend
npm run build
```

---

## 7️⃣ Configure Web Server (Nginx)

**Step 1: Install Nginx**

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

**Step 2: Create Nginx Configuration**

```bash
sudo nano /etc/nginx/sites-available/mstex
```

Add this configuration (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    root /home/username/mstex/frontend/build;
    index index.html;

    # Serve static files (CSS, JS, images)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Product images
    location /uploads/ {
        alias /home/username/mstex/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Logs
    access_log /var/log/nginx/mstex-access.log;
    error_log /var/log/nginx/mstex-error.log;
}
```

**Important:** Replace ALL instances of `username` with your actual server username!

**Step 3: Enable Site**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/mstex /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
```

**Step 4: Configure Firewall**

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 8️⃣ Setup SSL Certificate (HTTPS)

**Using Let's Encrypt (FREE SSL):**

**Step 1: Install Certbot**

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

**Step 2: Get SSL Certificate**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
1. Enter your email address
2. Agree to terms of service
3. Choose whether to redirect HTTP to HTTPS (recommended: Yes)

**Step 3: Test Auto-Renewal**

```bash
sudo certbot renew --dry-run
```

If successful, certificates will auto-renew every 90 days!

---

## 9️⃣ Final Testing

**Step 1: Check All Services**

```bash
# Check MongoDB
sudo systemctl status mongod

# Check Backend
sudo supervisorctl status mstex-backend

# Check Nginx
sudo systemctl status nginx
```

All should show "running" or "active"!

**Step 2: Test Website**

Open browser and visit:
- `https://yourdomain.com` - Should show MS TEX homepage
- `https://yourdomain.com/admin/login` - Should show admin login

**Step 3: Test API**

```bash
curl https://yourdomain.com/api/products
```

Should return JSON with products.

**Step 4: Test Admin Login**

1. Go to: `https://yourdomain.com/admin/login`
2. Email: `admin@mstex.com`
3. Password: `admin123`
4. Should redirect to admin dashboard

**Step 5: Test Image Upload**

1. Login as admin
2. Go to Products → Add Product
3. Upload an image from your computer
4. Save product
5. Check if it appears on homepage

---

## 🔟 Troubleshooting

### Backend Not Starting

**Check logs:**
```bash
sudo tail -100 /var/log/mstex-backend.err.log
```

**Common issues:**
- MongoDB not running: `sudo systemctl start mongod`
- Wrong Python path in supervisor config
- Missing dependencies: `pip install -r requirements.txt`

### Frontend Shows Blank Page

**Check Nginx logs:**
```bash
sudo tail -50 /var/log/nginx/mstex-error.log
```

**Common issues:**
- Wrong path in Nginx config
- Frontend not built: Run `npm run build`
- Permissions issue: `sudo chown -R www-data:www-data /home/username/mstex/frontend/build`

### Images Not Loading

**Check:**
1. Upload directory exists: `ls /home/username/mstex/backend/uploads/products/`
2. Nginx has permission:
   ```bash
   sudo chmod -R 755 /home/username/mstex/backend/uploads/
   ```
3. Nginx config `/uploads/` location is correct

### Database Connection Error

**Check MongoDB:**
```bash
sudo systemctl status mongod
mongo --eval "db.adminCommand('ping')"
```

**If using MongoDB Atlas:**
- Check connection string in `.env`
- Whitelist your server IP in Atlas dashboard

### API Returns 502 Bad Gateway

**Backend not running:**
```bash
sudo supervisorctl status mstex-backend
sudo supervisorctl restart mstex-backend
```

### Port 8001 Already in Use

```bash
# Find process using port
sudo lsof -i :8001

# Kill process (replace PID)
sudo kill -9 PID

# Restart backend
sudo supervisorctl restart mstex-backend
```

---

## 📊 Important Commands Reference

### Service Management
```bash
# Restart Backend
sudo supervisorctl restart mstex-backend

# View Backend Logs
sudo tail -f /var/log/mstex-backend.err.log

# Restart Nginx
sudo systemctl restart nginx

# Restart MongoDB
sudo systemctl restart mongod
```

### File Permissions
```bash
# Fix backend permissions
sudo chown -R username:username /home/username/mstex/backend

# Fix frontend permissions
sudo chown -R www-data:www-data /home/username/mstex/frontend/build

# Fix uploads permissions
sudo chmod -R 755 /home/username/mstex/backend/uploads/
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use mstex_ecommerce

# Show collections
show collections

# Count products
db.products.countDocuments()

# View admin user
db.users.findOne({role: "admin"})
```

---

## 🔒 Security Checklist

Before going live, ensure:

- [ ] Changed admin password from default `admin123`
- [ ] Updated JWT `SECRET_KEY` in `/backend/server.py`
- [ ] SSL certificate installed (HTTPS)
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] MongoDB secured (if local installation)
- [ ] File permissions set correctly (no 777 permissions)
- [ ] `.env` files have restricted permissions: `chmod 600 .env`
- [ ] Server OS updated: `sudo apt-get update && sudo apt-get upgrade`
- [ ] Regular backups configured

---

## 📦 Backup Guide

### Backup MongoDB
```bash
# Create backup directory
mkdir -p /home/username/backups

# Backup database
mongodump --uri="mongodb://localhost:27017/mstex_ecommerce" --out=/home/username/backups/mongodb-$(date +%Y%m%d)
```

### Backup Uploaded Images
```bash
tar -czf /home/username/backups/images-$(date +%Y%m%d).tar.gz /home/username/mstex/backend/uploads/
```

### Backup Code
```bash
tar -czf /home/username/backups/mstex-code-$(date +%Y%m%d).tar.gz /home/username/mstex/
```

### Automate Backups (Cron)
```bash
crontab -e
```

Add this line (backup daily at 2 AM):
```cron
0 2 * * * mongodump --uri="mongodb://localhost:27017/mstex_ecommerce" --out=/home/username/backups/mongodb-$(date +\%Y\%m\%d)
```

---

## 📞 Support & Help

### Server Access Issues
- Contact your hosting provider (SpidyHost support)
- Check SSH credentials
- Verify server is running

### Application Issues
- Check logs: `/var/log/mstex-backend.err.log`
- Check Nginx logs: `/var/log/nginx/mstex-error.log`
- MongoDB logs: `/var/log/mongodb/mongod.log`

### MongoDB Atlas Issues
- Check MongoDB Atlas dashboard
- Verify IP whitelist
- Check connection string

---

## ✅ Deployment Checklist

Print this and check off as you complete each step:

- [ ] Server access confirmed
- [ ] MongoDB installed/configured
- [ ] Backend files uploaded
- [ ] Backend dependencies installed
- [ ] Environment variables configured
- [ ] Database seeded with products
- [ ] Backend running via Supervisor
- [ ] Frontend built
- [ ] Frontend files uploaded
- [ ] Nginx installed
- [ ] Nginx configured with correct paths
- [ ] Domain pointed to server IP
- [ ] SSL certificate installed
- [ ] Website accessible via HTTPS
- [ ] Admin login working
- [ ] Products displaying
- [ ] Image upload working
- [ ] Cart and checkout working
- [ ] Changed admin password
- [ ] Updated SECRET_KEY
- [ ] Configured backups

---

## 🎉 Deployment Complete!

Your MS TEX e-commerce website is now live!

**Admin Access:**
- URL: `https://yourdomain.com/admin/login`
- Email: `admin@mstex.com`
- Password: `admin123` (⚠️ CHANGE THIS IMMEDIATELY!)

**Next Steps:**
1. Login to admin panel
2. Change admin password
3. Upload more products with your images
4. Test all features thoroughly
5. Share your website!

---

**Congratulations on deploying MS TEX!** 🚀🎊

If you encounter any issues, refer to the Troubleshooting section or check server logs.
