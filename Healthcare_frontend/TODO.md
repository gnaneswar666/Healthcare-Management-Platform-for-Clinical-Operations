# Health Twin Pages — Redesigned with Project Design System

## Goal
Rebuild all three Health Twin pages (Admin, Doctor, Patient) to use the project's consistent design system (`page-card`, `page-header`, `page-status-chip`, `page-title`, `page-subtitle`, `stat-card`, `soft-card`, framer-motion variants).

## Steps
- [x] 1. Analyze existing pages and identify improvement opportunities
- [x] 2. Get user approval on the plan
- [x] 3. Rewrite `healthtwin-ui/src/pages/admin/HealthTwins.jsx` — premium card grid with patient identity merge, enhanced search, functional navigation
- [x] 4. Rewrite `healthtwin-ui/src/pages/doctor/HealthTwin.jsx` — same premium card design, scoped to assigned patients, View → `/doctor/patient360/:patientId`
- [x] 5. Rewrite `healthtwin-ui/src/pages/patient/HealthTwin.jsx`:
  - [x] Remove dark gradient backgrounds, conic rotations, SVG gauge wall
  - [x] Use `page-card`/`page-header`/`page-status-chip--brand`/`page-title`/`page-subtitle`/`page-meta`
  - [x] 4 `stat-card`s (Height/Weight/Blood Group/BMI) with hover lift
  - [x] Risk gauge SVG kept as a compact visual in a `soft-card` alongside animated risk bar
  - [x] Vital signs in 2×2 tiles matching admin/doctor card style
  - [x] Risk Factors grid (4 columns) with `RiskFactor` normal/warning indicators
  - [x] Health Summary section with `SummaryRow` components
  - [x] `containerVariants`/`itemVariants` framer-motion staggered entrance
  - [x] 15s auto-refresh, loading spinner, empty state
  - [x] Clean imports — no unused icons, no `VitalCard` dependency
- [x] 6. ESLint passes on all three files with no errors
