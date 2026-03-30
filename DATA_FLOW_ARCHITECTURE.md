# 🌐 Complete Data Flow Architecture

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (App.tsx)                    │  │
│  │  ┌────────────┬──────────────┬───────────────────────┐  │  │
│  │  │ Dashboard  │ TaskTracker  │ MaintenanceLog        │  │  │
│  │  │ MissingItems AIReport      │                       │  │  │
│  │  └────────────┴──────────────┴───────────────────────┘  │  │
│  │                        ▲                                 │  │
│  │                        │                                 │  │
│  │              React State (useState)                      │  │
│  │    [rooms, maintenanceReports, missingItems]             │  │
│  │                        │                                 │  │
│  └────────────────────────┼────────────────────────────────┘  │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │     Supabase JS Client Library                         │  │
│  │  (src/utils/supabase.ts)                               │  │
│  │                                                        │  │
│  │  Functions:                                            │  │
│  │  • fetchRooms()                                        │  │
│  │  • updateRoom()                                        │  │
│  │  • createMaintenanceReport()                           │  │
│  │  • updateMaintenanceReport()                           │  │
│  │  • createMissingItemReport()                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                    HTTPS API Gateway
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │    Supabase Cloud (eu-west-1)        │
        │   https://bdqrzypwjrojkzbnhexs       │
        │      .supabase.co                    │
        └───────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
    ┌──────────┐    ┌──────────────┐   ┌──────────┐
    │PostgreSQL│    │  PostgREST   │   │Auth/RLS  │
    │Database  │    │   API        │   │Engine    │
    │          │    │              │   │          │
    │• rooms   │◄───┤Row filtering │   │Real-time │
    │• maint_  │    │Type safety   │   │Listeners │
    │  reports │    │Pagination    │   │          │
    │• missing_│    │Error handling│   │          │
    │  items   │    │              │   │          │
    └──────────┘    └──────────────┘   └──────────┘
```

---

## Data Flow Examples

### 1️⃣ LOADING DATA (Backend → Frontend)

```
App Component Mounts
         │
         ▼
    useEffect(() => {
      loadData async
    })
         │
         ▼
    fetchRooms()
    from supabase.ts
         │
         ▼
    HTTP GET /rooms
    → Supabase PostgREST API
         │
         ▼
    SELECT * FROM rooms
    @ PostgreSQL Database
         │
         ▼
    Returns: RoomRow[]
    [
      { id: "...", number: "031", floor: 0, status: "Cleaned", ... },
      { id: "...", number: "032", floor: 0, status: "Occupied", ... },
      ...
    ]
         │
         ▼
    Convert to App Types
    supabaseRoomToApp(room)
         │
         ▼
    setRooms(appRooms)
    Update React State
         │
         ▼
    <Dashboard rooms={rooms} />
    Re-render with data
```

### 2️⃣ UPDATING DATA (Frontend → Backend → Frontend)

```
User Clicks "Update Room Status"
TaskTracker Component
         │
         ▼
    handleUpdateRoom(roomId, updates)
    Called with:
    {
      status: "Cleaned",
      steward: "Mubarak 002",
      lastCleaned: Date
    }
         │
         ▼
    Convert App Type → DB Type
    {
      status: "Cleaned",
      steward: "Mubarak 002",
      last_cleaned: "2026-03-29T..."
    }
         │
         ▼
    await updateRoom(id, updates)
    from supabase.ts
         │
         ▼
    HTTP PATCH /rooms?id=eq.xxx
    → Supabase PostgREST API
         │
         ▼
    UPDATE rooms
    SET status='Cleaned', 
        steward='Mubarak 002', 
        last_cleaned=...
    WHERE id=xxx
    @ PostgreSQL
         │
         ▼
    Database Update Triggers
    • updated_at = now()
    • Real-time notification sent
         │
         ▼
    Returns Updated Row
    { id: "...", number: "032", status: "Cleaned", ... }
         │
         ▼
    Convert DB Type → App Type
    supabaseRoomToApp(updatedRow)
         │
         ▼
    setRooms(prev => 
      prev.map(r => 
        r.id === id ? newRoom : r
      )
    )
         │
         ▼
    Component Re-renders
    with Updated Data
         │
         ▼
    Success! Task displayed
```

### 3️⃣ CREATING NEW RECORD (Frontend → Backend)

```
User Adds Maintenance Report
MaintenanceLog Component
         │
         ▼
    handleAddMaintenanceReport(report)
    {
      roomNumber: "102",
      issueType: "AC/Heating",
      description: "Not cooling",
      status: "Pending"
    }
         │
         ▼
    Convert to DB Type
    {
      room_number: "102",
      issue_type: "AC/Heating",
      description: "Not cooling",
      status: "Pending",
      timestamp: "2026-03-29T..."
    }
         │
         ▼
    await createMaintenanceReport(report)
    from supabase.ts
         │
         ▼
    HTTP POST /maintenance_reports
    → Supabase PostgREST API
         │
         ▼
    INSERT INTO maintenance_reports
    VALUES (...)
    @ PostgreSQL
         │
         ▼
    Foreign Key Check
    room_number "102" EXISTS in rooms?
    ✅ Yes → Insert succeeds
         │
         ▼
    Returns: { id: "uuid-...", ... }
         │
         ▼
    setMaintenanceReports(prev => 
      [convertedReport, ...prev]
    )
         │
         ▼
    playAttentionSound()
    UI Notification shown
         │
         ▼
    Report appears in list
