# Add Conditions Management

## Why
Patients need the ability to manage their medical conditions (both chronic and transient) within their Personal Health Record (PHR). Currently, there is no capability for users to record, view, edit, or delete their medical diagnoses, which is a fundamental requirement for a complete health record system.

## What Changes
- Add complete CRUD (Create, Read, Update, Delete) functionality for medical conditions
- Support two condition types: Chronic and Transient (with sub-types: Recurrent and Resolved)
- Enable "Quick Add" functionality for rapid condition entry
- Link conditions to medications and documents
- Provide expandable detail views for conditions
- Implement mobile-first UI following the established design system (Public Sans typography, monochrome color scheme)

## Impact

### Affected specs
- **NEW**: `patient-health-records` - Core capability for managing patient conditions, medications, and documents

### Affected code
- New mobile screens: Conditions list, View condition, Add condition, Edit condition
- New data models: Condition entity with type classification
- New API endpoints: Conditions CRUD operations
- Related entities: Medications and Documents association with conditions

### User-facing changes
- New "Conditions" section accessible from patient dashboard
- Users can add conditions via quick-add or detailed form
- Users can view, edit, and delete existing conditions
- Conditions automatically categorized as Chronic or Transient

### Dependencies
- Design specifications from Figma (extracted to CONDITIONS_SCREENS_SPECS.md)
- Public Sans font family (Medium 500, Bold 700, ExtraBold 800)
- Icon assets (arrows, delete, status indicators)
