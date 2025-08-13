#!/bin/bash

echo "🚀 Building and running SAT Math Web with Docker Compose..."

# Build and start the containers
docker-compose up --build -d

echo "✅ Containers are starting up..."
echo ""
echo "📊 Services:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000/api/health"
echo ""
echo "🔍 Check container status:"
echo "   docker-compose ps"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop containers:"
echo "   docker-compose down" 