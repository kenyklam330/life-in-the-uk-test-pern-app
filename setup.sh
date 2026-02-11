#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   Life in the UK Test App - Quick Setup Script        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js installation... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Found Node.js $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL installation... "
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo -e "${GREEN}✓ Found $PSQL_VERSION${NC}"
else
    echo -e "${RED}✗ PostgreSQL not found${NC}"
    echo "Please install PostgreSQL 14+ from https://www.postgresql.org/"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo " Step 1: Database Setup"
echo "═══════════════════════════════════════════════════════"

# Create database
echo -n "Enter PostgreSQL username [postgres]: "
read DB_USER
DB_USER=${DB_USER:-postgres}

echo "Creating database 'life_in_uk'..."
createdb -U $DB_USER life_in_uk 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database created${NC}"
else
    echo -e "${YELLOW}⚠ Database might already exist (this is okay)${NC}"
fi

# Run schema
echo "Running database schema..."
psql -U $DB_USER -d life_in_uk -f server/database/schema.sql > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema created${NC}"
else
    echo -e "${RED}✗ Failed to create schema${NC}"
    exit 1
fi

# Seed data
echo "Seeding sample data..."
psql -U $DB_USER -d life_in_uk -f server/database/seed.sql > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Data seeded${NC}"
else
    echo -e "${RED}✗ Failed to seed data${NC}"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo " Step 2: Environment Configuration"
echo "═══════════════════════════════════════════════════════"

# Server .env
if [ ! -f server/.env ]; then
    echo "Creating server/.env file..."
    cp server/.env.example server/.env
    
    echo -e "${YELLOW}⚠ Please edit server/.env and add:${NC}"
    echo "  - Your PostgreSQL password"
    echo "  - Google OAuth Client ID and Secret"
    echo "  - A random session secret"
    echo ""
    echo "Get Google OAuth credentials from:"
    echo "https://console.cloud.google.com/apis/credentials"
    echo ""
else
    echo -e "${GREEN}✓ server/.env already exists${NC}"
fi

# Client .env
if [ ! -f client/.env ]; then
    echo "Creating client/.env file..."
    cp client/.env.example client/.env
    echo -e "${GREEN}✓ client/.env created${NC}"
else
    echo -e "${GREEN}✓ client/.env already exists${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo " Step 3: Installing Dependencies"
echo "═══════════════════════════════════════════════════════"

# Server dependencies
echo "Installing server dependencies..."
cd server
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Server dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install server dependencies${NC}"
    exit 1
fi
cd ..

# Client dependencies
echo "Installing client dependencies..."
cd client
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Client dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install client dependencies${NC}"
    exit 1
fi
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Edit server/.env with your Google OAuth credentials"
echo "2. Start the server: cd server && npm run dev"
echo "3. Start the client: cd client && npm run dev (in new terminal)"
echo "4. Visit http://localhost:5173"
echo ""
echo "For detailed instructions, see SETUP.md"
echo ""
