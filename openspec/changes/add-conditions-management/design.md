# Conditions Management - Technical Design

## Context

This is the first major feature implementation for the Patient Health Records mobile application. The Conditions Management feature provides the foundation for patients to track their medical diagnoses, which will serve as a reference point for other PHR capabilities (medications, documents, allergies, etc.).

### Background
- Mobile-first health record application
- Target platform: Mobile (iOS/Android)
- Design specs extracted from Figma using MCP server
- Monochrome design system with Public Sans typography

### Stakeholders
- Patients (primary users)
- Healthcare providers (consumers of shared health data)
- Development team
- Design team (specs already finalized in Figma)

## Goals / Non-Goals

### Goals
- Implement pixel-perfect mobile UI matching Figma specifications
- Enable complete CRUD operations for medical conditions
- Support both Chronic and Transient condition types
- Allow association of conditions with medications and documents
- Provide both quick-add and detailed-add workflows
- Ensure accessibility (WCAG AA compliance)

### Non-Goals
- Multi-language support (future enhancement)
- Offline-first functionality (future enhancement)
- Condition templates or auto-suggestions (future enhancement)
- Integration with external medical databases (ICD-10, SNOMED) (future enhancement)
- Sharing/permission management for conditions (separate feature)
- Medication and Document management screens (separate specs needed)

## Decisions

### Decision: Mobile-First Implementation
**What**: Implement for 390px mobile viewport first, desktop later
**Why**: Figma specs are mobile-only, primary use case is mobile PHR management
**Alternatives considered**:
- Responsive-first approach: Rejected due to lack of desktop designs
- Desktop-first approach: Rejected as it doesn't match user needs

### Decision: Condition Type Taxonomy
**What**: Two-tier classification: Chronic vs Transient (with Recurrent/Resolved subtypes)
**Why**: Matches medical record conventions and Figma specifications
**Alternatives considered**:
- Flat list without classification: Rejected, too simplistic for medical use
- Multi-level taxonomy with ICD-10 codes: Rejected as over-engineering for initial version

### Decision: Quick Add vs Detailed Add
**What**: Provide both an inline quick-add input and a detailed form screen
**Why**: Balances speed (quick add) with completeness (detailed add)
**Alternatives considered**:
- Detailed form only: Rejected, too slow for rapid entry
- Quick add only: Rejected, insufficient for capturing complete information

### Decision: Associations vs Nested Data
**What**: Store medication and document associations as separate entities linked to conditions
**Why**: Enables reuse (one medication can treat multiple conditions), supports future standalone management screens
**Alternatives considered**:
- Nested data structure: Rejected, creates data duplication
- No associations: Rejected, loses valuable clinical context

### Decision: Expandable Detail Sections
**What**: Show/hide additional fields (diagnosis date, details) via "Show more/less" toggle
**Why**: Reduces initial cognitive load, matches Figma specification
**Alternatives considered**:
- Always show all fields: Rejected, clutters UI
- Separate detail screen: Rejected, adds unnecessary navigation step

### Decision: Form State Management
**What**: Use controlled components with local state, API calls on save/submit
**Why**: Standard React pattern, enables validation before submission
**Alternatives considered**:
- Uncontrolled forms: Rejected, harder to validate
- Auto-save on every change: Rejected, creates unnecessary API traffic

### Decision: Validation Strategy
**What**: Client-side validation for required fields, API validation for business rules
**Why**: Immediate user feedback, but server remains authoritative
**Alternatives considered**:
- Client-only validation: Rejected, security risk
- Server-only validation: Rejected, poor UX

## Technical Architecture

### Data Model
```typescript
interface Condition {
  id: string;
  userId: string;
  name: string; // Diagnosis name
  type: 'Chronic' | 'Transient';
  subtype?: 'Recurrent' | 'Resolved'; // Only for Transient
  diagnosisDate?: Date;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConditionMedicationAssociation {
  conditionId: string;
  medicationId: string;
}

interface ConditionDocumentAssociation {
  conditionId: string;
  documentId: string;
}
```

### API Endpoints
```
GET    /api/conditions           - List all conditions for user
GET    /api/conditions/:id       - Get single condition details
POST   /api/conditions           - Create new condition
PUT    /api/conditions/:id       - Update condition
DELETE /api/conditions/:id       - Delete condition

POST   /api/conditions/:id/medications/:medId  - Associate medication
DELETE /api/conditions/:id/medications/:medId  - Remove medication association

POST   /api/conditions/:id/documents/:docId    - Associate document
DELETE /api/conditions/:id/documents/:docId    - Remove document association
```

