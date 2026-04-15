import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, ClipboardList, Wrench, PackageSearch, Sparkles } from "lucide-react";
import Dashboard from "@/app/components/Dashboard";
import TaskTracker from "@/app/components/TaskTracker";
import MaintenanceLog from "@/app/components/MaintenanceLog";
import MissingItems from "@/app/components/MissingItems";
import AIReport from "@/app/components/AIReport";
import {
  REMINDER_MS,
  playAttentionSound,
  attachAttentionAudioUnlockOnFirstGesture
} from "@/utils/attentionSound";
import {
  fetchRooms,
  fetchMaintenanceReports,
  fetchMissingItemReports,
  createMaintenanceReport,
  updateMaintenanceReport,
  createMissingItemReport,
  updateRoom,
  type RoomRow,
  type MaintenanceReportRow,
  type MissingItemReportRow
} from "@/utils/supabase";

type Tab = "home" | "tasks" | "maint" | "items" | "ai";

export type RoomStatus = "Cleaned" | "Checkout" | "In Progress" | "Active Issues" | "Occupied";
export type MaintenanceStatus = "Pending" | "In Progress" | "Resolved";
export type IssueType = "Tap/Plumbing" | "Shower" | "AC/Heating" | "Lighting" | "TV/Electronics" | "Furniture" | "Other";

export function floorLabel(floor: number): string {
  return floor === 0 ? "Ground Floor" : `Floor ${floor}`;
}

// Convert Supabase types to app types
export interface Room {
  id: string;
  number: string;
  floor: number;
  status: RoomStatus;
  steward: string | null;
  lastCleaned: Date | null;
  photo: string | null;
}

export interface MaintenanceReport {
  id: string;
  roomNumber: string;
  issueType: IssueType;
  description: string;
  status: MaintenanceStatus;
  photo: string | null;
  timestamp: Date;
  resolvedAt?: Date;
}

export interface MissingItemReport {
  id: string;
  roomNumber: string;
  steward: string;
  items: string[];
  comment: string;
  timestamp: Date;
  provided?: boolean;
  providedAt?: Date;
}

// Helper functions to convert between Supabase and app types
function parseSupabaseTimestamp(value: string | null | undefined): Date {
  if (!value) return new Date();

  // Supabase/Postgres timestamp columns may come without a timezone suffix (e.g. "2026-04-03T13:00:00").
  // Treat these as UTC to avoid local timezone drift (e.g. immediate 1h offsets for some users).
  const asString = String(value).trim();
  const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(asString);
  const normalized = hasZone ? asString : `${asString.endsWith("Z") ? asString : `${asString}Z`}`;
  return new Date(normalized);
}

function supabaseRoomToApp(room: RoomRow): Room {
  return {
    id: room.id,
    number: room.number,
    floor: room.floor,
    status: room.status as RoomStatus,
    steward: room.steward,
    lastCleaned: room.last_cleaned ? parseSupabaseTimestamp(room.last_cleaned) : null,
    photo: room.photo_url
  };
}

function supabaseMaintenanceToApp(report: MaintenanceReportRow): MaintenanceReport {
  return {
    id: report.id,
    roomNumber: report.room_number,
    issueType: report.issue_type as IssueType,
    description: report.description || "",
    status: report.status as MaintenanceStatus,
    photo: report.photo_url,
    timestamp: parseSupabaseTimestamp(report.timestamp),
    resolvedAt: report.resolved_at ? parseSupabaseTimestamp(report.resolved_at) : undefined
  };
}

function supabaseMissingItemToApp(report: MissingItemReportRow): MissingItemReport {
  return {
    id: report.id,
    roomNumber: report.room_number,
    steward: report.steward,
    items: report.items,
    comment: report.comment || "",
    timestamp: new Date(report.timestamp || new Date().toISOString())
  };
}

