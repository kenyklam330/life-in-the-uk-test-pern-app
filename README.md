# Life in the UK Test App

A full-stack PERN application for studying and practicing the Life in the UK test.

## Features
- Google OAuth authentication
- Study materials organized by chapters
- Mock tests with scoring
- Progress tracking
- User dashboard

## Tech Stack
- **Frontend**: React with Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: Passport.js with Google OAuth

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google OAuth credentials

### Environment Variables
See `.env.example` files in `server/` and `client/`

### Installation
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Setup database
psql -U postgres -f server/database/schema.sql
```

### Running the App
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```
