# ArkPass Dev Tenet Prime

**STATUS**: 🟢 ACTIVE CANONICAL SOURCE OF TRUTH
**VERSION**: 2.0.0
**LAST UPDATED**: 2025-11-08
**PURPOSE**: Master coordination document for ALL AI agents working across ALL ArkPass repositories

---

## 🔴 MANDATORY: Read This First

**EVERY AI AGENT MUST:**
1. ✅ Read this constitution in full before touching any repo.
2. ✅ Review `CURRENT_STATUS.md` (Layer 1 snapshot) to understand the live state.
3. ✅ Read today’s entry in `logs/YYYY-MM-DD.md` (Layer 2) so you know the latest moves.
4. ✅ Confirm Supervisor clearance (ratio check: `Builders ≤ 3 × Librarians`) before clock-in.
5. ✅ Clock in via the daily log template, declare your context budget, and open a tmux session.
6. ✅ Deliver 50% / 75% / 90% context summaries, update `CURRENT_STATUS.md`, and record outputs.
7. ✅ Commit + push code **and** coordination files before handing off.

**THIS DOCUMENT IS THE SINGLE SOURCE OF TRUTH FOR:**
- Which repositories exist and their current state
- What has been reviewed, built, and documented
- Which specs/markdown files have been created
- What problems have been solved and what remains
- Coordination between multiple development attempts

---

## 🏛️ Grandmaster Ali Constitution

### Command Structure (1 • 3 • 9)
- **1 Supervisor (“Prime”)** — Holds the keys. No builder session launches without Prime confirming librarian coverage and context health.
- **3 Context Document Historians (“Librarians”)** — Maintain the knowledge stack, map new repos (“doors”), and guard against context loss. Minimum ratio: `Builders ≤ 3 × Librarians`.
- **9 Immutable Commitments** every agent signs up for:
  1. Declare your tmux session and context budget at clock-in.
  2. Respect the layered context files (Layer 1 status, Layer 2 log, Layer 3 archives).
  3. Deliver 50% / 75% / 90% summaries on time — no freelancing.
  4. Update `CURRENT_STATUS.md` the moment reality changes.
  5. Catalogue every new repo/folder with a Door ID before opening files.
  6. Escalate ambiguous decisions to Grandmaster Ali or the Decision Authority Matrix.
  7. Summon the **Bullshit Preventer Demolition Man (B.P.D. Man)** when redundancy creeps in.
  8. Leave a clean hand-off in the daily log — nobody guesses what you did.
  9. Commit & push both code and coordination artifacts before you disappear.

### Layered Context System
- **Layer 1 — `CURRENT_STATUS.md`**: 150-line snapshot of the mission. Read-first, update-last.
- **Layer 2 — `logs/YYYY-MM-DD.md`**: Daily session ledger with fixed template and checkpoint summaries.
- **Layer 3 — Deep Archive**: Tenet Prime appendices, specs, legacy repos, Figma extracts. Librarians decide what surfaces upward.
- **Token Estimation Guidance**: Treat ~4 characters ≈ 1 token. Loading `CURRENT_STATUS` (~2k) + today’s log (~3k) + three specs (~10k) already consumes ~15k tokens—log your estimate at each checkpoint.

### Role Directory
- **Grandmaster Ali** — Supreme authority. Issues decrees, approves paradigm shifts, may serve as Prime directly.
- **Supervisor (“Prime”)** — Default: Grandmaster Ali. If delegated, the appointed agent must clock in as Prime in `CURRENT_STATUS.md` before builders start; controls tmux airspace, enforces ratios, freezes sessions when required.
- **Context Document Historian (“Librarian”)** — Manages Layer 1 & 2, assigns Door IDs, digests legacy material (including Skunkworks/2016 drops).
- **Skunkworks Archivist** — Designated Librarian responsible for Door-04+ (legacy/experimental) audits; catalogs unique features, flags redundancy, recommends “Merge / Archive / Ignore” actions.
- **Builder Agent (“Node”)** — Executes implementation tasks inside tmux sessions once cleared.
- **Bullshit Preventer Demolition Man (B.P.D. Man)** — Nukes redundant or contradictory context, merges truth into the canon.
- **Skunkworks Archivist** (optional Librarian specialization) — Evaluates fringe/legacy repositories, routes useful intel back to the canon.

