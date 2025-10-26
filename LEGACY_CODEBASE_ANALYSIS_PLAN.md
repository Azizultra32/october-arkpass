# Legacy Codebase Analysis Plan

**Date**: 2025-10-25
**Purpose**: Systematically analyze 9 legacy ArkPass attempts to extract useful patterns, schema decisions, and lessons learned
**Priority**: MEDIUM (after schema validation, before implementation)

---

## Overview

We have **9 legacy codebases** representing different attempts at building ArkPass. Each contains valuable insights:
- Database schema decisions
- Component architectures
- Figma extraction workflows
- Implementation roadmaps
- Lessons learned from previous attempts

**Goal**: Don't repeat mistakes, reuse what works, understand why previous attempts were abandoned.

---

## Inventory of Legacy Codebases

From system reminder message, we have detailed descriptions:

### 1. **armada-health-app** (Production-Style)
**Location**: `/Users/ali/Downloads/armada-health-app`
**Tmux Session**: `downloads-armada-health-app`

**Description**: Production-style Vite/React app with rich component tree

**Key Artifacts**:
- `src/components/` - Rich component tree
- `ARKPASS_IMPLEMENTATION_PLAN.md` - Implementation roadmap
- `IMPLEMENTATION_ROADMAP.md` - Planning docs
- `scripts/fetch-figma-designs.js` - Figma data pull automation
- TMUX helper scripts

**Analysis Priority**: 🔴 HIGH
**Why**: Production-style code, established component patterns, working Figma automation

**Questions to Answer**:
- What component patterns did they use?
- How did Figma integration work?
- What's in the implementation plans (phasing, priorities)?
- Why was this version abandoned/replaced?

---

### 2. **ARKPASS-2-FIGMA-VSCODE** (Automation Toolkit)
**Location**: `/Users/ali/Downloads/ARKPASS-2-FIGMA-VSCODE`
**Tmux Session**: `downloads-arkpass-2-figma`

**Description**: Automation toolkit for full Figma extraction workflow

**Key Artifacts**:
- MCP configs
- Docker setup
- `figma-pipeline.config.json` - Extraction pipeline
- Design-system tokens
- Component specs
- Architecture/roadmap docs
- Logic datasets

**Analysis Priority**: 🔴 HIGH
**Why**: This is about AUTOMATION - could save us massive time on Figma→Code workflow

**Questions to Answer**:
- How does the Figma pipeline work?
- What's the MCP integration?
- Can we reuse the automation for our current extraction?
- What design tokens were extracted?
- What went wrong with this approach?

---

### 3. **arkpass-manus** (Hybrid Analysis Hub)
**Location**: `/Users/ali/Downloads/arkpass-manus`
**Tmux Session**: `downloads-arkpass-manus`

**Description**: Hybrid Next.js/TypeScript workspace with extensive reports

**Key Artifacts**:
- Analytical reports
- MCP automation scripts
- `generated/` inventories
- Multiple implementation planning documents
- Blockchain/permission experiments

**Analysis Priority**: 🟡 MEDIUM
**Why**: Analytical approach, reports may contain insights, blockchain experiments interesting but likely out of scope

**Questions to Answer**:
- What analyses were done?
- What's in the generated inventories?
- Why blockchain/permission experiments?
- What conclusions were reached?

---

### 4. **ARMADA-EXTRACT** (Extraction-Focused)
**Location**: `/Users/ali/Downloads/ARMADA-EXTRACT`
**Tmux Session**: `downloads-armada-extract`

**Description**: Extraction-focused React project with multiple MCP variants

**Key Artifacts**:
- Multiple MCP server variants
- SQL migration helpers
- UI demos
- Exhaustive documentation on extraction improvements and architecture
- Supabase schema migrations
- Shadcn-based UI components

**Analysis Priority**: 🔴 HIGH
**Why**: Has Supabase migrations + Shadcn components (our target stack)

**Questions to Answer**:
- What Supabase migrations exist?
- How do they compare to our FHIR_SCHEMA_MIGRATIONS.sql?
- What Shadcn components were built?
- What extraction improvements were documented?
- What worked/failed in MCP variants?

---

### 5. **armada-arkpass-project** (Monorepo)
**Location**: `/Users/ali/armada-arkpass-project`
**Tmux Session**: NOT LISTED (need to create)

**Description**: Substantial monorepo with Next-style web + backend

**Key Artifacts**:
- `armadamd-web/` - Next.js frontend
- `backend/` folder - Backend code
- Exhaustive research reports
- Scripts for Figma extraction
- Detailed analysis directories

**Analysis Priority**: 🟡 MEDIUM-HIGH
**Why**: Full-stack monorepo, research reports may contain gold

