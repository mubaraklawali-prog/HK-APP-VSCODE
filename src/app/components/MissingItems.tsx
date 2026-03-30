import { useState } from "react";
import { MissingItemReport, Room, stewards, availableItems, floorLabel } from "@/app/App";

interface MissingItemsProps {
  reports: MissingItemReport[];
  addReport: (report: Omit<MissingItemReport, "id" | "timestamp">) => void;
  rooms: Room[];
}

export default function MissingItems({ reports, addReport, rooms }: MissingItemsProps) {
  const [roomNumber, setRoomNumber] = useState("");
  const [selectedSteward, setSelectedSteward] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const handleToggleItem = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = () => {
    if (roomNumber && selectedSteward && selectedItems.length > 0) {
      addReport({
        roomNumber,
        steward: selectedSteward,
        items: selectedItems,
        comment
      });
      setRoomNumber("");
      setSelectedSteward("");
      setSelectedItems([]);
      setComment("");
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-5 space-y-4">
      {/* Add Report Form */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-[15px] font-semibold text-slate-700 mb-4">Report Missing Items</h3>

        <div className="space-y-4">
          {/* Room Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Room Number</label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Select room...</option>
              {rooms.map(room => (
                <option key={room.id} value={room.number}>
                  Room {room.number} - {floorLabel(room.floor)}
                </option>
              ))}
            </select>
          </div>

          {/* Steward Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Steward</label>
            <select
              value={selectedSteward}
              onChange={(e) => setSelectedSteward(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="">Select steward...</option>
              {stewards.map(steward => (
                <option key={steward} value={steward}>{steward}</option>
              ))}
            </select>
          </div>

          {/* Items Checklist */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Missing Items</label>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {availableItems.map(item => {
                const isSelected = selectedItems.includes(item);

                return (
                  <button
                    key={item}
                    onClick={() => handleToggleItem(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isSelected ? "bg-green-50" : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected ? "bg-green-500 border-green-500" : "border-slate-300"
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[13px] font-medium ${isSelected ? "text-green-800" : "text-slate-700"}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Additional Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!roomNumber || !selectedSteward || selectedItems.length === 0}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[15px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[15px] font-semibold text-slate-700">Room {report.roomNumber}</div>
              <div className="text-[11px] text-slate-400">{report.steward}</div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {report.items.map(item => (
                <span
                  key={item}
                  className="px-2 py-0.5 bg-orange-50 text-orange-800 text-[11px] font-semibold rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>

            {report.comment && (
              <p className="text-xs text-slate-400 italic mb-2">
                {report.comment}
              </p>
            )}

            <div className="text-[11px] text-slate-400">
              {formatTimeAgo(report.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
