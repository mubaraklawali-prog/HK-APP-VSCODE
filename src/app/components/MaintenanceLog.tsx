import { useState } from "react";
import { Plus, Camera, Droplet, ShowerHead, Wind, Lightbulb, Tv, MoreHorizontal, Sofa, X } from "lucide-react";
import { MaintenanceReport, MaintenanceStatus, IssueType, Room, floorLabel } from "@/app/App";
import * as Dialog from "@radix-ui/react-dialog";

interface MaintenanceLogProps {
  reports: MaintenanceReport[];
  addReport: (report: Omit<MaintenanceReport, "id" | "timestamp">) => void;
  updateReport: (id: string, updates: Partial<MaintenanceReport>) => void;
  rooms: Room[];
}

const statusColors: Record<MaintenanceStatus, { bg: string; text: string }> = {
  "Pending": { bg: "bg-amber-50", text: "text-amber-800" },
  "In Progress": { bg: "bg-blue-50", text: "text-blue-800" },
  "Resolved": { bg: "bg-green-50", text: "text-green-800" }
};

const issueIcons: Record<IssueType, React.ElementType> = {
  "Tap/Plumbing": Droplet,
  "Shower": ShowerHead,
  "AC/Heating": Wind,
  "Lighting": Lightbulb,
  "TV/Electronics": Tv,
  "Furniture": Sofa,
  "Other": MoreHorizontal
};

