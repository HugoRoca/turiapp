#!/bin/bash

# TuriApp API Setup Script
echo "🚀 Setting up TuriApp API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Create the database: mysql -u root -p < database/schema.sql"
echo "3. Start the server: npm run dev"
echo ""
echo "API will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/health"
