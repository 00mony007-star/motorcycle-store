#!/bin/bash

# 🏍️ MotoGear Store - Enhanced Setup Script
# This script helps set up your enhanced motorcycle e-commerce platform

set -e

echo "🏍️  Setting up MotoGear Store - Enhanced Edition"
echo "=================================================="

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "🔧 Creating environment configuration..."
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please edit .env.local with your API keys before running the app"
else
    echo "✅ Environment file already exists"
fi

# Create necessary directories
echo ""
echo "📁 Setting up project structure..."
mkdir -p public/locales/en public/locales/ar
mkdir -p src/components/ui src/components/admin src/components/Product
mkdir -p docs

echo "✅ Project directories created"

# Build the project to verify everything works
echo ""
echo "🔨 Testing build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.local with your API keys:"
echo "   - Supabase URL and API key"
echo "   - Stripe publishable key"
echo "   - Other service configurations"
echo ""
echo "2. Set up your Supabase database:"
echo "   - Create a new Supabase project"
echo "   - Run the database migrations (see ARCHITECTURE.md)"
echo "   - Enable Realtime on products and orders tables"
echo ""
echo "3. Configure Stripe:"
echo "   - Add your Stripe keys to .env.local"
echo "   - Set up webhooks for order confirmation"
echo ""
echo "4. Start development:"
echo "   npm run dev"
echo ""
echo "🔗 Useful Links:"
echo "   - Documentation: ./ARCHITECTURE.md"
echo "   - Admin Dashboard: http://localhost:5173/admin"
echo "   - Storefront: http://localhost:5173"
echo ""
echo "🏍️  Happy coding with MotoGear Store!"