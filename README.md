# SwarmTech

Realtime coordination demo for disaster response teams.

![v1.1.0 screenshot](docs/v1.1.0.png)

## Who

* Grassroots volunteers for disaster response
* Police, Fire, National Guard

## Why

* Teams need to coordinate/share data to avoid wasted effort and be effective
* Volunteer teams may form and disband in a way that cannot be preplanned
* Need decentralized information management in order to take advantage of decentralized network (e.g. mesh)

## What

* Phone app reporting location and allowing text chat (field agents)
* Command center app showing pins for field agents, near-real-time integrated communications and situational awareness
* Ability to merge two teams situational awareness with 0 shared infrastructure and no custom integration costs (assuming protocol compliance)
* Demonstration of capabilities via “disaster drills” and report on outcome

## How

* Near-real-time state synchronization based on CRDTs
* Use data format RFCs when possible (e.g. GeoJSON, jCard)
* Extensible schema-less graph data to express relationships
* Content addressing
* Peer discovery by gossip protocol
* Object capability model for data access control
* Cryptographically verified identity, ownership, access

If you don't understand what these things mean, don't worry, you probably don't have to in order to use it, or even build apps on it.  Keep calm and carry on!

# Contributing

To begin contributing, please fork the repository to your personal account, clone it, and submit a pull request.  We'll respond with comments and should have your patch merged in short order.  If there are any problems with this process, please talk to us on [gitter.im/JSVillage](https://gitter.im/JSVillage).

# Quick Start with Docker (Recommended)

The easiest way to run SwarmTech is using Docker Compose:

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

## Running SwarmTech

```bash
# Clone the repository
git clone https://github.com/JSVillage/SwarmTech.git
cd SwarmTech

# Start all services (database, API, web)
docker-compose up -d

# Wait 30-60 seconds for initialization, then open your browser
```

Open your browser at **http://localhost:3000**

That's it! Enter your name and start coordinating with your team.

## Features

- **Real-time Map**: See all team members' locations on an interactive map
- **Live Chat**: Communicate with your team in real-time
- **WebSocket Sync**: Instant updates across all connected clients
- **No Setup Required**: Everything runs in Docker containers
- **Responsive Design**: Works on desktop and mobile

## Testing with Multiple Users

1. Open multiple browser tabs at `http://localhost:3000`
2. Use different names in each tab
3. Watch location pins and messages sync in real-time

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (fresh start next time)
docker-compose down -v
```

## Documentation

- **[Complete Setup Guide](SETUP.md)** - Detailed installation and configuration
- **[Architecture Overview](ARCHITECTURE.md)** - System design and data flow
- **[API Documentation](SETUP.md#api-documentation)** - REST and WebSocket APIs

## Technology Stack

- **Frontend**: Vue.js, Leaflet.js (OpenStreetMap), WebSocket
- **Backend**: Node.js, Express, WebSocket Server
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Docker Compose, Nginx

## Legacy Version

The original CRDT-based version is still available on the `legacy` branch. The current version uses a REST API with WebSocket for simpler deployment and maintenance.
