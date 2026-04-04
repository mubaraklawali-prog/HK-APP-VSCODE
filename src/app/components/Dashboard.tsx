import { Building2, Users, AlertCircle, LogOut, Clock, CheckCircle2, Home } from "lucide-react";
import { Room, MaintenanceReport, floorLabel } from "@/app/App";

interface DashboardProps {
  rooms: Room[];
  maintenanceReports?: MaintenanceReport[];
}

export default function Dashboard({ rooms, maintenanceReports = [] }: DashboardProps) {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "Occupied").length;
  const totalActiveIssues = maintenanceReports.filter(r => r.status !== "Resolved").length;

  const getFloorRooms = (floor: number) => rooms.filter(r => r.floor === floor);

  const getFloorStats = (floor: number) => {
    const floorRooms = getFloorRooms(floor);
    const cleaned = floorRooms.filter(r => r.status === "Cleaned").length;
    const inProgress = floorRooms.filter(r => r.status === "In Progress").length;
    const notCleaned = floorRooms.filter(r => r.status === "Checkout").length;
    const activeIssues = floorRooms.filter(r => r.status === "Active Issues").length;
    const occupied = floorRooms.filter(r => r.status === "Occupied").length;
    const occupiedPercentage = floorRooms.length ? Math.round((occupied / floorRooms.length) * 100) : 0;

    return { total: floorRooms.length, cleaned, inProgress, notCleaned, activeIssues, occupied, occupiedPercentage };
  };

  const getFloorMaintenanceCount = (floor: number) => {
    const floorRoomNumbers = getFloorRooms(floor).map(r => r.number);
    return maintenanceReports.filter(r => r.status !== "Resolved" && floorRoomNumbers.includes(r.roomNumber)).length;
  };

  return (
    <div className="p-5 space-y-6">
      {/* Top summary */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-500">Total Rooms</span>
            </div>
            <div className="text-[28px] font-bold text-slate-900">{totalRooms}</div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-slate-500">Total Occupied</span>
            </div>
            <div className="text-[28px] font-bold text-green-600">{occupiedRooms}</div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-slate-500">Total Active Issues</span>
            </div>
            <div className="text-[28px] font-bold text-red-600">{totalActiveIssues}</div>
          </div>
        </div>
      </div>

      {/* Floor Overview */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Floor Overview</h2>
        <div className="space-y-3">
          {[0, 1, 2, 3].map(floor => {
            const stats = getFloorStats(floor);

            return (
              <div key={floor} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[15px] font-semibold text-slate-700">{floorLabel(floor)}</div>
                    <div className="text-xs text-slate-500">{stats.total} Rooms</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">{stats.occupiedPercentage}% occupied</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-2xl">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-[11px] text-slate-500">Occupied</div>
                      <div className="font-semibold text-slate-900">{stats.occupied}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-[11px] text-slate-500">Cleaned</div>
                      <div className="font-semibold text-slate-900">{stats.cleaned}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-2xl">
                    <LogOut className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="text-[11px] text-slate-500">Checkout</div>
                      <div className="font-semibold text-slate-900">{stats.notCleaned}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-2xl">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-[11px] text-slate-500">In Progress</div>
                      <div className="font-semibold text-slate-900">{stats.inProgress}</div>
                    </div>
                  </div>
                </div>

                {stats.activeIssues > 0 && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 rounded-2xl text-xs text-slate-700">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>{stats.activeIssues} Active Issues</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Active Issues */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-slate-500">Total Active Issues</span>
        </div>
        <div className="text-[28px] font-bold text-red-600">{totalActiveIssues}</div>
        <div className="text-xs text-slate-500 mt-1">Maintenance Request</div>
      </div>
    </div>
  );
}