export const stewards = [
  "Sabi'u 001",
  "Mubarak 002",
  "Faith 003",
  "Abdulhafiz 004",
  "Musa 005",
  "Abbas 006",
  "Mustapha 007",
  "Favour 008"
];

export const availableItems = [
  "Towels (Bath)",
  "Towels (Hand)",
  "Bathrobe",
  "Slippers",
  "Tea/Coffee Kit",
  "Water Bottles",
  "Toiletries",
  "Hairdryer",
  "Remote Control",
  "Laundry Bag",
  "Glass Cup",
  "Tea Cup",
  "Tea Spoon",
  "Kettle",
  "Frame"
];

// Initialize mock data
const initializeRooms = (): Room[] => {
  const rooms: Room[] = [];
  const statuses: RoomStatus[] = ["Cleaned", "Checkout", "In Progress", "Active Issues", "Occupied"];

  // Ground Floor: Rooms 031-048 (18 rooms)
  const groundNumbers = Array.from({ length: 18 }, (_, i) => 31 + i);
  groundNumbers.forEach(num => {
    const numStr = num.toString().padStart(3, "0");
    rooms.push({
      id: `room-gf-${numStr}`,
      number: numStr,
      floor: 0,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      lastCleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000) : null,
      photo: null
    });
  });

  // Floor 1: Rooms 101-122 and 123-140 (40 rooms total)
  const floor1Numbers = [
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
    123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140
  ];
  floor1Numbers.forEach(num => {
    rooms.push({
      id: `room-${num}`,
      number: num.toString(),
      floor: 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      lastCleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000) : null,
      photo: null
    });
  });

  // Floor 2: Rooms 201-221 and 222-240 (40 rooms total)
  const floor2Numbers = [
    201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221,
    222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240
  ];
  floor2Numbers.forEach(num => {
    rooms.push({
      id: `room-${num}`,
      number: num.toString(),
      floor: 2,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      lastCleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000) : null,
      photo: null
    });
  });

  // Floor 3: Rooms 301-322 (excluding 317) and 323-329 (28 rooms total)
  const floor3Numbers = [
    301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 318, 319, 320, 321, 322,
    323, 324, 325, 326, 327, 328, 329
  ];
  floor3Numbers.forEach(num => {
    rooms.push({
      id: `room-${num}`,
      number: num.toString(),
      floor: 3,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      steward: Math.random() > 0.3 ? stewards[Math.floor(Math.random() * stewards.length)] : null,
      lastCleaned: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 86400000) : null,
      photo: null
    });
  });

  return rooms;
};

const initializeMaintenance = (): MaintenanceReport[] => {
  const issues: IssueType[] = ["Tap/Plumbing", "Shower", "AC/Heating", "Lighting", "TV/Electronics", "Furniture", "Other"];
  const statuses: MaintenanceStatus[] = ["Pending", "In Progress", "Resolved"];

  return [
    {
      id: "maint-1",
      roomNumber: "234",
      issueType: "AC/Heating",
      description: "Air conditioning not cooling properly. Temperature control seems unresponsive.",
      status: "Pending",
      photo: null,
      timestamp: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: "maint-2",
      roomNumber: "112",
      issueType: "Tap/Plumbing",
      description: "Leaking faucet in bathroom sink",
      status: "In Progress",
      photo: null,
      timestamp: new Date(Date.now() - 14400000) // 4 hours ago
    },
    {
      id: "maint-3",
      roomNumber: "305",
      issueType: "TV/Electronics",
      description: "TV remote not working, needs battery replacement",
      status: "Resolved",
      photo: null,
      timestamp: new Date(Date.now() - 90000000), // ~25 hours ago
      resolvedAt: new Date(Date.now() - 86400000) // ~24 hours ago (resolved in ~1 hour)
    }
  ];
};

