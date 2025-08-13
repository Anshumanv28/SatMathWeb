# SAT Math Web

A comprehensive SAT Math study platform with authentication and content management.

## Project Structure

```
SatMathWeb/
├── backend/          # Express.js API server
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── utils/        # Utility functions
└── frontend/         # React TypeScript app
    ├── src/
    │   ├── components/  # React components
    │   ├── contexts/    # React contexts
    │   └── lib/         # Library configurations
```

## Features

- **Authentication**: Supabase-powered user authentication
- **Content Management**: PDF and video content for SAT Math topics
- **Modern UI**: React with TypeScript and Tailwind CSS
- **RESTful API**: Express.js backend with proper error handling

## Tech Stack

### Backend
- Node.js with Express.js
- Supabase (PostgreSQL + Auth)
- TypeScript (ES6 Modules)

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Supabase client for authentication

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories with your Supabase credentials.

## Development

- Backend runs on: `http://localhost:3000`
- Frontend runs on: `http://localhost:3001`
- API endpoints: `http://localhost:3000/api/*`

## Database Schema

The application uses a single `sat_content` table to store:
- Topic-based content (PDFs and videos)
- Content metadata (title, description, type)
- File storage (PDFs as blobs, videos as URLs)
