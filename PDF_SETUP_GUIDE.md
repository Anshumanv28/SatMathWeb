# PDF Dynamic Integration Setup Guide

This guide will help you set up dynamic PDF fetching and display for your SAT Math Web application. The system automatically syncs with your Supabase storage bucket and updates the frontend in real-time.

## 🚀 Quick Setup

### 1. Configure Your Storage Bucket

First, update the bucket name in the following files to match your Supabase storage bucket:

**Backend Files:**
- `backend/controllers/storageController.js` (line 8)
- `backend/scripts/setupStorage.js` (line 3)

**Frontend Files:**
- `frontend/src/services/pdfService.ts` (line 8)

### 2. Set Up Storage Bucket

Run the setup script to create your storage bucket:

```bash
cd backend
node scripts/setupStorage.js
```

Or manually create a bucket in your Supabase dashboard:
- Name: `sattopicwisedata` (or your preferred name)
- Public: `true`
- Allowed MIME types: `application/pdf`
- File size limit: `50MB`

### 3. Organize Your PDFs

Create folders in your storage bucket for each topic:
```
sattopicwisedata/
├── Algebra/
│   ├── linear_equations.pdf
│   ├── quadratic_equations.pdf
│   └── polynomials.pdf
├── Geometry/
│   ├── triangles.pdf
│   ├── circles.pdf
│   └── coordinate_geometry.pdf
├── Trigonometry/
│   ├── basic_trig.pdf
│   └── identities.pdf
└── Statistics/
    ├── descriptive_stats.pdf
    └── probability.pdf
```

## 🔄 Dynamic Features

### Automatic PDF Detection
- PDFs are automatically detected when added to storage
- Topic cards show PDF count in real-time
- No manual database updates required

### Real-time Updates
- When you add/remove PDFs from storage, the website updates automatically
- Topic cards refresh PDF counts
- PDF lists update dynamically

### Smart Sync
- Use the sync endpoint to automatically add PDFs to your database
- Cleanup endpoint removes orphaned content entries
- Maintains consistency between storage and database

## 📡 API Endpoints

### Storage Endpoints

```bash
# Get PDFs for a specific topic
GET /api/storage/pdfs/:topic

# Get all topics with PDFs
GET /api/storage/topics

# Sync storage with database (adds new PDFs to DB)
POST /api/storage/sync

# Cleanup orphaned content (removes deleted PDFs from DB)
POST /api/storage/cleanup
```

### Example Usage

```javascript
// Get PDFs for Algebra topic
const pdfs = await apiService.getPDFsByTopic('Algebra');

// Get all topics that have PDFs
const topics = await apiService.getTopicsWithPDFs();

// Sync storage with database
const syncResult = await apiService.syncStorageWithDatabase();
```

## 🎨 Frontend Components

### PDFViewer
- Full-featured PDF viewer with zoom controls
- Download functionality
- Responsive design
- Error handling

### PDFList
- Grid layout of available PDFs
- Search functionality
- File size and date display
- Loading states

### TopicCard (Updated)
- Shows PDF count for each topic
- Real-time updates
- Loading indicators

### TopicDetail
- Tabbed interface (PDFs vs Database Content)
- Comprehensive topic view
- Back navigation

## 🔧 Configuration

### Environment Variables
Make sure your Supabase configuration is properly set up in:
- `frontend/src/lib/supabase.ts`
- `backend/config/supabase.js`

### Bucket Permissions
Ensure your storage bucket has the following policies:
- Public read access for PDF files
- Proper CORS configuration for web access

## 🚨 Troubleshooting

### Common Issues

1. **PDFs not showing up**
   - Check bucket name configuration
   - Verify PDF files are in correct topic folders
   - Ensure bucket is public

2. **CORS errors**
   - Configure CORS in Supabase dashboard
   - Allow your domain in CORS settings

3. **Large file uploads**
   - Check file size limits
   - Consider chunked uploads for large files

4. **Sync issues**
   - Run cleanup endpoint to remove orphaned entries
   - Check database connection
   - Verify storage permissions

### Debug Mode

Enable debug logging by adding to your environment:
```javascript
// In your frontend
localStorage.setItem('debug', 'pdfService');

// In your backend
console.log('Debug mode enabled');
```

## 📈 Performance Tips

1. **Optimize PDF sizes** - Compress PDFs before upload
2. **Use lazy loading** - PDFs load only when viewed
3. **Implement caching** - Cache PDF metadata
4. **Monitor storage usage** - Set up alerts for storage limits

## 🔐 Security Considerations

1. **File validation** - Only allow PDF files
2. **Size limits** - Prevent large file uploads
3. **Access control** - Implement proper authentication
4. **Content scanning** - Consider virus scanning for uploads

## 📝 Maintenance

### Regular Tasks
- Monitor storage usage
- Clean up orphaned content
- Update PDF metadata
- Backup important files

### Automated Sync
Consider setting up a cron job to run sync operations:
```bash
# Add to your crontab
0 2 * * * curl -X POST http://your-api.com/api/storage/sync
```

## 🎯 Next Steps

1. Upload your PDF files to the appropriate topic folders
2. Test the PDF viewer functionality
3. Set up automated sync if needed
4. Monitor performance and user feedback
5. Consider adding PDF annotations or bookmarks

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Supabase configuration
3. Test API endpoints directly
4. Check storage bucket permissions

The system is designed to be robust and self-maintaining, automatically adapting to changes in your PDF storage while providing a smooth user experience.
