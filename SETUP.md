# Life in the UK Test App - Setup Guide

## Overview
A full-stack PERN (PostgreSQL, Express, React, Node.js) application for studying and taking practice tests for the Life in the UK citizenship test.

## Features
✅ Google OAuth 2.0 Authentication
✅ Study materials organized by chapters
✅ Mock tests (24 questions, 45 minutes)
✅ Progress tracking
✅ Test history and detailed results
✅ Practice questions by chapter

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Google Cloud Console account (for OAuth credentials)

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE life_in_uk;

# Exit psql
\q
```

### 1.2 Run Schema
```bash
cd server
psql -U postgres -d life_in_uk -f database/schema.sql
```

### 1.3 Seed Sample Data
```bash
psql -U postgres -d life_in_uk -f database/seed.sql
```

## Step 2: Google OAuth Setup

### 2.1 Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - App name: Life in the UK Test
   - Add your email as developer contact
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Life in UK Web App
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
7. Copy your Client ID and Client Secret

### 2.2 Configure Environment Variables

**Server (.env)**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development

DB_USER=postgres
DB_HOST=localhost
DB_NAME=life_in_uk
DB_PASSWORD=your_postgres_password
DB_PORT=5432

GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

SESSION_SECRET=generate_a_random_secret_string_here
CLIENT_URL=http://localhost:5173
```

**Client (.env)**
```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Step 3: Install Dependencies

### 3.1 Server Dependencies
```bash
cd server
npm install
```

This installs:
- express (web framework)
- pg (PostgreSQL client)
- passport & passport-google-oauth20 (authentication)
- express-session (session management)
- cors (cross-origin requests)
- dotenv (environment variables)

### 3.2 Client Dependencies
```bash
cd client
npm install
```

This installs:
- react & react-dom (UI framework)
- react-router-dom (routing)
- axios (HTTP client)
- react-markdown (markdown rendering)
- vite (build tool)

## Step 4: Run the Application

### 4.1 Start the Server
```bash
cd server
npm run dev
```

Server will start on http://localhost:5000

### 4.2 Start the Client
```bash
# In a new terminal
cd client
npm run dev
```

Client will start on http://localhost:5173

## Step 5: Access the Application

1. Open browser to http://localhost:5173
2. Click "Sign in with Google"
3. Authorize the application
4. You'll be redirected to the dashboard

## Application Structure

```
life-in-uk-app/
├── server/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── passport.js          # Google OAuth config
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── chapters.js          # Study material endpoints
│   │   ├── tests.js             # Test endpoints
│   │   └── progress.js          # Progress tracking endpoints
│   ├── database/
│   │   ├── schema.sql           # Database schema
│   │   └── seed.sql             # Sample data
│   ├── server.js                # Main server file
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Study.jsx        # Chapter list
│   │   │   ├── ChapterDetail.jsx # Chapter content
│   │   │   ├── Test.jsx         # Mock test
│   │   │   └── TestResults.jsx  # Test results
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/logout` - Logout user
- `GET /auth/check` - Check auth status

### Chapters
- `GET /api/chapters` - Get all chapters with progress
- `GET /api/chapters/:id` - Get chapter details
- `POST /api/chapters/:id/complete` - Mark chapter complete

### Tests
- `GET /api/tests/start` - Start new test
- `POST /api/tests/submit` - Submit test answers
- `GET /api/tests/history` - Get user's test history
- `GET /api/tests/:testId/results` - Get detailed test results
- `GET /api/tests/practice/:chapterId` - Get practice questions

### Progress
- `GET /api/progress/stats` - Get user dashboard statistics
- `GET /api/progress` - Get chapter progress

## Database Schema

### Users
- id, google_id, email, name, picture
- created_at, last_login

### Chapters
- id, title, description, content, order_index

### Questions
- id, chapter_id, question_text
- option_a, option_b, option_c, option_d
- correct_answer, explanation, difficulty

### User Progress
- user_id, chapter_id, completed, last_accessed

### Test Results
- user_id, score, total_questions, percentage
- passed, time_taken, test_date

### Test Questions (junction)
- test_result_id, question_id, user_answer, is_correct

## Usage Guide

### For Students

1. **Sign In**: Use Google account to sign in
2. **Study**: Read through chapter materials
3. **Practice**: Take chapter-specific practice questions
4. **Test**: Take full 24-question mock tests
5. **Review**: Check detailed results and explanations
6. **Track**: Monitor progress on dashboard

### Test Format
- 24 multiple choice questions
- 45 minute time limit
- 75% pass mark (18 correct answers)
- Based on official Life in the UK handbook

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check database exists
psql -U postgres -l
```

### OAuth Issues
- Verify redirect URIs match exactly in Google Console
- Ensure http://localhost:5173 is in authorized origins
- Check CLIENT_ID and CLIENT_SECRET in .env

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your_production_db_host
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/google/callback
CLIENT_URL=https://yourdomain.com
SESSION_SECRET=use_a_strong_random_secret
```

### Build Client
```bash
cd client
npm run build
# Output in client/dist/
```

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable SQL injection protection

## Adding More Content

### Add New Chapters
1. Insert into `chapters` table
2. Add corresponding questions

### Add More Questions
```sql
INSERT INTO questions (chapter_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation)
VALUES (1, 'Your question?', 'Option A', 'Option B', 'Option C', 'Option D', 'A', 'Explanation here');
```

## Technologies Used

**Backend:**
- Node.js & Express - Server framework
- PostgreSQL - Database
- Passport.js - Authentication
- Google OAuth 2.0 - User authentication

**Frontend:**
- React 18 - UI library
- React Router - Client-side routing
- Axios - HTTP requests
- Vite - Build tool & dev server

## License
MIT

## Support
For issues or questions, please create an issue in the repository.

---

**Happy Studying! 🇬🇧📚**
