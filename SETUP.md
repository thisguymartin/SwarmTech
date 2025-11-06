# SwarmTech Setup Guide

## Quick Start (Recommended)

The easiest way to run SwarmTech is using Docker Compose. This will set up everything you need in minutes.

### Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

#### Installing Docker

**Windows & Mac:**
- Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Running SwarmTech

1. **Clone the repository**
   ```bash
   git clone https://github.com/JSVillage/SwarmTech.git
   cd SwarmTech
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

   This command will:
   - Pull necessary Docker images
   - Build the API server and web frontend
   - Start PostgreSQL database
   - Initialize the database schema
   - Start all services

3. **Wait for initialization**

   First time setup takes 30-60 seconds. Check status:
   ```bash
   docker-compose ps
   ```

   All services should show "Up" status.

4. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. **Join the network**
   - Enter your name
   - Click "Join Network"
   - You'll see a map with your location pin
   - Use the chat box to communicate with other users

### Testing with Multiple Users

To simulate multiple team members:

1. Open multiple browser tabs or windows at `http://localhost:3000`
2. Use different names in each tab
3. Watch as pins appear on all maps
4. Send messages and see them appear in all chat windows

### Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (including database)
docker-compose down -v
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

---

## Manual Setup (Without Docker)

If you prefer to run services individually:

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 15 or higher
- npm or yarn

### Database Setup

1. **Install PostgreSQL**
   ```bash
   # Mac
   brew install postgresql@15

   # Ubuntu/Debian
   sudo apt-get install postgresql-15

   # Windows: Download from postgresql.org
   ```

2. **Create database and user**
   ```bash
   psql -U postgres
   ```

   In PostgreSQL console:
   ```sql
   CREATE DATABASE swarmtech;
   CREATE USER swarmtech WITH PASSWORD 'swarmtech123';
   GRANT ALL PRIVILEGES ON DATABASE swarmtech TO swarmtech;
   \q
   ```

3. **Initialize schema**
   ```bash
   psql -U swarmtech -d swarmtech -f api/database/schema.sql
   ```

### API Server Setup

1. **Navigate to API directory**
   ```bash
   cd api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=swarmtech
   export DB_USER=swarmtech
   export DB_PASSWORD=swarmtech123
   export PORT=8001
   ```

4. **Start the API server**
   ```bash
   npm start
   ```

   Server will start at `http://localhost:8001`

### Frontend Setup

1. **In a new terminal, navigate to project root**
   ```bash
   cd SwarmTech
   ```

2. **Install a simple HTTP server**
   ```bash
   npm install -g http-server
   ```

3. **Serve the frontend**
   ```bash
   http-server client -p 8080
   ```

4. **Access the application**

   Open browser to `http://localhost:8080/index-new.html`

---

## Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=swarmtech
DB_USER=swarmtech
DB_PASSWORD=swarmtech123

# API Server Configuration
PORT=8001

# Frontend Configuration
API_URL=http://localhost:8001
```

### Ports

- **3000**: Frontend (Nginx)
- **8001**: API Server
- **5432**: PostgreSQL Database

To change ports, edit `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "8080:80"  # Change 3000 to 8080
```

---

## API Documentation

### REST Endpoints

#### Users
- `POST /api/users/login` - Create or get user
- `GET /api/users` - List all users

#### Messages
- `GET /api/messages?event_id=1` - Get messages
- `POST /api/messages` - Send message

#### Pins
- `GET /api/pins?event_id=1` - Get all pins
- `POST /api/pins` - Create/update pin
- `DELETE /api/pins/:id` - Delete pin

#### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event

### WebSocket

Connect to `ws://localhost:8001/ws`

**Message Types:**
- `connection` - Connection established
- `message` - New chat message
- `pin` - Pin location update

---

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
docker-compose down
docker-compose up -d --force-recreate
```

**Database connection error:**
```bash
# Check if database is ready
docker-compose logs db

# Restart database
docker-compose restart db
```

**Port already in use:**
```bash
# Find process using port
lsof -i :3000
# or
netstat -ano | findstr :3000

# Kill process or change port in docker-compose.yml
```

### Manual Setup Issues

**Database connection refused:**
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection settings in `.env`
- Verify database and user exist: `psql -U postgres -c '\l'`

**API won't start:**
- Check if port 8001 is available: `lsof -i :8001`
- Verify Node.js version: `node --version` (should be 18+)
- Check logs for errors

**Frontend not loading:**
- Clear browser cache
- Check browser console for errors
- Verify API is running at `http://localhost:8001/health`

### Common Issues

**Map not loading:**
- Check internet connection (map tiles from OpenStreetMap)
- Verify Leaflet.js is loaded in browser console

**WebSocket not connecting:**
- Check if API server is running
- Verify WebSocket endpoint in `api.js`
- Check browser console for connection errors

**Messages not syncing:**
- Verify WebSocket connection is established
- Check API logs: `docker-compose logs api`
- Try refreshing the page

---

## Development

### Hot Reload Development Mode

For active development with auto-reload:

```bash
# API server with nodemon
cd api
npm install -g nodemon
npm run dev

# Frontend (use any dev server with live reload)
cd client
npx live-server
```

### Database Reset

To reset database to initial state:

```bash
# Docker
docker-compose down -v
docker-compose up -d

# Manual
psql -U swarmtech -d swarmtech -f api/database/schema.sql
```

### Adding New Features

1. **Database Changes**: Edit `api/database/schema.sql`
2. **API Endpoints**: Add routes in `api/routes/`
3. **Frontend Components**: Edit files in `client/js/`

---

## Production Deployment

### Recommendations

1. **Use HTTPS**: Set up SSL/TLS certificates
2. **Secure Database**: Change default passwords
3. **Environment Variables**: Use secrets management
4. **Reverse Proxy**: Use Nginx or Traefik with SSL
5. **Monitoring**: Add logging and health checks
6. **Backups**: Regular database backups

### Deploy to Cloud

**Docker-based hosts** (Recommended):
- DigitalOcean App Platform
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Heroku

**Steps:**
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy using `docker-compose.yml`

---

## Support

- **Issues**: https://github.com/JSVillage/SwarmTech/issues
- **Discussions**: https://github.com/JSVillage/SwarmTech/discussions
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

---

## License

MIT License - See [LICENSE](LICENSE) file
