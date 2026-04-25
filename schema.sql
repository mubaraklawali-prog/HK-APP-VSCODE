-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  floor INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Cleaned', 'Checkout', 'In Progress', 'Active Issues', 'Occupied')),
  steward TEXT,
  last_cleaned TIMESTAMP,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create maintenance_reports table
CREATE TABLE IF NOT EXISTS maintenance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  photo_url TEXT,
  timestamp TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);

-- Create missing_items_reports table
CREATE TABLE IF NOT EXISTS missing_items_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL,
  steward TEXT NOT NULL,
  items TEXT[] NOT NULL,
  comment TEXT,
  photo_url TEXT,
  provided BOOLEAN DEFAULT FALSE,
  provided_at TIMESTAMP,
  timestamp TIMESTAMP DEFAULT now()
);

-- Enable real-time
ALTER TABLE rooms REPLICA IDENTITY FULL;
ALTER TABLE maintenance_reports REPLICA IDENTITY FULL;
ALTER TABLE missing_items_reports REPLICA IDENTITY FULL;