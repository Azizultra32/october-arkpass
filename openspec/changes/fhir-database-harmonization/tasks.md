# Implementation Tasks

## 1. Database Migration

- [x] 1.1 Extract production Supabase schema (completed)
- [x] 1.2 Compare production vs ARKPASS 6 reference (completed - SCHEMA_COMPARISON.md)
- [x] 1.3 Create production-specific migration script (completed - FHIR_SCHEMA_MIGRATIONS_PRODUCTION.sql)
- [x] 1.4 Test migration in dev Supabase project
- [x] 1.5 Validate all 23 tables created successfully
- [x] 1.6 Verify RLS policies active
- [x] 1.7 Test one record creation per table
- [ ] 1.8 Backup production database
- [ ] 1.9 Execute migration in production
- [ ] 1.10 Verify production migration success

## 2. Database Functions

- [x] 2.1 Create `compute_date_from_age()` function
- [x] 2.2 Create `update_updated_at_column()` trigger function
- [x] 2.3 Create display column update triggers for all dual-mode date fields
- [x] 2.4 Test dual-mode date conversion (Date mode)
- [x] 2.5 Test dual-mode date conversion (Age mode)
- [x] 2.6 Test display column generation (patient view format)
- [x] 2.7 Test display column generation (provider view format)

## 3. Row-Level Security (RLS)

- [x] 3.1 Create RLS policies for medications table
- [x] 3.2 Create RLS policies for allergies table
- [x] 3.3 Create RLS policies for conditions table
- [x] 3.4 Create RLS policies for surgeries table
- [x] 3.5 Create RLS policies for supplements table
- [x] 3.6 Create RLS policies for immunizations tables
- [x] 3.7 Create RLS policies for documents table
- [x] 3.8 Create RLS policies for personal_information table
- [x] 3.9 Create RLS policies for social_history table
- [x] 3.10 Create RLS policies for family_history table
- [x] 3.11 Create RLS policies for all junction tables
- [x] 3.12 Create RLS policies for user_profiles table
- [x] 3.13 Test RLS: Patient can access own data
- [x] 3.14 Test RLS: Patient cannot access other patient data

## 4. Backend API Endpoints

- [ ] 4.1 Create Medications API (CRUD + Quick Add)
- [ ] 4.2 Create Allergies API (CRUD + Quick Add)
- [ ] 4.3 Create Conditions API (CRUD, type-specific validation)
- [ ] 4.4 Create Surgeries API (CRUD)
- [ ] 4.5 Create Supplements API (CRUD + Quick Add)
- [ ] 4.6 Create Immunizations API (CRUD + dose management)
- [ ] 4.7 Create Documents API (CRUD + folder management)
- [ ] 4.8 Create Personal Information API (single record, field-level editing)
- [ ] 4.9 Create Social History API (CRUD + conditional fields)
- [ ] 4.10 Create Family History API (CRUD)
- [ ] 4.11 Create association APIs (link documents to PHR records)

## 5. FHIR Export Logic

- [ ] 5.1 Implement FHIR MedicationStatement mapper (medications)
- [ ] 5.2 Implement FHIR AllergyIntolerance mapper (allergies)
- [ ] 5.3 Implement FHIR Condition mapper (conditions)
- [ ] 5.4 Implement FHIR Procedure mapper (surgeries)
- [ ] 5.5 Implement FHIR MedicationStatement mapper (supplements with category)
- [ ] 5.6 Implement FHIR Immunization mapper
- [ ] 5.7 Implement FHIR Patient mapper (personal information)
- [ ] 5.8 Implement custom FHIR extensions (EpiPen, privacy flags, etc.)
- [ ] 5.9 Test "Share Health Record" export with sample data
- [ ] 5.10 Validate FHIR output against R4 schema

## 6. Frontend Components

