# Institution Management System (IMS)

A full-featured React + Vite web application for managing an Islamic institution (madrasa/school). Built using a comprehensive custom CSS design system.

## Tech Stack
- **Frontend**: React 18, Vite 6
- **Icons**: lucide-react
- **Styling**: Custom CSS variables (light/dark mode, RTL support)
- **State**: Local React state (no backend; mock data)

## Features
- **Login Page** — Email/password auth with developer quick login buttons
- **Dashboard** — Role-based (Manager sees stats + quick actions; Staff sees personal summary + AI assistant UI)
- **Calendar** — Monthly calendar with Islamic event types (Muzaakarah, Jalsah, Eid, etc.), tooltips, filter, and upcoming events panel
- **Staff Management** — Table with search, add/remove staff, status toggles, action dropdowns
- **My Classes** — Class selector sidebar + student table with attendance bars, status badges, and editable notes
- **Reports** — Bar charts, pie chart, and leave summary table
- **Log Time** — Time entry form with calculated duration + history table
- **Leave Request** — Leave application form with duration calculation and balance display
- **Pending Leaves** — Approve/reject cards with leave tally and history tabs
- **Red Flags** — High/medium priority issues with resolve functionality
- **People to Visit** — Table + grouped Kanban view with sort, log visit actions
- **Budget** — Expense tracking table with progress bars and variance
- **Settings** — Profile, notifications checkboxes, and security (password)

## Roles
- `manager` — Sees all management views (staff, leaves, flags, visits, budget, reports)
- `dhimmedaar` (staff) — Sees personal views (classes, log time, leave request, visits)

## UI Features
- Dark mode toggle (persisted in localStorage)
- Language switcher (English, Arabic, Urdu) with RTL layout
- Collapsible sidebar (desktop) + mobile slide-in sidebar
- Bottom navigation bar for mobile
- Responsive design (breakpoints at 900px and 600px)

## Mock Credentials
- Manager: `admin@ims.org` / `admin`
- Staff: `ahmad@ims.org` / `1234`

## Run
```bash
npm run dev
```
Runs on port 5000.
