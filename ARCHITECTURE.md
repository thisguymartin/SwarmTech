# SwarmTech Architecture

## System Overview

SwarmTech is a real-time disaster response coordination platform built with modern web technologies and containerized with Docker for easy deployment.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Vue.js Frontend                       │   │
│  │  - Login Component                                       │   │
│  │  - Map Component (Leaflet.js)                           │   │
│  │  - Chat Component                                        │   │
│  │  - API Client (REST + WebSocket)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                    │                   │
│         │ HTTP/HTTPS                         │ WebSocket         │
└─────────┼────────────────────────────────────┼───────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX (Port 3000)                           │
│  - Static file serving                                           │
│  - Reverse proxy to API                                          │
│  - WebSocket proxy                                               │
└─────────────────────────────────────────────────────────────────┘
          │                                    │
          │ /api/*                             │ /ws
          ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API SERVER (Port 8001)                         │
│                     Node.js + Express                            │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │   REST API  │  │  WebSocket  │  │   Business   │            │
│  │   Routes    │  │   Server    │  │    Logic     │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
│                                                                   │
│  Routes:                                                          │
│  - /api/users      (User management)                             │
│  - /api/messages   (Chat messages)                               │
│  - /api/pins       (Location pins)                               │
│  - /api/events     (Disaster events)                             │
│  - /ws             (Real-time updates)                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
          │
          │ SQL Queries
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                POSTGRESQL DATABASE (Port 5432)                   │
│                                                                   │
│  Tables:                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────┐  ┌────────┐              │
│  │  users  │  │ messages │  │ pins │  │ events │              │
│  └─────────┘  └──────────┘  └──────┘  └────────┘              │
│                                                                   │
│  - Persistent storage                                            │
│  - Indexed queries                                               │
│  - ACID compliance                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Login
1. User enters name in frontend
2. POST request to `/api/users/login`
3. API creates/retrieves user from database
4. User data returned to frontend
5. Frontend establishes WebSocket connection

### Sending a Message
1. User types message and clicks "Send"
2. POST request to `/api/messages`
3. API saves message to database
4. API broadcasts message via WebSocket to all connected clients
5. All clients receive and display the new message

### Updating Location
1. User pans the map (throttled to 200ms)
2. POST request to `/api/pins`
3. API updates/creates pin in database
4. API broadcasts pin update via WebSocket
5. All clients update the marker on their maps

### Real-time Updates
- WebSocket connection established on login
- Server broadcasts updates for:
  - New messages
  - Pin location changes
  - New users joining
- Clients receive and apply updates immediately

## Technology Stack

### Frontend
- **Vue.js 2.7**: Reactive UI framework
- **Leaflet.js**: Interactive maps
- **WebSocket API**: Real-time communication
- **Font Awesome**: Icons

### Backend
- **Node.js 18**: JavaScript runtime
- **Express.js**: Web framework
- **WebSocket (ws)**: Real-time communication
- **pg**: PostgreSQL client

### Database
- **PostgreSQL 15**: Relational database
- Stores users, messages, pins, and events

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Web server and reverse proxy

## Container Architecture

```
┌────────────────────────────────────────────────────┐
│              Docker Compose Network                 │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   web        │  │     api      │  │    db    │ │
│  │  (nginx)     │  │  (node.js)   │  │(postgres)│ │
│  │  Port: 3000  │  │  Port: 8001  │  │Port: 5432│ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                  │                │       │
│         └──────────────────┴────────────────┘       │
│                     Internal Network                │
└────────────────────────────────────────────────────┘
```

## Security Considerations

- **Environment Variables**: Sensitive data stored in env vars
- **Network Isolation**: Containers communicate via internal network
- **CORS**: Configured to allow frontend-backend communication
- **Input Validation**: API validates all user inputs
- **SQL Injection Protection**: Parameterized queries

## Scalability

The current architecture is designed for single-server deployment but can be scaled:

1. **Horizontal Scaling**: Add more API containers behind a load balancer
2. **Database Replication**: Add PostgreSQL read replicas
3. **WebSocket Clustering**: Use Redis for pub/sub across multiple API instances
4. **CDN**: Serve static assets from a CDN

## Development vs Production

### Development
- Hot reloading enabled
- Detailed error messages
- Source maps included
- Database accessible on localhost:5432

### Production (Recommended Changes)
- Minify and bundle frontend assets
- Use production builds of libraries
- Enable HTTPS/TLS
- Implement authentication/authorization
- Add rate limiting
- Use strong database passwords
- Implement logging and monitoring
- Database not exposed externally

## Future Enhancements

1. **Authentication**: JWT-based auth system
2. **Teams/Groups**: Multiple isolated coordination groups
3. **Voice Chat**: WebRTC integration
4. **File Sharing**: Upload and share images/documents
5. **Offline Support**: Service workers for offline capability
6. **Mobile Apps**: React Native or Flutter apps
7. **Analytics**: Track response times and coordination efficiency
