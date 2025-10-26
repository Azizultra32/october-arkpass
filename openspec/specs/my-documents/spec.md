# Documents Management

## Purpose

Enable patients to organize, store, and share clinical documents including prescriptions, lab results, imaging reports, and consult notes. Support folder organization, privacy controls, document tagging, and association with PHR records.

## Requirements

### Requirement: Document Upload and Creation

The system SHALL provide camera capture and file upload for document creation with metadata entry.

#### Scenario: Add new document via camera
- **WHEN** user taps "Add New Document" button
- **THEN** open camera interface for photo capture
- **AND** after photo, show "Take another Photo" option for multi-page documents
- **AND** show "Add photo details" button to proceed to metadata entry

#### Scenario: Multi-page document upload
- **WHEN** user taps "Take another Photo"
- **THEN** keep previous photos in memory
- **AND** open camera again for next page
- **AND** continue until user taps "Add photo details"
- **AND** associate all photos with single document record

#### Scenario: Add new document via file picker
- **WHEN** user taps "Add New Document" and selects file upload
- **THEN** open system file picker
- **AND** accept file types: PDF, JPG, PNG, audio files
- **AND** proceed directly to metadata entry after selection

### Requirement: Document Metadata Fields

The system SHALL capture required and optional metadata for document organization.

#### Scenario: Required document name
- **WHEN** user attempts to save document
- **THEN** validate Name field is not empty
- **AND** show error "Name (Required)" with red border if empty
- **AND** prevent save until Name is filled

#### Scenario: Required folder selection
- **WHEN** user saves document
- **THEN** validate Folder is selected
- **AND** require selection from 5 pre-defined folders:
  - Prescriptions
  - Lab Results
  - Imaging
  - Consult
  - Other
- **AND** prevent save until folder selected

#### Scenario: Required system selection
- **WHEN** user saves document
- **THEN** validate System is selected (body system classification)
- **AND** require selection from dropdown:
  - Cardiac
  - Endocrine
  - Nervous
  - Renal
  - Immune
  - Respiratory
  - Gastrointestinal
  - Musculoskeletal
  - Integumentary
  - Reproductive
  - Other
- **AND** prevent save until system selected

#### Scenario: Optional document date
- **WHEN** user enters document date
- **THEN** provide calendar date picker
- **AND** default to current date
- **AND** allow past dates (e.g., prescription written weeks ago)
- **AND** allow save with empty date

#### Scenario: Optional document tags
- **WHEN** user adds tags
- **THEN** provide free-text tag input with "Add" button
- **AND** display added tags as black pills with × delete icon
- **AND** allow multiple tags per document
- **AND** support tag deletion by tapping ×

### Requirement: Document Privacy and Organization

The system SHALL provide privacy controls and highlighting for important documents.

#### Scenario: Make document private
- **WHEN** user toggles "Make Private" checkbox
- **THEN** mark document as private (is_private = true)
- **AND** show 🔒 padlock icon in list view
- **AND** exclude document from "Share Your Health Record" exports
- **USE CASE** Mental health records, sensitive test results

#### Scenario: Highlight important document
- **WHEN** user toggles "Highlight this file" checkbox
- **THEN** mark document as highlighted (is_highlighted = true)
- **AND** show ⭐ star icon in list view
- **AND** sort highlighted documents to top of lists
- **USE CASE** Current prescriptions, recent lab results, emergency contacts

### Requirement: Folder Organization System

The system SHALL organize documents into 5 pre-defined folders with no custom folder creation.

#### Scenario: Browse folders view
- **WHEN** user views My Documents (Browse tab)
- **THEN** display 5 folders at top:
  - Prescriptions (shows document count)
  - Lab Results (shows document count)
  - Imaging (shows document count)
  - Consult (shows document count)
  - Other (shows document count)
- **AND** display loose documents below folders
- **AND** show folder count as "X documents inside"

#### Scenario: Navigate into folder
- **WHEN** user taps folder card
- **THEN** open folder view showing only documents in that folder
- **AND** show back button with folder name
- **AND** maintain search/filter controls

#### Scenario: Fixed folder structure
- **WHEN** user manages documents
- **THEN** use only 5 pre-defined folders
- **AND** do NOT allow custom folder creation
- **AND** require folder selection for all documents

### Requirement: Browse vs Inbox Views

The system SHALL provide two viewing modes: Browse (organized) and Inbox (incoming).

#### Scenario: Browse tab active
- **WHEN** user views My Documents with Browse tab selected
- **THEN** show folders + organized documents
- **AND** display full document metadata (name, date, system)
- **AND** show privacy/highlight icons (🔒, ⭐)
- **AND** allow folder navigation

