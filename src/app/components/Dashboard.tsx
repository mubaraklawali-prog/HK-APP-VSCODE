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
    const occupied = floorRooms.filter(r => r.status === "Occupied").length;
    const occupiedPercentage = floorRooms.length ? Math.round((occupied / floorRooms.length) * 100) : 0;

    return { total: floorRooms.length, cleaned, occupied, occupiedPercentage };
  };

  return (
    <div className="space-y-4">
      {/* Summary Layout */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Total Rooms */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500">Total Rooms</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-on-surface">{totalRooms}</span>
          </div>
          {/* Total Occupied */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary fill-current" />
              <span className="text-[11px] font-semibold text-slate-500">Total Occupied</span>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-primary">{occupiedRooms}</span>
          </div>
        </div>
        {/* Active Issues */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-secondary fill-current" />
            <span className="text-[11px] font-semibold text-slate-500">Total Active Issues</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-secondary">{totalActiveIssues}</span>
        </div>
      </section>

      {/* Floor Overview Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-slate-800">Floor Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[0, 1, 2, 3].map(floor => {
            const stats = getFloorStats(floor);
            return (
              <div key={floor} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{floorLabel(floor)}</h3>
                    <p className="text-xs text-slate-500">{stats.total} rooms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">OCCUPIED</p>
                    <span className="text-xl font-extrabold text-primary leading-none">{stats.occupiedPercentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-5">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${stats.occupiedPercentage}%` }}></div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-primary fill-current" />
                    <p className="text-[13px] font-medium text-slate-600"><span className="font-bold text-slate-800">{stats.occupied}</span> Occupied</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500 fill-current" />
                    <p className="text-[13px] font-medium text-slate-600"><span className="font-bold text-slate-800">{stats.cleaned}</span> Cleaned</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
