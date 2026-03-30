import { Building2, Users, AlertCircle, LogOut, Sparkles, Clock } from "lucide-react";
import { Room, floorLabel } from "@/app/App";

interface DashboardProps {
  rooms: Room[];
}

export default function Dashboard({ rooms }: DashboardProps) {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "Occupied").length;
  const activeIssuesRooms = rooms.filter(r => r.status === "Active Issues").length;

  const getFloorRooms = (floor: number) => rooms.filter(r => r.floor === floor);

  const getFloorStats = (floor: number) => {
    const floorRooms = getFloorRooms(floor);
    const cleaned = floorRooms.filter(r => r.status === "Cleaned").length;
    const inProgress = floorRooms.filter(r => r.status === "In Progress").length;
    const notCleaned = floorRooms.filter(r => r.status === "Checkout").length;
    const activeIssues = floorRooms.filter(r => r.status === "Active Issues").length;
    const occupied = floorRooms.filter(r => r.status === "Occupied").length;

    return { total: floorRooms.length, cleaned, inProgress, notCleaned, activeIssues, occupied };
  };

  return (
    <div className="p-5 space-y-6">
      {/* Top summary */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-slate-500">Total Active Issues</span>
          </div>
          <div className="text-[28px] font-bold text-red-600">{activeIssuesRooms}</div>
        </div>
      </div>

      {/* Floor Overview */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Floor Overview</h2>
        <div className="space-y-3">
          {[0, 1, 2, 3].map(floor => {
            const stats = getFloorStats(floor);
            const occupiedPct = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

            const statusRows = [
              stats.occupied > 0 ? (
                <div key="occ" className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 shrink-0 text-green-600" strokeWidth={2.25} aria-hidden />
                  <span className="text-xs text-slate-600">{stats.occupied} Occupied</span>
                </div>
              ) : null,
              stats.notCleaned > 0 ? (
                <div key="co" className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5 shrink-0 text-fuchsia-600" strokeWidth={2.25} aria-hidden />
                  <span className="text-xs text-slate-600">{stats.notCleaned} Checkout</span>
                </div>
              ) : null,
              stats.activeIssues > 0 ? (
                <div key="ai" className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" strokeWidth={2.25} aria-hidden />
                  <span className="text-xs text-slate-600">{stats.activeIssues} Active Issues</span>
                </div>
              ) : null,
              stats.cleaned > 0 ? (
                <div key="cl" className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-yellow-600" strokeWidth={2.25} aria-hidden />
                  <span className="text-xs text-slate-600">{stats.cleaned} Cleaned</span>
                </div>
              ) : null,
              stats.inProgress > 0 ? (
                <div key="ip" className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-blue-600" strokeWidth={2.25} aria-hidden />
                  <span className="text-xs text-slate-600">{stats.inProgress} In Progress</span>
                </div>
              ) : null
            ].filter(Boolean);

            return (
              <div key={floor} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[15px] font-semibold text-slate-700">{floorLabel(floor)}</div>
                    <div className="text-xs text-slate-500">{stats.total} rooms</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Occupied</div>
                    <div className="text-sm font-semibold text-green-700">{occupiedPct}%</div>
                  </div>
                </div>

                {/* Progress: % of rooms occupied */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${occupiedPct}%` }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {statusRows}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
