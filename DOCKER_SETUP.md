# SAT Math Web - Docker Setup

This is a frontend-only React application that connects directly to Supabase for authentication and file storage.

## Quick Start

1. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your actual Supabase credentials.

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   Open http://localhost in your browser.

## Architecture

This application uses a **frontend-only architecture**:
- ✅ **React Frontend** - User interface and routing
- ✅ **Supabase Auth** - Direct authentication integration
- ✅ **Supabase Storage (S3-compatible)** - Direct file storage access
- ❌ **No Backend** - Eliminated for simplicity

## Environment Variables

Copy `env.example` to `.env` and configure:

### Required Variables:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `REACT_APP_S3_ACCESS_KEY_ID` - S3 access key from Supabase Storage
- `REACT_APP_S3_SECRET_ACCESS_KEY` - S3 secret key from Supabase Storage
- `REACT_APP_S3_ENDPOINT` - S3 endpoint URL
- `REACT_APP_S3_REGION` - S3 region (usually "project_region")
- `REACT_APP_S3_BUCKET_NAME` - Storage bucket name (default: "sattopicwisedata")

## Supabase Setup

1. Create a Supabase project
2. Enable Authentication with Google/Facebook providers
3. Create a Storage bucket named `sattopicwisedata`
4. Set up S3-compatible API keys in Storage settings
5. Upload your SAT Math files organized by topic folders

## File Organization

Organize your files in the storage bucket like this:
```
sattopicwisedata/
├── algebra/
│   ├── equations.pdf
│   ├── inequalities.docx
│   └── functions.pdf
├── geometry/
│   ├── circles.pdf
│   ├── triangles.docx
│   └── angles.pdf
└── statistics/
    ├── probability.pdf
    └── data-analysis.docx
```

## Docker Commands

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild from scratch
docker-compose down
docker-compose up --build --force-recreate
```

## Production Deployment

For production deployment:

1. Update environment variables for production
2. Consider using a reverse proxy (nginx/traefik)
3. Set up SSL certificates
4. Configure proper domain names
5. Set up monitoring and logging

## Troubleshooting

### Common Issues:

1. **Files not showing up:**
   - Check bucket name and permissions
   - Verify S3 credentials are correct
   - Ensure files are in topic-named folders

2. **Authentication issues:**
   - Verify Supabase URL and keys
   - Check OAuth provider settings
   - Ensure redirect URLs are configured

3. **Build failures:**
   - Check environment variables
   - Verify Docker is running
   - Clear Docker cache: `docker system prune -a`

### Health Check:
The application includes a health check endpoint at `/health` that returns "healthy" when the app is running correctly.