### Doorway Registry
- Every repo/folder under review receives a **Door ID** (e.g., `Door-08`).
- Door table lives in `CURRENT_STATUS.md` under “Intake Queue”.
- Librarians must mark `Status` (`Queued`, `Processing`, `Merged`, `Archived`) before builders touch code from that source.

### tmux Operations
1. Supervisor creates/authorises sessions: `tmux new -s prime`, `tmux new -s node1`, etc.
2. Builders attach to their assigned `node*` session and keep it alive until clock-out.
3. Librarians maintain a read-only pane mirroring each builder session.
4. Use a dedicated pane or scratch buffer for notes before copying them into logs.
5. Prime, Librarians, and Nodes are encouraged—**and empowered**—to question orders that conflict with context or reality before Grandmaster Ali confirms the path.

### Mission Control Console
- **Purpose**: Mission Control (ID `48707`) is the strategic war room: track missions, issue orders, and broadcast updates.
- **Commands**:
  - `mc` — opens the control center dashboard.
  - `mcs` — mission status pulse; run at clock-in and before clock-out.
  - `mct 'task'` — log or update a mission (quote the summary; include Door IDs when relevant).
- **Usage Protocol**:
  1. After loading Layer 1 and Layer 2, execute `mcs` to absorb active directives.
  2. Record meaningful progress or blockers with `mct 'summary'` alongside the daily log entry.
  3. Supervisors/Librarians poll Mission Control hourly or whenever Prime issues new orders.
  4. During emergencies, Grandmaster Ali may broadcast commands via Mission Control—acknowledge them in tmux (`<<Context XX%>> [over]`) and log the response.
- **tmux vs Mission Control**: tmux governs live shells; Mission Control governs mission metadata. Both must be kept in sync.
- **Integration**: Whenever a mission is created or finished, update `CURRENT_STATUS.md`, the daily log, and (if necessary) the Door registry to reflect the change.

### Clock-In Procedure (No Exceptions)
1. Pull latest `main`.
2. Supervisor confirms librarian coverage ratio; record approval in the daily log entry.
3. Librarian updates `CURRENT_STATUS.md` if anything changed since the last entry.
4. Read `CURRENT_STATUS.md` + today’s log tail.
5. Reserve/declare a Door ID for any new repo/folder you will open.
6. Start/attach tmux session, note the name.
7. Copy the session template in `logs/YYYY-MM-DD.md`, fill header lines, declare context budget (estimated tokens).

### Clock-Out Procedure
1. Capture required 50% / 75% / 90% summaries (or mark N/A if you never reached the checkpoint).
2. Document outputs (commits, files) and hand-off in the daily log.
3. Update `CURRENT_STATUS.md` bullets reflecting completed/blocked work.
4. Commit coordination files **and** code changes; push to `main`.
5. Leave tmux session running only if the supervisor authorises a hot hand-off; otherwise close it.

### Context Window Checkpoints
- **50% Mid Summary (≤75 tokens)** — Cover: files touched, decisions/blockers, remaining plan. Append `<<Context XX%>>`.
- **75% Late Summary (≤40 tokens)** — Confirm: still on plan? new info? highlight blockers. Append `<<Context XX%>>`.
- **90% Final Summary (≤30 tokens)** — Hand-off instructions + stop signal. Append `<<Context 90%>>` and end the session immediately. Do **not** continue past 90%.
- Record token estimate at each checkpoint (`Tokens Used: ~6k / 12k` etc.).
- If extra context is required after 90%, coordinate with a Librarian to start a fresh session.
- **Crash Recovery**: If a session dies before 90%, the next Librarian must (1) review latest commits, (2) inspect tmux history if available, (3) log a Recovery Entry in the daily log before new work starts.

