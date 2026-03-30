# 🔐 Environment & Database Configuration

## ✅ Configured Environment

### File: `.env`
```
VITE_SUPABASE_URL=https://bdqrzypwjrojkzbnhexs.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_2qXyP669Fm3gllbpEp3eow_psSzSLeo
```

**Location**: Project root directory  
**Status**: ✅ Ready to use  
**DO NOT COMMIT**: This file contains your API key

---

## 📦 Supabase Project Details

| Property | Value |
|----------|-------|
| Project Name | Houkeeping Best Project |
| Project ID | `bdqrzypwjrojkzbnhexs` |
| Region | EU (eu-west-1) |
| Database | PostgreSQL 17.6 |
| Status | Active & Healthy |
| API Endpoint | https://bdqrzypwjrojkzbnhexs.supabase.co |

---

## 🗄️ Database Tables & Data

### Summary
✅ 3 Tables Created  
✅ 22 Records Inserted  
✅ Real-time Enabled  
✅ Foreign Keys Configured  
✅ Indexes Created  

### Table: `rooms` (16 records)
```
Column          | Type      | Constraints
─────────────────────────────────────────
id              | UUID      | PRIMARY KEY
number          | TEXT      | UNIQUE NOT NULL
floor           | INT       | NOT NULL
status          | TEXT      | NOT NULL, CHECK constraint
steward         | TEXT      | NULLABLE
last_cleaned    | TIMESTAMP | NULLABLE
photo_url       | TEXT      | NULLABLE
created_at      | TIMESTAMP | DEFAULT now()
updated_at      | TIMESTAMP | DEFAULT now()
```

**Sample Records**:
- Ground Floor: 031-035 (5 rooms)
- Floor 1: 101-105 (5 rooms)  
- Floor 2: 201-203 (3 rooms)
- Floor 3: 301-303 (3 rooms)

---

### Table: `maintenance_reports` (4 records)
```
Column         | Type      | Constraints
────────────────────────────────────────
id             | UUID      | PRIMARY KEY
room_number    | TEXT      | FOREIGN KEY → rooms.number
issue_type     | TEXT      | NOT NULL
description    | TEXT      | NULLABLE
status         | TEXT      | NOT NULL, CHECK constraint
photo_url      | TEXT      | NULLABLE
timestamp      | TIMESTAMP | DEFAULT now()
resolved_at    | TIMESTAMP | NULLABLE
```

**Status Types**: Pending | In Progress | Resolved  
**Issue Types**: AC/Heating, Tap/Plumbing, TV/Electronics, Lighting, Shower, Other

**Sample Records**:
1. Room 102 - AC/Heating: Pending
2. Room 104 - Tap/Plumbing: In Progress
3. Room 202 - TV/Electronics: Resolved
4. Room 302 - Lighting: Pending

---

### Table: `missing_items_reports` (2 records)
```
Column      | Type      | Constraints
─────────────────────────────────────
id          | UUID      | PRIMARY KEY
room_number | TEXT      | FOREIGN KEY → rooms.number
steward     | TEXT      | NOT NULL
items       | TEXT[]    | NOT NULL (array)
comment     | TEXT      | NULLABLE
timestamp   | TIMESTAMP | DEFAULT now()
```

**Sample Records**:
1. Room 035 - Towels, Bathrobe, Slippers
2. Room 105 - Remote Control, Tea Cup

---

## 🔑 API Keys

### Publishable/Anon Key (Used in Frontend)
```
sb_publishable_2qXyP669Fm3gllbpEp3eow_psSzSLeo
```
**Risk Level**: Low (Only read/write public data)  
**Scope**: Used in browser to connect frontend to DB  
**Rotation**: ✅ Can be rotated in Supabase dashboard

### Service Role Key (Not Shared)
**Location**: Supabase dashboard only  
**Risk Level**: High (Bypasses RLS)  
**Use**: Server-to-database only, never in frontend

---

## 🔌 Frontend Integration Points

### Supabase Client Initialization
**File**: `src/utils/supabase.ts`
```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Available CRUD Operations
```typescript
// Read
fetchRooms()
fetchMaintenanceReports()
fetchMissingItemReports()

// Create
createRoom(room)
createMaintenanceReport(report)
createMissingItemReport(report)

// Update
updateRoom(id, updates)
updateMaintenanceReport(id, updates)

// Delete
deleteRoom(id)
```

### Component Integration
- **App.tsx**: Main component with data fetching
- **Dashboard.tsx**: Display room statistics
- **TaskTracker.tsx**: Update room status
- **MaintenanceLog.tsx**: Manage maintenance issues
- **MissingItems.tsx**: Track missing items
- **AIReport.tsx**: Generate reports from database data

---

## 🔄 Real-Time Features

### Enabled Tables
- ✅ rooms (REPLICA IDENTITY FULL)
- ✅ maintenance_reports (REPLICA IDENTITY FULL)
- ✅ missing_items_reports (REPLICA IDENTITY FULL)

### How to Subscribe (Optional Enhancement)
```typescript
supabase
  .channel('rooms')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'rooms' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe();
```

---

## 🧪 Testing the Connection

### Method 1: Manual Test
```bash
# Open browser console and run:
fetch('https://bdqrzypwjrojkzbnhexs.supabase.co/rest/v1/rooms',
  { headers: { 'Authorization': 'Bearer YOUR_KEY' } }
).then(r => r.json()).then(console.log)
```

### Method 2: Run Verification Script
```bash
npm run verify-connection
```

### Method 3: Check App Loading
- Run `npm run dev`
- Open app in browser
- Check browser console for data logs
- Dashboard should show 16 rooms
- All sections should have sample data

---

## 🛡️ Security Checklist

- ✅ Public API key is limited to anon role
- ✅ Database has CHECK constraints on enum fields
- ✅ Foreign keys prevent orphaned data
- ✅ Row Level Security can be enabled
- ⚠️ Currently no authentication (optional to add)
- ⚠️ No rate limiting (optional to add)

---

## 📋 Database Schema SQL

All schema is managed automatically through Supabase.  
Original SQL used: (saved in `schema.sql` file)

**Operations**:
- Create all 3 tables
- Set up foreign keys
- Create indexes on performance columns
- Enable real-time with REPLICA IDENTITY FULL

---

## 🚀 How to Deploy

### Option 1: Vercel (Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Option 2: Docker
```bash
docker build -t housekeeping-pro .
docker run -p 3000:3000 housekeeping-pro
```

### Option 3: Direct Server
```bash
npm run build
npm install -g serve
serve dist
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module VITE_SUPABASE_URL"
**Solution**: Ensure `.env` file is in project root  
**Check**: `echo $VITE_SUPABASE_URL` in terminal

### Issue: "API key not found" error  
**Solution**: Reload browser (Vite may need restart)  
**Check**: .env file has correct values

### Issue: 401 Unauthorized
**Solution**: Check API key isn't expired  
**Check**: Regenerate new key in Supabase dashboard

### Issue: "Table does not exist"
**Solution**: Run schema.sql in Supabase SQL editor  
**Check**: Tables visible in Supabase dashboard

### Issue: No data loads
**Solution**: Check browser Network tab for errors  
**Check**: Run populate script if tables are empty

---

## 📞 Support

**Supabase Docs**: https://supabase.com/docs  
**API Reference**: https://supabase.com/docs/reference  
**Community**: https://discord.supabase.io

---

**Last Updated**: March 29, 2026  
**Status**: ✅ All Systems Operational  
**Backup**: Enabled ✅  
**Monitoring**: Available in Supabase dashboard