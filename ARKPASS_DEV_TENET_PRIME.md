# ArkPass Dev Tenet Prime

**STATUS**: 🟢 ACTIVE CANONICAL SOURCE OF TRUTH
**VERSION**: 1.0.0
**LAST UPDATED**: 2025-11-08
**PURPOSE**: Master coordination document for ALL AI agents working across ALL ArkPass repositories

---

## 🔴 MANDATORY: Read This First

**EVERY AI AGENT MUST:**
1. ✅ Read this document in full before starting ANY work
2. ✅ Clock in by updating the "Agent Activity Log" section
3. ✅ Review the "Repository Status Matrix" to understand what has been done
4. ✅ Update your work session in real-time as you complete tasks
5. ✅ Clock out by committing your session summary to this document
6. ✅ Push changes to GitHub so other agents can see your work

**THIS DOCUMENT IS THE SINGLE SOURCE OF TRUTH FOR:**
- Which repositories exist and their current state
- What has been reviewed, built, and documented
- Which specs/markdown files have been created
- What problems have been solved and what remains
- Coordination between multiple development attempts

---

## 📊 Repository Status Matrix

### Active Repositories

| Repository | Status | Primary Focus | Last Reviewed | Key Artifacts | Notes |
|------------|--------|---------------|---------------|---------------|-------|
| **october-arkpass** | 🟢 PRIMARY | Database schema, Figma specs, OpenSpec proposals | 2025-11-08 | 33 spec files, INVIC field mapping, dual-mode date system | THIS REPO - Main coordination hub |
| **INVIC-headless** | 🟡 PRODUCTION DB | Supabase PostgreSQL database | Not yet inspected | Existing: medications, conditions tables | Need to run EXTRACT_SCHEMA.sql |
| *(List other repos)* | | | | | |

### Repository Purpose Classification

**🟢 PRIMARY ACTIVE**: Current development focus, all new work goes here
**🟡 REFERENCE**: Contains valuable code/docs but not actively developed
**🔴 DEPRECATED**: Outdated, do not use, kept for historical reference
**🔵 EXPERIMENTAL**: Testing ground, may be promoted or deprecated

---

## 🗂️ October-ArkPass Repository Inventory

**Location**: `/Users/ali/october-arkpass/`
**Status**: 🟢 PRIMARY - Active Development
**Last Full Audit**: 2025-11-08

### Complete File Listing (33 files)

#### 1. Database Migration Scripts

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `scripts/dual-mode-date-functions.sql` | 220 | ✅ READY | PostgreSQL functions for dual-mode date system | 2025-11-07 |
| `scripts/enhanced-migration-with-dates.sql` | 250+ | ✅ READY | Complete migration with JSONB date support | 2025-11-07 |
| `scripts/test-migration.sql` | 60 | ⚠️ TEST ONLY | Simplified test migration | 2025-11-07 |
| `FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql` | 285 | 🔴 OUTDATED | Original migration (no dual-mode dates) | Old |
| `FHIR_SCHEMA_MIGRATIONS.sql` | ? | 🔴 REFERENCE | Historical reference | Old |
| `scripts/EXTRACT_SCHEMA.sql` | ~20 | ✅ UTILITY | Query to extract Supabase schema | 2025-11-07 |

**Migration Strategy Decisions Made:**
- ✅ Dual-mode JSONB date storage (stores date OR age with precision/certainty)
- ✅ Computed columns for query performance (`{field}_computed` timestamps)
- ✅ Display columns for UI (`{field}_display_pt` patient view, `{field}_display_pr` provider view)
- ✅ PostgreSQL functions: `compute_date_from_age()`, `extract_computed_date()`, `generate_patient_display()`, `generate_provider_display()`

#### 2. Field Mapping & Analysis

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `INVIC_VS_ARKPASS_FIELD_MAPPING.md` | 700+ | ✅ COMPLETE | Field-by-field comparison for all 10 features | 2025-11-07 |
| `FHIR_HARMONIZATION_MAP.md` | 41KB | ✅ COMPLETE | FHIR R4 resource mapping | Earlier |
| `SCHEMA_COMPARISON.md` | 13KB | ✅ COMPLETE | Production vs target schema comparison | Earlier |
| `MIGRATION_ADJUSTMENTS_LOG.md` | 9KB | ✅ COMPLETE | Audit trail of schema decisions | Earlier |
| `SCHEMA_VALIDATION_CHECKLIST.md` | 11KB | ✅ COMPLETE | 6-phase validation procedures | Earlier |

