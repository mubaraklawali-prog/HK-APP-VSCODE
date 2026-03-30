I now have the full source code. Let me read the remaining component files to get the complete picture.I have everything I need from the source code already in context. Let me now produce a comprehensive Figma prompt.Now I have everything I need. Let me produce a comprehensive, deeply detailed Figma prompt based on the full source code analysis.Here is the complete, exhaustive Figma prompt — copy and paste this directly into Figma's AI/design tool, or share it with a designer:

🎨 Complete Figma Design Prompt: HouseKeeping Pro

PROJECT OVERVIEW
Design a full mobile application UI called HouseKeeping Pro — a hotel housekeeping management tool for supervisors. The app runs as a mobile-first PWA constrained to a max-width of 390px, centered on desktop with a drop shadow as a phone shell. It has 5 screens all sharing the same shell layout.

DESIGN SYSTEM
Color Palette
Background (app): #F1F5F9 (slate-100)
Surface (cards/panels): #FFFFFF
Top bar & nav bar bg: #FFFFFF with rgba(255,255,255,0.9) + backdrop blur
Border / divider: #F1F5F9 (slate-100)
Primary text: #0F172A (slate-900)
Secondary text: #64748B (slate-500)
Muted / label text: #94A3B8 (slate-400)
Status Color Tokens
Status
Bg
Text
Border
Cleaned
#F0FDF4
#166534
#86EFAC
Not Cleaned
#FFF7ED
#9A3412
#FED7AA
In Progress
#EFF6FF
#1E40AF
#BFDBFE
Needs Attention
#FFFBEB
#92400E
#FDE68A
Occupied
#F5F3FF
#5B21B6
#DDD6FE
Maintenance Pending
#FFF7ED
#C2410C
—
Maintenance In Progress
#EFF6FF
#1D4ED8
—
Maintenance Resolved
#F0FDF4
#15803D
—

Typography — Font: Inter
App label (top bar): 10px / 700 / uppercase / tracking-wider — slate-400
Section heading: 18px / 700 — slate-800
Sub-heading / card title: 14–15px / 600 — slate-700
Body / label: 13px / 400–500 — slate-500
Caption / badge: 11–12px / 500–600
Stat number (dashboard): 28–32px / 700
Spacing
Screen padding: 20px horizontal
Card padding: 16px
Card gap: 12px
Element gap within card: 8–12px
Border radius cards: 16px
Border radius pills/badges: 9999px
Border radius inputs: 12px
Border radius buttons: 12px
Shadows
Card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
App shell (desktop): 0 25px 50px rgba(0,0,0,0.15)
Icons — Use Lucide icons throughout (stroke-width 2, active state stroke-width 2.5)

SHARED SHELL (appears on all 5 screens)
Top Bar — height: 40px
Background: white/90 + backdrop-blur
Bottom border: 1px solid #F1F5F9
Center: text label "HOUSEKEEPING PRO" — 10px / 700 / uppercase / tracking-widest / slate-400
z-index: above scroll content
Bottom Navigation Bar — height: 80px
Background: white
Top border: 1px solid #F1F5F9
5 equally-spaced tabs: Home, Tasks, Maint, Items, AI
Each tab: icon above label
Icon: 24×24 Lucide — LayoutDashboard, ClipboardList, Wrench, PackageSearch, Sparkles
Label: 10px / 500
Inactive: icon + label in slate-400
Active: icon + label in slate-900; icon has a bg: slate-100, border-radius: 12px, padding: 6px pill behind it
Bottom padding: 8px (safe area)
Content Area — everything between top bar and nav bar, scrollable, padding: 20px, background: #F1F5F9

