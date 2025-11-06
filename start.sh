#!/bin/bash

# SwarmTech Startup Script

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        SwarmTech                               ║"
echo "║        Disaster Response Coordination Platform                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker first."
    exit 1
fi

echo "🚀 Starting SwarmTech services..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check status
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                  ✅ SwarmTech is running!                      ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🌐 Web Application:  http://localhost:3000"
    echo "🔌 API Server:       http://localhost:8001"
    echo "🗄️  Database:         localhost:5432"
    echo ""
    echo "📝 To view logs:     docker-compose logs -f"
    echo "🛑 To stop:          docker-compose down"
    echo ""
    echo "📖 Documentation:    See SETUP.md and ARCHITECTURE.md"
    echo ""
    echo "Open http://localhost:3000 in your browser to get started!"
else
    echo ""
    echo "❌ Error: Services failed to start. Check logs with:"
    echo "   docker-compose logs"
fi
