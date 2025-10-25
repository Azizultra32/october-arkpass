# OpenSpec Implementation Guide - Conditions Management

## Quick Start

You now have a complete OpenSpec change proposal for implementing the Conditions Management feature! Here's what was created:

### ✅ What's Ready

1. **Figma Specs Extracted** ([CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md))
   - 7 screen specifications with pixel-perfect details
   - Complete design system documentation
   - Typography, colors, spacing, components
   - Extracted via Figma MCP Server

2. **OpenSpec Change Proposal** ([openspec/changes/add-conditions-management/](openspec/changes/add-conditions-management/))
   - **proposal.md** - Why we're building this, what changes, and impact
   - **tasks.md** - 100+ implementation tasks organized in 11 sections
   - **design.md** - Technical architecture, decisions, risks, and migration plan
   - **specs/patient-health-records/spec.md** - 14 formal requirements with 60+ scenarios

3. **Validation** - ✅ Passed strict validation
   ```bash
   openspec validate add-conditions-management --strict
   # Result: Change 'add-conditions-management' is valid
   ```

---

## Next Steps

### Step 1: Review & Approve the Proposal
Read through the change proposal:
```bash
openspec show add-conditions-management
```

Or view individual files:
- [proposal.md](openspec/changes/add-conditions-management/proposal.md) - Executive summary
- [design.md](openspec/changes/add-conditions-management/design.md) - Technical decisions
- [tasks.md](openspec/changes/add-conditions-management/tasks.md) - Implementation checklist
- [spec.md](openspec/changes/add-conditions-management/specs/patient-health-records/spec.md) - Formal requirements

### Step 2: Fill Out Project Context
Update [openspec/project.md](openspec/project.md) with your project details:
- Tech stack (React Native? Flutter? React PWA?)
- Styling approach (Tailwind? CSS-in-JS? Styled Components?)
- API framework (REST? GraphQL? tRPC?)
- Testing strategy (Jest? Playwright? Cypress?)
- Git workflow

### Step 3: Resolve Open Questions
The [design.md](openspec/changes/add-conditions-management/design.md) file has 6 open questions that need answers:
- **Q1**: Authentication and user context
- **Q2**: API framework and conventions
- **Q3**: Testing framework
- **Q4**: Medication and Document entity schemas
- **Q5**: Deployment strategy
- **Q6**: Internationalization requirements

### Step 4: Start Implementation
Once approved, follow the [tasks.md](openspec/changes/add-conditions-management/tasks.md) checklist:

```bash
# View tasks
cat openspec/changes/add-conditions-management/tasks.md

# As you complete tasks, check them off:
# - [ ] 1.1 Create Condition entity
# becomes
# - [x] 1.1 Create Condition entity
```

Implementation is organized in 11 phases:
1. Data Model & Backend (8 tasks)
2. Mobile UI Components (7 tasks)
3. Conditions List Screen (9 tasks)
4. View Condition Screen (10 tasks)
5. Add Condition Screen (14 tasks)
6. Edit Condition Screen (14 tasks)
7. Styling & Design System (8 tasks)
8. Navigation & Routing (6 tasks)
9. Icon Assets (5 tasks)
10. Integration & Testing (15 tasks)
11. Documentation (4 tasks)

### Step 5: Archive When Complete
After deploying, archive the change:

```bash
# Create the base spec from the delta
openspec archive add-conditions-management

# This will:
# 1. Move changes/add-conditions-management/ to changes/archive/2025-10-24-add-conditions-management/
# 2. Create specs/patient-health-records/spec.md with all requirements
```

---

## OpenSpec Commands Reference

```bash
# List all changes
openspec list

# List all specs
openspec list --specs

# Show change details
openspec show add-conditions-management

# Show specific spec
openspec show patient-health-records --type spec

# View differences
openspec diff add-conditions-management

# Validate
openspec validate add-conditions-management --strict

# Archive when done
openspec archive add-conditions-management
```

---

## File Structure

```
october-arkpass/
├── CONDITIONS_SCREENS_SPECS.md          # Figma specs (7 screens)
├── README-OPENSPEC.md                   # This file
└── openspec/
    ├── AGENTS.md                        # OpenSpec workflow guide
    ├── project.md                       # Project conventions (TODO: fill out)
    └── changes/
        └── add-conditions-management/
            ├── proposal.md              # Why & what (1.7KB)
            ├── tasks.md                 # 100+ tasks (6KB)
            ├── design.md                # Architecture (10KB)
            └── specs/
                └── patient-health-records/
                    └── spec.md          # 14 requirements, 60+ scenarios
```

---

## Requirements Summary

### 14 Requirements Defined

1. **Condition Data Model** - Entity structure with type/subtype
2. **Conditions List View** - Organized display (Chronic/Transient)
3. **Quick Add Functionality** - Rapid entry workflow
4. **Detailed Add Functionality** - Full form with all fields
5. **View Condition Details** - Read-only display with expand/collapse
6. **Edit Condition** - Update all fields and manage associations
7. **Delete Condition** - Removal with confirmation
8. **Condition Type Classification** - Chronic vs Transient taxonomy
9. **Mobile-First Responsive Design** - 390px viewport, design system
10. **Expandable Detail Sections** - Show more/less toggles
11. **Form Validation** - Required fields, error handling
12. **Empty State Display** - Consistent messaging
13. **Navigation Integration** - Dashboard integration, back navigation
14. **Association Management** - Link to medications and documents

Each requirement has 3-7 scenarios (60+ total) covering:
- Success cases
- Error handling
- Edge cases
- State transitions

---

## Key Technical Decisions (from design.md)

### ✅ Confirmed
- **Mobile-first**: 390px viewport, per Figma specs
- **Two-tier taxonomy**: Chronic vs Transient (Recurrent/Resolved)
- **Dual workflow**: Quick add + detailed add
- **Associations**: Separate entities, not nested
- **Expandable sections**: Show more/less for additional fields
- **Validation**: Client-side for UX, server-side for authority

### ⚠️ To Be Decided
- Styling framework (Tailwind? CSS-in-JS? Styled Components?)
- API framework (REST? GraphQL? tRPC?)
- Testing framework (Jest? Playwright? Cypress?)
- Mobile platform (React Native? Flutter? PWA?)

---

## Integration with Figma MCP

The Figma MCP server successfully extracted:
- ✅ Complete component hierarchy for 7 screens
- ✅ React + Tailwind code (convert to your stack)
- ✅ Design tokens (colors, typography, spacing)
- ✅ Icon asset references (localhost:3845/assets/*.svg)
- ✅ Data attributes with Figma node IDs for traceability

---

## Questions or Issues?

1. **Review the workflow**: Read [openspec/AGENTS.md](openspec/AGENTS.md)
2. **Check validation**: `openspec validate add-conditions-management --strict`
3. **View change details**: `openspec show add-conditions-management --json`
4. **Update project context**: Edit [openspec/project.md](openspec/project.md)

---

**Status**: ✅ Ready for Review & Approval

Once approved, start with tasks.md Section 1 (Data Model & Backend) or Section 2 (Mobile UI Components).