#### Scenario: Inbox tab active
- **WHEN** user taps Inbox tab
- **THEN** show flat list of incoming documents
- **AND** display only date (no document name shown)
- **AND** hide privacy/highlight icons
- **AND** no folder grouping
- **USE CASE** Documents received from providers before patient organizes them

#### Scenario: Organize document from Inbox
- **WHEN** user taps document in Inbox view
- **THEN** open document details view
- **AND** allow editing name, folder, system
- **AND** after save, document appears in Browse view
- **AND** document removed from Inbox view

### Requirement: Document Association Pattern

The system SHALL allow linking documents to PHR records (allergies, medications, conditions, etc.).

#### Scenario: Associate document from PHR record
- **WHEN** user taps "+ Add Documents" in allergy/medication/surgery/etc. form
- **THEN** open document selection interface (Browse mode)
- **AND** show folders grayed out (navigation only)
- **AND** show individual documents with + icon
- **AND** allow multi-select by tapping + icons
- **AND** create associations on "Done" tap

#### Scenario: Browse into folder for association
- **WHEN** in document selection interface, user taps folder
- **THEN** show folder contents with + icons
- **AND** maintain "Done" button in header
- **AND** allow selection from folder documents
- **AND** return to PHR record form after "Done"

#### Scenario: Display associated documents
- **WHEN** viewing PHR record (allergy/medication/etc.)
- **THEN** show DOCUMENTS section
- **AND** display document names as links
- **AND** allow deletion of association (not document itself)

#### Scenario: Delete document association
- **WHEN** user deletes document link from PHR record
- **THEN** remove association record
- **AND** keep document in My Documents
- **AND** do NOT delete document file

### Requirement: Document Search and Filter

The system SHALL provide search and filter capabilities across all documents.

#### Scenario: Search documents by name
- **WHEN** user types in search input
- **THEN** filter documents by name match (case-insensitive)
- **AND** search across all folders (in Browse view)
- **AND** update results in real-time

#### Scenario: Search documents by tags
- **WHEN** user searches for tag text
- **THEN** include documents with matching tags in results
- **AND** support partial tag matching

#### Scenario: Filter documents
- **WHEN** user taps "Filter" button
- **THEN** show filter options:
  - By folder (Prescriptions, Lab Results, etc.)
  - By system (Cardiac, Endocrine, etc.)
  - By date range
  - By privacy status (Private, Public)
  - By highlighted status
- **AND** apply filters to document list
- **AND** show active filter count

### Requirement: Document Viewing and Editing

The system SHALL provide view and edit modes for document metadata.

#### Scenario: View document details
- **WHEN** user taps document card in list
- **THEN** open Document Details (View mode)
- **AND** display image preview (96px thumbnail)
- **AND** show read-only metadata: Name, Folder, System, Date, Tags
- **AND** show privacy/highlight status (filled icons)
- **AND** show "Edit" button in header

#### Scenario: Edit document metadata
- **WHEN** user taps "Edit" in document view
- **THEN** convert all fields to editable inputs
- **AND** preserve current values
- **AND** show "Save" button in header
- **AND** validate required fields (Name, Folder, System)

#### Scenario: Save document changes
- **WHEN** user taps "Save" after editing
- **THEN** validate required fields
- **AND** update document record
- **AND** update updated_at timestamp
- **AND** return to view mode

### Requirement: Document Deletion

The system SHALL allow permanent deletion of documents with confirmation.

#### Scenario: Delete document
- **WHEN** user taps "Delete" button in document view/edit
- **THEN** show confirmation dialog "Delete this document?"
- **AND** if confirmed, soft delete document (set deleted_at)
- **AND** delete all PHR associations
- **AND** hide from patient view
- **AND** return to documents list

#### Scenario: Soft delete for audit
- **WHEN** document is deleted
- **THEN** mark as deleted_at = NOW()
- **AND** cascade delete associations
- **AND** retain file in storage for compliance period
- **AND** hide from all patient views

### Requirement: Share Health Record Integration

The system SHALL exclude private documents from health record sharing.

#### Scenario: Export public documents only
- **WHEN** user taps "Share Your Health Record"
- **THEN** include all documents where is_private = false
- **AND** exclude all documents where is_private = true
- **AND** format as FHIR DocumentReference resources
- **AND** include document metadata and file URLs

## Data Model

### Database Schema

