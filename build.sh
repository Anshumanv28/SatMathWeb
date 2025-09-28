#!/bin/bash

# SAT Math Web - Build Script

echo "🚀 Building SAT Math Web Application..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please copy env.example to .env and configure your environment variables"
    echo "   cp env.example .env"
    echo ""
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose build

echo "✅ Build complete!"
echo ""
echo "To run the application:"
echo "   docker-compose up"
echo ""
echo "To run in background:"
echo "   docker-compose up -d"
echo ""
echo "To view logs:"
echo "   docker-compose logs -f"