const initializeMissingItems = (): MissingItemReport[] => {
  return [
    {
      id: "missing-1",
      roomNumber: "125",
      steward: "Mubarak 002",
      items: ["Towels (Bath)", "Bathrobe", "Slippers"],
      comment: "Items not found after guest checkout",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "missing-2",
      roomNumber: "208",
      steward: "Faith 003",
      items: ["Remote Control", "Tea Cup"],
      comment: "",
      timestamp: new Date(Date.now() - 7200000)
    }
  ];
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [maintenanceReports, setMaintenanceReports] = useState<MaintenanceReport[]>([]);
  const [missingItemReports, setMissingItemReports] = useState<MissingItemReport[]>([]);
  const [loading, setLoading] = useState(true);

  const maintenanceReportsRef = useRef(maintenanceReports);
  const missingItemReportsRef = useRef(missingItemReports);

// Load data from Supabase on mount and on auto-refresh
  const loadData = async () => {
    try {
      const [roomsData, maintenanceData, missingItemsData] = await Promise.all([
        fetchRooms(),
        fetchMaintenanceReports(),
        fetchMissingItemReports()
      ]);

      setRooms(roomsData.map(supabaseRoomToApp));
      setMaintenanceReports(maintenanceData.map(supabaseMaintenanceToApp));
      setMissingItemReports(missingItemsData.map(supabaseMissingItemToApp));
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to mock data if Supabase fails
      setRooms(initializeRooms());
      setMaintenanceReports(initializeMaintenance());
      setMissingItemReports(initializeMissingItems());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 600000); // 10 minutes

    return () => {
      window.clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    maintenanceReportsRef.current = maintenanceReports;
    missingItemReportsRef.current = missingItemReports;
  });

  useEffect(() => {
    attachAttentionAudioUnlockOnFirstGesture();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const maint = maintenanceReportsRef.current;
      const missing = missingItemReportsRef.current;
      const hasOpenMaintenance = maint.some(r => r.status !== "Resolved");
      const hasMissingItems = missing.length > 0;
      if (hasOpenMaintenance || hasMissingItems) {
        playAttentionSound();
      }
    }, REMINDER_MS);
    return () => window.clearInterval(id);
  }, []);

  // Migrate legacy status strings
  useEffect(() => {
    setRooms(prev => prev.map(room => {
      const s = room.status as string;
      if (s === "Not Cleaned") return { ...room, status: "Checkout" as RoomStatus };
      if (s === "Needs Attention") return { ...room, status: "Active Issues" as RoomStatus };
      return room;
    }));
  }, []);

  const handleUpdateRoom = async (roomId: string, updates: Partial<Room>) => {
    try {
      // Convert app types to Supabase types
      const supabaseUpdates: Record<string, any> = {};
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.steward !== undefined) supabaseUpdates.steward = updates.steward;
      if (updates.lastCleaned) supabaseUpdates.last_cleaned = updates.lastCleaned.toISOString();
      if (updates.photo !== undefined) supabaseUpdates.photo_url = updates.photo;

      const updatedRoom = await updateRoom(roomId, supabaseUpdates);
      const appRoom = supabaseRoomToApp(updatedRoom);

      setRooms(prev => prev.map(room =>
        room.id === roomId ? appRoom : room
      ));
    } catch (error) {
      console.error("Error updating room:", error);
      // Fallback to local update
      setRooms(prev => prev.map(room =>
        room.id === roomId ? { ...room, ...updates } : room
      ));
    }
  };

  const handleAddMaintenanceReport = async (report: Omit<MaintenanceReport, "id" | "timestamp">) => {
    try {
      const supabaseReport = {
        room_number: report.roomNumber,
        issue_type: report.issueType,
        description: report.description,
        status: report.status,
        photo_url: report.photo
      };

      const newReport = await createMaintenanceReport(supabaseReport);
      const appReport = supabaseMaintenanceToApp(newReport);

      setMaintenanceReports(prev => [appReport, ...prev]);
      playAttentionSound();
    } catch (error) {
      console.error("Error creating maintenance report:", error);
      // Fallback to local creation
      const newReport: MaintenanceReport = {
        ...report,
        id: `maint-${Date.now()}`,
        timestamp: new Date()
      };
      setMaintenanceReports(prev => [newReport, ...prev]);
      playAttentionSound();
    }
  };

  const handleUpdateMaintenanceReport = async (id: string, updates: Partial<MaintenanceReport>) => {
    try {
      const supabaseUpdates: Record<string, any> = {};
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.resolvedAt) supabaseUpdates.resolved_at = updates.resolvedAt.toISOString();

      const updatedReport = await updateMaintenanceReport(id, supabaseUpdates);
      const appReport = supabaseMaintenanceToApp(updatedReport);

      setMaintenanceReports(prev => prev.map(report =>
        report.id === id ? appReport : report
      ));
    } catch (error) {
      console.error("Error updating maintenance report:", error);
      // Fallback to local update
      setMaintenanceReports(prev => prev.map(report =>
        report.id === id ? { ...report, ...updates } : report
      ));
    }
  };

  const handleAddMissingItemReport = async (report: Omit<MissingItemReport, "id" | "timestamp">) => {
    try {
      const supabaseReport = {
        room_number: report.roomNumber,
        steward: report.steward,
        items: report.items,
        comment: report.comment
      };

      const newReport = await createMissingItemReport(supabaseReport);
      const appReport = supabaseMissingItemToApp(newReport);

      setMissingItemReports(prev => [appReport, ...prev]);
      playAttentionSound();
    } catch (error) {
      console.error("Error creating missing item report:", error);
      // Fallback to local creation
      const newReport: MissingItemReport = {
        ...report,
        id: `missing-${Date.now()}`,
        timestamp: new Date()
      };
      setMissingItemReports(prev => [newReport, ...prev]);
      playAttentionSound();
    }
  };

  const tabs = [
    { id: "home" as Tab, icon: LayoutDashboard, label: "Home" },
    { id: "tasks" as Tab, icon: ClipboardList, label: "Tasks" },
    { id: "maint" as Tab, icon: Wrench, label: "Maint" },
    { id: "items" as Tab, icon: PackageSearch, label: "Items" },
    { id: "ai" as Tab, icon: Sparkles, label: "AI" }
  ];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-[1100px] flex-col gap-4 pb-20">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/90 px-5 py-4 backdrop-blur-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Housekeeping Pro</p>
                <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">Dankani Housekeeping</h1>
              </div>
              <p className="text-sm text-slate-500">Live overview of room occupancy and open issues.</p>
            </div>
          </div>

          <div className="min-h-[calc(100vh-280px)] overflow-y-auto bg-slate-100 px-4 py-5 sm:px-6 sm:py-6">
            {loading ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600">Loading data...</p>
                </div>
              </div>
            ) : (
              <>
                {activeTab === "home" && <Dashboard rooms={rooms} maintenanceReports={maintenanceReports} />}
                {activeTab === "tasks" && <TaskTracker rooms={rooms} updateRoom={handleUpdateRoom} />}
                {activeTab === "maint" && (
                  <MaintenanceLog
                    reports={maintenanceReports}
                    addReport={handleAddMaintenanceReport}
                    updateReport={handleUpdateMaintenanceReport}
                    rooms={rooms}
                  />
                )}
                {activeTab === "items" && (
                  <MissingItems
                    reports={missingItemReports}
                    addReport={handleAddMissingItemReport}
                    updateReport={(id, updates) => {
                      setMissingItemReports(prev => prev.map(report =>
                        report.id === id ? { ...report, ...updates } : report
                      ));
                    }}
                    rooms={rooms}
                  />
                )}
                {activeTab === "ai" && <AIReport rooms={rooms} maintenanceReports={maintenanceReports} />}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-[28px] bg-white border border-slate-200 px-3 py-3 shadow-sm sm:px-4">
          <div className="grid grid-cols-5 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[10px] font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