```sql
-- Pre-defined folders (seeded data)
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'Prescriptions', 'Lab Results', 'Imaging', 'Consult', 'Other'
  sort_order INTEGER NOT NULL,
  icon TEXT DEFAULT 'folder',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE NOT NULL,

  -- Core metadata (required)
  name TEXT NOT NULL,
  folder_id UUID REFERENCES document_folders(id) NOT NULL,
  system TEXT NOT NULL, -- Body system (dropdown value)

  -- Optional metadata
  document_date DATE DEFAULT CURRENT_DATE,
  tags TEXT[], -- PostgreSQL array for tags

  -- Privacy/organization
  is_private BOOLEAN DEFAULT FALSE,
  is_highlighted BOOLEAN DEFAULT FALSE,

  -- File storage
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_type TEXT NOT NULL, -- 'image', 'pdf', 'audio', 'word', 'other'
  file_size_bytes INTEGER,

  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Document associations (link documents to PHR records)
CREATE TABLE document_associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  entity_type TEXT NOT NULL, -- 'allergy', 'medication', 'surgery', 'immunization', 'supplement', 'condition'
  entity_id UUID NOT NULL, -- FK to specific PHR record
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(document_id, entity_type, entity_id)
);

-- Indexes
CREATE INDEX idx_documents_patient ON documents(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_folder ON documents(folder_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_highlighted ON documents(patient_id, is_highlighted) WHERE is_highlighted = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_documents_tags ON documents USING GIN (tags);
CREATE INDEX idx_doc_associations_document ON document_associations(document_id);
CREATE INDEX idx_doc_associations_entity ON document_associations(entity_type, entity_id);

-- Seed default folders
INSERT INTO document_folders (name, sort_order, icon) VALUES
  ('Prescriptions', 1, 'folder'),
  ('Lab Results', 2, 'folder'),
  ('Imaging', 3, 'folder'),
  ('Consult', 4, 'folder'),
  ('Other', 5, 'folder')
ON CONFLICT (name) DO NOTHING;
```

### TypeScript Interfaces

```typescript
interface Document {
  id: string;
  patientId: string;

  // Core metadata (required)
  name: string;
  folderId: string; // FK to document_folders
  system: BodySystem; // Body system classification

  // Optional metadata
  documentDate?: Date;
  tags?: string[];

  // Privacy/organization
  isPrivate: boolean; // Default: false
  isHighlighted: boolean; // Default: false

  // File storage
  fileUrl: string; // Supabase Storage URL
  fileType: FileType;
  fileSizeBytes?: number;

  // Timestamps
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface DocumentFolder {
  id: string;
  name: string; // 'Prescriptions', 'Lab Results', etc.
  sortOrder: number;
  icon: string;
  createdAt: Date;
}

interface DocumentAssociation {
  id: string;
  documentId: string; // FK to documents
  entityType: 'allergy' | 'medication' | 'surgery' | 'immunization' | 'supplement' | 'condition';
  entityId: string; // FK to specific PHR record
  createdAt: Date;
}

type BodySystem =
  | 'cardiac'
  | 'endocrine'
  | 'nervous'
  | 'renal'
  | 'immune'
  | 'respiratory'
  | 'gastrointestinal'
  | 'musculoskeletal'
  | 'integumentary'
  | 'reproductive'
  | 'other';

type FileType = 'image' | 'pdf' | 'audio' | 'word' | 'other';

// Pre-defined folders (constants)
const DEFAULT_FOLDERS: DocumentFolder[] = [
  { id: '...', name: 'Prescriptions', sortOrder: 1, icon: 'folder' },
  { id: '...', name: 'Lab Results', sortOrder: 2, icon: 'folder' },
  { id: '...', name: 'Imaging', sortOrder: 3, icon: 'folder' },
  { id: '...', name: 'Consult', sortOrder: 4, icon: 'folder' },
  { id: '...', name: 'Other', sortOrder: 5, icon: 'folder' }
];
```

## UI Patterns

### Browse vs Inbox Toggle
- Two-button toggle (42px height each)
- Active state: Black background, white text
- Inactive state: White background, black text
- Browse = organized view, Inbox = incoming view

### Folder Cards
- Icon: 📁 Folder (48px)
- Title: Folder name (20px bold)
- Subtitle: "X documents inside" (16px gray)
- Background: #EEEEEE (Browse), white (Association mode)

### Document Cards
- Icon: Type-specific (🖼️ image, 📄 PDF, 🔊 audio) 48px
- Title: Document name (20px bold)
- Subtitle: "Date, System" (16px gray)
- Right icons: 🔒 (private), ⭐ (highlighted) 24px

### Privacy Icons
- 🔒 Padlock (filled): Document is private
- ⭐ Star (filled): Document is highlighted
- Icons shown in list view and detail view

### Tag Pills
- Black pills with white text (42px height)
- × icon for deletion (in edit mode)
- Gray pills (read-only) in view mode