**Questions to Answer**:
- What backend architecture was used?
- What's the API structure?
- What's in the research reports?
- How was Next.js configured?
- What Figma extraction scripts exist?

---

### 6. **ARKPASS-CLASSIC** (Archival)
**Location**: `/Users/ali/ARKPASS-CLASSIC`
**Tmux Session**: `arkpass-classic`

**Description**: Minimal archival folder

**Key Artifacts**:
- `AGENTS.md`
- `CLAUDE.md`

**Analysis Priority**: ⚪ LOW
**Why**: Minimal content, likely early notes or context docs

**Questions to Answer**:
- What's in AGENTS.md? (OpenSpec agents?)
- What's in CLAUDE.md? (Instructions for Claude?)
- Any historical context worth preserving?

---

### 7. **arkpass-attemtpt** (Early Scaffold)
**Location**: `/Users/ali/arkpass-attemtpt`
**Tmux Session**: `arkpass-attemtpt`

**Description**: Early CRA scaffold with standard React boilerplate

**Key Artifacts**:
- `my-react-app/` - Create React App boilerplate
- `CLAUDE.md`

**Analysis Priority**: ⚪ LOW
**Why**: Appears to be abandoned early attempt, minimal custom code

**Questions to Answer**:
- Was anything built beyond boilerplate?
- What's in CLAUDE.md?
- Why abandoned so early?

---

### 8. **ARKPASS-2-FIGMA-VSCODE** (Root Copy)
**Location**: `/Users/ali/ARKPASS-2-FIGMA-VSCODE`
**Tmux Session**: `arkpass-2-figma-vscode`

**Description**: Leaner automation scripts, mirrors Downloads version

**Key Artifacts**:
- Extractor JS files
- Setup instructions
- (No node_modules - cleaner version)

**Analysis Priority**: 🟡 MEDIUM
**Why**: Lighter version of #2, may be easier to analyze

**Questions to Answer**:
- How does this differ from Downloads version?
- Which version is more recent?
- Are setup instructions complete?

---

### 9. **arkpass test anima** (Anima Export)
**Location**: `/Users/ali/arkpass test anima`
**Tmux Session**: `arkpass-test-anima`

**Description**: Anima-generated Vite project for medication screens

**Key Artifacts**:
- `AnimaPackage-React-b589u/`
- Component/storybook structure
- Medication screen components

**Analysis Priority**: ⚪ LOW-MEDIUM
**Why**: Anima auto-generation may not align with our manual extraction approach, but medication screens could have useful patterns

**Questions to Answer**:
- Quality of Anima-generated code?
- Are medication screen components reusable?
- Why was Anima approach abandoned?

---

## Analysis Methodology

### Phase 1: Quick Scan (2-3 hours)

For each codebase:
1. **Skim README/docs** - Get overview
2. **Check package.json** - Tech stack, dependencies
3. **Scan directory structure** - Architecture patterns
4. **Read planning docs** - IMPLEMENTATION_PLAN, ROADMAP, etc.
5. **Note key findings** - 3-5 bullet points per codebase

**Deliverable**: Quick scan summary document

---

### Phase 2: Deep Dive (High-Priority Codebases)

Focus on **#1 (armada-health-app)**, **#2 (ARKPASS-2-FIGMA-VSCODE)**, **#4 (ARMADA-EXTRACT)**

For each:
1. **Component Analysis**:
   - Catalog reusable components
   - Document component patterns
   - Extract Shadcn/UI configurations

2. **Schema Analysis**:
   - Extract database schemas
   - Compare with our FHIR_HARMONIZATION_MAP
   - Identify conflicts/alignments
   - Document migrations (especially ARMADA-EXTRACT)

3. **Figma Integration Analysis**:
   - Document automation workflows
   - Extract Figma API usage patterns
   - Understand pipeline configurations
   - Assess reusability for our project

4. **Implementation Plan Review**:
   - Extract phasing strategies
   - Identify priorities (what was deemed critical)
   - Learn from decisions (what was deferred, why)
   - Check for lessons learned sections

**Deliverable**: Deep dive report for each high-priority codebase

---

### Phase 3: Cross-Codebase Synthesis

After individual analysis:
1. **Compare schemas** - Which is closest to FHIR standard?
2. **Identify best component patterns** - Which codebase has cleanest components?
3. **Extract automation gems** - Best Figma→Code workflow
4. **Compile lessons learned** - Why were attempts abandoned?
5. **Recommendation matrix** - What to adopt from each

**Deliverable**: Synthesis report with actionable recommendations

---

## Analysis Template

For each codebase, fill out:

