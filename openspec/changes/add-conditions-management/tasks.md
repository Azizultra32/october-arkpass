# Implementation Tasks

## 1. Data Model & Backend
- [ ] 1.1 Create Condition entity/model with fields: id, name, type, subtype, diagnosisDate, details, createdAt, updatedAt
- [ ] 1.2 Define condition type enum: Chronic, Transient
- [ ] 1.3 Define transient subtype enum: Recurrent, Resolved
- [ ] 1.4 Create database migration for conditions table
- [ ] 1.5 Implement CRUD API endpoints for conditions
- [ ] 1.6 Add association endpoints: Link conditions to medications and documents
- [ ] 1.7 Write unit tests for condition model validations
- [ ] 1.8 Write API integration tests for all CRUD operations

## 2. Mobile UI Components
- [ ] 2.1 Create ConditionCard component (list item with name, type indicator)
- [ ] 2.2 Create ConditionTypeRadio component (Chronic/Transient selection)
- [ ] 2.3 Create TransientSubtypeRadio component (Recurrent/Resolved selection)
- [ ] 2.4 Create QuickAddInput component (inline add functionality)
- [ ] 2.5 Create ExpandableSection component (show more/less toggle)
- [ ] 2.6 Create AssociationList component (medications/documents linking)
- [ ] 2.7 Implement responsive layout container (390px mobile width)

## 3. Conditions List Screen
- [ ] 3.1 Create ConditionsListScreen component
- [ ] 3.2 Implement "Share Your Health Record" header button
- [ ] 3.3 Implement Quick Add input with inline add button
- [ ] 3.4 Implement "Add with details" button
- [ ] 3.5 Display Chronic conditions section with header
- [ ] 3.6 Display Transient conditions section with header
- [ ] 3.7 Show empty state for Transient section
- [ ] 3.8 Implement navigation to View/Add/Edit screens
- [ ] 3.9 Add bottom navigation bar

## 4. View Condition Screen
- [ ] 4.1 Create ViewConditionScreen component
- [ ] 4.2 Implement back navigation
- [ ] 4.3 Display condition name in header
- [ ] 4.4 Add Edit button in header
- [ ] 4.5 Display read-only fields: Name, Type
- [ ] 4.6 Implement expandable section for additional details (diagnosis date, details)
- [ ] 4.7 Display associated medications list
- [ ] 4.8 Display associated documents list
- [ ] 4.9 Implement "Show more/Show less" toggle
- [ ] 4.10 Add Delete button at bottom

## 5. Add Condition Screen
- [ ] 5.1 Create AddConditionScreen component
- [ ] 5.2 Implement back navigation
- [ ] 5.3 Add "Add Condition" title in header
- [ ] 5.4 Add Save button in header
- [ ] 5.5 Implement name input field with validation (required)
- [ ] 5.6 Implement Chronic/Transient radio selection
- [ ] 5.7 Conditionally show Recurrent/Resolved radio for Transient type
- [ ] 5.8 Implement expandable section for additional fields (diagnosis date, details)
- [ ] 5.9 Add medications association section with empty state
- [ ] 5.10 Add documents association section with empty state
- [ ] 5.11 Implement "+ Add Medications" button
- [ ] 5.12 Implement "+ Add Documents" button
- [ ] 5.13 Implement form validation before save
- [ ] 5.14 Connect to API for condition creation

## 6. Edit Condition Screen
- [ ] 6.1 Create EditConditionScreen component
- [ ] 6.2 Implement back navigation
- [ ] 6.3 Display condition name in header (editable)
- [ ] 6.4 Add Save button in header
- [ ] 6.5 Pre-populate all fields with existing data
- [ ] 6.6 Implement name editing with validation
- [ ] 6.7 Allow type change (Chronic/Transient)
- [ ] 6.8 Allow subtype change for Transient conditions
- [ ] 6.9 Display associated medications with delete option per item
- [ ] 6.10 Display associated documents with delete option per item
- [ ] 6.11 Implement "+ Add Medications" button
- [ ] 6.12 Implement "+ Add Documents" button
- [ ] 6.13 Add Delete condition button at bottom
- [ ] 6.14 Connect to API for condition updates

## 7. Styling & Design System
- [ ] 7.1 Configure Public Sans font family (weights: 500, 600, 700, 800)
- [ ] 7.2 Define color palette constants (Black #000000, Gray #666666, Border #CCCCCC, etc.)
- [ ] 7.3 Create typography scale (H1: 24px Bold, H2: 20px Bold, Body: 16px Medium, etc.)
- [ ] 7.4 Define spacing constants (gaps: 8px, 16px, 24px; padding: 16px)
- [ ] 7.5 Create button style variants (Primary: black bg, Secondary: border only, Tertiary: gray bg)
- [ ] 7.6 Create input field styles (border, height 58px, rounded 4px)
- [ ] 7.7 Create radio button styles (24px outer, 14px inner fill when selected)
- [ ] 7.8 Implement separator component (2px height, #CCCCCC)

## 8. Navigation & Routing
- [ ] 8.1 Define route for /conditions (list view)
- [ ] 8.2 Define route for /conditions/:id (view detail)
- [ ] 8.3 Define route for /conditions/add (add new)
- [ ] 8.4 Define route for /conditions/:id/edit (edit existing)
- [ ] 8.5 Implement navigation transitions (slide animations)
- [ ] 8.6 Add "Conditions" to main navigation/dashboard

## 9. Icon Assets
- [ ] 9.1 Import/create arrow-left icon (24px)
- [ ] 9.2 Import/create delete icon (24px)
- [ ] 9.3 Import/create status indicator icon (10px oval)
- [ ] 9.4 Import/create home, calendar, plus, key, account icons for nav bar
- [ ] 9.5 Configure SVG optimization and loading

## 10. Integration & Testing
- [ ] 10.1 Test Quick Add flow end-to-end
- [ ] 10.2 Test Add with details flow (all field combinations)
- [ ] 10.3 Test View condition (collapsed and expanded states)
- [ ] 10.4 Test Edit condition (all field updates)
- [ ] 10.5 Test Delete condition (with confirmation)
- [ ] 10.6 Test Chronic condition workflow
- [ ] 10.7 Test Transient - Recurrent workflow
- [ ] 10.8 Test Transient - Resolved workflow
- [ ] 10.9 Test medication association (add/remove)
- [ ] 10.10 Test document association (add/remove)
- [ ] 10.11 Verify empty states display correctly
- [ ] 10.12 Test form validation (required fields, error states)
- [ ] 10.13 Test navigation flows between all screens
- [ ] 10.14 Verify responsive layout at 390px width
- [ ] 10.15 Test accessibility (touch targets minimum 42px, contrast ratios)

## 11. Documentation
- [ ] 11.1 Document API endpoints in project docs
- [ ] 11.2 Add component usage examples
- [ ] 11.3 Update user documentation with Conditions feature
- [ ] 11.4 Create developer guide for extending condition types
