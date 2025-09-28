# 🚀 Auto-Sync System Setup Guide

## 📋 **What This System Does**

Your website will **automatically** show topics and PDFs based on what's in your Supabase storage bucket:

- **Add a folder** → New topic appears on website
- **Add a PDF** → New content appears under that topic  
- **Delete a PDF** → Content disappears from website
- **Delete a folder** → Topic and all content disappears

## 🔧 **Setup Steps**

### **Step 1: Create Database Tables**
1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `CREATE_TABLES.sql`
3. Click **Run**
4. Copy and paste the contents of `SAT_MATH_TOPICS.sql` 
5. Click **Run**

### **Step 2: Create Storage Bucket**
1. Go to **Supabase Dashboard** → **Storage**
2. Click **New Bucket**
3. Name: `sattopicwisedata`
4. Make it **Public**
5. Click **Create Bucket**

### **Step 3: Organize Your PDFs**
Create folders in your bucket like this:

```
sattopicwisedata/
├── Heart of Algebra/
│   ├── linear-equations.pdf
│   ├── systems-equations.pdf
│   └── inequalities.pdf
├── Problem Solving & Data Analysis/
│   ├── ratios-proportions.pdf
│   └── statistics.pdf
└── Geometry/
    ├── triangles.pdf
    └── circles.pdf
```

### **Step 4: Start Your Servers**
1. **Backend:** `cd backend && npm start`
2. **Frontend:** `cd frontend && npm start`

## ✨ **How It Works**

### **Automatic Sync (Every 30 seconds)**
- ✅ Scans your `sattopicwisedata` bucket
- ✅ Detects new/removed files
- ✅ Updates database automatically
- ✅ Website shows latest content

### **Manual Controls**
- 🔄 **Force Sync:** Update immediately
- ⏸️ **Stop Auto-Sync:** Pause automatic updates
- ▶️ **Start Auto-Sync:** Resume automatic updates
- 📊 **View Status:** See sync history and stats

## 🎯 **Usage Examples**

### **Add New Topic:**
1. Create folder in bucket: `Trigonometry/`
2. Upload PDFs: `trigonometry-basics.pdf`, `identities.pdf`
3. Wait 30 seconds (or force sync)
4. Topic appears on website with PDFs

### **Add New PDF:**
1. Upload PDF to existing topic folder
2. Wait 30 seconds (or force sync)  
3. PDF appears under that topic

### **Remove Content:**
1. Delete PDF from bucket
2. Wait 30 seconds (or force sync)
3. Content disappears from website

## 🔍 **Auto-Generated Content**

The system automatically creates:
- **Topic Names:** From folder names
- **Content Titles:** From PDF filenames (cleaned up)
- **Difficulty Levels:** Guessed from filename keywords
- **Descriptions:** Auto-generated based on topic

## 📱 **Frontend Features**

- **Topic Cards:** Show all topics from your bucket
- **PDF Lists:** Show all PDFs for each topic
- **Auto-Sync Dashboard:** Control sync settings (admin only)
- **Real-time Updates:** Content updates automatically

## 🛠️ **API Endpoints**

- `GET /api/storage/topics` - Get all topics with PDFs
- `GET /api/storage/pdfs/:topic` - Get PDFs for specific topic
- `POST /api/storage/auto-sync/start` - Start auto-sync
- `POST /api/storage/auto-sync/stop` - Stop auto-sync
- `GET /api/storage/auto-sync/status` - Get sync status
- `POST /api/storage/sync/force` - Force manual sync

## 🎉 **Result**

Your website will be **100% dynamic** - just manage files in your `sattopicwisedata` Supabase bucket and everything updates automatically!
