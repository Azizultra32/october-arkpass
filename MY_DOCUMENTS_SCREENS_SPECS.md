# My Documents - Screen Specifications

**Feature**: Document Management System
**Total Screens Extracted**: 11 screens (from Figma section "My Documents" - 12 screens total)
**Extraction Date**: 2025-10-25
**Status**: ✅ COMPLETE

---

## 🎯 Purpose & Critical Findings

### What "My Documents" Actually Is

Based on Figma extraction and ARKPASS 6 gap analysis, **"My Documents" is a comprehensive document management system** that serves multiple purposes:

1. **Clinical Document Storage**: Prescriptions, Lab Results, Imaging, Consult notes
2. **Folder Organization**: Pre-defined folders for different document types
3. **Document Sharing**: Integration with "Share Your Health Record" feature
4. **Privacy Controls**: Private vs. Shared documents
5. **Metadata Management**: Tags, dates, system categorization
6. **Inbox/Browse Views**: Two modes for viewing documents

### How This Fills ARKPASS 6 Gaps

From [ARKPASS_6_GAP_ANALYSIS.md](ARKPASS_6_GAP_ANALYSIS.md):

✅ **Visit Notes**: Documents can store clinic visit notes, doctor's notes, discharge summaries
✅ **Lab Results**: Dedicated "Lab Results" folder for blood work, imaging reports
✅ **Export Feature**: "Share Your Health Record" button integrates with document system
✅ **Document Attachments**: Every PHR record can link to documents (prescriptions, test results, etc.)

---

## 📊 Screen Inventory

