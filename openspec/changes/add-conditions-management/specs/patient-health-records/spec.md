# Patient Health Records - Conditions Management

## ADDED Requirements

### Requirement: Condition Data Model
The system SHALL store patient medical conditions with the following attributes: unique identifier, name/diagnosis, condition type (Chronic or Transient), transient subtype (Recurrent or Resolved, applicable only to Transient conditions), optional diagnosis date, optional details text, creation timestamp, and last update timestamp.

#### Scenario: Create chronic condition
- **WHEN** user creates a new chronic condition with name "Asthma"
- **THEN** the system SHALL store the condition with type "Chronic" and generate unique identifier and timestamps

#### Scenario: Create transient recurrent condition
- **WHEN** user creates a transient condition and selects "Recurrent"
- **THEN** the system SHALL store the condition with type "Transient" and subtype "Recurrent"

#### Scenario: Create transient resolved condition
- **WHEN** user creates a transient condition and selects "Resolved"
- **THEN** the system SHALL store the condition with type "Transient" and subtype "Resolved"

### Requirement: Conditions List View
The system SHALL display all patient conditions organized by type, showing Chronic conditions in one section and Transient conditions in another section, with an empty state message "No Transient Conditions" when no transient conditions exist.

#### Scenario: Display chronic conditions
- **WHEN** patient has chronic conditions (Asthma, Allergic rhinitis, Bronchitis)
- **THEN** the system SHALL display them under "CHRONIC" header with condition names and optional status indicators

#### Scenario: Display empty transient section
- **WHEN** patient has no transient conditions
- **THEN** the system SHALL display "TRANSIENT" header with "No Transient Conditions" message centered below

#### Scenario: Display mixed conditions
- **WHEN** patient has both chronic and transient conditions
- **THEN** the system SHALL display both sections with respective conditions grouped by type

### Requirement: Quick Add Functionality
The system SHALL provide a quick add input field allowing users to rapidly enter condition names without navigating to a detailed form, automatically categorizing the condition as Chronic by default.

#### Scenario: Quick add chronic condition
- **WHEN** user types "Diabetes" in quick add field and clicks "Add" button
- **THEN** the system SHALL create a new chronic condition named "Diabetes" and add it to the Chronic section

#### Scenario: Quick add validation
- **WHEN** user clicks "Add" button with empty quick add field
- **THEN** the system SHALL not create a condition and SHALL display validation error

### Requirement: Detailed Add Functionality
The system SHALL provide an "Add with details" button that navigates to a dedicated add screen where users can specify condition name (required), type (Chronic or Transient), transient subtype (if applicable), diagnosis date, and additional details.

#### Scenario: Navigate to add screen
- **WHEN** user clicks "+ Add with details" button
- **THEN** the system SHALL navigate to Add Condition screen with empty form

#### Scenario: Add chronic condition with details
- **WHEN** user enters name "Hypertension", selects "Chronic", and clicks "Save"
- **THEN** the system SHALL create the condition and navigate back to conditions list

#### Scenario: Add transient condition with subtype
- **WHEN** user enters name "Common Cold", selects "Transient", selects "Resolved", and clicks "Save"
- **THEN** the system SHALL create the condition with type "Transient" and subtype "Resolved"

#### Scenario: Require condition name
- **WHEN** user clicks "Save" without entering a condition name
- **THEN** the system SHALL display validation error indicating name is required

### Requirement: View Condition Details
The system SHALL display condition details in a read-only view showing name, type, expandable additional fields (diagnosis date, details), associated medications, and associated documents.

#### Scenario: View basic condition details
- **WHEN** user taps on "Asthma" condition in the list
- **THEN** the system SHALL display condition name in header, condition type "Chronic", Edit button, and Delete button

#### Scenario: Expand additional details
- **WHEN** user clicks "Show more" link on view screen
- **THEN** the system SHALL display diagnosis date and details fields, and change link to "Show less"

#### Scenario: Collapse additional details
- **WHEN** user clicks "Show less" link on expanded view
- **THEN** the system SHALL hide diagnosis date and details fields, and change link to "Show more"

#### Scenario: View associated medications
- **WHEN** viewing a condition with associated medications
- **THEN** the system SHALL display medications list under "MEDICATIONS" header showing medication name, dosage, frequency, and associated condition

