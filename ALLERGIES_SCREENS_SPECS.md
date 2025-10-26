# Allergies Screens - Complete Figma Extraction

**Extraction Date**: 2025-10-25
**Source**: Figma section `1374:8693` - Allergies
**Total Screens**: 7

---

## 🚨 IMPORTANT: Expansion Beyond Figma

This document extracts the 7 screens visible in Figma. However, **product requirements extend significantly beyond these screens**. See **[ALLERGIES_EXPANSION_SPEC.md](ALLERGIES_EXPANSION_SPEC.md)** for the complete allergy/sensitivity tracking system including:

- **5 Allergy Categories**: Medication, Food, Seasonal, Skin/Contact, Environmental
- **Allergy vs Sensitivity Distinction**: Separate field for clinical accuracy
- **Severity Classification**: Severe (anaphylaxis risk) vs Not Severe
- **EpiPen Tracking**: Yes/No field for severe allergies
- **Multi-Select Symptoms**: Category-specific symptom lists
- **Enhanced Details Field**: Free-text for additional context

**For implementation**: Use this document for UI layout/screens, refer to ALLERGIES_EXPANSION_SPEC.md for complete data model and business logic.

---

## Screen Overview

| # | Screen Name | Node ID | State | Purpose |
|---|---|---|---|---|
| 1 | Allergies List | 1483:8437 | Default | List view of all allergies |
| 2 | View Allergy | 1483:8438 | Collapsed | View single allergy (collapsed) |
| 3 | View Allergy | 1483:8439 | Expanded | View single allergy (expanded with hidden fields) |
| 4 | Edit Allergy | 1483:8440 | Collapsed | Edit allergy (collapsed) |
| 5 | Edit Allergy | 1483:8441 | Expanded | Edit allergy (expanded with hidden fields) |
| 6 | Add Allergy | 1483:8442 | Collapsed | Add new allergy (collapsed) |
| 7 | Add Allergy | 1483:8443 | Expanded | Add new allergy (expanded with hidden fields) |

---

## 1. Allergies List (Node: 1483:8437)

### Layout
- **Screen Title**: "Allergies"
- **Top Action**: "Share Your Health Record" button (black, full-width)
- **Quick Add**: Input field + "Add" button (inline)
- **Secondary Action**: "+ Add with details" (outlined button)

### Sections

#### Medication Allergies Section
- **Section Header**: "MEDICATION ALLERGIES" (uppercase, bold)
- **Example Allergies Shown**:
  - Penicillins
  - Erythromycin
- **Allergy Cards**: Border, padding, clickable

#### Environmental/Seasonal/Skin/Other Section
- **Section Header**: "ENVIRONMENTAL/SEASONAL/SKIN/OTHER" (uppercase, bold)
- **Empty State**: "No environmental/seasonal/skin/other allergies"

### Fields & Components

**Quick Add Input**:
- Type: Text input with inline button
- Label: "Quick Add"
- Button: "Add" (black background)
- Border: Left side has border, right side (button) has rounded corners

**Add with Details Button**:
- Type: Outlined button
- Label: "+ Add with details"
- Border: #666666
- Height: 42px

**Allergy Card**:
- Border: 1px solid #666666
- Padding: 16px
- Border-radius: 4px
- Content: Allergy name in bold (20px)
- Clickable/tappable

### Categories Shown in Figma

**Visible in List Screen**:
1. **MEDICATION ALLERGIES** - Shown with example entries (Penicillins, Erythromycin)
2. **ENVIRONMENTAL/SEASONAL/SKIN/OTHER** - Shown with empty state

**⚠️ PRODUCT EXPANSION**: Full system supports 5 distinct categories:
- Medication
- Food (not shown in Figma, but required)
- Seasonal
- Skin/Contact
- Environmental

See [ALLERGIES_EXPANSION_SPEC.md](ALLERGIES_EXPANSION_SPEC.md) for complete category specifications.

### Quick Add Pattern

**What Figma shows**:
- Inline text input with "Add" button
- Appears to create name-only entry

**Implementation** (from QUICK_ADD_PATTERN.md):
- Quick Add creates minimal record with **Name only**
- User must later edit to add Category, Type, Severity, Symptoms, etc.
- Records created via Quick Add are flagged as "incomplete"
- "+ Add with details" button opens full form with all fields

---

## 2. View Allergy - Collapsed (Node: 1483:8438)

### Layout
- **Header**: Back arrow + Allergy name ("Penicillins") + "Edit" button
- **Form Content**: Name field visible
- **Show More Toggle**: "Show more" link (blue text)
- **Documents Section**: List of associated documents
- **Bottom Action**: "Delete" button (with delete icon)

