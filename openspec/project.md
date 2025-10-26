# Project Context

## Purpose

**ArkPass** - Personal Health Record (PHR) mobile application enabling patients to:
- Manage comprehensive medical history (conditions, medications, allergies, surgeries, etc.)
- Track 10 core health categories with detailed data
- Associate documents with health records
- Share health information with healthcare providers
- Export data in FHIR format for interoperability

**Target Users**: Patients managing their own health records, caregivers, healthcare providers (via access grants)

## Tech Stack

### Frontend
- **React** (mobile-first, responsive web)
- **UI Library**: Shadcn UI components
- **Typography**: Public Sans (Medium 500, Bold 700, ExtraBold 800)
- **Styling**: Tailwind CSS
- **State Management**: React Context / React Query
- **Icons**: Custom icon system (arrows, delete, status indicators)

### Backend
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **Auth**: Supabase Auth (email/password, session management)
- **Storage**: Supabase Storage (for document uploads)
- **API**: Supabase PostgREST (auto-generated REST API)

### Data Standards
- **FHIR R4**: For export/interoperability ONLY (not database constraint)
- **Medical Coding**: LOINC, SNOMED, RxNorm (for future vocabulary support)

## Project Conventions

### Database Design Philosophy

**CRITICAL PRIORITY ORDER**:
1. **ArkPass Schema** (PRIMARY) - Figma UI drives database structure
2. **FHIR R4 Export** (SECONDARY) - For interoperability, not design constraint

**Core Principle**:
- Figma designs dictate database fields
- Custom fields for ArkPass features are acceptable (e.g., `requires_epipen`, folder structure)
- FHIR mapping happens at export time (custom extensions for mismatches)
- Never remove features to fit FHIR limitations

### Code Style
- **File Structure**: Feature-based organization (`features/medications/`, `features/allergies/`)
- **Naming**: kebab-case for files, PascalCase for components, camelCase for variables
- **Comments**: JSDoc for public APIs, inline for complex logic

### Architecture Patterns

**UI Patterns** (6 reusable patterns):
1. **Dual-Mode Date Input**: Date OR Age selection
2. **Quick Add Pattern**: Minimal fields vs. detailed form
3. **Repeatable Entry Pattern**: Multiple entries with individual controls
4. **Field-Level Editing**: Tap individual field to edit (mobile-first)
5. **Conditional UI Pattern**: Dynamic field visibility based on selections
6. **Multi-Select Pattern**: Checkbox lists with "Other" option

**Data Patterns**:
- **Document Associations**: Link documents to PHR records via junction tables
- **Privacy Controls**: `is_private` / `is_highlighted` toggles
- **Audit Trails**: `created_at`, `updated_at`, `created_via` on all tables

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Supabase client interactions
- **E2E Tests**: Cypress (critical user flows)
- **Schema Validation**: `openspec validate --strict` before deployment

### Git Workflow
- **Branch Strategy**: `main` (production), `dev` (integration), feature branches
- **Commit Convention**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **PR Requirements**: OpenSpec validation passing, review approval
- **Deployment**: Automatic from `main` after merge

## Domain Context

### Healthcare PHR System

**10 Core Features**:
1. **Medications**: Name, dosage, frequency, indication, status (8 screens)
2. **Allergies**: Category, severity, requires EpiPen flag (7 screens) **PATIENT SAFETY CRITICAL**
3. **Conditions**: Chronic vs. transient, tags, status (7 screens)
4. **Surgeries**: Name, date, surgeon, complications (9 screens)
5. **Supplements**: Non-prescription medications (7 screens)
6. **Immunizations**: Vaccines, batch numbers, reactions (7 screens)
7. **My Documents**: 5 folders (Prescriptions, Lab Results, Imaging, Consult, Other) (11 screens)
8. **Personal Information**: Demographics, emergency contacts, insurance (15 screens)
9. **Social History**: Smoking, alcohol, drugs, living situation (8 screens)
10. **Family History**: Relatives, conditions, hereditary risks (3 screens)

**Total**: 75 Figma screens extracted

### Medical Terminology

- **Chronic**: Long-term, ongoing condition
- **Transient**: Temporary condition (recurrent or resolved)
- **EpiPen**: Emergency epinephrine auto-injector for life-threatening allergies
- **PHR**: Personal Health Record (patient-controlled)
- **EMR/EHR**: Electronic Medical/Health Record (provider-controlled)

## Important Constraints

### Compliance Requirements
- **HIPAA**: Audit logs, access controls, encryption at rest/transit
- **RLS (Row-Level Security)**: Patients can only access their own data
- **Consent Management**: Explicit consent for data sharing (access grants)

### Technical Constraints
- **Mobile-First**: All UI must work on mobile devices (small screens)
- **Offline**: Future requirement (not MVP)
- **Performance**: <2s page load, <500ms interactions

### Business Constraints
- **Patient Safety**: Cannot launch without allergy severity + EpiPen tracking
- **Data Portability**: Must support FHIR export (legal requirement)
- **Privacy**: `is_private` toggle on all sensitive data

## External Dependencies

### Services
- **Supabase**: `https://gqahazcatpgzzfujnidk.supabase.co`
  - Database (PostgreSQL)
  - Auth (email/password, session management)
  - Storage (document uploads)
  - PostgREST API (auto-generated)

### Future Integrations (Planned)
- **FHIR Export Service**: Convert ArkPass data → FHIR Bundle
- **Vocabulary Services**: RxNorm (medications), SNOMED (conditions), LOINC (lab tests)
- **Provider Portal**: Healthcare provider access via access grants

### Development Tools
- **Figma**: Design source of truth (75 screens extracted)
- **OpenSpec**: Specification and governance framework
- **MCP (Model Context Protocol)**: AI assistant integration (Figma Desktop MCP)

## Additional Notes

### Database State (As of 2025-10-26)
- **Current**: 2 minimal tables (`medications`, `conditions`)
- **Target**: 23 comprehensive tables (full PHR schema)
- **Migration**: Ready to execute (Phase 0 + Phases 1-4)

### Documentation Structure
- **Figma Specs**: `*_SCREENS_SPECS.md` (27 files, 75 screens)
- **UI Patterns**: `*_PATTERN.md` (6 files, reusable patterns)
- **FHIR Harmonization**: `FHIR_HARMONIZATION_MAP.md`, `FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql`
- **OpenSpec**: `openspec/specs/` (capability specifications)
- **OpenSpec Changes**: `openspec/changes/` (change proposals)

### Contact & Resources
- **Figma File**: [Link to Figma design file]
- **Supabase Dashboard**: https://app.supabase.com
- **Documentation**: [Link to team docs]
- **OpenSpec Docs**: https://github.com/openspec/openspec