```

---

## Environment & Configuration

```
.env (Project Root)
├── VITE_SUPABASE_URL
│   └─ Points to: https://bdqrzypwjrojkzbnhexs.supabase.co
│
└── VITE_SUPABASE_ANON_KEY
    └─ Public access key (limited permissions)
```

**How Vite Uses Environment Variables:**
```
import.meta.env.VITE_SUPABASE_URL
        ↓
    Injected at build time
        ↓
    Available in browser
        ↓
    Used by supabase.ts client
```

---

## Type Safety Flow

```
PostgreSQL Schema
        │
        ▼
Supabase Auto-generates Types
        │
        ▼
supabase.ts
├── RoomRow
├── RoomInsert
├── RoomUpdate
├── MaintenanceReportRow
├── MaintenanceReportInsert
├── MaintenanceReportUpdate
├── MissingItemReportRow
├── MissingItemReportInsert
└── MissingItemReportUpdate
        │
        ▼
App.tsx Conversion Functions
├── supabaseRoomToApp(RoomRow) → Room
├── supabaseMaintenanceToApp(MaintenanceReportRow) → MaintenanceReport
└── supabaseMissingItemToApp(MissingItemReportRow) → MissingItemReport
        │
        ▼
Components
├── <Dashboard rooms={Room[]} />
├── <TaskTracker updateRoom={handleUpdateRoom} />
├── <MaintenanceLog addReport={handleAddMaintenanceReport} />
└── <MissingItems addReport={handleAddMissingItemReport} />
```

---

## Error Handling Flow

```
User Action
    │
    ▼
Frontend Function (e.g., handleUpdateRoom)
    │
    ├─ try {
    │   │
    │   ├─ Convert types
    │   │
    │   ├─ Call Supabase API
    │   │   │
    │   │   ├─ ✅ Success
    │   │   │  └─ Update React state
    │   │   │     └─ Re-render
    │   │   │
    │   │   └─ ❌ Error (Network/DB)
    │   │      └─ Caught in catch block
    │   │
    │   └─ Console error logging
    │
    └─ catch (error) {
       │
       ├─ console.error("Error:", error)
       │
       └─ Fallback to local update
          setRooms(prev => 
            prev.map(r => 
              r.id === id ? {...r, ...updates} : r
            )
          )
          [Data saved locally until sync]
    }
```

---

## Real-Time Data Flow (Optional Feature)

```
Database Change
    │
    ▼
PostgreSQL Trigger
(REPLICA IDENTITY FULL)
    │
    ▼
Supabase Realtime Engine
    │
    ▼
WebSocket to Browser
    │
    ▼
supabase.channel().subscribe()
    │
    ▼
payload received
    │
    ├─ event type: 'INSERT'
    ├─ event type: 'UPDATE'
    └─ event type: 'DELETE'
    │
    ▼
Update Local State
(if needed)
    │
    ▼
UI Auto-updates
```

---

## Request/Response Example

### Request: Update Room
```http
PATCH /rest/v1/rooms?id=eq.xxxx-xxxx HTTP/1.1
Host: bdqrzypwjrojkzbnhexs.supabase.co
Authorization: Bearer sb_publishable_2qXyP669Fm3gllbpEp3eow_psSzSLeo
Content-Type: application/json

{
  "status": "Cleaned",
  "steward": "Mubarak 002",
  "last_cleaned": "2026-03-29T10:30:00.000Z",
  "updated_at": "2026-03-29T10:35:00.000Z"
}
```

### Response: Room Updated
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "xxxx-xxxx",
  "number": "032",
  "floor": 0,
  "status": "Cleaned",
  "steward": "Mubarak 002",
  "last_cleaned": "2026-03-29T10:30:00.000Z",
  "photo_url": null,
  "created_at": "2026-03-29T09:00:00.000Z",
  "updated_at": "2026-03-29T10:35:00.000Z"
}
```

---

## Summary

✅ **Frontend** (React) connects to  
✅ **Supabase Client** (JavaScript) connects to  
✅ **PostgREST API** (HTTP) connects to  
✅ **PostgreSQL Database** (Data storage)  

All data flows bidirectionally with:
- Type safety (TypeScript)
- Error handling (Try-catch)
- Fallback mode (Local storage)
- Performance (Indexes, pagination)
- Real-time capability (REPLICA IDENTITY)

**Result**: Fully integrated, production-ready system! 🚀