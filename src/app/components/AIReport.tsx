import { useState } from "react";
import { Sparkles, AlertCircle, Copy, Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Room, MaintenanceReport } from "@/app/App";

interface AIReportProps {
  rooms: Room[];
  maintenanceReports: MaintenanceReport[];
}

export default function AIReport({ rooms, maintenanceReports }: AIReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDate, setSelectingDate] = useState<"from" | "to" | null>(null);

  // Clear any cached demo reports on component mount
  useEffect(() => {
    setReport(null);
  }, []);

  // Initialize with today and 7 days ago
  const [fromDate, setFromDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [toDate, setToDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const formatDateRange = () => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);

    if (selectingDate === "from") {
      selectedDate.setHours(0, 0, 0, 0);
      setFromDate(selectedDate);
      if (selectedDate > toDate) {
        const newToDate = new Date(selectedDate);
        newToDate.setHours(23, 59, 59, 999);
        setToDate(newToDate);
      }
    } else if (selectingDate === "to") {
      selectedDate.setHours(23, 59, 59, 999);
      setToDate(selectedDate);
      if (selectedDate < fromDate) {
        const newFromDate = new Date(selectedDate);
        newFromDate.setHours(0, 0, 0, 0);
        setFromDate(newFromDate);
      }
    }

    setShowCalendar(false);
    setSelectingDate(null);
  };

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  const isDateInRange = (day: number) => {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    date.setHours(12, 0, 0, 0);
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    return date >= from && date <= to;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    const fromDay = fromDate.getDate();
    const fromMonth = fromDate.getMonth();
    const fromYear = fromDate.getFullYear();
    const toDay = toDate.getDate();
    const toMonth = toDate.getMonth();
    const toYear = toDate.getFullYear();

    return (
      (date.getDate() === fromDay && date.getMonth() === fromMonth && date.getFullYear() === fromYear) ||
      (date.getDate() === toDay && date.getMonth() === toMonth && date.getFullYear() === toYear)
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setReport(null);

    // Simulate API call - In real implementation, this would call Supabase Edge Function
    setTimeout(() => {
      // Filter maintenance reports by date range
      const reportsInRange = maintenanceReports.filter(r => {
        const reportDate = new Date(r.timestamp);
        return reportDate >= fromDate && reportDate <= toDate;
      });

        // Generate a mock report based on actual data and date range
        const totalRooms = rooms.length;
        const cleanedRooms = rooms.filter(r => r.status === "Cleaned").length;
        const checkoutRooms = rooms.filter(r => r.status === "Checkout").length;
        const inProgressRooms = rooms.filter(r => r.status === "In Progress").length;
        const activeIssuesRooms = rooms.filter(r => r.status === "Active Issues").length;
        const occupiedRooms = rooms.filter(r => r.status === "Occupied").length;
        const pendingMaintenance = reportsInRange.filter(r => r.status === "Pending").length;
        const inProgressMaintenance = reportsInRange.filter(r => r.status === "In Progress").length;
        const resolvedMaintenance = reportsInRange.filter(r => r.status === "Resolved").length;

        const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const mockReport = `# Housekeeping Operations Report

## Period Summary
**${formatDateRange()}** (${daysDiff} ${daysDiff === 1 ? 'day' : 'days'})
Generated at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}

The housekeeping operations are currently showing **${Math.round((cleanedRooms / totalRooms) * 100)}% completion** across all ${totalRooms} rooms. Overall performance is ${cleanedRooms / totalRooms > 0.7 ? 'strong' : 'moderate'} with ${reportsInRange.length} maintenance ${reportsInRange.length === 1 ? 'report' : 'reports'} logged during this period.

## Current Room Status

- ✅ **Cleaned**: ${cleanedRooms} rooms (${Math.round((cleanedRooms / totalRooms) * 100)}%)
- 🚪 **Checkout**: ${checkoutRooms} rooms ready for cleaning
- 🔄 **In Progress**: ${inProgressRooms} rooms being serviced
- ⚠️ **Active Issues**: ${activeIssuesRooms} rooms requiring immediate action
- 👥 **Occupied**: ${occupiedRooms} rooms currently occupied

## Floor Performance Analysis

**Ground Floor** (${rooms.filter(r => r.floor === 0).length} rooms): ${rooms.filter(r => r.floor === 0 && r.status === "Cleaned").length} cleaned (${rooms.filter(r => r.floor === 0).length ? Math.round((rooms.filter(r => r.floor === 0 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 0).length) * 100) : 0}%) - ${rooms.filter(r => r.floor === 0).length && rooms.filter(r => r.floor === 0 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 0).length > 0.6 ? 'Performing well' : 'Needs improvement'}

**Floor 1** (${rooms.filter(r => r.floor === 1).length} rooms): ${rooms.filter(r => r.floor === 1 && r.status === "Cleaned").length} cleaned (${Math.round((rooms.filter(r => r.floor === 1 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 1).length) * 100)}%) - ${rooms.filter(r => r.floor === 1 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 1).length > 0.6 ? 'Performing well' : 'Needs improvement'}

**Floor 2** (${rooms.filter(r => r.floor === 2).length} rooms): ${rooms.filter(r => r.floor === 2 && r.status === "Cleaned").length} cleaned (${Math.round((rooms.filter(r => r.floor === 2 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 2).length) * 100)}%) - ${rooms.filter(r => r.floor === 2 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 2).length > 0.6 ? 'Good progress' : 'Moderate progress'}

**Floor 3** (${rooms.filter(r => r.floor === 3).length} rooms): ${rooms.filter(r => r.floor === 3 && r.status === "Cleaned").length} cleaned (${Math.round((rooms.filter(r => r.floor === 3 && r.status === "Cleaned").length / rooms.filter(r => r.floor === 3).length) * 100)}%)

## Maintenance Activity (${formatDateRange()})

**Total Reports**: ${reportsInRange.length} ${reportsInRange.length === 0 ? '🎉' : ''}

${reportsInRange.length > 0 ? `- ⏳ **Pending**: ${pendingMaintenance} ${pendingMaintenance === 1 ? 'issue' : 'issues'}
- 🔧 **In Progress**: ${inProgressMaintenance} ${inProgressMaintenance === 1 ? 'task' : 'tasks'}
- ✅ **Resolved**: ${resolvedMaintenance} ${resolvedMaintenance === 1 ? 'issue' : 'issues'}` : '- No maintenance reports during this period'}

${reportsInRange.length > 0 ? `**Resolution Rate**: ${Math.round((resolvedMaintenance / reportsInRange.length) * 100)}% of issues resolved` : ''}

## Key Insights & Recommendations

${activeIssuesRooms > 5 ? '- 🔴 **Critical**: ' + activeIssuesRooms + ' rooms marked "Active Issues" - prioritize immediate action' : ''}
${checkoutRooms > 10 ? '- 🚪 **High Priority**: ' + checkoutRooms + ' checkout rooms waiting for cleaning service' : ''}
${inProgressRooms > 10 ? '- 📋 Coordinate with stewards to expedite ' + inProgressRooms + ' in-progress rooms' : ''}
${pendingMaintenance > 0 ? '- 🔧 **Maintenance Alert**: ' + pendingMaintenance + ' pending ' + (pendingMaintenance === 1 ? 'request requires' : 'requests require') + ' attention to prevent guest complaints' : ''}
${cleanedRooms / totalRooms > 0.7 ? '- ✨ Excellent housekeeping performance! Keep up the great work' : '- 📊 Focus on improving completion rate across all floors'}
- 📈 Monitor floor-by-floor metrics daily to identify and resolve bottlenecks

---
*Report generated using housekeeping data from Supabase database.*`;

      setReport(mockReport);
      setGeneratedAt(new Date());
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (report) {
      navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-5 space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Status Report</h2>
            <p className="text-[13px] text-slate-500">Generate intelligent summaries for any date range</p>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Report Period</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setSelectingDate("from");
              setShowCalendar(true);
              setCalendarMonth(fromDate);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="text-[10px] font-medium text-slate-500 mb-1">From</div>
            <div className="text-[13px] font-semibold text-slate-800">
              {fromDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </button>

          <button
            onClick={() => {
              setSelectingDate("to");
              setShowCalendar(true);
              setCalendarMonth(toDate);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="text-[10px] font-medium text-slate-500 mb-1">To</div>
            <div className="text-[13px] font-semibold text-slate-800">
              {toDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Selected Range</span>
            <span className="text-[11px] font-medium text-purple-600">{formatDateRange()}</span>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-[340px] w-full shadow-2xl">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>

              <div className="text-center">
                <div className="text-[15px] font-bold text-slate-800">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="text-[11px] text-slate-500">
                  Select {selectingDate === "from" ? "start" : "end"} date
                </div>
              </div>

              <button
                onClick={nextMonth}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-[11px] font-medium text-slate-400 py-2">
                  {day}
                </div>
              ))}

              {(() => {
                const { daysInMonth, startingDayOfWeek } = getDaysInMonth(calendarMonth);
                const days = [];

                // Empty cells for days before month starts
                for (let i = 0; i < startingDayOfWeek; i++) {
                  days.push(<div key={`empty-${i}`} />);
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const isSelected = isDateSelected(day);
                  const inRange = isDateInRange(day);

                  days.push(
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square rounded-lg text-[13px] font-medium transition-all
                        ${isSelected
                          ? 'bg-purple-600 text-white shadow-md scale-105'
                          : inRange
                          ? 'bg-purple-100 text-purple-800'
                          : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                }

                return days;
              })()}
            </div>

            {/* Quick Select Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  const yesterday = new Date();
                  yesterday.setDate(yesterday.getDate() - 1);
                  yesterday.setHours(0, 0, 0, 0);
                  setFromDate(yesterday);
                  setToDate(today);
                  setShowCalendar(false);
                  setSelectingDate(null);
                }}
                className="px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 transition-colors"
              >
                Yesterday
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  const week = new Date();
                  week.setDate(week.getDate() - 7);
                  week.setHours(0, 0, 0, 0);
                  setFromDate(week);
                  setToDate(today);
                  setShowCalendar(false);
                  setSelectingDate(null);
                }}
                className="px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  const month = new Date();
                  month.setDate(month.getDate() - 30);
                  month.setHours(0, 0, 0, 0);
                  setFromDate(month);
                  setToDate(today);
                  setShowCalendar(false);
                  setSelectingDate(null);
                }}
                className="px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium hover:bg-slate-200 transition-colors"
              >
                Last 30 Days
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setShowCalendar(false);
                setSelectingDate(null);
              }}
              className="w-full py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!report && !isGenerating && (
        <button
          onClick={handleGenerate}
          className="w-full bg-purple-600 text-white py-3.5 rounded-xl text-[15px] font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-5 h-5" />
          Generate Report
        </button>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-[13px] text-slate-400 text-center">
              Analysing housekeeping data...
            </p>
            <div className="w-full space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-3 bg-slate-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-800 mb-1">Failed to generate report</div>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Report Output */}
      {report && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-purple-600">
          <div className="flex items-center justify-between mb-4">
            {generatedAt && (
              <div className="text-[11px] text-slate-400">
                Generated at {generatedAt.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="prose prose-sm max-w-none">
            {report.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-lg font-bold text-slate-900 mb-3">{line.slice(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={i} className="text-[15px] font-bold text-slate-800 mt-4 mb-2">{line.slice(3)}</h2>;
              } else if (line.startsWith('- ')) {
                return <li key={i} className="text-[13px] text-slate-600 ml-4">{line.slice(2)}</li>;
              } else if (line.startsWith('**') || line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={i} className="text-[13px] text-slate-600 mb-2">
                    {parts.map((part, j) => (
                      j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-800">{part}</strong> : part
                    ))}
                  </p>
                );
              } else if (line.startsWith('---')) {
                return <hr key={i} className="my-4 border-slate-200" />;
              } else if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              } else {
                return <p key={i} className="text-[13px] text-slate-600 mb-2">{line}</p>;
              }
            })}
          </div>

          <button
            onClick={handleGenerate}
            className="w-full mt-4 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Generate New Report
          </button>
        </div>
      )}
    </div>
  );
}