### Document Selection Interface
- Folders grayed out (navigation only, no + icon)
- Individual documents with + icon (24px)
- "Done" button in header to commit selections

## FHIR Mapping

ArkPass is PRIMARY. FHIR export is SECONDARY for interoperability.

### Export to FHIR (Share Health Record)

```typescript
// Map Document to FHIR DocumentReference resource
function toFHIRDocumentReference(document: Document): FHIRDocumentReference {
  // Only export non-private documents
  if (document.isPrivate) return null;

  return {
    resourceType: 'DocumentReference',
    id: document.id,
    status: 'current',
    type: {
      text: document.system // Body system as document type
    },
    category: [{
      text: getFolderName(document.folderId) // Folder name as category
    }],
    subject: {
      reference: `Patient/${document.patientId}`
    },
    date: document.documentDate || document.uploadedAt,
    content: [{
      attachment: {
        url: document.fileUrl,
        contentType: getContentType(document.fileType),
        size: document.fileSizeBytes,
        title: document.name
      }
    }],
    context: {
      related: document.tags?.map(tag => ({ display: tag }))
    }
  };
}
```

**Key Mappings**:
- `Document.name` → `content[0].attachment.title`
- `Document.system` → `type.text`
- `Document.folder` → `category[0].text`
- `Document.fileUrl` → `content[0].attachment.url`
- `Document.tags` → `context.related[]`
- `Document.isPrivate = true` → NOT exported

**Import Limitation**:
- ArkPass does NOT import FHIR DocumentReference data
- Export-only for sharing with providers/EHRs

## Figma References

**Source**: Figma file `october-arkpass`, section "My Documents"

| Screen | Node ID | Purpose |
|--------|---------|---------|
| Browse View | 1483:8382 | Main view with folders + documents |
| Prescriptions Folder | 1483:8386 | Folder contents view |
| Lab Results Folder | 1483:8387 | Folder contents view |
| Inbox View | 1869:42066 | Incoming documents (date-only) |
| Add/Associate (Browse) | 1483:8383 | Select docs from all folders |
| Add/Associate (Folder) | 1483:8384 | Select docs from specific folder |
| Add/Associate (Lab Results) | 1483:8385 | Select lab results specifically |
| Add Another Photo | 1869:42139 | Multi-page upload workflow |
| New Document Details | 1483:8389 | Metadata entry form |
| Document Details (View) | 1483:8390 | Read-only document view |

**Critical Screens**:
- Browse View (1483:8382): Shows folder structure + loose documents
- Add/Associate Browse (1483:8383): Demonstrates + icon pattern for selection
- New Document Details (1483:8389): All metadata fields with privacy controls

## Dependencies

### Required Components
- ✅ Camera interface (native or web)
- ✅ File picker (native system picker)
- ✅ Tag input component (multi-add pattern)
- ✅ Privacy toggle (checkbox with icon)

### Storage Dependencies
- Supabase Storage (or S3) for file hosting
- File upload/download API
- Image thumbnail generation
- File type detection

### Database Dependencies
- `user_profiles` table (patient_id foreign key)
- `document_folders` table (pre-seeded)
- All PHR tables (for associations)

### Feature Dependencies
- Share Health Record feature (excludes private docs)
- All PHR features (allergies, medications, etc.) for associations

## Compliance

### HIPAA
- All documents are PHI
- Soft delete preserves audit trail (deleted_at)
- Privacy controls (is_private flag) prevent unauthorized sharing
- File storage must be HIPAA-compliant (encrypted at rest)

### File Storage Security
- Signed URLs with expiration for file access
- Patient-scoped permissions (can only access own documents)
- No public file URLs
- Audit logging for file access

### FHIR Compatibility
- Export as FHIR DocumentReference resources
- Includes file URLs, metadata, system classification
- Compatible with EHR document repositories

## Open Questions

1. **File Size Limits**: What are maximum file sizes?
   - Recommendation: 10MB per file, 50MB per document (multi-page)

2. **File Retention**: How long to retain deleted documents?
   - Recommendation: 7 years for HIPAA compliance, then hard delete

3. **OCR Integration**: Extract text from prescription/lab result images?
   - Future enhancement for search/analysis

4. **Folder Customization**: Should users create custom folders?
   - Current: Fixed 5 folders (simpler UX)
   - Alternative: Allow custom folders (more flexible)

5. **Provider Direct Upload**: Can providers upload to patient Inbox?
   - Requires provider portal integration
   - Security: Verify provider credentials before upload

6. **Version History**: Track document updates/replacements?
   - Future enhancement for prescription renewals

7. **Expiration Dates**: Mark prescriptions with expiry?
   - Future enhancement with reminders