**Key Findings Documented:**
- ✅ Identified 8 critical schema blockers requiring OpenSpec proposals
- ✅ Defined 6 match types: Exact, Partial, Transform, Custom, Missing, Conflict
- ✅ Mapped all 10 PHR features to INVIC-headless fields
- ✅ Documented decision rationale for every field mismatch

#### 3. Architecture & Design Documentation

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `DATABASE_ARCHITECTURE_DISPLAY_COLUMNS.md` | 12KB | ✅ COMPLETE | Display column architecture pattern | Earlier |
| `openspec/changes/fhir-database-harmonization/design.md` | 20KB | ✅ COMPLETE | Complete design rationale | Earlier |
| `openspec/changes/fhir-database-harmonization/tasks.md` | 6.6KB | 🟡 9/111 DONE | 12-phase implementation task breakdown | Earlier |
| `openspec/changes/fhir-database-harmonization/proposal.md` | 9.5KB | ✅ COMPLETE | OpenSpec proposal document | Earlier |

**Architectural Decisions Locked In:**
- ✅ ArkPass Schema > FHIR (PRIMARY vs SECONDARY approach)
- ✅ Soft delete pattern (not hard delete)
- ✅ Row-Level Security (RLS) strategy defined
- ✅ Patient vs Provider display text separation

#### 4. Date/Time System Documentation

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `IMPORTANT_DATE_FIELDS_SUMMARY.md` | 8KB | ✅ COMPLETE | Date selection framework summary | Earlier |
| `DATE_TIME_SELECTION_FRAMEWORK.md` | 20KB | ✅ COMPLETE | Full intelligent date input specification | Earlier |
| `DUAL_MODE_DATE_INPUT_COMPONENT.md` | 22KB | ✅ COMPLETE | React component specification | Earlier |

**Date System Innovation:**
- ✅ Framework 1: Within 1yr/5yr/Over 5yr/Age (long-term dates)
- ✅ Framework 2: Within 1mo/6mo/2yr/More 2yr (recent dates)
- ✅ Voice input + LLM interpretation support
- ✅ Certainty levels: certain, somewhat_certain, uncertain
- ✅ Precision levels: day, month, year, age

#### 5. Migration Testing Guides

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `scripts/MIGRATION_TESTING_GUIDE.md` | ~100 | ✅ COMPLETE | Step-by-step dev testing instructions | 2025-11-07 |
| `scripts/README_MIGRATIONS.md` | ~150 | ✅ COMPLETE | Migration system master guide | 2025-11-07 |
| `scripts/RUN_THIS_IN_SUPABASE.md` | 112 | ✅ COMPLETE | 5-minute manual migration guide | 2025-11-07 |

#### 6. Figma Screen Specifications (11 files, 8000+ lines)

| File | Lines | Status | Screens | Last Updated |
|------|-------|--------|---------|--------------|
| `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` | ~800 | ✅ COMPLETE | 9 screens | 2025-11-08 |
| `MEDICATIONS_SCREENS_SPECS.md` | 568 | ✅ COMPLETE | 8 screens | Earlier |
| `ALLERGIES_SCREENS_SPECS.md` | 828 | ✅ COMPLETE | 10 screens | Earlier |
| `CONDITIONS_SCREENS_SPECS.md` | 513 | ✅ COMPLETE | 7 screens | Earlier |
| `SURGERIES_SCREENS_SPECS.md` | 750 | ✅ COMPLETE | 9 screens | Earlier |
| `IMMUNIZATIONS_SCREENS_SPECS.md` | 819 | ✅ COMPLETE | 9 screens | Earlier |
| `SUPPLEMENTS_SCREENS_SPECS.md` | 623 | ✅ COMPLETE | 7 screens | Earlier |
| `FAMILY_HISTORY_SCREENS_SPECS.md` | 421 | ✅ COMPLETE | 6 screens | Earlier |
| `SOCIAL_HISTORY_SCREENS_SPECS.md` | 757 | ✅ COMPLETE | 10 screens | Earlier |
| `PERSONAL_INFORMATION_SCREENS_SPECS.md` | 854 | ✅ COMPLETE | 10 screens | Earlier |
| `MY_DOCUMENTS_SCREENS_SPECS.md` | 1069 | ✅ COMPLETE | 7 screens | Earlier |

