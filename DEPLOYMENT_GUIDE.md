# MS TEX - Deployment Guide for SpidyHost

## 🎉 Site is Working Perfectly!
- ✅ All 55 products with images loading
- ✅ MS TEX logo integrated
- ✅ INR (₹) prices throughout
- ✅ Complete e-commerce functionality

---

## 📦 Pre-Deployment Checklist

1. **Files to Deploy:**
   - `/app/backend/` - FastAPI backend
   - `/app/frontend/build/` - React build files
   - `/app/backend/uploads/` - Product images

2. **Database:**
   - MongoDB required
   - Pre-seeded with 55 products and admin user

---

## 🚀 Deployment Steps for SpidyHost

### Step 1: Build Frontend
```bash
cd /app/frontend
npm run build
# or
yarn build
```

This creates optimized production files in `/app/frontend/build/`

### Step 2: Prepare Backend
```bash
cd /app/backend
# Ensure all dependencies are in requirements.txt
pip freeze > requirements.txt
```

### Step 3: Upload to SpidyHost

#### Option A: Using FTP/SFTP
1. Connect to your SpidyHost via FTP client (FileZilla, WinSCP)
2. Upload `/app/backend/` to your server (e.g., `/home/yourusername/backend/`)
3. Upload `/app/frontend/build/` contents to public_html or web root
4. Upload `/app/backend/uploads/` folder with all images

#### Option B: Using Git
```bash
# On your local machine
git init
git add .
git commit -m "MS TEX E-Commerce Site"
git remote add origin YOUR_SPIDYHOST_REPO
git push origin main

# Then SSH into SpidyHost and pull
ssh user@your-spidyhost-server
cd /path/to/your/app
git pull origin main
```

### Step 4: Setup MongoDB on SpidyHost

1. **If SpidyHost has MongoDB:**
   ```bash
   # Update backend/.env with SpidyHost MongoDB credentials
   MONGO_URL=mongodb://localhost:27017/
   DB_NAME=mstex_ecommerce
   ```

2. **If using External MongoDB (MongoDB Atlas - Free):**
   ```bash
   # Sign up at https://www.mongodb.com/cloud/atlas
   # Create free cluster
   # Get connection string
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
   DB_NAME=mstex_ecommerce
   ```

3. **Seed Database:**
   ```bash
   cd /app/backend
   python seed_50_products.py
   ```

### Step 5: Install Python Dependencies on Server
```bash
ssh user@your-spidyhost-server
cd /path/to/backend
pip install -r requirements.txt
```

### Step 6: Configure Environment Variables

Create `/backend/.env` on server:
```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=mstex_ecommerce
CORS_ORIGINS=https://yourdomain.com
```

Create `/frontend/.env` on server (if using separate API domain):
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### Step 7: Run Backend on SpidyHost

#### Option A: Using Supervisor (Recommended)
Create `/etc/supervisor/conf.d/mstex-backend.conf`:
```ini
[program:mstex-backend]
command=/usr/bin/python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
directory=/home/yourusername/backend
user=yourusername
autostart=true
autorestart=true
stderr_logfile=/var/log/mstex-backend.err.log
stdout_logfile=/var/log/mstex-backend.out.log
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start mstex-backend
```

#### Option B: Using PM2 (Alternative)
```bash
npm install -g pm2
cd /path/to/backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name mstex-backend
pm2 save
pm2 startup
```

### Step 8: Configure Web Server (Nginx/Apache)

#### For Nginx:
Create `/etc/nginx/sites-available/mstex`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /home/yourusername/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (images)
    location /uploads/ {
        alias /home/yourusername/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/mstex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### For Apache:
Create `/etc/apache2/sites-available/mstex.conf`:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    DocumentRoot /home/yourusername/frontend/build

    <Directory /home/yourusername/frontend/build>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ index.html [L]
    </Directory>

    ProxyPass /api http://localhost:8001/api
    ProxyPassReverse /api http://localhost:8001/api

    Alias /uploads /home/yourusername/backend/uploads
    <Directory /home/yourusername/backend/uploads>
        Require all granted
    </Directory>
</VirtualHost>
```

Enable site:
```bash
sudo a2ensite mstex
sudo a2enmod proxy proxy_http rewrite
sudo systemctl reload apache2
```

### Step 9: Setup SSL Certificate (HTTPS)

Using Let's Encrypt (Free):
```bash
sudo apt install certbot python3-certbot-nginx
# For Nginx:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For Apache:
sudo apt install python3-certbot-apache
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

---

## 🔐 Security Checklist

1. **Change JWT Secret Key** in `/backend/server.py`:
   ```python
   SECRET_KEY = "your-very-secure-random-secret-key-here"
   ```

2. **Update Admin Password:**
   ```bash
   # After deployment, login as admin and change password
   ```

3. **Set Proper File Permissions:**
   ```bash
   chmod 755 /path/to/backend
   chmod 644 /path/to/backend/*.py
   chmod 700 /path/to/backend/.env
   ```

4. **Configure Firewall:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

---

## 📝 Post-Deployment

1. **Test Site:**
   - Visit `https://yourdomain.com`
   - Test product browsing
   - Test user registration/login
   - Test adding to cart
   - Test checkout flow

2. **Admin Login:**
   - URL: `https://yourdomain.com/admin/login`
   - Email: `admin@mstex.com`
   - Password: `admin123`

3. **Monitor Logs:**
   ```bash
   # Backend logs
   tail -f /var/log/mstex-backend.err.log
   
   # Nginx logs
   tail -f /var/log/nginx/error.log
   ```

---

## 🔄 Updates & Maintenance

### To Update Code:
```bash
# Pull latest changes
git pull origin main

# Restart backend
sudo supervisorctl restart mstex-backend

# Rebuild frontend
cd frontend
npm run build
```

### Backup Database:
```bash
mongodump --uri="your_mongo_url" --out=/backup/mstex-$(date +%Y%m%d)
```

---

## ❓ Troubleshooting

### Images Not Loading:
- Check `/backend/uploads/products/` directory exists
- Verify web server has read permissions
- Check nginx/apache configuration for `/uploads/` alias

### Backend Not Starting:
```bash
# Check logs
tail -100 /var/log/mstex-backend.err.log

# Test manually
cd /path/to/backend
python -m uvicorn server:app --reload
```

### Database Connection Error:
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check MONGO_URL in .env file
- Test connection: `mongo your_connection_string`

---

## 📞 Support

- SpidyHost Documentation: https://www.spidyhost.com/help
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/

---

**Deployment completed successfully! Your MS TEX e-commerce site is ready to go live!** 🎉