export default function MaintenanceLog({ reports, addReport, updateReport, rooms }: MaintenanceLogProps) {
  const [showForm, setShowForm] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editIssueType, setEditIssueType] = useState<IssueType | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoDataUrl, setEditPhotoDataUrl] = useState<string | null>(null);

  const issueTypes: IssueType[] = ["Tap/Plumbing", "Shower", "AC/Heating", "Lighting", "TV/Electronics", "Furniture", "Other"];

  const resetNewReportForm = () => {
    setRoomNumber("");
    setRoomSearch("");
    setIssueType(null);
    setDescription("");
    setPhotoDataUrl(null);
  };

  const handlePhotoFileChange = (file: File | null) => {
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditPhotoFileChange = (file: File | null) => {
    if (!file) return;
    setEditPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setEditPhotoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (report: MaintenanceReport) => {
    setEditMode(true);
    setEditIssueType(report.issueType);
    setEditDescription(report.description);
    setEditPhotoDataUrl(report.photo ?? null);
  };

  const handleSaveEdit = () => {
    if (!selectedReport || !editIssueType || !editDescription) return;

    const updates: Partial<MaintenanceReport> & { photo?: File | string | null } = {
      issueType: editIssueType,
      description: editDescription,
      photo: editPhotoFile ?? editPhotoDataUrl
    };

    updateReport(selectedReport.id, updates);

    setSelectedReport(prev => prev ? { ...prev, ...updates } as MaintenanceReport : prev);
    setEditMode(false);
  };

  const handleSubmit = () => {
    if (roomNumber && issueType && description) {
      addReport({
        roomNumber,
        issueType,
        description,
        status: "Pending",
        photo: photoFile ?? photoDataUrl
      });
      resetNewReportForm();
      setShowForm(false);
    }
  };

  const roomSearchLower = roomSearch.trim().toLowerCase();
  const filteredRooms = rooms
    .slice()
    .sort((a, b) => Number(a.number) - Number(b.number))
    .filter(room => {
      if (!roomSearchLower) return true;
      return room.number.includes(roomSearchLower) || floorLabel(room.floor).toLowerCase().includes(roomSearchLower);
    });

  const handleStatusChange = (id: string, status: MaintenanceStatus) => {
    const updates: Partial<MaintenanceReport> = { status };
    
    // If status is being changed to "Resolved", record the resolution time
    if (status === "Resolved") {
      updates.resolvedAt = new Date();
    }
    
    updateReport(id, updates);
    setSelectedReport(null);
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

  const formatDuration = (startDate: Date, endDate: Date) => {
    const seconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      }
      return `${hours}h ${remainingMinutes}m`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    return `${days}d ${remainingHours}h`;
  };

  return (
    <div className="p-5 space-y-4">
      {/* Add New Report Button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-white border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-700 hover:border-slate-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="text-[15px] font-semibold">Report New Issue</span>
      </button>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map(report => {
          const Icon = issueIcons[report.issueType];

          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm text-left transition-transform active:scale-98"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-[15px] font-semibold text-slate-700">Room {report.roomNumber}</div>
                <div className={`text-[11px] font-semibold px-2 py-1 rounded-full ${statusColors[report.status].bg} ${statusColors[report.status].text}`}>
                  {report.status}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-slate-500" />
                <span className="text-[13px] text-slate-600">{report.issueType}</span>
              </div>

              <p className="text-[13px] text-slate-500 line-clamp-2 mb-2">
                {report.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {formatTimeAgo(report.timestamp)}
                </div>
                {report.status === "Resolved" && report.resolvedAt && (
                  <div className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    ✓ Resolved in {formatDuration(report.timestamp, report.resolvedAt)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* New Report Form Dialog */}
      <Dialog.Root open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) resetNewReportForm();
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-[390px] md:max-w-[720px] w-[95vw] mx-auto shadow-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-bold text-slate-800">Report New Issue</Dialog.Title>
                <Dialog.Close className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </Dialog.Close>
              </div>

              {/* Room Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Room Number</label>
                <input
                  type="text"
                  value={roomSearch}
                  onChange={(e) => {
                    setRoomSearch(e.target.value);
                    setRoomNumber("");
                  }}
                  placeholder="Search room number or floor..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 max-h-48 overflow-y-auto">
                  {filteredRooms.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">No rooms found.</div>
                  ) : (
                    filteredRooms.map(room => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => {
                          setRoomNumber(room.number);
                          setRoomSearch(room.number);
                        }}
                        className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-white ${roomNumber === room.number ? "bg-white" : "bg-slate-50"}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">Room {room.number}</div>
                            <div className="text-xs text-slate-500">{floorLabel(room.floor)}</div>
                          </div>
                          {roomNumber === room.number && (
                            <div className="text-[11px] font-semibold text-slate-600">Selected</div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {issueTypes.map(type => {
                    const Icon = issueIcons[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setIssueType(type)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                          issueType === type
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Photo</label>
                <div className="space-y-3">
                  <label className="group cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400">
                    <Camera className="w-5 h-5 text-slate-500" />
                    <span>{photoDataUrl ? "Change uploaded image" : "Upload image from gallery"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoFileChange(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  {photoDataUrl && (
                    <img
                      src={photoDataUrl}
                      alt="Report preview"
                      className="w-full max-h-64 rounded-2xl object-cover border border-slate-200"
                    />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!roomNumber || !issueType || !description}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-[15px] font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Report
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Report Detail Dialog */}
      <Dialog.Root open={selectedReport !== null} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-[390px] md:max-w-[720px] w-[95vw] mx-auto shadow-2xl" aria-describedby={undefined}>
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

            {selectedReport && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-xl font-bold text-slate-900">Room {selectedReport.roomNumber}</Dialog.Title>
                  <Dialog.Close className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </Dialog.Close>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Edit Issue Type</div>
                      <div className="grid grid-cols-2 gap-2">
                        {issueTypes.map(type => {
                          const Icon = issueIcons[type];
                          return (
                            <button
                              key={type}
                              onClick={() => setEditIssueType(type)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                                editIssueType === type
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Edit Description</div>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Edit Photo</div>
                      <div className="space-y-3">
                        <label className="group cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400">
                          <Camera className="w-5 h-5 text-slate-500" />
                          <span>{editPhotoDataUrl ? "Change uploaded image" : "Upload image from gallery"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleEditPhotoFileChange}
                          />
                        </label>
                        {editPhotoDataUrl && (
                          <img
                            src={editPhotoDataUrl}
                            alt="Edit preview"
                            className="w-full max-h-64 rounded-2xl object-cover border border-slate-200"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveEdit}
                        className="min-w-[120px] rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="min-w-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Issue Type</div>
                      <div className="text-sm text-slate-600">{selectedReport.issueType}</div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Description</div>
                      <div className="text-sm text-slate-600">{selectedReport.description}</div>
                    </div>

                    {selectedReport.photo && (
                      <div>
                        <div className="text-sm font-semibold text-slate-700 mb-2">Photo</div>
                        <img
                          src={selectedReport.photo}
                          alt="Report photo"
                          className="w-full rounded-2xl object-cover border border-slate-200"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["Pending", "In Progress", "Resolved"] as MaintenanceStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedReport.id, status)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          selectedReport.status === status
                            ? `${statusColors[status].bg} ${statusColors[status].text}`
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      onClick={() => startEdit(selectedReport)}
                      className="px-3 py-1.5 rounded-full bg-slate-900 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {selectedReport.status === "Resolved" && selectedReport.resolvedAt && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-1">Resolution Time</div>
                    <div className="text-sm text-slate-600">{formatDuration(selectedReport.timestamp, selectedReport.resolvedAt)}</div>
                  </div>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}