**Figma Extraction Status:**
- ✅ **91 total screens documented** (82 PHR features + 9 navigation)
- ✅ All 10 patient health record features fully specified
- ✅ Authentication, dashboard, sharing, pre-visit questionnaire complete
- ✅ Bottom navigation bar (5 icons) documented
- ✅ Access code lifecycle (active/unused/expired/revoked) fully mapped
- ⚠️ **Missing**: Calendar screen, Account/Profile screen, Quick Add menu

#### 7. Master Index & Coordination

| File | Lines | Status | Purpose | Last Updated |
|------|-------|--------|---------|--------------|
| `DATABASE_FILES_INDEX.md` | 250 | ✅ COMPLETE | Master index of all 33 files | 2025-11-08 |
| `ARKPASS_DEV_TENET_PRIME.md` | THIS | ✅ ACTIVE | Cross-repository coordination | 2025-11-08 |

---

## 🎯 What Has Been Completed

### Phase 1: Discovery & Analysis ✅ COMPLETE
- [x] Extracted all 91 Figma screens to markdown specs
- [x] Analyzed INVIC-headless database structure
- [x] Compared ArkPass requirements vs INVIC fields
- [x] Identified 8 critical schema conflicts
- [x] Created comprehensive field mapping matrix

### Phase 2: Architecture & Design ✅ COMPLETE
- [x] Designed dual-mode JSONB date system
- [x] Created PostgreSQL functions for date conversion
- [x] Specified display column architecture (patient vs provider views)
- [x] Defined RLS strategy
- [x] Documented soft delete pattern
- [x] Created migration strategy (4 phases)

### Phase 3: Documentation ✅ COMPLETE
- [x] 33 specification files created (8000+ lines)
- [x] Master index with usage matrix
- [x] Migration testing guides (3 guides)
- [x] OpenSpec proposal for FHIR harmonization
- [x] Task breakdown (111 tasks across 12 phases)

### Phase 4: Implementation 🔴 NOT STARTED
- [ ] Run EXTRACT_SCHEMA.sql on INVIC-headless to validate assumptions
- [ ] Create 8 OpenSpec proposals for schema conflicts
- [ ] Build Phase 1-4 migration scripts
- [ ] Test migrations in dev Supabase
- [ ] Implement RLS policies
- [ ] Build API endpoints
- [ ] Build frontend components

---

## 🚨 Critical Blockers & Open Questions

### 1. INVIC-headless Schema Inspection 🔴 URGENT
**Status**: Not yet inspected
**Blocker**: Need actual schema to validate field mapping assumptions
**Action Required**: Run `scripts/EXTRACT_SCHEMA.sql` in INVIC-headless Supabase SQL Editor
**Who Can Do This**: Developer with Supabase access to INVIC-headless project (gqahazcatpgzzfujnidk)

### 2. Eight OpenSpec Proposals Needed 🟡 HIGH PRIORITY
**Status**: Identified but not created
**Proposals Required**:
1. Dual-mode date system (affects ALL features)
2. Supplements table (entire feature missing from INVIC)
3. Allergy safety fields (category, severity, requires_epipen)
4. Document management system (folders, tags, associations)
5. Condition type system (Chronic vs Transient)
6. Immunization dose parent-child relationships
7. Social history enhancements (CAGE assessment, recreational drugs)
8. Personal info extended demographics

### 3. Missing Figma Screens 🟡 MEDIUM PRIORITY
**Status**: Referenced in navigation but not extracted
**Screens Needed**:
- Calendar screen (bottom nav icon exists)
- Account/Profile screen (bottom nav icon exists)
- Quick Add menu/modal (center plus button destination)
- Note entry screen (for adding visit notes)
- Revoke access confirmation modal
- Custom period date picker

### 4. Home Screen Design Update 🟢 JUST RAISED
**Status**: User indicated possible redesign
**Current**: Dashboard with sharing cards + health record grid
**Future**: To be determined
**Action**: Wait for user input on new design vision

---

## 🔄 Agent Activity Log

### Session Template
```markdown
#### [DATE] [TIME] - Agent [NAME/ID]
**Action**: CLOCK IN
**Repository**: [repo-name]
**Branch**: [branch-name]
**Task**: [Brief description]
**Files Modified**: [List]
**Commits**: [commit-hash if any]
**Status**: IN PROGRESS / COMPLETED / BLOCKED
**Notes**: [Any observations, blockers, or handoff notes]
**Action**: CLOCK OUT
**Duration**: [time]
```