- [ ] 6.1 Create Dual-Mode Date Input component
- [ ] 6.2 Create Quick Add Input component
- [ ] 6.3 Create Repeatable Entry component (immunizations doses)
- [ ] 6.4 Create Progressive Disclosure component (Show more/Show less)
- [ ] 6.5 Create Multi-Select component (allergy symptoms, drug types)
- [ ] 6.6 Create Conditional UI component (social history)
- [ ] 6.7 Create Field-Level Editing component (personal information)
- [ ] 6.8 Create Document Association component (+ icon workflow)
- [ ] 6.9 Test all components in isolation (Storybook)
- [ ] 6.10 Test component integration in feature screens

## 7. Feature Implementation

- [ ] 7.1 Implement Medications feature (8 screens)
- [ ] 7.2 Implement Allergies feature (7 screens)
- [ ] 7.3 Implement Conditions feature (7 screens)
- [ ] 7.4 Implement Surgeries feature (9 screens)
- [ ] 7.5 Implement Supplements feature (7 screens)
- [ ] 7.6 Implement Immunizations feature (6 screens)
- [ ] 7.7 Implement My Documents feature (6 screens)
- [ ] 7.8 Implement Personal Information feature (15 screens)
- [ ] 7.9 Implement Social History feature (8 screens)
- [ ] 7.10 Implement Family History feature (3 screens)

## 8. Validation & Testing

- [ ] 8.1 Unit tests: Dual-mode date conversion
- [ ] 8.2 Unit tests: FHIR mappers
- [ ] 8.3 Unit tests: Quick Add validation
- [ ] 8.4 Unit tests: Progressive disclosure logic
- [ ] 8.5 Integration tests: Medication CRUD
- [ ] 8.6 Integration tests: Allergy CRUD + EpiPen validation
- [ ] 8.7 Integration tests: Condition CRUD + type-specific fields
- [ ] 8.8 Integration tests: Document associations
- [ ] 8.9 Integration tests: "Share Health Record" export
- [ ] 8.10 E2E tests: Complete user workflows for all 10 features
- [ ] 8.11 Accessibility tests: Keyboard navigation, screen reader
- [ ] 8.12 Performance tests: List queries <10ms, export <500ms

## 9. Data Migration (Existing Records)

- [ ] 9.1 Migrate existing medications records (rename columns)
- [ ] 9.2 Migrate existing conditions records (rename columns)
- [ ] 9.3 Backfill created_via='import' for pre-existing records
- [ ] 9.4 Verify no data loss during migration

## 10. Documentation

- [x] 10.1 Document production schema state (SCHEMA_COMPARISON.md)
- [x] 10.2 Document migration strategy (MIGRATION_ADJUSTMENTS_LOG.md)
- [x] 10.3 Document FHIR harmonization philosophy (FHIR_HARMONIZATION_MAP.md)
- [x] 10.4 Create stakeholder summary (EXECUTIVE_SUMMARY.md)
- [x] 10.5 Convert all 10 features to OpenSpec format
- [x] 10.6 Convert all 6 UI patterns to OpenSpec format
- [ ] 10.7 Update API documentation with new endpoints
- [ ] 10.8 Update FHIR export documentation
- [ ] 10.9 Create migration runbook for operations team

## 11. Deployment

- [ ] 11.1 Deploy database migration to production
- [ ] 11.2 Deploy backend API changes
- [ ] 11.3 Deploy frontend changes
- [ ] 11.4 Enable features for beta users
- [ ] 11.5 Monitor error rates and performance
- [ ] 11.6 Enable features for all users
- [ ] 11.7 Monitor "Share Health Record" FHIR exports

## 12. Post-Deployment Validation

- [ ] 12.1 Verify all 23 tables accessible
- [ ] 12.2 Verify RLS policies enforced
- [ ] 12.3 Create sample patient record with all 10 features populated
- [ ] 12.4 Export sample record as FHIR, validate with HL7 validator
- [ ] 12.5 Monitor database query performance (no regressions)
- [ ] 12.6 Monitor user-reported issues (first 48 hours)
- [ ] 12.7 Conduct stakeholder demo with production data