### Visible Fields (Collapsed State)

**Field 1: Name**
- Label: "Name" (grey, 14px)
- Value: "Penicillins" (bold, 16px, 24px line-height)
- Type: Read-only display

### Hidden Fields
- Onset (revealed when "Show more" clicked)
- Details (revealed when "Show more" clicked)

### Documents Section
- **Header**: "DOCUMENTS" (uppercase, bold)
- **Document 1**: Listed
- **Document 2**: Listed
- **Documents**: Appear to be hyperlinks/clickable

### Actions

**Edit Button**:
- Type: Outlined button
- Label: "Edit"
- Width: 77px
- Height: 42px
- Border: #666666

**Delete Button**:
- Type: Text button with icon
- Icon: Delete/trash icon (24px)
- Label: "Delete" (grey text)
- Height: 58px

---

## 3. View Allergy - Expanded (Node: 1483:8439)

### Layout
Same as collapsed, but with additional fields revealed

### All Visible Fields (Expanded State)

**Field 1: Name**
- Label: "Name" (grey, 14px)
- Value: "Penicillins" (bold, 16px)

**Field 2: Onset** ⚠️ CRITICAL
- Label: "Onset" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: What are the possible values for Onset?
  - Date/time period? (like conditions)
  - Age? ("When I was 5 years old")
  - Text description? ("Childhood", "Adulthood", "Unknown")

**Field 3: Details**
- Label: "Details" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: Free-form text field for description?
  - Symptoms/reaction description?
  - Severity?
  - Treatment notes?

### Show Less Toggle
- **Text**: "Show less" (blue link)
- **Action**: Collapse to hide Onset and Details fields

---

## 4. Edit Allergy - Collapsed (Node: 1483:8440)

### Layout
- **Header**: Back arrow + Allergy name + "Save" button (black)
- **Form Content**: Editable fields
- **Show More Toggle**: "Show more" link
- **Documents Section**: List with delete icons
- **Bottom Actions**: "+ Add Documents" button + "Delete" button

### Editable Fields (Collapsed State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)" (grey, 14px)
- Value: "Penicillins" (bold, 16px)
- Border: 1px solid #CCCCCC
- Background: White
- Height: 58px
- Padding: 8px 16px

### Documents Section (Edit Mode)

**Document Items**:
- Document name on left
- Delete icon (24px) on right
- Each document can be removed individually

**Add Documents Button**:
- Type: Button
- Label: "+ Add Documents"
- Background: #EEEEEE
- Border: 1px solid #666666
- Height: 58px
- Full-width

### Actions

**Save Button**:
- Type: Filled button (black background)
- Label: "Save" (white text)
- Width: 86px
- Height: 42px

**Delete Button** (bottom):
- Same as View mode
- Icon + "Delete" text (grey)

---

## 5. Edit Allergy - Expanded (Node: 1483:8441)

### Layout
Same as collapsed Edit, but with additional editable fields

### All Editable Fields (Expanded State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)"
- Value: "Penicillins"
- Height: 58px

**Field 2: Onset** ⚠️ CRITICAL
- Type: Date picker input (has calendar icon)
- Label: "Onset"
- Icon: Calendar icon (24px) on right
- Height: 58px
- Border: 1px solid #CCCCCC
- **CRITICAL QUESTION**: Does this use the same date/time framework as Conditions?
  - Framework 1 (Within 1yr/5yr/Over 5yr/Age)?
  - Framework 2 (Within 1mo/6mo/2yr/More 2yr)?
  - Different framework?
  - Simple date picker?

**Field 3: Details**
- Type: Multi-line text input (textarea)
- Label: "Details"
- Height: 90px (taller for multi-line text)
- Border: 1px solid #CCCCCC
- Placeholder: "Details" (grey text)

### Show Less Toggle
- **Text**: "Show less" (blue link)
- **Action**: Collapse to hide Onset and Details fields

---

## 6. Add Allergy - Collapsed (Node: 1483:8442)

### Layout
- **Header**: Back arrow + "Add Allergy" title + "Save" button (black)
- **Form Content**: Empty fields ready for input
- **Show More Toggle**: "Show more" link
- **Documents Section**: Empty state with add button

### Fields (Collapsed State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)" (grey placeholder)
- Value: Empty
- Height: 58px
- Border: 1px solid #CCCCCC

### Documents Section (Empty State)

**No Documents State**:
- Text: "No Documents" (centered)
- Padding: 16px vertical