### Active Sessions

#### 2025-11-08 - Agent Claude (Session 1)
**Action**: CLOCK IN
**Repository**: october-arkpass
**Branch**: main
**Task**: Extract dashboard/navigation screens from Figma, create ARKPASS_DEV_TENET_PRIME.md
**Files Created**:
- `DASHBOARD_NAVIGATION_SCREENS_SPECS.md` (800 lines)
- `ARKPASS_DEV_TENET_PRIME.md` (this file)

**Files Modified**:
- `DATABASE_FILES_INDEX.md` (added dashboard spec to index)

**Commits**:
- `463e3c5` - docs: Add comprehensive dashboard & navigation screens specification

**Status**: IN PROGRESS
**Notes**:
- Successfully extracted 9 navigation screens (auth, dashboard, sharing, pre-visit questionnaire)
- Documented access code lifecycle with color-coded states
- User indicated possible home screen redesign - awaiting requirements
- All changes pushed to GitHub

**Next Agent Should**:
- Review this document first
- Check if user provided home screen redesign requirements
- If starting implementation, begin with INVIC schema inspection
- Update this log with your session

#### 2025-11-08 06:45 AM - Agent Claude (Session 2)
**Action**: CLOCK IN
**Repository**: october-arkpass
**Branch**: main
**Task**: Review downloaded armada-arkpass codebase, identify missing dashboard/navigation components, clarify implementation gaps

**Analysis Completed**:
- Reviewed `/Users/ali/Downloads/armada-arkpass (5)/src` codebase
- Identified existing dashboard components: Dashboard.tsx, EnhancedDashboard.tsx, RecordsList.tsx, Navbar.tsx, SharedCard components
- Compared with current `october-arkpass/app/src` implementation
- Confirmed current app routes directly to `/medications` with no dashboard/home screen

**Key Findings**:
1. **Downloaded version HAS**:
   - Dashboard with welcome banner, profile photo, quick stats (conditions: 4, medications: 5, visits: 3, documents: 12)
   - RecordsList component showing grid of health record cards
   - Bottom navigation (mobile: 3 icons, desktop: 5-item sidebar)
   - SharedCard components for access code management
   - Layout wrappers (Layout, LayoutNoMidbar, LayoutDoctors)
   - VisitNotes, DashboardWelcome, Logo components

2. **Current october-arkpass app MISSING**:
   - Dashboard screen (no home page)
   - Bottom navigation bar
   - Access code/sharing features
   - Layout wrappers
   - All navigation infrastructure

3. **What IS built in current app**:
   - All 10 PHR feature list screens (medications, allergies, conditions, surgeries, immunizations, supplements, family-history, social-history, personal-information, documents)
   - Add screens for each feature
   - View screens for each feature
   - Routes configured but no navigation UI

