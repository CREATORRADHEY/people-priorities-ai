# Technical Debt Backlog

This document tracks identified technical debt, bundle optimizations, and code quality improvements to be addressed after the MVP/hackathon phase.

---

## Backlog Items

### TECH-DEBT-001: Optimize Frontend Bundle Size

- **Description**: The production bundle size has increased to ~996 KB after adding form controls and voice recording assets, which is large for a standard static landing and form layout.
- **Impact**: Slow initial page load times and higher bandwidth usage.
- **Proposed Actions**:
  - Lazy load routes using React's `lazy` and `Suspense`.
  - Split feature bundles into separate chunks using Vite's Rollup configuration.
  - Analyze and optimize imported dependencies (e.g., Lucide React tree-shaking, package-lock audit).
- **Status**: Backlog
- **Priority**: Medium

### TECH-DEBT-002: Refactor Client-side Form Validation to Schema-based Library

- **Description**: The custom input validator hook (`useSubmissionForm.ts`) works well for SPRINT 1 but will scale poorly as additional fields, multimedia inputs, and localized messages are integrated.
- **Impact**: Code complexity and validation maintenance overhead.
- **Proposed Actions**: Migrate validation logic to a schema-based validation library like Zod combined with React Hook Form.
- **Status**: Backlog
- **Priority**: Low

### TECH-DEBT-003: Dynamically Load Configuration Options (Categories/Languages)

- **Description**: Frontend categories and preferred languages lists are currently hardcoded in static client constants.
- **Impact**: Code changes and redeployments are required to add/edit categories.
- **Proposed Actions**: Expose a config endpoint on the backend (e.g., `GET /config`) to fetch available issue categories and languages dynamically.
- **Status**: Backlog
- **Priority**: Low

### TECH-DEBT-004: Route-based Code Splitting

- **Description**: All page components and icons are loaded in a single main JavaScript bundle.
- **Impact**: Increased initial bundle download times and script parsing blocks.
- **Proposed Actions**: Implement route-based code splitting using `React.lazy()` and `Suspense` for lazy loading route destinations.
- **Status**: Backlog
- **Priority**: Medium