**Add Documents Button**:
- Type: Button
- Label: "+ Add Documents"
- Background: #EEEEEE
- Border: 1px solid #666666
- Height: 58px

### Actions

**Save Button**:
- Type: Filled button (black)
- Label: "Save"
- Width: 86px
- Enabled even with empty form (validation on submit?)

---

## 7. Add Allergy - Expanded (Node: 1483:8443)

### Layout
Same as collapsed Add, but with additional empty fields

### All Fields (Expanded State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)"
- Empty

**Field 2: Onset**
- Type: Date picker input
- Label: "Onset"
- Icon: Calendar icon (24px)
- Empty

**Field 3: Details**
- Type: Multi-line text input
- Label: "Details"
- Height: 90px
- Empty

### Show Less Toggle
- **Text**: "Show less" (blue link)
- **Action**: Collapse to hide Onset and Details

---

## Design Specifications

### Typography

**Screen Title (H1)**:
- Font: Public Sans Bold
- Size: 24px
- Weight: 700
- Color: #000000
- Line-height: 100%
- Tracking: -0.3333px

**Allergy Name (H2)**:
- Font: Public Sans Bold
- Size: 20px
- Weight: 700
- Color: #000000
- Line-height: 100%

**Section Headers**:
- Font: Public Sans Bold
- Size: 16px
- Weight: 700
- Color: #000000
- Text-transform: Uppercase

**Field Labels**:
- Font: Public Sans Medium
- Size: 14px
- Weight: 500
- Color: #666666

**Field Values**:
- Font: Public Sans Bold
- Size: 16px
- Weight: 700
- Color: #000000
- Line-height: 24px

**Body Text**:
- Font: Public Sans Medium
- Size: 16px
- Weight: 500
- Color: #000000

**Links**:
- Font: Public Sans Medium
- Size: 16px
- Color: #1A73E8 (blue)

**Button Text (Filled)**:
- Font: Public Sans ExtraBold
- Size: 16px
- Weight: 800
- Color: #FFFFFF

**Button Text (Outlined)**:
- Font: Public Sans ExtraBold
- Size: 14px
- Weight: 800
- Color: #000000

### Colors

- **Black**: #000000
- **White**: #FFFFFF
- **Grey (text/borders)**: #666666
- **Grey (labels)**: #666666
- **Light Grey (backgrounds)**: #EEEEEE
- **Border Grey**: #CCCCCC
- **Link Blue**: #1A73E8

### Spacing

- **Screen padding**: 16px
- **Section gap**: 24px
- **Form field gap**: 16px
- **Card padding**: 16px
- **Button height (primary)**: 58px
- **Button height (secondary)**: 42px
- **Input field height**: 58px
- **Textarea height**: 90px

### Borders & Radii