**User Questions Answered**:
- Navigation bar colors: White background (#FFFFFF), black icons (#000000), black top border (1px)
- Sharing workflow: Color-coded cards - Yellow (active #FFFCBA), Orange (unused #FBBC05), Gray (pending #EEEEEE), White (expired)
- Access codes: 5-digit codes with time expiry (48h/1week/1month/custom)

**Status**: IN PROGRESS
**Notes**:
- User confirmed downloaded armada-arkpass has components we need
- All 10 PHR features built but no way to navigate between them
- Dashboard spec exists (DASHBOARD_NAVIGATION_SCREENS_SPECS.md) but not implemented
- Ready to implement dashboard + bottom nav OR port from downloaded version

**Next Action Options**:
1. Port dashboard components from downloaded armada-arkpass to current app
2. Build dashboard fresh from DASHBOARD_NAVIGATION_SCREENS_SPECS.md
3. Hybrid: Use downloaded as reference, build to match current app architecture

**Awaiting**: User decision on implementation approach

#### 2025-11-08 07:15 AM - Agent Claude (Session 2 - Continued)
**Action**: UPDATE
**Task**: Add Decision Authority Matrix to ARKPASS_DEV_TENET_PRIME.md

**Enhancement Added**:
- Created comprehensive Decision Authority Matrix section
- Categorized 25+ decision types into 5 categories:
  - Schema & Database (5 decisions)
  - Frontend Implementation (5 decisions)
  - Code Quality (4 decisions)
  - Documentation (4 decisions)
  - Git Operations (4 decisions)
  - Testing & Validation (3 decisions)

**Matrix Legend**:
- ✅ Yes: Agent can proceed autonomously
- 🚨 ASK USER FIRST: Requires explicit approval
- 🚨 WAIT FOR USER: User will provide requirements
- 🚨 NEVER: Forbidden operations

**Key Rules Established**:
- Port components from downloaded repos → ASK USER FIRST
- Production migrations → ASK USER FIRST
- Home screen redesign → WAIT FOR USER
- Force push to main → NEVER (forbidden)
- Update ARKPASS_DEV_TENET_PRIME.md → MANDATORY with every session

**"When In Doubt" Decision Tree Added**:
- Affects UX → ASK USER
- Changes architecture → ASK USER
- Reversible via git → Probably OK
- Follows existing patterns → Probably OK
- Still unsure → ASK USER

**Files Modified**:
- `ARKPASS_DEV_TENET_PRIME.md` (added 52 lines)

**Status**: READY FOR COMMIT

---

## 🔐 Decision Authority Matrix

**Purpose**: Clarify which decisions agents can make autonomously vs which require explicit user approval.

| Decision Type | Can Agent Decide? | Requires User Approval? | Notes |
|---------------|-------------------|------------------------|-------|
| **Schema & Database** |
| Add/rename database fields (following conventions) | ✅ Yes | ❌ No | Must document rationale in commit |
| Change database architecture (RLS, soft delete, etc.) | 🚨 **ASK USER FIRST** | ✅ YES | Major architectural changes only |
| Run dev/staging migrations | ✅ Yes | ❌ No | Test environment only |
| Run production migrations | 🚨 **ASK USER FIRST** | ✅ YES | Production changes require approval |
| Create new OpenSpec proposals | ✅ Yes | ❌ No | Document decision rationale |
| **Frontend Implementation** |
| Build components from existing specs | ✅ Yes | ❌ No | Follow DASHBOARD_NAVIGATION_SCREENS_SPECS.md |
| Port components from downloaded repos | 🚨 **ASK USER FIRST** | ✅ YES | User must approve which repo/approach |
| Change navigation structure | 🚨 **ASK USER FIRST** | ✅ YES | Affects user experience |
| Fix styling bugs (alignment, colors, spacing) | ✅ Yes | ❌ No | Match Figma specs exactly |
| Home screen redesign | 🚨 **WAIT FOR USER** | ✅ YES | User indicated possible redesign |
| **Code Quality** |
| Fix bugs in existing code | ✅ Yes | ❌ No | Document what was broken and how fixed |
| Refactor for performance/readability | ✅ Yes | ❌ No | Don't change external behavior |
| Add TypeScript types | ✅ Yes | ❌ No | Follow project conventions |
| Update dependencies | 🚨 **ASK USER FIRST** | ✅ YES | May introduce breaking changes |
| **Documentation** |
| Extract missing Figma screens | ✅ Yes | ❌ No | Follow existing spec format |
| Update ARKPASS_DEV_TENET_PRIME.md | ✅ Yes (MANDATORY) | ❌ No | Must update with every session |
| Create new architecture docs | ✅ Yes | ❌ No | Document decision rationale |
| Update existing specs | ✅ Yes | ❌ No | Keep specs in sync with implementation |
| **Git Operations** |
| Commit completed work | ✅ Yes | ❌ No | Follow commit message format |
| Push to main branch | ✅ Yes | ❌ No | Always push after session |
| Create feature branches | ✅ Yes | ❌ No | For experimental work |
| Force push to main | 🚨 **NEVER** | ❌ FORBIDDEN | Destructive operation |
| **Testing & Validation** |
| Run test migrations in dev | ✅ Yes | ❌ No | Always test before production |
| Validate schema with EXTRACT_SCHEMA.sql | ✅ Yes | ❌ No | Recommended before implementation |
| Test date functions with sample data | ✅ Yes | ❌ No | Validate dual-mode date system |

### Legend
- ✅ **Yes**: Agent can proceed autonomously
- 🚨 **ASK USER FIRST**: Stop and ask for explicit approval before proceeding
- 🚨 **WAIT FOR USER**: Do not proceed, user will provide requirements
- 🚨 **NEVER**: Forbidden, will cause problems

### When In Doubt
**If you're unsure whether a decision requires approval:**
1. Check if it affects user experience (UX) → ASK USER
2. Check if it changes architecture → ASK USER
3. Check if it's reversible via git → Probably OK to proceed
4. Check if it follows existing patterns → Probably OK to proceed
5. Still unsure? → ASK USER (better safe than sorry)

---

## 📋 Quick Reference: File Organization

```
october-arkpass/
├── ARKPASS_DEV_TENET_PRIME.md          ← YOU ARE HERE (master coordination)
├── DATABASE_FILES_INDEX.md             ← Index of all 33 files
├── INVIC_VS_ARKPASS_FIELD_MAPPING.md   ← Field comparison matrix
│
├── scripts/
│   ├── dual-mode-date-functions.sql         ← Run FIRST
│   ├── enhanced-migration-with-dates.sql    ← Run SECOND
│   ├── MIGRATION_TESTING_GUIDE.md           ← How to test
│   ├── README_MIGRATIONS.md                 ← Migration overview
│   └── RUN_THIS_IN_SUPABASE.md             ← 5-min manual guide
│
├── openspec/changes/fhir-database-harmonization/
│   ├── proposal.md                          ← Why we're doing this
│   ├── design.md                            ← How it works
│   └── tasks.md                             ← 111 tasks (9 done, 102 pending)
│
├── *_SCREENS_SPECS.md (11 files)            ← Figma screen specifications
│   ├── DASHBOARD_NAVIGATION_SCREENS_SPECS.md (9 screens)
│   ├── MEDICATIONS_SCREENS_SPECS.md (8 screens)
│   ├── ALLERGIES_SCREENS_SPECS.md (10 screens)
│   ├── CONDITIONS_SCREENS_SPECS.md (7 screens)
│   ├── SURGERIES_SCREENS_SPECS.md (9 screens)
│   ├── IMMUNIZATIONS_SCREENS_SPECS.md (9 screens)
│   ├── SUPPLEMENTS_SCREENS_SPECS.md (7 screens)
│   ├── FAMILY_HISTORY_SCREENS_SPECS.md (6 screens)
│   ├── SOCIAL_HISTORY_SCREENS_SPECS.md (10 screens)
│   ├── PERSONAL_INFORMATION_SCREENS_SPECS.md (10 screens)
│   └── MY_DOCUMENTS_SCREENS_SPECS.md (7 screens)
│
└── [Other FHIR/architecture docs]           ← Reference material
```

---

## 🎓 Knowledge Base: Key Decisions

### Design Philosophy
1. **ArkPass Schema is PRIMARY, FHIR is SECONDARY**
   - We optimize for patient UX first, FHIR export second
   - Custom fields allowed when FHIR doesn't fit patient needs

2. **Date Input Innovation: Dual-Mode System**
   - Patients can enter dates OR ages ("May 2020" or "When I was 25")
   - Stored as JSONB with precision/certainty metadata
   - Computed columns for efficient queries
   - Display columns for patient vs provider views

3. **Color-Coded Access Code Lifecycle**
   - 🟨 Yellow = Active (in use)
   - 🟧 Orange = Unused (generated but not used)
   - 🔲 Gray = Pending (awaiting questionnaire or generation)
   - ⚪ White = Expired/Revoked

4. **Bottom Navigation Pattern**
   - 5 icons: Home, Calendar, Plus (center/primary), Key, Account
   - Always visible except during questionnaire flows
   - Plus button = Quick add (opens modal/menu)

### Database Conventions
- `{field}_raw` = JSONB storage (date/age/relative time)
- `{field}_computed` = TIMESTAMP generated column (for queries)
- `{field}_display_pt` = TEXT generated column (patient view: "May 2020")
- `{field}_display_pr` = TEXT generated column (provider view: "05/15/2020 (uncertain)")
- Soft delete: `deleted_at TIMESTAMP` (never hard delete)
- RLS: Row-Level Security on all patient data tables

### Tech Stack
- **Database**: PostgreSQL (Supabase)
- **Backend**: (To be determined)
- **Frontend**: React + (styling TBD - Figma shows Tailwind but needs conversion)
- **Auth**: Google OAuth, Apple OAuth, Mobile Phone + SMS
- **Design System**: Public Sans font, 24px H1, 20px H2, 16px body

---

## 🔧 Development Environment

### Supabase Projects
- **INVIC-headless** (gqahazcatpgzzfujnidk): Production database
- **Dev/Staging**: (To be confirmed)

### Required Tools
- Supabase CLI (currently v2.22.12 - may need update)
- Git
- PostgreSQL client (for local testing)
- Figma Desktop app (for MCP server screen extraction)

---

## 📝 Standard Operating Procedures

### For New Agents Joining Mid-Project

1. **Read ARKPASS_DEV_TENET_PRIME.md** (this document) - MANDATORY
2. **Check Agent Activity Log** - See what the last agent did
3. **Review DATABASE_FILES_INDEX.md** - Understand all 33 files
4. **Clock In** - Add your session to Activity Log
5. **Check Blockers Section** - See if anything is blocking progress
6. **Start Work** - Follow the task breakdown in openspec/changes/.../tasks.md
7. **Update as You Go** - Keep Activity Log current
8. **Clock Out** - Commit your session summary
9. **Push to GitHub** - So next agent can see your work

### For Planning/Design Work

1. Check if design decisions exist in `openspec/changes/fhir-database-harmonization/design.md`
2. Check if specs exist in `*_SCREENS_SPECS.md` files
3. Check field mapping in `INVIC_VS_ARKPASS_FIELD_MAPPING.md`
4. If creating NEW design, document decision rationale
5. Update relevant spec files
6. Update this document if architectural change

### For Implementation Work

1. Check migration scripts in `scripts/` directory
2. Check if database functions exist (`dual-mode-date-functions.sql`)
3. Run migrations in dev environment first (never production directly)
4. Follow validation checklist in `SCHEMA_VALIDATION_CHECKLIST.md`
5. Test dual-mode date fields with sample data
6. Document any issues in Activity Log

### For Figma Screen Extraction

1. Check if screen already extracted (11 spec files cover 91 screens)
2. Use Figma Desktop app + MCP server
3. Get screenshot + design context + variable definitions
4. Convert Tailwind to project's actual styling system
5. Document in `*_SCREENS_SPECS.md` format (see existing files)
6. Update `DATABASE_FILES_INDEX.md`

---

## 🚀 Recommended Next Steps (Priority Order)

### Immediate (Do First)
1. **Inspect INVIC-headless schema** - Run `EXTRACT_SCHEMA.sql` to validate field mapping
2. **Clarify home screen redesign** - Get requirements from user
3. **Test dual-mode date functions** - Run test queries in dev Supabase

### Short-term (This Week)
4. Create 8 OpenSpec proposals for schema conflicts
5. Build Phase 1 migration scripts (create missing tables)
6. Set up dev Supabase project for testing
7. Implement RLS policies

### Medium-term (This Month)
8. Build API endpoints (auth, access-codes, visit-notes, questionnaires)
9. Build frontend components (authentication screens)
10. Build dashboard with access code cards
11. Implement bottom navigation

### Long-term (Future)
12. Complete all 111 tasks in `tasks.md`
13. Extract missing Figma screens (Calendar, Account)
14. Implement all 10 PHR features
15. FHIR export functionality

---

## 🔗 External References

### Documentation
- **OpenSpec**: (Link to OpenSpec documentation if available)
- **Supabase**: https://supabase.com/docs
- **FHIR R4**: http://hl7.org/fhir/R4/

### GitHub Repositories
- **october-arkpass**: (Add GitHub URL)
- **INVIC-headless**: (Add if separate repo)
- *(Add other repos as discovered)*

### Figma
- **File**: Salma's Test_Low-Fidelity Wireframes
- **URL**: https://www.figma.com/design/hn3R5rzRSIEl4lPT2gw2iO/

---

## 🔄 Version History

| Version | Date | Changes | Updated By |
|---------|------|---------|------------|
| 1.0.0 | 2025-11-08 | Initial creation - Master coordination document | Claude (Session 1) |

---

## 📜 Agent Agreement

**By working on this project, every AI agent agrees to:**

1. ✅ Read this document before starting work
2. ✅ Update the Activity Log with every session
3. ✅ Commit and push all changes to GitHub
4. ✅ Document all decisions and rationale
5. ✅ Never make breaking changes without updating specs
6. ✅ Never delete or overwrite another agent's work without explicit instruction
7. ✅ Always check for blockers before starting implementation
8. ✅ Follow established conventions (naming, structure, architecture)
9. ✅ Ask clarifying questions when requirements are ambiguous
10. ✅ Hand off cleanly to the next agent with detailed notes

**This document is living and must be updated by every agent who contributes to the project.**

---

**END OF ARKPASS DEV TENET PRIME v1.0.0**

*Last verified by: Claude (2025-11-08)*
*Next agent: Please update Activity Log and continue from "Recommended Next Steps"*