#### Scenario: View associated documents
- **WHEN** viewing a condition with associated documents
- **THEN** the system SHALL display documents list under "DOCUMENTS" header showing document names

### Requirement: Edit Condition
The system SHALL allow users to modify all condition fields including name, type, subtype, diagnosis date, details, and manage associations with medications and documents.

#### Scenario: Navigate to edit screen
- **WHEN** user clicks "Edit" button on view condition screen
- **THEN** the system SHALL navigate to edit screen with all fields pre-populated with current values

#### Scenario: Update condition name
- **WHEN** user changes condition name from "Asthma" to "Chronic Asthma" and clicks "Save"
- **THEN** the system SHALL update the condition name and navigate back to view screen

#### Scenario: Change condition type
- **WHEN** user changes condition from "Chronic" to "Transient" and selects "Recurrent"
- **THEN** the system SHALL update condition type and subtype and save changes

#### Scenario: Remove associated medication
- **WHEN** user clicks delete icon next to a medication in edit screen
- **THEN** the system SHALL remove the association between condition and medication

#### Scenario: Add medication association
- **WHEN** user clicks "+ Add Medications" button
- **THEN** the system SHALL navigate to medication selection or creation screen

#### Scenario: Remove associated document
- **WHEN** user clicks delete icon next to a document in edit screen
- **THEN** the system SHALL remove the association between condition and document

#### Scenario: Add document association
- **WHEN** user clicks "+ Add Documents" button
- **THEN** the system SHALL navigate to document selection or upload screen

### Requirement: Delete Condition
The system SHALL allow users to permanently delete a condition from their health record with a confirmation step to prevent accidental deletion.

#### Scenario: Delete condition from view screen
- **WHEN** user clicks "Delete" button on view condition screen
- **THEN** the system SHALL prompt for confirmation before deleting

#### Scenario: Delete condition from edit screen
- **WHEN** user clicks "Delete" button on edit condition screen
- **THEN** the system SHALL prompt for confirmation before deleting

#### Scenario: Confirm deletion
- **WHEN** user confirms deletion
- **THEN** the system SHALL permanently delete the condition and navigate back to conditions list

#### Scenario: Cancel deletion
- **WHEN** user cancels deletion confirmation
- **THEN** the system SHALL not delete the condition and remain on current screen

### Requirement: Condition Type Classification
The system SHALL support two primary condition types: Chronic (ongoing, long-term conditions) and Transient (temporary conditions), with Transient conditions further classified as Recurrent (recurring condition) or Resolved (past condition no longer active).

#### Scenario: Select chronic type
- **WHEN** adding or editing a condition and selecting "Chronic" radio button
- **THEN** the system SHALL not display transient subtype options (Recurrent/Resolved)

#### Scenario: Select transient type
- **WHEN** adding or editing a condition and selecting "Transient" radio button
- **THEN** the system SHALL display Recurrent and Resolved radio buttons below

#### Scenario: Select recurrent subtype
- **WHEN** transient type is selected and user selects "Recurrent"
- **THEN** the system SHALL store subtype as "Recurrent"

#### Scenario: Select resolved subtype
- **WHEN** transient type is selected and user selects "Resolved"
- **THEN** the system SHALL store subtype as "Resolved"

### Requirement: Mobile-First Responsive Design
The system SHALL implement all condition screens with mobile-first design at 390px width, using the established design system with Public Sans font family (Medium 500, Bold 700, ExtraBold 800), monochrome color palette, and consistent spacing.

#### Scenario: Display on 390px mobile viewport
- **WHEN** condition screens are rendered on mobile device with 390px width
- **THEN** all elements SHALL fit within viewport without horizontal scrolling

#### Scenario: Apply typography system
- **WHEN** rendering condition screens
- **THEN** the system SHALL use Public Sans Bold 24px for page titles, Bold 20px for section headers, and Medium 16px for body text

