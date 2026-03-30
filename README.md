
  # App replication request

  This is a code bundle for App replication request. The original project is available at https://www.figma.com/design/dEeTmpGB9dHwCBX9NmxYXZ/App-replication-request.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env` (if it exists) or create `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup:**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy and run the contents of `schema.sql` to create the database tables
   - Populate with sample data:
   ```bash
   npm run populate
   ```

## Running the code

Run `npm run dev` to start the development server.

## Features

- **Dashboard**: Overview of room statuses and floor summaries
- **Task Tracker**: Filterable room list with status editing
- **Maintenance Log**: Issue reporting with resolution tracking
- **Missing Items**: Inventory management for room amenities
- **AI Report**: Operational reports with date range filtering

All data is stored in Supabase with real-time synchronization.
  