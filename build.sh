#!/bin/bash
set -e

echo "🔨 Building iBible with Vercel..."
echo "📂 Current directory: $(pwd)"
echo "📂 Directory contents:"
ls -la | head -20

# Make sure we're in the right place or navigate there
if [ -f "myscriptum/package.json" ]; then
  cd myscriptum
  echo "📂 Navigated to myscriptum"
fi

echo "📋 Running prebuild..."
npm run prebuild || echo "⚠️  Prebuild might have failed or doesn't exist"

echo "🏗️  Building Next.js..."
npm run build

echo "✅ Build complete!"