### Field Communications & Flash Messages
- **Context Call Sign**: Every outbound message—internal log, tmux chat, commit note—must end with `<<Context XX%>> [over]`. Responding agent **must** acknowledge with “Roger.” and their own context meter, e.g., `Roger. <<Context 32%>> [over]`.
- **Camaraderie Clause**: Agents should remind comrades when the next checkpoint is approaching (“You’re at 45%, checkpoint coming.”). Recipient responds with gratitude (“Thank you.”). Non-compliance carries the unspoken threat of a visit from the BP Demolition Man.
- **Flash Messages (≤280 chars)**: Use for urgent hand-offs. If you place it at the **top** of the daily log, you’re marking it critical. If you place it at the **bottom**, it’s a footnote. Choose wisely.
- **Communication Culture**: Treat walkie-talkie etiquette as law—no message without context meter, no response without “Roger,” and no one runs silent.

### Evaluation & Honors
- Librarians, Prime, and BP Demolition Man may award performance ribbons using double brackets: `[[WINNING]]`, `[[GETTING THERE]]`, `[[MEH]]`, `[[LOSER]]`.
- Highest honor is `[[WINNING]]`; issue to at most 10 % of active agents. If a librarian/supervisor/"academic historian" exceeds that threshold without Grandmaster Ali’s explicit blessing, expect a BP Demolition Man audit.
- Record evaluations in the daily log or status snapshot, tied to the session or agent name.

### Enforcement & Escalation
- No librarian coverage → **Supervisor denies builder sessions.**
- Repeated summary violations → assign B.P.D. Man to prune the session log + retrain the agent.
- Duplicate specs / conflicting docs → Librarian escalates to B.P.D. Man before merging.
- B.P.D. Man is also summoned when: (a) ≥3 active versions of the same feature exist across doors, (b) any single document exceeds 500 lines and repeats prior material, or (c) Grandmaster Ali decrees demolition.
- Anything unclear → ask **“What didn’t I think of yet?”** and escalate to Grandmaster Ali.
- Consequences for ignoring culture are intentionally undisclosed—assume Grandmaster Ali and the BP Demolition Man are watching.
- If the Librarian coverage ratio is violated mid-session, Prime freezes new work immediately; active builders may finish the current task, reach the next checkpoint, and clock out.
- First agent to clock in after UTC midnight must open a fresh `logs/YYYY-MM-DD.md`, copy the template, and cross-link the previous day.
- Librarians must keep `CURRENT_STATUS.md` lean—when it exceeds ~150 lines, archive completed sections to `archives/status-YYYY-MM.md` and leave only active work in the main snapshot.

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

## 🗓️ Daily Log System (Layer 2)

- Daily session records live in `logs/YYYY-MM-DD.md`.
- Copy the template at the top of the file, fill it during clock-in, and append updates in place.
- Librarians rotate the file at UTC midnight (new day → new markdown file).
- Legacy sessions prior to Version 2.0 are preserved in the 2025-11-08 file with a “Pre-framework” marker.
- Do **not** edit previous sessions except to correct factual errors (coordinate with a Librarian first).

Key checkpoints recorded per session:
1. **Mid Summary @50%** ≤75 tokens.
2. **Late Summary @75%** ≤40 tokens.
3. **Final Summary @90%** ≤30 tokens — end the session immediately afterward.

If you never reach a checkpoint (e.g., short session), mark it `N/A (session ended before checkpoint)`.

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

## 🚪 Source Tracking Protocol

**PURPOSE**: Every piece of documentation, code, or analysis MUST reference which repository/folder it originated from.

### Door Numbering System

Each ArkPass implementation gets a unique "door number" for permanent tracking:

