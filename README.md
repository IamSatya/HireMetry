# HireMetry

AI-powered interview practice platform that analyzes technical, behavioral, spontaneous, and problem-solving patterns.

## Features

- Interactive interview simulation
- Real-time AI feedback on competencies
- Responsive web interface
- Technical skill assessment
- Behavioral analysis

## Local Development

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd HireMetry

   # Backend
   cd backend
   npm install

   # Frontend
   cd ../web
   npm install
   ```

2. **Configure environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Run locally:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev  # Runs on http://localhost:5000

   # Terminal 2: Frontend
   cd web
   npm run dev  # Runs on http://localhost:5173
   ```

## Production Deployment on Ubuntu 24.04

### Prerequisites
- Ubuntu 24.04 server
- Domain name (hiremetry.com)
- Root or sudo access

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management (optional, but recommended)
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

### 2. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone <your-repo-url> hiremetry
sudo chown -R $USER:$USER hiremetry
cd hiremetry

# Install dependencies
cd backend
npm install --production

cd ../web
npm install
npm run build
```

### 3. Environment Configuration

```bash
cd /var/www/hiremetry/backend
cp .env.example .env
# Edit .env with production values:
# OPENAI_API_KEY=your_production_key
# PORT=5000
# NODE_ENV=production
```

### 4. Systemd Services

#### Backend Service (`/etc/systemd/system/hiremetry-backend.service`)

```ini
[Unit]
Description=HireMetry Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hiremetry/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

#### Frontend Service (Not needed - served by Nginx)
# Skip this - frontend is static files served by Nginx

### 5. Nginx Configuration

#### Main Nginx config (`/etc/nginx/sites-available/hiremetry.com`)

```nginx
server {
    listen 80;
    server_name hiremetry.com www.hiremetry.com;

    root /var/www/hiremetry/web/dist;
    index index.html;

    # Frontend (React app)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect www to non-www
server {
    listen 80;
    server_name www.hiremetry.com;
    return 301 http://hiremetry.com$request_uri;
}
```

### 6. Enable Services

```bash
# Enable and start services
sudo systemctl enable hiremetry-backend
sudo systemctl start hiremetry-backend

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/hiremetry.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get certificate
sudo certbot --nginx -d hiremetry.com -d www.hiremetry.com

# Certbot will automatically update Nginx config for SSL
```

### 8. Update Frontend API Calls

In production, the frontend needs to call `/api/analyze-text` instead of the full URL. Update the axios call:

```javascript
// In web/src/App.tsx, update generateFeedback function:
const apiUrl = process.env.NODE_ENV === 'production' 
  ? '/api/analyze-text' 
  : 'http://localhost:5000/analyze-text';

await axios.post(apiUrl, { text: transcript });
```

### 9. Monitoring and Logs

```bash
# Check service status
sudo systemctl status hiremetry-backend

# View logs
sudo journalctl -u hiremetry-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 10. Backup and Updates

```bash
# Backup database (if using MongoDB/PostgreSQL)
# Add your backup commands here

# Update application
cd /var/www/hiremetry
git pull
cd backend && npm install --production
cd ../web && npm install && npm run build

# Restart services
sudo systemctl restart hiremetry-backend
sudo systemctl reload nginx
```

## API Documentation

### POST /api/analyze-text
Analyzes interview transcript for competencies.

**Request:**
```json
{
  "text": "Candidate's response text"
}
```

**Response:**
```json
{
  "feedback": "AI-generated feedback with scores and suggestions"
}
```

## Troubleshooting

- **Port conflicts:** Check `sudo netstat -tlnp | grep :5000`
- **Permission issues:** Ensure www-data user owns the app directory
- **CORS errors:** Check Nginx proxy headers
- **SSL issues:** Run `sudo certbot renew`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

## License

MIT License
