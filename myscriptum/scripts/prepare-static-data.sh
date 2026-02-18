#!/bin/bash
# Copy Bible data from data/ to public/ for static serving
echo "📋 Copying Bible data to public directory..."
mkdir -p public/data
cp -r data/bible public/data/ 2>/dev/null || true
cp -r data/featured-verses.json public/data/ 2>/dev/null || true
echo "✅ Bible data copied successfully"