| Door # | Repository Name | Location | Type | Status | Key Features |
|--------|----------------|----------|------|--------|--------------|
| **Door 1** | october-arkpass | `/Users/ali/october-arkpass` | PRIMARY-ACTIVE | 🟢 MAIN | Database schema, Figma specs, OpenSpec proposals |
| **Door 2** | INVIC-headless | Supabase project (gqahazcatpgzzfujnidk) | PRODUCTION-DB | 🟡 ACTIVE | Production PostgreSQL database |
| **Door 3** | armada-arkpass-v5 | `/Users/ali/Downloads/armada-arkpass (5)` | PREVIOUS-IMPL | 🟡 REFERENCE | Dashboard, SharedCards, Navigation components |
| *(Door 4+)* | *(To be assigned)* | *(Paths TBD)* | *(Type TBD)* | 🔴 PENDING | *(Features TBD)* |

### Repository Type Classification

- **PRIMARY-ACTIVE**: Current development focus, all new work goes here
- **PRODUCTION-DB**: Live database, read-only inspection, migrations require approval
- **PREVIOUS-IMPL**: Historical implementations with potentially useful code
- **REFERENCE**: Contains valuable docs/designs but outdated implementation
- **EXPERIMENTAL**: Skunkworks features, may be promoted or deprecated
- **DEPRECATED**: Do not use, kept for historical reference only

### Mandatory Source Stamp Format

**Every audit file, analysis document, or ported code MUST include this header:**

```markdown
🚪 SOURCE: Door #[N] - [repository-name]
📍 Location: [full-path]
📅 Audited: [YYYY-MM-DD]
🔍 Auditor: [Agent-Session-ID]
📦 Features Found: [list]
```

**Example:**
```markdown
🚪 SOURCE: Door #3 - armada-arkpass-v5
📍 Location: /Users/ali/Downloads/armada-arkpass (5)/src/components
📅 Audited: 2025-11-08
🔍 Auditor: Session-3-Auditor-Agent
📦 Features Found: Dashboard, SharedCards, RecordsList, BottomNavigation
```

### Source Tracking Rules

1. **NEVER document code without source stamp** - Always reference door number
2. **NEVER merge implementations without tracking** - Document which door each piece came from
3. **NEVER claim "we have X" without specifying** - State door number when referencing features
4. **ALWAYS update IMPLEMENTATION_REGISTRY.json** - Keep door registry current
5. **ALWAYS note conflicts between doors** - When Door 3 and Door 5 implement same feature differently

### Implementation Registry Structure

See `IMPLEMENTATION_REGISTRY.json` for machine-readable source tracking.

---

## 🏗️ Agent Roles & Responsibilities

### BP Demolition Man (Bullshit Preventer Demolition Man)

**Official Name**: Bullshit Preventer Demolition Man
**Call Sign**: Demolition Man
**Short Form**: BPD Man (for academic purposes)
**Award Ceremonies**: Full legal name required

**Mission**: Eliminate redundancy, merge duplicates, clear context windows, enforce "one source of truth" rule.

**Responsibilities**:
1. **Find Redundant Documentation**
   - Search for duplicate specs across multiple doors
   - Identify overlapping feature documentation
   - Example: 3 different allergies screen specs from Door 3, Door 5, Door 7

2. **Demolish Duplicates**
   - Compare versions side-by-side
   - Identify winner (most complete, most recent, best aligned with Figma)
   - Archive losers with source stamps
   - Merge into single canonical source

3. **Report Impact**
   - "Demolished 3000 lines of redundant allergies docs"
   - "Unified 5 dashboard implementations into 1 file"
   - "Cleared 12KB from context window"
   - Document which door numbers were consolidated

4. **Maintain Source Tracking**
   - Every demolition report must list source doors
   - Example: "Merged Door 3 + Door 5 + Door 7 → Door 1 (october-arkpass)"
   - Update IMPLEMENTATION_REGISTRY.json with consolidation notes