```markdown
## Codebase: [Name]

**Location**: [Path]
**Tech Stack**: [React/Next/Vite/etc., TypeScript?, UI lib?]
**Last Modified**: [Check git log or file timestamps]

### Overview
[2-3 sentence summary]

### Key Findings

#### 1. Architecture
- Component structure: [pattern used]
- State management: [Redux/Context/Zustand/etc.]
- Routing: [React Router/Next router/etc.]
- API layer: [REST/GraphQL/tRPC/etc.]

#### 2. Database/Schema
- Schema files found: [list]
- Tables documented: [count and key tables]
- FHIR alignment: [yes/no/partial]
- Conflicts with our schema: [list]
- Useful migrations: [list]

#### 3. Figma Integration
- Automation level: [none/partial/full]
- Tools used: [Anima/custom scripts/MCP/etc.]
- Reusability: [high/medium/low]
- Key scripts: [list file paths]

#### 4. Components
- UI library: [MUI/Shadcn/custom/etc.]
- Reusable components: [list top 5-10]
- Quality assessment: [production-ready/prototype/boilerplate]
- Alignment with our needs: [high/medium/low]

#### 5. Documentation
- Implementation plans: [found/not found]
- API docs: [found/not found]
- Lessons learned: [found/not found]
- Quality: [excellent/good/minimal]

### Recommendations

**Adopt**:
- [Things we should use from this codebase]

**Avoid**:
- [Things that didn't work, should not repeat]

**Investigate Further**:
- [Things that need deeper analysis]

### Questions Raised
1. [Question]
2. [Question]
```

---

## Priority Order for Analysis

### Immediate (This Week)
1. **ARMADA-EXTRACT** - Schema migrations + Shadcn components
2. **armada-health-app** - Production patterns + Figma scripts

### Next Week
3. **ARKPASS-2-FIGMA-VSCODE** - Automation pipeline
4. **armada-arkpass-project** - Full-stack architecture
5. **arkpass-manus** - Analytical reports

### Optional (If Time Permits)
6. **arkpass test anima** - Anima medication screens
7. **ARKPASS-2-FIGMA-VSCODE (root)** - Compare with Downloads version
8. **ARKPASS-CLASSIC** - Historical context
9. **arkpass-attemtpt** - Early attempt notes

---

## Tool Usage

### For Analysis

```bash
# Navigate to codebase
tmux attach -t downloads-armada-health-app

# Quick structure overview
tree -L 3 -I 'node_modules|.git' > structure.txt

# Find key files
find . -name "*.schema.sql" -o -name "*migration*" -o -name "IMPLEMENTATION*"

# Check git history (if available)
git log --oneline --all --graph --decorate | head -20

# Count components
find src/components -name "*.tsx" -o -name "*.jsx" | wc -l

# Search for FHIR references
grep -r "FHIR\|fhir" --include="*.ts" --include="*.tsx" --include="*.md"

# Check package.json for stack
cat package.json | jq '.dependencies'
```

---

## Success Criteria

Analysis is complete when we can answer:

1. ✅ **Schema Question**: Which legacy schema is closest to FHIR standard?
2. ✅ **Component Question**: Which component library/patterns should we adopt?
3. ✅ **Automation Question**: Can we reuse any Figma→Code automation?
4. ✅ **Implementation Question**: What phasing strategy worked best in previous attempts?
5. ✅ **Failure Question**: Why were previous attempts abandoned? (Avoid same mistakes)

---

## Deliverables

1. **LEGACY_ANALYSIS_QUICK_SCAN.md** - Phase 1 summary (all 9 codebases)
2. **LEGACY_ANALYSIS_ARMADA_EXTRACT.md** - Deep dive #1
3. **LEGACY_ANALYSIS_ARMADA_HEALTH_APP.md** - Deep dive #2
4. **LEGACY_ANALYSIS_FIGMA_VSCODE.md** - Deep dive #3
5. **LEGACY_ANALYSIS_SYNTHESIS.md** - Cross-codebase recommendations

---

## Timeline Estimate

- **Phase 1 (Quick Scan)**: 2-3 hours (all 9 codebases)
- **Phase 2 (Deep Dive)**: 4-6 hours (3 high-priority codebases)
- **Phase 3 (Synthesis)**: 2-3 hours
- **Total**: 8-12 hours

---

## Next Steps

1. Start with ARMADA-EXTRACT (highest priority - Supabase migrations)
2. Document findings in real-time
3. Flag blocking issues immediately
4. Update DOCUMENTATION_INDEX.md with findings
5. Use insights to refine FHIR_SCHEMA_MIGRATIONS.sql

---

**Document Status**: Plan - Ready to Execute
**Dependencies**: None (can run in parallel with schema validation)
**Owner**: Development Team
