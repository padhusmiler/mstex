# MS TEX - Quick Deployment Checklist

## 🚀 5-Minute Quick Guide

### Before Starting
- [ ] Server with SSH access ready
- [ ] Domain name configured
- [ ] FTP/SFTP client installed (FileZilla)

---

## Step 1: Prepare Files (5 min)
```bash
cd /app/frontend
npm run build

cd /app
tar -czf mstex-deployment.tar.gz backend/ frontend/build/
```
Download `mstex-deployment.tar.gz`

---

## Step 2: Upload to Server (10 min)
**Via FileZilla:**
- Host: your-server-ip
- Upload `mstex-deployment.tar.gz` to `/home/username/mstex/`

**Via SSH:**
```bash
ssh username@server-ip
cd /home/username/mstex
tar -xzf mstex-deployment.tar.gz
```

---

## Step 3: Install MongoDB (10 min)

**Option A - Local:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Option B - Cloud (Recommended):**
1. Go to https://mongodb.com/cloud/atlas
2. Create FREE account & cluster
3. Get connection string
4. Save for Step 4

---

## Step 4: Setup Backend (15 min)
```bash
cd /home/username/mstex/backend

# Install Python
sudo apt-get install -y python3 python3-pip python3-venv

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install packages
pip install -r requirements.txt

# Create .env file
nano .env
```

Add to `.env`:
```env
MONGO_URL=mongodb://localhost:27017/
# OR Atlas: mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=mstex_ecommerce
CORS_ORIGINS=https://yourdomain.com
```

```bash
# Seed database
python seed_user_images.py

# Install Supervisor
sudo apt-get install -y supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/mstex-backend.conf
```

Paste this (change `username`):
```ini
[program:mstex-backend]
command=/home/username/mstex/backend/venv/bin/python -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/home/username/mstex/backend
user=username
autostart=true
autorestart=true
stderr_logfile=/var/log/mstex-backend.err.log
stdout_logfile=/var/log/mstex-backend.out.log
```

```bash
# Start backend
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mstex-backend
```

---

## Step 5: Setup Nginx (10 min)
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/mstex
```

Paste this (change `username` and `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /home/username/mstex/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads/ {
        alias /home/username/mstex/backend/uploads/;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mstex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configure firewall
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## Step 6: Setup SSL (5 min)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow prompts → Choose redirect HTTP to HTTPS (Yes)

---

## Step 7: Test Everything (5 min)

```bash
# Check services
sudo systemctl status mongod
sudo supervisorctl status mstex-backend
sudo systemctl status nginx

# Test API
curl https://yourdomain.com/api/products
```

**Open browser:**
- `https://yourdomain.com` - Homepage ✓
- `https://yourdomain.com/admin/login` - Admin login ✓

**Login:**
- Email: admin@mstex.com
- Password: admin123

---

## ⚡ Quick Commands

### Restart Services
```bash
sudo supervisorctl restart mstex-backend
sudo systemctl restart nginx
```

### View Logs
```bash
sudo tail -f /var/log/mstex-backend.err.log
sudo tail -f /var/log/nginx/error.log
```

### Fix Permissions
```bash
sudo chmod -R 755 /home/username/mstex/backend/uploads/
```

---

## 🔧 Common Issues

**Backend not starting?**
```bash
sudo tail -100 /var/log/mstex-backend.err.log
sudo supervisorctl restart mstex-backend
```

**Images not loading?**
```bash
sudo chmod -R 755 /home/username/mstex/backend/uploads/
sudo systemctl reload nginx
```

**Can't connect to MongoDB?**
```bash
sudo systemctl restart mongod
# Check .env has correct MONGO_URL
```

---

## ✅ Final Checklist

After deployment:
- [ ] Website loads: https://yourdomain.com
- [ ] Products showing with images
- [ ] Admin login works
- [ ] Can add new products
- [ ] Can upload images
- [ ] Cart works
- [ ] Checkout works
- [ ] Changed admin password
- [ ] SSL certificate active (HTTPS)

---

## 🎉 You're Live!

**Admin Panel:**
- URL: https://yourdomain.com/admin/login
- Email: admin@mstex.com
- Password: admin123 (CHANGE THIS!)

**Start uploading your products and images!** 🚀

---

## 📚 Full Documentation

For detailed steps, see:
- `/app/MANUAL_DEPLOYMENT_GUIDE.md` - Complete guide
- `/app/ADMIN_IMAGE_UPLOAD_GUIDE.md` - Upload images guide
- `/app/README.md` - Project overview
- `/app/DEPLOYMENT_GUIDE.md` - SpidyHost specific

---

**Total Deployment Time:** ~60 minutes

**Need Help?** Check logs and troubleshooting section in MANUAL_DEPLOYMENT_GUIDE.md