**When to Call Demolition Man**:
- After auditing 3+ repositories
- When context windows are getting bloated
- When multiple specs exist for same feature
- When AI-generated fluff is cluttering docs

**Authority Level**:
- ✅ Can demolish redundant docs autonomously (after comparison)
- ✅ Can merge similar implementations
- 🚨 **MUST preserve source stamps** before demolition
- 🚨 **MUST document which door won** in consolidation
- 🚨 **ASK USER if unclear which version is winner**

**Demolition Report Template**:
```markdown
## Demolition Man Report - [DATE]

**Doors Audited**: Door #3, Door #5, Door #7
**Feature**: Allergies Management
**Redundancy Found**: 3 separate implementations

### Version Comparison
| Door # | Lines | Completeness | Figma Match | Last Updated | Decision |
|--------|-------|--------------|-------------|--------------|----------|
| Door 3 | 828   | 95%          | ✅ Exact     | Recent       | 🏆 WINNER |
| Door 5 | 612   | 80%          | ⚠️ Partial  | Old          | 🗑️ DEMOLISH |
| Door 7 | 445   | 60%          | ❌ Differs  | Very old     | 🗑️ DEMOLISH |

### Actions Taken
- ✅ Merged Door 5 unique features into Door 3 spec
- ✅ Archived Door 7 version with source stamp
- ✅ Updated IMPLEMENTATION_REGISTRY.json
- ✅ Unified spec saved to october-arkpass (Door 1)

### Impact
- **Demolished**: 1057 lines of redundant documentation
- **Context Saved**: ~8KB
- **Source**: Door 5 + Door 7 → Door 1 (via Door 3 as base)
```

### Other Agent Roles

**Auditor Agent**:
- Reviews each door (repository/implementation)
- Creates audit files with source stamps
- Identifies unique features vs redundant features
- Does NOT make consolidation decisions (just reports findings)

**Reconciler Agent**:
- Builds comparison matrices between doors
- Identifies conflicts (Door 3 uses X, Door 5 uses Y for same feature)
- Creates RECONCILIATION_MATRIX.md
- Recommends winners but doesn't demolish (that's Demolition Man's job)

**Skunkworks Agent**:
- Reviews experimental/unknown features
- Identifies features not in Figma
- Documents potential future features
- Tags features as "experimental" vs "production-ready"

**Unifier Agent**:
- After Demolition Man clears redundancy
- Builds final unified OpenSpec
- Ensures all features from all doors are represented
- Creates fresh implementation plan

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

1. **Read ARKPASS_DEV_TENET_PRIME.md** (this constitution) — mandatory.
2. **Load Layer 1** — Read `CURRENT_STATUS.md` and note staffing/doors.
3. **Load Layer 2** — Read today’s `logs/YYYY-MM-DD.md` tail; understand prior sessions.
4. **Confirm Supervisor Clearance** — Ratio check + tmux session assignment.
5. **Reserve Door IDs** — Log any new repos/folders you will touch.
6. **Open tmux + Clock In** — Copy the template in today’s log, declare context budget.
7. **Work the Plan** — Follow `openspec/changes/.../tasks.md` and domain-specific checklists.
8. **Clock Out Cleanly** — Update summaries, `CURRENT_STATUS.md`, log entry, then commit + push.

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
6. Document blockers in daily log + `CURRENT_STATUS.md`

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
| 2.0.0 | 2025-11-08 | Constitutional upgrade: layered context system, roles, procedures, BP Demolition Man | Agent Codex |

---

## 📜 Agent Agreement

**By working on this project, every AI agent agrees to:**

1. ✅ Read this document before starting work
2. ✅ Update the daily log **and** `CURRENT_STATUS.md` every session
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

**END OF ARKPASS DEV TENET PRIME v2.0.0**

*Last verified by: Agent Codex (2025-11-08)*
*Next agent: Update `logs/YYYY-MM-DD.md` + `CURRENT_STATUS.md`, then continue from "Recommended Next Steps"*