SCREEN 1: DASHBOARD (Home tab)
Purpose: Overview stats + quick summary of all rooms.
Section: Stats Row (top of content)
4 stat cards in a 2×2 grid, each white, border-radius: 16px, padding: 16px
Each card contains:
Top: small icon (16px, colored) + label text 12px / 500 in muted color
Bottom: large number 28px / 700 in dark text
Cards:
Total Rooms — icon: Home — value: 45
Cleaned — icon: CheckCircle green — value: dynamic count — text green
In Progress — icon: Clock blue — value: dynamic — text blue
Needs Attention — icon: AlertTriangle amber — value: dynamic — text amber
Section: Floor Breakdown
Heading: "Floor Overview" 18px / 700
3 cards, one per floor (Floor 1, Floor 2, Floor 3)
Each card: white, border-radius: 16px, padding: 16px
Left: floor label "Floor 1" bold + room count "18 rooms" muted
Right: horizontal mini progress bar showing % cleaned (green fill on #E2E8F0 bg, height: 6px, border-radius: 3px) + percentage text
Below bar: row of colored status dots/pills with counts
Section: Recent Activity (optional, if shown)
List of last 3–5 status changes: room number + what changed + time ago
Each row: border-bottom: 1px solid #F8FAFC

SCREEN 2: TASK TRACKER (Tasks tab)
Purpose: View all 45 rooms by floor; update each room's cleaning status and assign a steward.
Filter Bar
Horizontal pill-button row (no-scrollbar): "All", "Floor 1", "Floor 2", "Floor 3"
Active pill: bg: slate-900, text: white, border-radius: 9999px, padding: 6px 14px, font: 12px/600
Inactive pill: bg: white, text: slate-500, border 1px solid slate-200
Room Grid
3-column grid layout
Each room tile: white, border-radius: 12px, padding: 12px, shadow: soft
Room number: 15px / 700 / slate-800 at top-center
Status badge: pill below number — color coded per status token table above — 11px / 600
Steward name (if assigned): 11px / slate-400 truncated
Tap → opens a bottom sheet / modal
Room Detail Bottom Sheet / Modal
Slides up from bottom, border-radius: 24px 24px 0 0, white bg, padding: 24px
Handle bar: 40×4px, bg: slate-200, border-radius: 2px, centered top
Room number heading: 20px / 700
Status selector: row of 5 status pills (tap to select) — Cleaned, Not Cleaned, In Progress, Needs Attention, Occupied
Selected pill fills with status color
Steward dropdown: label "Assigned To" + dropdown/picker showing 8 stewards:
Sabi'u 001, Mubarak 002, Faith 003, Abdulhafiz 004, Musa 005, Abbas 006, Mustapha 007, Favour 008
Last cleaned: date/time display if available
Photo: camera icon button to attach a photo — border: 1.5px dashed slate-300, border-radius: 12px, 80×80px, icon centered
Save button: full-width, bg: slate-900, text: white, height: 48px, border-radius: 12px, font: 15px/600

SCREEN 3: MAINTENANCE LOG (Maint tab)
Purpose: Log new maintenance issues and view all existing reports.
Add New Report Button
Full-width card with + icon: "Report New Issue" — bg: white, border: 1.5px dashed slate-300, border-radius: 16px, padding: 16px, icon left, text center
New Maintenance Report Form (bottom sheet or inline card) Fields:
Room Number: text input
Issue Type: segmented selector / dropdown with 6 options: Tap/Plumbing, Shower, AC/Heating, Lighting, TV/Electronics, Other — displayed as a grid of selectable chips
Description: multiline textarea, min-height: 80px, border-radius: 12px, border: 1px solid slate-200
Photo: same dashed camera upload tile as above
Submit button: full-width bg: slate-900 button
Reports List
Each report card: white, border-radius: 16px, padding: 16px
Row 1: Room number "Room 234" bold + status badge right-aligned (Pending / In Progress / Resolved)
Row 2: Issue type icon + type label — 13px / slate-600
Row 3: Description text — 13px / slate-500 — 2-line clamp
Row 4: Timestamp — 11px / slate-400
If photo attached: thumbnail 60×60px, border-radius: 8px, right side
Tap to expand / change status
Status Badge Colors per token table: Pending = amber, In Progress = blue, Resolved = green

SCREEN 4: MISSING ITEMS (Items tab)
Purpose: Report missing/absent items from a room.
Add Report Form Card
White card, border-radius: 16px, padding: 16px
Heading: "Report Missing Items" 15px / 600
Room Number input
Steward selector (dropdown or picker, same 8 stewards)
Items checklist — vertical list of checkboxes for all 15 items:
Towels (Bath), Towels (Hand), Bathrobe, Slippers, Tea/Coffee Kit, Water Bottles, Toiletries, Hairdryer, Remote Control, Laundry Bag, Glass Cup, Tea Cup, Tea Spoon, Kettle, Frame
Each row: checkbox left + item name — 13px / 500 / slate-700
Checked row: bg: #F0FDF4, checkbox filled green
Comment field: textarea "Additional comments..." — border-radius: 12px
Submit button: full-width bg: slate-900
Reports List
Each card: white, border-radius: 16px, padding: 14px
Row 1: "Room 125" bold + steward name muted
Row 2: item pills — each missing item shown as a small pill bg: #FFF7ED, text: #9A3412, font: 11px/600, border-radius: 9999px, wrapping
Row 3: comment text if present — 12px / slate-400 italic
Row 4: timestamp 11px / slate-400

SCREEN 5: AI REPORT (AI tab)
Purpose: Generate an AI-powered summary report of the current housekeeping status using Gemini API.
Header Card
White card, border-radius: 16px, padding: 20px
Sparkles icon 24px in #7C3AED (purple)
Heading: "AI Status Report" 18px / 700
Subtitle: "Generate an intelligent summary of today's operations" — 13px / slate-500
Generate Button
Full-width, bg: #7C3AED (purple), text: white, height: 52px, border-radius: 12px, font: 15px / 600
Left icon: Sparkles white
Label: "Generate Report"
Loading State (shown while API call is in progress)
Animated pulsing skeleton card or spinner
Text: "Analysing housekeeping data..." — 13px / slate-400 centered
Shimmer animation on placeholder lines
Report Output Card
White card, border-radius: 16px, padding: 20px
Rendered markdown output (react-markdown): headings, bullet lists, bold text
Timestamp: "Generated at 14:32" — 11px / slate-400
Subtle top border: 3px solid #7C3AED on card top edge (pill accent)
Copy button: small ghost button top-right of card
Error State
Red-tinted card, icon AlertCircle, message "Failed to generate report. Check your API key."

COMPONENT LIBRARY (create as Figma components)
RoomTile — grid tile with number, status badge, steward label
StatusBadge — colored pill, 5 variants (Cleaned / Not Cleaned / In Progress / Needs Attention / Occupied)
MaintenanceBadge — 3 variants (Pending / In Progress / Resolved)
MaintenanceCard — full report card
MissingItemCard — report card with item pills
ItemPill — small missing-item pill
FloorCard — floor overview with progress bar
StatCard — dashboard stat with icon + large number
BottomSheet — modal overlay for room detail
FormInput — text input with label
FormTextarea — multiline input
CheckboxRow — item checklist row
StewardDropdown — picker for 8 stewards
NavBar — 5-tab bottom nav with active states
TopBar — branded top bar
PrimaryButton — full-width CTA
IssueTypeChip — selectable chip for maintenance type
PhotoUploadTile — dashed camera upload area

FIGMA FILE STRUCTURE
📁 HouseKeeping Pro
  📄 Cover
  📁 Design System
    — Colors
    — Typography
    — Spacing
    — Components
  📁 Screens
    — 01 Dashboard
    — 02 Task Tracker (list + room detail modal)
    — 03 Maintenance Log (list + add form)
    — 04 Missing Items (list + add form)
    — 05 AI Report (idle + loading + result + error)
  📁 Prototype Flow
    — Full clickable prototype


ADDITIONAL NOTES
All screens use the same 390px × 844px frame (iPhone 14 size)
The app shell (top bar + bottom nav) should be a component placed on all screen frames
Prototype connections: each bottom tab connects to its screen; room tiles open bottom sheet overlay; form submit transitions back to list
The color transition for status is the most important visual detail — green = clean = positive, amber/orange = issues = caution, blue = active, purple = AI
The design should feel clean, clinical, and operational — this is a tool used by hotel staff on the go, not a consumer lifestyle app

This prompt covers every screen, every component, every color token, every data model, and every interaction state. You can now build this directly in Figma from scratch or feed it into Figma's AI design generator.

