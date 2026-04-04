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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Total Rooms</div>
          <div className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">{totalRooms}</div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Total Occupied</div>
          <div className="mt-4 text-4xl font-semibold text-emerald-700 sm:text-5xl">{occupiedRooms}</div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Total Active Issues</div>
          <div className="mt-4 text-4xl font-semibold text-rose-600 sm:text-5xl">{totalActiveIssues}</div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Floor Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Review occupancy and room progress by floor.</p>
          </div>
        </div>

        <div className="space-y-4">
          {[0, 1, 2, 3].map(floor => {
            const stats = getFloorStats(floor);
            const detailRows = [
              { label: "Occupied", value: stats.occupied },
              { label: "Cleaned", value: stats.cleaned },
              { label: "Active Issues", value: stats.activeIssues },
              { label: "Checkout", value: stats.notCleaned },
              { label: "In Progress", value: stats.inProgress }
            ].filter(row => row.value > 0);

            return (
              <div key={floor} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{floorLabel(floor)}</p>
                    <p className="mt-1 text-sm text-slate-500">{stats.total} rooms</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {stats.occupiedPercentage}% occupied
                  </div>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all duration-300"
                    style={{ width: `${stats.occupiedPercentage}%` }}
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {detailRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm text-slate-700">
                      <span>{row.label}</span>
                      <span className="font-semibold text-slate-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