| # | Screen Name | Node ID | Primary Function | Key Features |
|---|-------------|---------|------------------|--------------|
| 1 | My Documents (Browse) | 1483:8382 | Main list view | Folders + files, search, filter, browse/inbox toggle |
| 2 | My Documents - Private Folder | 1483:8386 | Folder contents (Prescriptions) | 3 documents inside, search/filter |
| 3 | My Documents - Shared Folder | 1483:8387 | Folder contents (Lab Results) | 2 documents inside |
| 4 | My Documents - Inbox | 1869:42066 | Incoming documents view | Date-based list, no names |
| 5 | Add/Associate Documents (Browse All) | 1483:8383 | Associate docs with PHR records | Folders + files with + icon |
| 6 | Add/Associate Documents (Folder View) | 1483:8384 | Select from specific folder | Prescriptions folder with + icons |
| 7 | Add/Associate Documents (Lab Results) | 1483:8385 | Select from Lab Results folder | 2 files with + icons |
| 8 | My Documents - Add New | 1483:8388 | Camera/upload initiation | (Timed out - not extracted) |
| 9 | Add another Photo + Details | 1869:42139 | Multi-photo upload | "Take another Photo" + "Add photo details" |
| 10 | New Document Details | 1483:8389 | Add metadata to new doc | Name, folder, system, date, tags |
| 11 | Document Details (View) | 1483:8390 | View existing document | Read-only metadata, highlight/private/delete |
| 12 | Edit Document | 1483:8391 | Edit document metadata | (Not extracted - similar to #10) |

---

## 🗂️ Pre-Defined Folder Structure

From Screen #1 extraction, the system has **5 pre-defined folders**:

| Folder Name | Document Count | Icon | Purpose |
|-------------|----------------|------|---------|
| **Prescriptions** | 3 documents | Folder | Prescription images, pharmacy receipts |
| **Lab Results** | 2 documents | Folder | Blood work, test results, imaging reports |
| **Imaging** | 1 document | Folder | X-rays, MRIs, CT scans, ultrasounds |
| **Consult** | 1 document | Folder | Specialist consult notes, referral letters |
| **Other** | 1 document | Folder | Catch-all for misc documents |

**Key Insight**: These folders directly map to Visit Notes and Lab Results from ARKPASS 6 gap analysis.

---

## 📱 Screen #1: My Documents (Browse View)

**Node ID**: 1483:8382
**Purpose**: Main landing screen for document management

### Layout Structure

```
┌─────────────────────────────────────┐
│  [Share Your Health Record] (Black) │  ← 58px button
├─────────────────────────────────────┤
│           My Documents              │  ← 24px title
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │  ← 58px button
├─────────────────────────────────────┤
│  [Search________] (Input)           │  ← 58px input
├─────────────────────────────────────┤
│         [Filter] (White)            │  ← 42px button
├─────────────────────────────────────┤
│  ───────────────────────────────────│  ← 2px separator
├─────────────────────────────────────┤
│  [Browse (Black)] [Inbox (White)]   │  ← Toggle tabs
├─────────────────────────────────────┤
│  ☰ 📁 Prescriptions                 │
│      3 documents inside             │
├─────────────────────────────────────┤
│  ☰ 📁 Lab Results                   │
│      2 document inside              │
├─────────────────────────────────────┤
│  ☰ 📁 Imaging                       │
│      1 document inside              │
├─────────────────────────────────────┤
│  ☰ 📁 Consult                       │
│      1 document inside              │
├─────────────────────────────────────┤
│  ☰ 📁 Other                         │
│      1 document inside              │
├─────────────────────────────────────┤
│  ☰ 🖼️ MyPrescription    ⭐          │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│  ☰ 📄 MyFile           🔒 ⭐        │
│      Jan 12, 2023, Nervous          │
├─────────────────────────────────────┤
│  ☰ 📄 MyFile                        │
│      Jan 12, 2023, Nervous          │
├─────────────────────────────────────┤
│  ☰ 🔊 Dr.A Visit Audio1    🔒      │
│      Jan 12, 2023, Immune           │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

### Fields & Components

**Header**:
- **Share Your Health Record** button (black, 58px height)
- **Title**: "My Documents" (24px, bold, center-aligned)

**Actions**:
- **Add New Document** button (gray #EEEEEE, 58px height, black border)
- **Search** input field (58px height, placeholder "Search")
- **Filter** button (white, 42px height, black border)

**Browse/Inbox Toggle**:
- Two-button toggle (42px height each)
- Active state: Black background, white text
- Inactive state: White background, black text, gray border

**Folder List** (5 folders):
- Icon: Folder icon (48px size)
- Title: Folder name (20px, bold)
- Subtitle: "X documents inside" (16px, gray)
- Drag handle: ☰ icon on left (16px width)

**File List** (individual documents):
- Icon: Type-specific (Image/Word/Audio, 48px size)
- Title: Document name (20px, bold)
- Subtitle: "Date, System" (16px, gray - e.g., "Jan 12, 2023, Cardiac")
- Right icons:
  - 🔒 Padlock (if private)
  - ⭐ Star (if highlighted)

**Footer**:
- "Show more" link (16px, blue #1A73E8)

---

## 📱 Screen #2: Private Folder View (Prescriptions)

**Node ID**: 1483:8386
**Purpose**: View contents of "Prescriptions" folder

### Layout Structure

```
┌─────────────────────────────────────┐
│  ← Prescriptions                    │  ← Header with back button
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  ☰ 🖼️ MyPrescription 1    ⭐        │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│  ☰ 🔊 Audio 2                       │
│      Jan 12, 2023, Nervous          │
├─────────────────────────────────────┤
│  ☰ 🖼️ MyPrescription 3             │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

### Key Differences from Main View

- **Header**: Back arrow + folder name (no "My Documents" title)
- **No folders**: Only files from this folder
- **Same search/filter**: Consistent UX
- **3 documents total**: Matches "3 documents inside" from main view

---

## 📱 Screen #3: Shared Folder View (Lab Results)

**Node ID**: 1483:8387
**Purpose**: View contents of "Lab Results" folder

### Layout Structure

```
┌─────────────────────────────────────┐
│  ← Lab Results                      │
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  ☰ 🖼️ MyResult 1       ⭐           │
│      Jan 12, 2023, Endocrine        │
├─────────────────────────────────────┤
│  ☰ 🖼️ My Result 2                  │
│      Jan 12, 2023, Endocrine        │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

### Key Observations

- **2 documents total**: Matches main view count
- **System tagging**: Both tagged as "Endocrine"
- **Naming pattern**: "MyResult 1", "My Result 2"

---

## 📱 Screen #4: My Documents - Inbox View

**Node ID**: 1869:42066
**Purpose**: View incoming/shared documents (date-only view)

### Layout Structure

```
┌─────────────────────────────────────┐
│  [Share Your Health Record] (Black) │
│           My Documents              │
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  [Browse (White)] [Inbox (Black)]   │  ← Toggle (Inbox active)
├─────────────────────────────────────┤
│  🖼️ Jan 12, 2023                    │  ← No name, just date
├─────────────────────────────────────┤
│  📄 Jan 12, 2023                    │
├─────────────────────────────────────┤
│  📄 Jan 12, 2023                    │
├─────────────────────────────────────┤
│  🔊 Jan 12, 2023                    │
├─────────────────────────────────────┤
│  🖼️ Jan 12, 2023                    │
└─────────────────────────────────────┘
```

### Key Differences from Browse View

- **Inbox tab active** (black background)
- **No document names**: Only dates shown
- **No folders**: Flat list of incoming documents
- **No highlights/privacy icons**: Simplified view

**Use Case**: Documents received from providers/clinics before patient has reviewed/organized them

---

## 📱 Screen #5: Add/Associate Documents (Browse All)

**Node ID**: 1483:8383
**Purpose**: Select documents to associate with PHR records (medications, allergies, etc.)

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  Add Documents        [Done]     │  ← Black Done button
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  [Browse (Black)] [Inbox (White)]   │
├─────────────────────────────────────┤
│  📁 Prescriptions (Gray bg)         │  ← Folders grayed out
│      3 documents inside             │
├─────────────────────────────────────┤
│  📁 Lab Results (Gray bg)           │
│      2 document inside              │
├─────────────────────────────────────┤
│  📁 Imaging (Gray bg)               │
│      1 document inside              │
├─────────────────────────────────────┤
│  📁 Consult (Gray bg)               │
│      1 document inside              │
├─────────────────────────────────────┤
│  📁 Other (Gray bg)                 │
│      1 document inside              │
├─────────────────────────────────────┤
│  🖼️ MyPrescription    ⭐ [+]        │  ← Plus icon to add
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│  📄 MyFile          🔒 ⭐ [+]       │
│      Jan 12, 2023, Renal            │
├─────────────────────────────────────┤
│  📄 MyFile                [+]       │
│      Jan 12, 2023, Immune           │
├─────────────────────────────────────┤
│  🔊 Dr.A Visit Audio1  🔒 [+]      │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

### Key Features

- **Header**: Back button + "Add Documents" title + "Done" button (black, 86px width)
- **Folders grayed out**: Can only select individual files (folders are navigation only)
- **+ Icon**: 24px plus icon on right side of each file
- **Multi-select**: User can tap multiple + icons before tapping Done

**User Flow**:
1. User is editing an allergy/medication/condition
2. Taps "+ Add Documents"
3. System shows this screen
4. User taps + icon next to relevant files
5. User taps "Done"
6. System associates selected documents with the record

---

## 📱 Screen #6: Add/Associate (Prescriptions Folder)

**Node ID**: 1483:8384
**Purpose**: Select documents from specific folder

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  Prescriptions        [Done]     │
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  🖼️ MyPrescription 1    ⭐ [+]      │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│  🔊 Audio 2                [+]      │
│      Jan 12, 2023, Nervous          │
├─────────────────────────────────────┤
│  🖼️ My Prescription 3     [+]      │
│      Jan 12, 2023, Cardiac          │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

### Key Features

- **Drill-down navigation**: User tapped a folder in Screen #5
- **Same + icon pattern**: Tap to select multiple
- **3 documents**: Matches Prescriptions folder count

---

## 📱 Screen #7: Add/Associate (Lab Results Folder)

**Node ID**: 1483:8385
**Purpose**: Select lab results to associate with PHR records

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  Lab Results          [Done]     │
├─────────────────────────────────────┤
│    [Add New Document] (Gray)        │
│  [Search________] (Input)           │
│         [Filter] (White)            │
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  🖼️ MyResult 1       ⭐ [+]         │
│      Jan 12, 2023, Endocrine        │
├─────────────────────────────────────┤
│  🖼️ My Result 2          [+]       │
│      Jan 12, 2023, Endocrine        │
├─────────────────────────────────────┤
│          Show more (Link)            │
└─────────────────────────────────────┘
```

---

## 📱 Screen #9: Add another Photo + Details

**Node ID**: 1869:42139
**Purpose**: Multi-photo upload workflow

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  Add New Document                │
├─────────────────────────────────────┤
│  [📷 Take another Photo] (Black)    │  ← Camera icon + text
├─────────────────────────────────────┤
│  [Add photo details] (White border) │  ← Secondary action
└─────────────────────────────────────┘
```

### User Flow

1. User taps "Add New Document" from main screen
2. Camera opens, user takes photo
3. This screen appears
4. User can either:
   - **Take another Photo**: Add more images to same document
   - **Add photo details**: Proceed to metadata screen (#10)

---

## 📱 Screen #10: New Document Details

**Node ID**: 1483:8389
**Purpose**: Add metadata to new document

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  New Document          [Save]    │  ← Black Save button
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │                             │   │  ← 96px image preview
│  │        🖼️ (Large icon)      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  [Name (Required)_______] (Input)   │  ← 58px height
├─────────────────────────────────────┤
│  Folder (Required)                  │  ← 58px dropdown
│  Select                        ▼    │
├─────────────────────────────────────┤
│  System (Required)                  │  ← 58px dropdown
│  Select                        ▼    │
├─────────────────────────────────────┤
│  Date                               │  ← 58px date picker
│  March 13, 2023              📅     │
├─────────────────────────────────────┤
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  [Tag____________] [Add] (Border)   │  ← Tag input + Add button
├─────────────────────────────────────┤
│  [Tag 1 ✕] [Tag 2 ✕] (Black pills) │  ← Added tags
├─────────────────────────────────────┤
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  ⭐ Highlight this file             │  ← Toggle options
│  🔒 Make Private                    │
├─────────────────────────────────────┤
│  ───────────────────────────────────│
└─────────────────────────────────────┘
```

### Fields

**Required Fields** (marked with "Required"):
1. **Name** (Text input, 58px height)
   - Placeholder: "Name (Required)"
   - Validation: Cannot be empty

2. **Folder** (Dropdown, 58px height)
   - Label: "Folder (Required)"
   - Default: "Select"
   - Options: Prescriptions, Lab Results, Imaging, Consult, Other
   - Icon: Down arrow

3. **System** (Dropdown, 58px height)
   - Label: "System (Required)"
   - Default: "Select"
   - Options: Body systems (Cardiac, Endocrine, Nervous, Renal, Immune, etc.)
   - Icon: Down arrow

**Optional Fields**:
4. **Date** (Date picker, 58px height)
   - Label: "Date"
   - Default: Current date
   - Icon: Calendar
   - Format: "March 13, 2023"

5. **Tags** (Dynamic multi-add)
   - Tag input field (grows with Add button)
   - "Add" button (89px width, black border)
   - Added tags appear as black pills with × icon
   - Tags can be deleted by tapping ×

**Toggle Options**:
6. **Highlight this file** (Checkbox/toggle)
   - Icon: ⭐ Star outline
   - Tap to toggle highlighted state

7. **Make Private** (Checkbox/toggle)
   - Icon: 🔒 Padlock outline
   - Tap to toggle private state

---

## 📱 Screen #11: Document Details (View Mode)

**Node ID**: 1483:8390
**Purpose**: View existing document details (read-only)

### Layout Structure

```
┌─────────────────────────────────────┐
│  ←  MyPrescription        [Edit]    │  ← Gray Edit button
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │        🖼️ (Large icon)      │   │  ← 96px image preview
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  Name                               │
│  MyPrescription                     │
├─────────────────────────────────────┤
│  Folder                             │
│  Prescriptions                      │
├─────────────────────────────────────┤
│  System                             │
│  Cardiac                            │
├─────────────────────────────────────┤
│  Date                               │
│  March 13, 2023                     │
├─────────────────────────────────────┤
│  Tags                               │
│  [Tag 1] [Tag 2] (Gray pills)       │
├─────────────────────────────────────┤
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  ⭐ Highlight this file (Filled)    │  ← Active state
│  🔒 Private (Filled)                │
├─────────────────────────────────────┤
│  ───────────────────────────────────│
├─────────────────────────────────────┤
│  🗑️ Delete (Gray text)              │  ← Delete button
└─────────────────────────────────────┘
```

### Key Differences from Edit Mode

- **Read-only fields**: All metadata displayed as labels + values (no inputs)
- **Edit button**: Gray button (77px width) to switch to edit mode
- **Tags display**: Gray pills (no × delete icon)
- **Filled icons**: ⭐ Star and 🔒 Padlock are filled (not outlined)
- **Delete button**: Bottom action (gray text, 58px height)

---

## 🔗 Document Association Pattern

Based on screens #5-#7 and references in other specs, here's how document association works:

### Where Documents Can Be Associated

From existing spec files:
- ✅ **Allergies**: "+ Add Documents" button ([ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md))
- ✅ **Medications**: Documents section ([MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md))
- ✅ **Surgeries**: Documents section ([SURGERIES_SCREENS_SPECS.md](SURGERIES_SCREENS_SPECS.md))
- ✅ **Immunizations**: Documents section ([IMMUNIZATIONS_SCREENS_SPECS.md](IMMUNIZATIONS_SCREENS_SPECS.md))
- ✅ **Supplements**: Documents section ([SUPPLEMENTS_SCREENS_SPECS.md](SUPPLEMENTS_SCREENS_SPECS.md))
- ✅ **Conditions**: Documents section ([CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md))

### Association Flow

```
PHR Record Edit Screen
   ↓ (Tap "+ Add Documents")
Screen #5: Add/Associate Documents (Browse All)
   ↓ (Optional: Tap a folder)
Screen #6/7: Add/Associate (Folder View)
   ↓ (Tap + icons to select)
   ↓ (Tap "Done")
PHR Record Edit Screen (documents now linked)
```

### Database Schema

```typescript
interface DocumentAssociation {
  id: string;
  documentId: string; // FK to documents table
  entityType: 'allergy' | 'medication' | 'surgery' | 'immunization' | 'supplement' | 'condition';
  entityId: string; // FK to the specific record
  createdAt: Date;
}
```

---

## 📊 System/Body System Classification

From Screen #10, documents are tagged with body systems. Examples observed:

- **Cardiac**: Heart-related (prescriptions, test results)
- **Endocrine**: Hormone-related (lab results for thyroid, diabetes)
- **Nervous**: Neurological (consultations, imaging)
- **Renal**: Kidney-related
- **Immune**: Immunology (allergies, immunizations)

**Full List** (inferred from medical records standard):
- Cardiovascular (Cardiac)
- Endocrine
- Nervous/Neurological
- Renal/Urinary
- Immune/Immunological
- Respiratory
- Gastrointestinal
- Musculoskeletal
- Integumentary (Skin)
- Reproductive
- Other

---

## 🔐 Privacy & Sharing Features

### Private Documents

- **Icon**: 🔒 Padlock (filled when active)
- **Toggle**: "Make Private" checkbox in edit/create mode
- **Behavior**: Private documents are not included in "Share Your Health Record" exports
- **Use Cases**:
  - Mental health records
  - Sensitive test results
  - Personal notes

### Highlighted Documents

- **Icon**: ⭐ Star (filled when active)
- **Toggle**: "Highlight this file" checkbox
- **Behavior**: Highlighted documents appear at top of lists, easier to find
- **Use Cases**:
  - Current prescriptions
  - Recent lab results
  - Emergency contacts

---

## 🏷️ Tagging System

### Tag Features

- **Free-text**: User can create any tag
- **Multi-tag**: Each document can have multiple tags
- **Display**: Black pills with white text (42px height)
- **Delete**: Tap × icon to remove tag
- **Search**: Tags are searchable (via Search field)

### Example Tag Use Cases

- Year: "2023", "2024"
- Provider: "Dr. Smith", "General Hospital"
- Urgency: "Urgent", "Review", "Archived"
- Type: "Prescription", "Receipt", "Insurance"

---

## 📐 Component Specifications

### Buttons

**Primary Button** (Black):
- Background: #000000
- Text: White, 16px, ExtraBold
- Height: 58px (large) or 42px (small)
- Border radius: 4px
- Padding: 16px horizontal

**Secondary Button** (Gray):
- Background: #EEEEEE
- Border: 1px solid #666666
- Text: Black, 16px, ExtraBold
- Height: 58px
- Border radius: 4px

**Tertiary Button** (White):
- Background: #FFFFFF
- Border: 1px solid #666666 or #000000
- Text: Black, 14px or 16px, Bold/ExtraBold
- Height: 42px or 58px
- Border radius: 4px

### Input Fields

**Text Input**:
- Height: 58px
- Border: 1px solid #CCCCCC
- Border radius: 4px
- Padding: 20px horizontal
- Placeholder: 16px, Medium, #666666

**Dropdown**:
- Height: 58px
- Border: 1px solid #CCCCCC
- Border radius: 4px
- Padding: 8px horizontal (16px)
- Label: 14px, Medium, #666666 (top)
- Value: 16px, Bold, #000000 (bottom)
- Icon: Down arrow, 24px, right-aligned

### Icons

**Document Type Icons**:
- Size: 48px × 48px
- Types: Folder, Image, Word/Document, Audio
- Color: Varies by type

**Action Icons**:
- Size: 24px × 24px
- Types: Plus (+), Star (⭐), Padlock (🔒), Delete (🗑️), Camera (📷)

**Drag Handle**:
- Size: 16px width
- Icon: ☰ (three horizontal lines)

### File/Folder Cards

**Folder Card**:
- Background: #EEEEEE (Browse mode) or white (Association mode)
- Border: 1px solid #666666
- Border radius: 4px
- Padding: 16px
- Height: Auto (contains icon + 2 lines of text)

**File Card**:
- Background: White
- Border: 1px solid #666666
- Border radius: 4px
- Padding: 16px
- Height: Auto

### Toggle Tabs (Browse/Inbox)

**Active Tab**:
- Background: #000000
- Text: White, 14px, ExtraBold
- Height: 42px
- Border radius: 4px (top-left for Browse, top-right for Inbox)

**Inactive Tab**:
- Background: White
- Border: 1px solid #666666
- Text: Black, 14px, ExtraBold
- Height: 42px

---

## 🔄 User Flows

### Flow 1: Add New Document from Scratch

```
Main Screen (#1)
   ↓ Tap "Add New Document"
Screen #8: Add New (Camera/Upload) [Not extracted]
   ↓ Take photo or select file
Screen #9: Add another Photo + Details
   ↓ Either "Take another Photo" or "Add photo details"
Screen #10: New Document Details
   ↓ Fill Name, Folder, System, Date, Tags
   ↓ Toggle Highlight/Private
   ↓ Tap "Save"
Main Screen (#1) - Document added
```

### Flow 2: Associate Existing Document with PHR Record

```
Allergy Edit Screen (example)
   ↓ Tap "+ Add Documents"
Screen #5: Add/Associate (Browse All)
   ↓ Browse folders or scroll to file
   ↓ Tap + icon(s) to select
   ↓ Tap "Done"
Allergy Edit Screen - Documents now linked
```

### Flow 3: View Document Details

```
Main Screen (#1) or Folder View (#2/#3)
   ↓ Tap on document card
Screen #11: Document Details (View)
   ↓ View metadata, tags, privacy status
   ↓ Optionally tap "Edit"
Screen #12: Edit Document [Not extracted, similar to #10]
   ↓ Make changes
   ↓ Tap "Save"
Screen #11: Document Details (updated)
```

### Flow 4: Browse vs. Inbox

```
Main Screen (#1) - Browse tab active (default)
   ↓ See folders + organized files
   ↓ Tap "Inbox" tab
Screen #4: My Documents - Inbox
   ↓ See date-only list of incoming documents
   ↓ Tap a document to view/organize
   ↓ (Add name, move to folder, etc.)
```

---

## 📋 Data Model

### Documents Table

```typescript
interface Document {
  id: string;
  patientId: string;

  // Core metadata (required)
  name: string; // User-provided name
  folderId: string; // FK to folders (Prescriptions, Lab Results, etc.)
  system: BodySystem; // Cardiac, Endocrine, etc.

  // Optional metadata
  date?: Date; // Document date (default: upload date)
  tags?: string[]; // User-created tags

  // Privacy/organization
  isPrivate: boolean; // Default: false
  isHighlighted: boolean; // Default: false

  // File storage
  fileUrl: string; // S3/Supabase Storage URL
  fileType: FileType; // 'image' | 'pdf' | 'audio' | 'word' | 'other'
  fileSizeBytes: number;

  // Timestamps
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
```

### Folders Table (Pre-defined)

```typescript
interface Folder {
  id: string;
  name: string; // "Prescriptions", "Lab Results", etc.
  sortOrder: number; // Display order
  icon: string; // Icon identifier
}

const DEFAULT_FOLDERS: Folder[] = [
  { id: '1', name: 'Prescriptions', sortOrder: 1, icon: 'folder' },
  { id: '2', name: 'Lab Results', sortOrder: 2, icon: 'folder' },
  { id: '3', name: 'Imaging', sortOrder: 3, icon: 'folder' },
  { id: '4', name: 'Consult', sortOrder: 4, icon: 'folder' },
  { id: '5', name: 'Other', sortOrder: 5, icon: 'folder' },
];
```

### Document Associations Table

```typescript
interface DocumentAssociation {
  id: string;
  documentId: string; // FK to documents
  entityType: 'allergy' | 'medication' | 'surgery' | 'immunization' | 'supplement' | 'condition';
  entityId: string; // FK to the specific PHR record
  createdAt: Date;
}
```

---

## 🗂️ Database Schema (SQL)

```sql
-- Folders (pre-seeded)
CREATE TABLE document_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- "Prescriptions", "Lab Results", etc.
  sort_order INTEGER NOT NULL,
  icon VARCHAR(50) DEFAULT 'folder',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) NOT NULL,

  -- Core metadata
  name VARCHAR(255) NOT NULL,
  folder_id UUID REFERENCES document_folders(id) NOT NULL,
  system VARCHAR(50) NOT NULL, -- Body system enum

  -- Optional metadata
  document_date DATE, -- When the document is from (default: uploaded_at)
  tags TEXT[], -- PostgreSQL array for tags

  -- Privacy/organization
  is_private BOOLEAN DEFAULT FALSE,
  is_highlighted BOOLEAN DEFAULT FALSE,

  -- File storage
  file_url TEXT NOT NULL, -- S3/Supabase Storage URL
  file_type VARCHAR(20) NOT NULL, -- 'image', 'pdf', 'audio', 'word', 'other'
  file_size_bytes INTEGER,

  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document associations (link docs to PHR records)
CREATE TABLE document_associations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'allergy', 'medication', etc.
  entity_id UUID NOT NULL, -- FK to the specific record
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(document_id, entity_type, entity_id) -- Prevent duplicates
);

-- Indexes
CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_highlighted ON documents(patient_id, is_highlighted) WHERE is_highlighted = TRUE;
CREATE INDEX idx_documents_tags ON documents USING GIN (tags); -- For tag searches
CREATE INDEX idx_doc_associations_document ON document_associations(document_id);
CREATE INDEX idx_doc_associations_entity ON document_associations(entity_type, entity_id);

-- Seed default folders
INSERT INTO document_folders (name, sort_order, icon) VALUES
  ('Prescriptions', 1, 'folder'),
  ('Lab Results', 2, 'folder'),
  ('Imaging', 3, 'folder'),
  ('Consult', 4, 'folder'),
  ('Other', 5, 'folder');
```

---

## 🎨 Design Tokens

### Colors
- **Primary (Black)**: #000000 - Primary buttons, active tabs
- **Secondary (Gray)**: #EEEEEE - Secondary buttons, folder backgrounds
- **Border Light**: #CCCCCC - Input borders
- **Border Dark**: #666666 - Button borders, file cards
- **Text Primary**: #000000 - Titles, values
- **Text Secondary**: #666666 - Labels, placeholders
- **Link**: #1A73E8 - "Show more" links
- **Background**: #FFFFFF - Page background

### Typography
- **H1**: 24px, Bold, Black - Page titles
- **H2**: 20px, Bold, Black - Document/folder names
- **Body**: 16px, Medium, Black/Gray - Text fields, subtitles
- **Button**: 16px, ExtraBold, White/Black - Buttons
- **Small**: 14px, Medium/Bold, Gray/Black - Labels, tags

### Spacing
- **Page padding**: 16px
- **Field gap**: 16px vertical
- **Button height (large)**: 58px
- **Button height (small)**: 42px
- **Input height**: 58px
- **Icon size (large)**: 48px
- **Icon size (small)**: 24px
- **Border radius**: 4px
- **Separator**: 2px height

---

## ✅ Implementation Checklist

### Must Have (Core Functionality)

- [ ] **Folder System**: 5 pre-defined folders (Prescriptions, Lab Results, Imaging, Consult, Other)
- [ ] **Document Upload**: Camera capture + file picker
- [ ] **Metadata Management**: Name, Folder, System, Date, Tags
- [ ] **Privacy Controls**: Private/Public toggle, Highlighted toggle
- [ ] **Browse/Inbox Views**: Toggle between organized and incoming
- [ ] **Document Association**: Link documents to allergies, medications, surgeries, immunizations, supplements, conditions
- [ ] **Search**: Search documents by name, tags, system
- [ ] **Filter**: Filter by folder, system, date range, privacy status

### Should Have (Enhanced UX)

- [ ] **Multi-photo Upload**: "Take another Photo" workflow
- [ ] **Drag to Reorder**: ☰ drag handle for custom sorting
- [ ] **Show More**: Pagination for large document lists
- [ ] **Tag Autocomplete**: Suggest existing tags when adding new ones
- [ ] **System Icons**: Visual icons for body systems
- [ ] **File Type Detection**: Auto-detect file type from upload

### Nice to Have (Future Enhancements)

- [ ] **OCR**: Extract text from prescription images
- [ ] **FHIR Export**: Export documents as FHIR DocumentReference
- [ ] **Share Individual Documents**: Share single document vs. entire health record
- [ ] **Version History**: Track document updates/replacements
- [ ] **Expiration Dates**: Mark prescriptions with expiry dates
- [ ] **Reminders**: Remind to renew expiring prescriptions

---

## 🔗 Related Documents

- [ARKPASS_6_GAP_ANALYSIS.md](ARKPASS_6_GAP_ANALYSIS.md) - Gap analysis showing how "My Documents" fills Visit Notes and Lab Results needs
- [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) - Example of "+ Add Documents" pattern
- [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md) - Documents section example
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Central index of all specifications

---

## 📝 Open Questions

1. **Screen #8 (My Documents - Add New)**: Not extracted due to timeout - need to understand initial camera/upload screen
2. **Screen #12 (Edit Document)**: Not extracted - likely similar to Screen #10 (New Document Details)
3. **Folder Customization**: Can users create custom folders, or are the 5 folders fixed?
4. **File Size Limits**: What are the max file sizes for uploads?
5. **Storage Provider**: S3, Supabase Storage, or other?
6. **FHIR Mapping**: How do documents map to FHIR DocumentReference resource?
7. **Provider Sharing**: Can providers upload directly to patient's Inbox?
8. **Deletion**: Is document deletion soft-delete or hard-delete?

---

**Extraction Complete**: 11/12 screens documented
**Next Steps**:
1. Fill gaps (screens #8 and #12)
2. Implement document upload workflow
3. Build folder navigation
4. Create document association UI for all PHR records