### Component Hierarchy
```
ConditionsListScreen
├── Header (Share button)
├── PageTitle ("Conditions")
├── QuickAddInput
│   ├── TextInput
│   └── AddButton
├── AddWithDetailsButton
├── ChronicConditionsSection
│   ├── SectionHeader ("CHRONIC")
│   └── ConditionCard[] (list items)
├── TransientConditionsSection
│   ├── SectionHeader ("TRANSIENT")
│   └── EmptyState | ConditionCard[]
└── BottomNavBar

ViewConditionScreen
├── Header
│   ├── BackButton
│   ├── ConditionName
│   └── EditButton
├── FormSection
│   ├── FieldDisplay (name, type)
│   ├── ExpandableSection
│   │   ├── ShowMoreLink
│   │   └── AdditionalFields (diagnosis date, details)
│   ├── MedicationsList
│   └── DocumentsList
└── DeleteButton

AddConditionScreen / EditConditionScreen
├── Header
│   ├── BackButton
│   ├── PageTitle / ConditionName
│   └── SaveButton
├── FormSection
│   ├── NameInput
│   ├── TypeRadioGroup (Chronic/Transient)
│   ├── SubtypeRadioGroup (Recurrent/Resolved) [conditional]
│   ├── ExpandableSection
│   │   └── AdditionalFields
│   ├── MedicationsAssociationSection
│   │   ├── MedicationsList [with delete icons in edit mode]
│   │   └── AddMedicationsButton
│   └── DocumentsAssociationSection
│       ├── DocumentsList [with delete icons in edit mode]
│       └── AddDocumentsButton
└── DeleteButton [edit mode only]
```

### Styling Approach
- **CSS-in-JS or Tailwind**: TBD based on project conventions (update `openspec/project.md`)
- **Design tokens**: Extract Figma values to constants
- **Responsive breakpoints**: Start at 390px (mobile), expand later

### State Management
- **Local component state** for form inputs (useState)
- **API state** via React Query or SWR for server data
- **Navigation state** via React Router or equivalent

## Risks / Trade-offs

### Risk: Medication/Document entities not yet implemented
- **Mitigation**: Scaffold association UI with placeholders, implement full functionality when those entities are available
- **Fallback**: Show "Coming soon" message for + Add Medications/Documents buttons

### Risk: Figma assets (icons) may need optimization
- **Mitigation**: Use SVGO or similar tool to optimize SVG assets from localhost:3845
- **Fallback**: Replace with open-source icon library (Heroicons, Lucide) if needed

### Risk: Public Sans font licensing or loading
- **Mitigation**: Verify Google Fonts license, use `@import` or `<link>` tag
- **Fallback**: System font stack (San Francisco, Roboto, Segoe UI)

### Trade-off: Pixel-perfect design vs development speed
- **Decision**: Prioritize pixel-perfect implementation per Figma specs
- **Reason**: First major feature sets quality bar for entire app
- **Cost**: Slower initial implementation, but establishes design system for future features

### Trade-off: Client-side search/filter vs server-side
- **Decision**: Not implementing search in v1
- **Reason**: Figma specs don't include search UI
- **Future**: Add when condition lists exceed ~20 items

## Migration Plan

### Phase 1: Backend Setup
1. Create database tables (conditions, condition_medication_associations, condition_document_associations)
2. Implement API endpoints with OpenAPI/Swagger docs
3. Write API tests

### Phase 2: Frontend Foundation
1. Set up design system (colors, typography, spacing constants)
2. Implement shared components (buttons, inputs, radio buttons, separators)
3. Configure routing

### Phase 3: Screen Implementation
1. Conditions List Screen
2. Add Condition Screen (basic, without associations)
3. View Condition Screen (basic, without associations)
4. Edit Condition Screen (basic, without associations)

### Phase 4: Associations
1. Implement association placeholder UI
2. Connect to medication/document APIs when available

### Phase 5: Polish
1. Animations and transitions
2. Loading states and error handling
3. Accessibility audit
4. Cross-device testing

### Rollback Plan
- Feature flag: `ENABLE_CONDITIONS_MANAGEMENT` (default: off)
- Toggle on for beta users first
- If critical issues found, toggle off and rollback database migrations
- No data loss risk (append-only tables)

## Open Questions

### Q1: Authentication and user context
- How is the current user identified?
- Is userId passed via JWT, session, or context provider?
- **Action**: Review authentication implementation in existing codebase

### Q2: API framework and conventions
- Are we using REST, GraphQL, or tRPC?
- What's the error response format?
- **Action**: Update `openspec/project.md` with API conventions

### Q3: Testing framework
- Jest + React Testing Library?
- Playwright/Cypress for E2E?
- **Action**: Update `openspec/project.md` with testing strategy

### Q4: Medication and Document entity schemas
- When will these be available?
- Should we mock them for now?
- **Action**: Create separate change proposals for medications and documents

### Q5: Deployment strategy
- Mobile: React Native, Flutter, or PWA?
- CI/CD pipeline?
- **Action**: Update `openspec/project.md` with deployment process

### Q6: Internationalization
- Is i18n needed in v1?
- If yes, which library (react-i18next, FormatJS)?
- **Action**: Clarify with product owner, update goals if needed