- **Input border**: 1px solid #CCCCCC
- **Button border**: 1px solid #666666
- **Card border**: 1px solid #666666
- **Border-radius**: 4px
- **Separator height**: 2px (#CCCCCC)

---

## Critical Questions & Gaps

### 1. Onset Field Date/Time Framework

**Question**: What date/time selection framework does Onset use?

**Possibilities**:
- **Option A**: Same as Conditions Framework 1 (Within 1yr/5yr/Over 5yr/Age)
- **Option B**: Same as Conditions Framework 2 (Within 1mo/6mo/2yr/More 2yr)
- **Option C**: Different framework specific to allergies
- **Option D**: Simple calendar date picker (month/year or full date)
- **Option E**: Text-based ("Childhood", "Adulthood", "Unknown")

**Why Important**: Determines database schema and UI implementation

**Recommendation**: Likely uses Conditions Framework 1 since allergies are typically long-term like chronic conditions

---

### 2. Quick Add vs Add with Details

**Question**: What's the functional difference?

**Hypothesis**:
- **Quick Add**: Name only, minimal friction, fast entry
  - Onset: defaults to null/unknown
  - Details: defaults to empty
  - Documents: defaults to empty
- **Add with Details**: Opens full form with all fields
  - Forces user to consider Onset and Details
  - Prompts for document upload

**Why Important**: Determines UX flow and validation rules

---

### 3. Allergy Categories

**Question**: Are categories predefined or user-defined?

**Observed Categories**:
1. Medication Allergies
2. Environmental/Seasonal/Skin/Other

**Missing Categories** (common in medical systems):
3. Food Allergies
4. Insect/Animal Allergies

**Why Important**: Determines:
- Database schema (category field)
- UI organization (separate sections)
- Filtering/search logic

**Recommendation**: Add category field to data model, even if UI only shows two categories currently

---

### 4. Onset Field Validation

**Question**: Is Onset required or optional?

**Observed**: Shows "N/a" when empty in View mode
**Implication**: Optional field (unlike Name which is Required)

**Follow-up**: If optional, what's the default display?
- "N/a"
- "Unknown"
- Empty/hidden
- "Not specified"

---

### 5. Details Field Format

**Question**: Is Details a free-form text field or structured?

**Observed**: Multi-line text input (90px height)
**Implication**: Free-form text, no structured data

**Possible Use Cases**:
- Describe reaction symptoms
- Note severity
- Record treatment/management notes
- Document cross-reactivity

**Why Important**: Affects:
- Database field type (TEXT vs structured JSON)
- Search/filtering capabilities
- Display logic

---

### 6. Document Association Logic

**Question**: How do documents get associated with allergies?

**Observed**:
- Documents listed in allergy view/edit
- "+ Add Documents" button
- Delete icon per document in edit mode

**Missing Details**:
- Document upload flow
- Document types accepted
- Max number of documents
- Document preview/download

**Recommendation**: Likely shares same document association pattern as Conditions and Medications

---

### 7. Severity/Reaction Type

**Question**: Is there a severity or reaction type field?

**Observed**: Not visible in any extracted screen
**But Common in Medical Systems**:
- Severity: Mild, Moderate, Severe, Life-threatening
- Reaction Type: Rash, Anaphylaxis, Nausea, etc.

**Why Missing?**:
- Could be in Details field (free text)
- Could be future enhancement
- Could be in a different workflow

**Recommendation**: Consider adding structured severity field in database, even if not in UI yet

---

## Data Model Implications

Based on extracted screens, proposed schema:

```typescript
interface Allergy {
  id: string;
  patientId: string;

  // Core fields
  name: string; // Required
  category: 'medication' | 'environmental_seasonal_skin_other' | 'food' | 'insect_animal';

  // Optional fields (revealed in expanded view)
  onset?: AllergyOnsetDate; // Date selection framework
  details?: string; // Free-form text

  // Potential future fields (not in UI yet)
  severity?: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  reactionType?: string;

  // Document associations
  documents?: AllergyDocument[];

  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdVia: 'quick_add' | 'add_with_details' | 'edit';
}

interface AllergyOnsetDate {
  // Uses same framework as Conditions (likely Framework 1)
  type: 'within_1yr' | 'within_5yr' | 'over_5yr' | 'age' | 'unknown';

  // If type = 'age'
  ageValue?: number;

  // Progressive disclosure
  year?: number;
  month?: number;
  day?: number;
  precision?: 'year' | 'month' | 'day';

  // Computed date
  computedDate?: Date;
}

interface AllergyDocument {
  documentId: string;
  allergyId: string;
  // Links to Document entity
}
```

---

## Navigation Flow

### From Allergies List

**Tap Allergy Card** → View Allergy (Collapsed)

**Tap "Quick Add" + Enter Name + Tap "Add"** →
- Save allergy with name only
- Refresh list
- Show success feedback?

**Tap "+ Add with details"** → Add Allergy (Expanded)

### From View Allergy

**Tap "Edit"** → Edit Allergy (same state - collapsed or expanded)

**Tap "Show more"** → View Allergy (Expanded)

**Tap "Show less"** → View Allergy (Collapsed)

**Tap "Delete"** → Confirmation dialog? → Delete → Back to Allergies List

**Tap Document** → View Document (separate flow)

**Tap Back Arrow** → Allergies List

### From Edit Allergy

**Tap "Save"** → Validate → Save → View Allergy (same state)

**Tap "Show more"** → Edit Allergy (Expanded)

**Tap "Show less"** → Edit Allergy (Collapsed)

**Tap "Delete" on Document** → Remove document association

**Tap "+ Add Documents"** → Document picker/selector

**Tap "Delete" (bottom)** → Confirmation dialog → Delete → Back to Allergies List

**Tap Back Arrow** → Discard changes confirmation? → View Allergy or Allergies List

### From Add Allergy

**Tap "Save"** → Validate (Name required) → Save → View Allergy (Collapsed)

**Tap "Show more"** → Add Allergy (Expanded)

**Tap "Show less"** → Add Allergy (Collapsed)

**Tap "+ Add Documents"** → Document picker/selector

**Tap Back Arrow** → Discard confirmation if fields filled → Allergies List

---

## Comparison with Conditions & Medications

### Similarities

1. **Progressive Disclosure Pattern**: "Show more" / "Show less" toggle
2. **Document Association**: Same pattern for linking documents
3. **Edit/View Separation**: Separate screens for viewing vs editing
4. **Collapsed/Expanded States**: Hidden fields revealed on expansion
5. **Delete Button**: Placed at bottom in view/edit screens
6. **Required Name Field**: Core identifier field marked as required

### Differences

1. **No Multi-Entity Association**:
   - Medications can link to multiple conditions
   - Allergies appear standalone (no condition linking shown)

2. **Simpler Data Model**:
   - Only 3 core fields (Name, Onset, Details)
   - No dosage, frequency, route, status like Medications
   - No type selection like Conditions (Chronic/Transient)

3. **Categories in List View**:
   - Allergies list shows category headers
   - Conditions/Medications don't show category grouping

4. **Quick Add Feature**:
   - Allergies have inline quick-add input
   - Conditions/Medications only have "+ Add" button

5. **No Certainty Toggle**:
   - Medications have certainty when linking to conditions
   - Allergies don't show certainty markers
   - Could be implicit (all allergies are "known allergies")

---

## Validation Rules (Inferred)

### On Save

**Name Field**:
- Required: Yes
- Min length: 1 character
- Max length: TBD (reasonable limit like 100 chars)
- Format: Free text
- Validation message: "Name is required"

**Onset Field**:
- Required: No
- Validation: Date must be in past
- Validation: Cannot be in future

**Details Field**:
- Required: No
- Max length: TBD (reasonable limit like 500-1000 chars)
- Format: Free text

### On Quick Add

**Name Field**:
- Same as regular save
- Other fields auto-default to null/empty

---

## UI States Not Extracted

### Loading States
- Loading allergies list
- Saving allergy
- Deleting allergy

### Error States
- Save failed
- Delete failed
- Validation errors
- Network errors

### Empty States
- ✅ "No environmental/seasonal/skin/other allergies" (extracted)
- ✅ "No Documents" (extracted)
- No medication allergies state (not shown)
- No allergies at all state (not shown)

### Success States
- Allergy saved successfully
- Allergy deleted successfully

---

## Next Steps

### Immediate Questions for User/Stakeholder

1. **What date/time framework does Onset use?** (Framework 1, Framework 2, or custom?)
2. **Are there other allergy categories besides Medication and Environmental?** (Food, Insect, etc.)
3. **Is Severity a field?** (If yes, what are the options?)
4. **Is Reaction Type a field?** (If yes, structured or free text?)
5. **How does Quick Add autocomplete work?** (Database of common allergies? API?)
6. **What happens when user taps a document?** (View, download, open in viewer?)
7. **Is there an association between allergies and medications?** (e.g., flagging contraindicated meds)

### Documentation to Create

1. **ALLERGIES_DATE_FIELD_LOGIC.md** - If using date framework
2. **ALLERGIES_VALIDATION_RULES.md** - Complete validation specification
3. **ALLERGIES_FLOW_DIAGRAM.md** - ASCII flow diagrams
4. **ALLERGIES_LOGIC_RULES.all** - Logic in ALL notation

### Implementation Tasks

1. Determine Onset date framework (reuse or new)
2. Create database schema for Allergy entity
3. Implement Quick Add autocomplete (if applicable)
4. Build progressive disclosure toggle
5. Implement document association flow
6. Create validation rules
7. Design loading/error/success states

---

## Summary

### What We Know ✅

- **7 screens extracted** (List, View collapsed/expanded, Edit collapsed/expanded, Add collapsed/expanded)
- **3 core fields**: Name (required), Onset (optional), Details (optional)
- **2 categories shown**: Medication Allergies, Environmental/Seasonal/Skin/Other
- **Progressive disclosure pattern**: "Show more" / "Show less" toggle
- **Document association**: Same pattern as Conditions/Medications
- **Quick Add feature**: Inline name-only add
- **Design specs**: Complete typography, colors, spacing extracted

### What We Don't Know ❓

- **Onset date framework**: Which framework or custom?
- **Additional categories**: Food, Insect allergies?
- **Severity field**: Structured or in Details text?
- **Reaction type field**: Exists or not?
- **Quick Add autocomplete**: Implementation details
- **Allergy-Medication linking**: Contraindication flagging?

### Status

✅ **Complete Figma extraction** - All 7 screens documented
⚠️ **Partial specification** - Missing date framework details and optional fields
📋 **Next**: User clarification on date framework and additional fields

---

**Extraction complete. Ready for logic documentation once date framework is confirmed.**