#### Scenario: Apply color system
- **WHEN** rendering UI elements
- **THEN** the system SHALL use black (#000000) for primary text, gray (#666666) for secondary text, and light gray (#CCCCCC) for borders

#### Scenario: Ensure touch target sizes
- **WHEN** rendering interactive elements (buttons, radio buttons, inputs)
- **THEN** all touch targets SHALL be minimum 42px in height for accessibility

### Requirement: Expandable Detail Sections
The system SHALL provide "Show more" and "Show less" toggles to expand or collapse additional condition fields (diagnosis date, details) on both view and add/edit screens, defaulting to collapsed state.

#### Scenario: Default collapsed state
- **WHEN** opening view or add/edit screen
- **THEN** additional fields SHALL be hidden and "Show more" link SHALL be displayed

#### Scenario: Expand details
- **WHEN** user clicks "Show more" link
- **THEN** diagnosis date and details fields SHALL become visible and link text SHALL change to "Show less"

#### Scenario: Collapse details
- **WHEN** user clicks "Show less" link on expanded section
- **THEN** additional fields SHALL be hidden and link text SHALL change to "Show more"

### Requirement: Form Validation
The system SHALL validate all condition forms requiring a condition name to be provided, preventing submission of incomplete forms.

#### Scenario: Require condition name
- **WHEN** user attempts to save a condition without entering a name
- **THEN** the system SHALL display validation error "Name / Diagnosis (Required)" and prevent save

#### Scenario: Accept valid chronic condition
- **WHEN** user enters name "Asthma" and selects "Chronic" type
- **THEN** the system SHALL validate successfully and allow save

#### Scenario: Require transient subtype
- **WHEN** user selects "Transient" type
- **THEN** the system SHALL require selection of either "Recurrent" or "Resolved" subtype before allowing save

### Requirement: Empty State Display
The system SHALL display appropriate empty state messages when no data exists for medications, documents, or transient conditions, centered with consistent styling.

#### Scenario: Show no medications empty state
- **WHEN** adding a new condition with no medications associated
- **THEN** the system SHALL display "No Medications" centered under "MEDICATIONS" header

#### Scenario: Show no documents empty state
- **WHEN** adding a new condition with no documents associated
- **THEN** the system SHALL display "No Documents" centered under "DOCUMENTS" header

#### Scenario: Show no transient conditions empty state
- **WHEN** patient has no transient conditions
- **THEN** the system SHALL display "No Transient Conditions" centered under "TRANSIENT" header

### Requirement: Navigation Integration
The system SHALL integrate conditions management into the main patient dashboard with navigation to conditions list screen and proper back navigation throughout all condition screens.

#### Scenario: Navigate from dashboard
- **WHEN** user clicks "Conditions" on patient dashboard
- **THEN** the system SHALL navigate to conditions list screen

#### Scenario: Navigate back from view screen
- **WHEN** user clicks back arrow on view condition screen
- **THEN** the system SHALL navigate back to conditions list screen

#### Scenario: Navigate back from add screen
- **WHEN** user clicks back arrow on add condition screen
- **THEN** the system SHALL navigate back to conditions list screen

#### Scenario: Navigate back from edit screen
- **WHEN** user clicks back arrow on edit condition screen
- **THEN** the system SHALL navigate back to view condition screen

### Requirement: Association Management
The system SHALL allow users to associate medications and documents with conditions, displaying these associations on view screens and allowing management (add/remove) on edit screens.

#### Scenario: View medication associations
- **WHEN** viewing a condition with associated medications
- **THEN** the system SHALL display each medication with format "[Name], [Dosage], [Frequency]\nfor [Condition]"

#### Scenario: View document associations
- **WHEN** viewing a condition with associated documents
- **THEN** the system SHALL display document names in a list

#### Scenario: Add medication association from edit
- **WHEN** editing a condition and clicking "+ Add Medications"
- **THEN** the system SHALL navigate to medication selection/creation interface

#### Scenario: Remove medication association from edit
- **WHEN** editing a condition and clicking delete icon next to a medication
- **THEN** the system SHALL remove the association and update the display

#### Scenario: Add document association from edit
- **WHEN** editing a condition and clicking "+ Add Documents"
- **THEN** the system SHALL navigate to document selection/upload interface

#### Scenario: Remove document association from edit
- **WHEN** editing a condition and clicking delete icon next to a document
- **THEN** the system SHALL remove the association and update the display
