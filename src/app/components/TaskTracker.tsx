import { useState } from "react";
import { Camera, X } from "lucide-react";
import { Room, RoomStatus, stewards } from "@/app/App";
import * as Dialog from "@radix-ui/react-dialog";

interface TaskTrackerProps {
  rooms: Room[];
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
}

type Filter = "All" | "Ground Floor" | "Floor 1" | "Floor 2" | "Floor 3";

const statusColors: Record<RoomStatus, { bg: string; text: string; border: string }> = {
  "Cleaned": { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" },
  "Checkout": { bg: "bg-fuchsia-50", text: "text-fuchsia-800", border: "border-fuchsia-200" },
  "In Progress": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "Active Issues": { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  "Occupied": { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" }
};

export default function TaskTracker({ rooms, updateRoom }: TaskTrackerProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editStatus, setEditStatus] = useState<RoomStatus | null>(null);
  const [editSteward, setEditSteward] = useState<string | null>(null);

  const filters: Filter[] = ["All", "Ground Floor", "Floor 1", "Floor 2", "Floor 3"];

  // Helper function to get status colors with fallback for old data
  const getStatusColors = (status: RoomStatus) => {
    return statusColors[status] || statusColors["Checkout"];
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === "All") return true;
    if (filter === "Ground Floor") return room.floor === 0;
    return `Floor ${room.floor}` === filter;
  });

  const handleOpenRoom = (room: Room) => {
    setSelectedRoom(room);
    setEditStatus(room.status);
    setEditSteward(room.steward);
  };

  const handleSave = () => {
    if (selectedRoom && editStatus) {
      updateRoom(selectedRoom.id, {
        status: editStatus,
        steward: editSteward,
        lastCleaned: editStatus === "Cleaned" ? new Date() : selectedRoom.lastCleaned
      });
      setSelectedRoom(null);
    }
  };

  const allStatuses: RoomStatus[] = ["Cleaned", "Checkout", "In Progress", "Active Issues", "Occupied"];

  return (
    <div className="p-5">
      {/* Filter Bar */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filteredRooms.map(room => {
          const colors = getStatusColors(room.status);
          return (
            <button
              key={room.id}
              onClick={() => handleOpenRoom(room)}
              className="bg-white rounded-xl p-3 shadow-sm text-center transition-transform active:scale-95"
            >
              <div className="text-[15px] font-bold text-slate-800 mb-2">{room.number}</div>
              <div className={`text-[11px] font-semibold px-2 py-1 rounded-full ${colors.bg} ${colors.text} mb-1`}>
                {room.status}
              </div>
              {room.steward && (
                <div className="text-[11px] text-slate-400 truncate">{room.steward}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Room Detail Dialog */}
      <Dialog.Root open={selectedRoom !== null} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-[390px] mx-auto shadow-2xl" aria-describedby={undefined}>
            {/* Handle Bar */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

            {selectedRoom && (
              <div className="space-y-5">
                {/* Room Number */}
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-xl font-bold text-slate-900">Room {selectedRoom.number}</Dialog.Title>
                  <Dialog.Close className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </Dialog.Close>
                </div>

                {/* Status Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {allStatuses.map(status => {
                      const colors = getStatusColors(status);
                      return (
                        <button
                          key={status}
                          onClick={() => setEditStatus(status)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            editStatus === status
                              ? `${colors.bg} ${colors.text} border ${colors.border}`
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Steward Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Assigned To</label>
                  <select
                    value={editSteward || ""}
                    onChange={(e) => setEditSteward(e.target.value || null)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="">Unassigned</option>
                    {stewards.map(steward => (
                      <option key={steward} value={steward}>{steward}</option>
                    ))}
                  </select>
                </div>

                {/* Last Cleaned */}
                {selectedRoom.lastCleaned && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Last Cleaned</label>
                    <div className="text-sm text-slate-500">
                      {selectedRoom.lastCleaned.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Photo</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl w-20 h-20 flex items-center justify-center bg-slate-50">
                    <Camera className="w-6 h-6 text-slate-400" />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-[15px] font-semibold hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
