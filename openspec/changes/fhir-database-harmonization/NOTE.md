# Note: Foundational Database Change

This change does not include delta specs because it is a **foundational database migration** that creates the schema required by all 11 OpenSpec specifications.

## Why No Deltas?

- **No existing specs to modify**: This is the initial database schema creation
- **No capability changes**: This change implements the database layer for capabilities already documented in:
  - `openspec/specs/medications/spec.md`
  - `openspec/specs/allergies/spec.md`
  - `openspec/specs/conditions/spec.md`
  - `openspec/specs/surgeries/spec.md`
  - `openspec/specs/supplements/spec.md`
  - `openspec/specs/immunizations/spec.md`
  - `openspec/specs/my-documents/spec.md`
  - `openspec/specs/personal-information/spec.md`
  - `openspec/specs/social-history/spec.md`
  - `openspec/specs/family-history/spec.md`
  - `openspec/specs/ui-patterns/spec.md`

## What This Change Accomplishes

1. **Database Schema**: Implements the "Data Model" sections from all 11 specs
2. **FHIR Harmonization**: Establishes export-time mapping strategy (ArkPass schema PRIMARY)
3. **Production Migration**: Extends existing 2 tables, creates 21 new tables
4. **Patient Safety**: Implements EpiPen tracking, severity classification, soft delete

## Implementation Status

- [x] **Proposal**: Documented in `proposal.md`
- [x] **Tasks**: Detailed checklist in `tasks.md`
- [x] **Migration Scripts**: `FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql` (root directory)
- [x] **Schema Analysis**: `SCHEMA_COMPARISON.md` (root directory)
- [x] **Strategy Log**: `MIGRATION_ADJUSTMENTS_LOG.md` (root directory)

## Next Steps

After database migration is executed and tested:
1. Archive this change to `openspec/changes/archive/YYYY-MM-DD-fhir-database-harmonization/`
2. Database schema is now baseline for all future changes
3. Future feature enhancements will use delta specs to modify the established baseline

## Validation Status

**Specs Validation**: ✅ PASS (11/11 specs validated successfully)
- All 10 feature specs include complete database schemas
- UI patterns spec documented
- All requirements include scenario blocks

**Change Validation**: ⚠️ SKIP (foundational change, no deltas expected)

This is an **infrastructure change** that enables the capabilities defined in the OpenSpec specifications, not a capability change itself.
