# Allergies - Comprehensive System Specification

**Status**: ✅ Product requirements confirmed by user
**Date**: 2025-10-25
**Scope**: Expansion beyond Figma screens to complete allergy/sensitivity tracking system

---

## Executive Summary

The allergies feature requires significant expansion beyond what's visible in current Figma screens. This specification documents the complete allergy and sensitivity tracking system, including:

- **5 distinct allergy categories** (Medication, Food, Seasonal, Skin/Contact, Environmental)
- **Allergy vs Sensitivity distinction** (separate fields)
- **Severity classification** (Severe vs Not Severe)
- **EpiPen tracking** (Yes/No field)
- **Multi-select symptoms** organized by category
- **Category-specific symptom lists** (different for Medication/Food vs Seasonal)
- **Free-text description** option for additional details

This represents a **major enhancement** to the basic 7-screen Figma extraction documented in [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md).

---

## 1. Allergy Categories

### 1.1 Category Field (New)

**Type**: Dropdown or Radio Button Group
**Label**: "Category"
**Required**: Yes
**Position**: Should appear early in form (before or after Name field)

**Options**:
1. **Medication** - Allergies to pharmaceutical drugs
2. **Food** - Allergies to food items
3. **Seasonal** - Seasonal allergies (pollen, ragweed, etc.)
4. **Skin/Contact** - Contact dermatitis, skin reactions
5. **Environmental** - Dust, mold, pet dander, etc.

**Implementation Notes**:
- Category selection determines which symptom list is shown (see Section 5)
- Category affects severity options and symptom vocabulary
- Consider grouping UI layout: First row = Category, Second row = Allergy vs Sensitivity

---

## 2. Allergy vs Sensitivity Distinction

### 2.1 Type Field (New)

**Type**: Radio button group or Toggle
**Label**: "Type"
**Required**: Yes
**Position**: After Category, before Name

**Options**:
1. **Allergy** - True allergic reaction (immune system response)
2. **Sensitivity** - Intolerance or adverse reaction (not immune-mediated)

**Display Examples**:
```
Type: ○ Allergy  ● Sensitivity

// Alternative layout:
[Allergy] [Sensitivity]  (toggle button style)
```

**Clinical Distinction**:
- **Allergy**: Immune system involvement (IgE-mediated), can cause anaphylaxis
- **Sensitivity**: Non-immune reaction (e.g., lactose intolerance, sulfite sensitivity)

**UI Impact**:
- If Type = "Allergy", Severity field is critical (especially "Severe" option)
- If Type = "Sensitivity", Severity may be less critical but still useful

---

## 3. Severity Classification

### 3.1 Severity Field (New)

**Type**: Radio button group or Dropdown
**Label**: "Severity"
**Required**: Strongly recommended (especially for Type = "Allergy")
**Position**: After Type, before Symptoms

**Options**:
1. **Severe** - Anaphylaxis risk, EpiPen required, life-threatening
2. **Not Severe** - Mild to moderate reactions, not life-threatening

**Conditional Logic**:
```typescript
if (severity === 'severe') {
  // Show EpiPen field (Section 4)
  // Show severe symptom list (anaphylaxis, difficulty breathing, etc.)
  // Consider adding alert/warning banner in UI
}

if (severity === 'not_severe') {
  // Show milder symptom list (hives, itchiness, rash, etc.)
  // EpiPen field may be hidden or grayed out
}
```

**Display in View Mode**:
```
Severity: Severe ⚠️  (show warning icon for severe)
Severity: Not Severe
```

---

## 4. EpiPen Tracking

### 4.1 EpiPen Field (New)

**Type**: Radio button group or Yes/No toggle
**Label**: "EpiPen Prescribed?"
**Required**: Conditional (required if Severity = "Severe")
**Position**: Immediately after Severity field

**Options**:
1. **Yes** - Patient has been prescribed an EpiPen
2. **No** - No EpiPen prescription

**Conditional Visibility**:
```typescript
// Option A: Always visible
epiPenField.visible = true

// Option B: Conditional (recommended)
epiPenField.visible = (severity === 'severe')

// Option C: Mandatory for severe
if (severity === 'severe') {
  epiPenField.required = true
}
```

**Display Examples**:
```
EpiPen Prescribed? ● Yes  ○ No

// Alternative:
EpiPen: [Yes] [No]  (toggle style)
```

**Implementation Notes**:
- Consider adding educational tooltip: "EpiPen is used for emergency treatment of severe allergic reactions (anaphylaxis)"
- If EpiPen = "Yes", consider showing reminder: "Always carry your EpiPen"
- May link to EpiPen expiration date tracking (future enhancement)

---

## 5. Multi-Select Symptoms by Category

### 5.1 Symptoms Field (New)

**Type**: Multi-select checkbox list
**Label**: "Symptoms" or "Reactions"
**Required**: No (optional but highly recommended)
**Position**: After EpiPen field, within "Show more" expanded section

**Implementation Pattern**:
```typescript
interface AllergySymptoms {
  selectedSymptoms: string[]; // Array of symptom IDs
  otherSymptomDescription?: string; // Free-text if "Other" selected
}
```

**UI Layout**:
```
Symptoms
☐ Symptom 1
☐ Symptom 2
☐ Symptom 3
☐ Other (specify): [_______________________]
```

---

### 5.2 Medication/Food Allergy Symptoms (Severe)

**Applicable when**:
- Category = "Medication" OR "Food"
- Severity = "Severe"

**Symptom List**:
1. ☐ **Anaphylaxis** - Life-threatening allergic reaction
2. ☐ **Difficulty breathing** - Shortness of breath, wheezing
3. ☐ **Swelling of face/throat/tongue** - Angioedema
4. ☐ **Swelling of lips** - Localized swelling
5. ☐ **Tightness in chest** - Chest constriction
6. ☐ **Rapid heartbeat** - Tachycardia
7. ☐ **Dizziness or fainting** - Loss of consciousness risk
8. ☐ **Severe drop in blood pressure** - Hypotension
9. ☐ **Nausea or vomiting** - Gastrointestinal symptoms
10. ☐ **Abdominal pain/cramping** - GI distress
11. ☐ **Other** (specify): [Free-text input]

**Notes**:
- These are emergency symptoms requiring immediate medical attention
- Consider adding warning banner: "⚠️ If experiencing these symptoms, use EpiPen and call 911"

---

### 5.3 Medication/Food Allergy Symptoms (Not Severe)

**Applicable when**:
- Category = "Medication" OR "Food"
- Severity = "Not Severe"

**Symptom List**:
1. ☐ **Hives** - Raised, itchy welts on skin
2. ☐ **Itchiness** - Generalized itching
3. ☐ **Rash** - Skin redness or irritation
4. ☐ **Mild swelling** - Localized, not throat/face
5. ☐ **Runny nose** - Rhinorrhea
6. ☐ **Watery eyes** - Lacrimation
7. ☐ **Mild nausea** - Upset stomach
8. ☐ **Headache** - Mild to moderate headache
9. ☐ **Other** (specify): [Free-text input]

**Notes**:
- These symptoms are uncomfortable but not life-threatening
- May still require medical attention or avoidance of allergen

---

### 5.4 Seasonal Allergy Symptoms

**Applicable when**:
- Category = "Seasonal"

**Symptom List**:
1. ☐ **Runny nose** - Rhinorrhea
2. ☐ **Itchy eyes** - Ocular itching
3. ☐ **Itchy nose** - Nasal itching
4. ☐ **Cough** - Dry or productive cough
5. ☐ **Sneezing** - Frequent sneezing
6. ☐ **Congestion** - Nasal congestion
7. ☐ **Watery eyes** - Lacrimation
8. ☐ **Post-nasal drip** - Mucus in throat
9. ☐ **Sinus pressure** - Facial pain/pressure
10. ☐ **Fatigue** - Tiredness, low energy
11. ☐ **Other** (specify): [Free-text input]

**Notes**:
- Seasonal allergies typically don't cause severe/life-threatening reactions
- Severity field may still apply (severe seasonal allergies can significantly impact quality of life)

---

### 5.5 Skin/Contact Allergy Symptoms

**Applicable when**:
- Category = "Skin/Contact"

**Symptom List** (Suggested):
1. ☐ **Rash** - Contact dermatitis
2. ☐ **Itchiness** - Pruritus
3. ☐ **Redness** - Erythema
4. ☐ **Swelling** - Localized swelling at contact site
5. ☐ **Blisters** - Vesicles or bullae
6. ☐ **Dry, cracked skin** - Xerosis
7. ☐ **Burning sensation** - Burning or stinging
8. ☐ **Hives** - Urticaria
9. ☐ **Other** (specify): [Free-text input]

**Notes**:
- Contact allergies typically localized to area of contact
- Severity can range from mild irritation to severe dermatitis

---

### 5.6 Environmental Allergy Symptoms

**Applicable when**:
- Category = "Environmental"

**Symptom List** (Suggested - similar to Seasonal):
1. ☐ **Runny nose**
2. ☐ **Itchy eyes**
3. ☐ **Sneezing**
4. ☐ **Cough**
5. ☐ **Wheezing** - Especially for dust/mold allergies
6. ☐ **Shortness of breath** - If severe/asthma-related
7. ☐ **Watery eyes**
8. ☐ **Congestion**
9. ☐ **Skin rash** - For pet dander, etc.
10. ☐ **Other** (specify): [Free-text input]

**Notes**:
- Environmental allergies (dust, mold, pet dander) can trigger asthma
- May overlap with respiratory symptoms

---

## 6. Free-Text Description

### 6.1 Details Field (Enhanced)

**Type**: Textarea
**Label**: "Details" or "Additional Notes"
**Required**: No
**Height**: 90px (multi-line)
**Position**: Within "Show more" expanded section, after Symptoms

**Purpose**:
- Capture additional context not covered by structured fields
- Document specific triggers (e.g., "Only allergic to raw tomatoes, not cooked")
- Note when allergy was diagnosed
- Record severity of past reactions
- Link to associated conditions (e.g., "Related to asthma")

**Placeholder Text**:
```
Enter additional details about this allergy/sensitivity...
```

**Example Entries**:
```
"First reaction occurred at age 5. Required hospitalization. Now carries EpiPen at all times."

"Mild intolerance to lactose. Can tolerate small amounts in baked goods but not milk."

"Seasonal allergy to ragweed pollen. Symptoms peak in late summer (August-September)."
```

---

## 7. Complete Data Model

### 7.1 TypeScript Interface

```typescript
interface Allergy {
  id: string;
  patientId: string;

  // Core identification (from Figma)
  name: string; // Required - allergen name (e.g., "Peanuts", "Penicillin", "Ragweed")

  // NEW FIELDS - Category and Type
  category: AllergyCategory; // Required
  type: 'allergy' | 'sensitivity'; // Required

  // NEW FIELDS - Severity and EpiPen
  severity?: AllergySeverity; // Recommended
  epiPenPrescribed?: boolean; // Required if severity = 'severe'

  // NEW FIELD - Multi-select symptoms
  symptoms?: {
    selectedSymptoms: string[]; // Array of symptom codes
    otherSymptomDescription?: string; // Free-text if "Other" selected
  };

  // Existing fields (from Figma)
  onset?: DualModeDate; // Date OR Age when allergy first occurred
  details?: string; // Enhanced - free-form notes
  documents?: AllergyDocument[]; // Supporting documentation

  // Audit fields
  createdAt: Date;
  updatedAt: Date;
}

// Category options
type AllergyCategory =
  | 'medication'
  | 'food'
  | 'seasonal'
  | 'skin_contact'
  | 'environmental';

// Severity options
type AllergySeverity =
  | 'severe' // Anaphylaxis risk, EpiPen required
  | 'not_severe'; // Mild to moderate reactions

// Symptom codes (examples)
type AllergySymptom =
  // Severe symptoms
  | 'anaphylaxis'
  | 'difficulty_breathing'
  | 'swelling_face_throat_tongue'
  | 'swelling_lips'
  | 'tightness_chest'
  | 'rapid_heartbeat'
  | 'dizziness_fainting'
  | 'severe_blood_pressure_drop'
  | 'nausea_vomiting'
  | 'abdominal_pain'
  // Not severe symptoms
  | 'hives'
  | 'itchiness'
  | 'rash'
  | 'mild_swelling'
  | 'runny_nose'
  | 'watery_eyes'
  | 'mild_nausea'
  | 'headache'
  // Seasonal symptoms
  | 'itchy_eyes'
  | 'itchy_nose'
  | 'cough'
  | 'sneezing'
  | 'congestion'
  | 'post_nasal_drip'
  | 'sinus_pressure'
  | 'fatigue'
  // Skin/Contact symptoms
  | 'redness'
  | 'blisters'
  | 'dry_cracked_skin'
  | 'burning_sensation'
  // Environmental symptoms
  | 'wheezing'
  | 'shortness_of_breath'
  | 'skin_rash'
  // Other
  | 'other';

interface AllergyDocument {
  id: string;
  allergyId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}
```

---

### 7.2 Database Schema

```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),

  -- Core identification
  name VARCHAR(255) NOT NULL,

  -- NEW: Category and Type
  category VARCHAR(50) NOT NULL, -- 'medication', 'food', 'seasonal', 'skin_contact', 'environmental'
  type VARCHAR(20) NOT NULL, -- 'allergy', 'sensitivity'

  -- NEW: Severity and EpiPen
  severity VARCHAR(20), -- 'severe', 'not_severe'
  epipen_prescribed BOOLEAN,

  -- NEW: Symptoms (stored as JSONB array)
  symptoms JSONB, -- { selectedSymptoms: ['anaphylaxis', 'hives'], otherSymptomDescription: '...' }

  -- Existing fields
  onset_raw JSONB, -- Dual-mode date data
  details TEXT, -- Enhanced free-form notes

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE allergy_documents (
  id UUID PRIMARY KEY,
  allergy_id UUID REFERENCES allergies(id),
  file_name VARCHAR(255),
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Index for category queries
CREATE INDEX idx_allergies_category ON allergies(category);

-- Index for severity queries (find all severe allergies)
CREATE INDEX idx_allergies_severity ON allergies(severity);

-- Index for EpiPen tracking
CREATE INDEX idx_allergies_epipen ON allergies(epipen_prescribed) WHERE epipen_prescribed = TRUE;
```

---

## 8. UI/UX Implementation Guidelines

### 8.1 Progressive Disclosure Strategy

**Collapsed State** (visible by default):
1. Name (Required)
2. Category (NEW - Required)
3. Type (NEW - Required - Allergy vs Sensitivity)
4. Severity (NEW - Recommended)
5. EpiPen (NEW - Conditional)
6. "Show more" link

**Expanded State** (when "Show more" clicked):
7. Symptoms (NEW - Multi-select)
8. Onset (Dual-mode date)
9. Details (Enhanced description)
10. Documents (Attachment section)
11. "Show less" link

**Rationale**:
- Critical safety information (Category, Type, Severity, EpiPen) visible immediately
- Detailed symptom tracking and documentation available in expanded view
- Maintains Quick Add pattern for name-only entries

---

### 8.2 Field Layout Recommendations

**Suggested Layout for Edit/Add Screens**:

```
┌─────────────────────────────────────┐
│  ← Allergies                   [Save]│
│                                     │
│  Name*                              │  ← Existing field
│  [Peanuts_______________]           │
│                                     │
│  Category*                          │  ← NEW
│  [Medication ▼]                     │
│                                     │
│  Type*                              │  ← NEW
│  ● Allergy  ○ Sensitivity          │
│                                     │
│  Severity                           │  ← NEW
│  ● Severe  ○ Not Severe             │
│                                     │
│  EpiPen Prescribed?                 │  ← NEW (conditional)
│  ● Yes  ○ No                        │
│                                     │
│  Show more ▼                        │
│                                     │
│  [Delete Allergy]                   │
└─────────────────────────────────────┘
```

**Expanded State**:

```
┌─────────────────────────────────────┐
│  ← Allergies                   [Save]│
│                                     │
│  Name*                              │
│  [Peanuts_______________]           │
│                                     │
│  Category*                          │
│  [Food ▼]                           │
│                                     │
│  Type*                              │
│  ● Allergy  ○ Sensitivity          │
│                                     │
│  Severity                           │
│  ● Severe  ○ Not Severe             │
│                                     │
│  EpiPen Prescribed?                 │
│  ● Yes  ○ No                        │
│                                     │
│  Symptoms                           │  ← NEW - Multi-select
│  ☑ Anaphylaxis                      │
│  ☑ Difficulty breathing             │
│  ☑ Swelling of face/throat/tongue   │
│  ☐ Swelling of lips                 │
│  ☐ Tightness in chest               │
│  ☐ Other (specify): [______]        │
│                                     │
│  Onset                              │  ← Existing (dual-mode)
│  [Date ▼] [03/15/1999] 📅          │
│                                     │
│  Details                            │  ← Existing (enhanced)
│  [First reaction at age 5...]      │
│  [Required hospitalization...]      │
│                                     │
│  Documents                          │  ← Existing
│  + Add Documents                    │
│                                     │
│  Show less ▲                        │
│                                     │
│  [Delete Allergy]                   │
└─────────────────────────────────────┘
```

---

### 8.3 Conditional Logic Flow

**Severity Selection → Symptom List**:

```typescript
// When user selects severity
onSeverityChange(severity: 'severe' | 'not_severe') {
  if (category === 'medication' || category === 'food') {
    if (severity === 'severe') {
      symptomList = SEVERE_MEDICATION_FOOD_SYMPTOMS
      epiPenField.visible = true
      epiPenField.required = true
    } else {
      symptomList = NOT_SEVERE_MEDICATION_FOOD_SYMPTOMS
      epiPenField.visible = false
      epiPenField.required = false
    }
  } else if (category === 'seasonal') {
    symptomList = SEASONAL_SYMPTOMS
    epiPenField.visible = false
  }
  // ... etc for other categories
}
```

**Category Selection → Available Fields**:

```typescript
onCategoryChange(category: AllergyCategory) {
  // All categories support severity
  severityField.visible = true

  // EpiPen field conditional
  if (category === 'medication' || category === 'food') {
    epiPenField.visible = (severity === 'severe')
  } else {
    epiPenField.visible = false
  }

  // Load appropriate symptom list
  updateSymptomList(category, severity)
}
```

---

### 8.4 Quick Add Pattern Integration

**Quick Add Behavior**:
- Quick Add creates minimal record with **Name only**
- Default values applied automatically:
  - Category: _null_ (user must select later)
  - Type: _null_ (user must select later)
  - Severity: _null_
  - EpiPen: _null_
  - Symptoms: _empty array_

**Incomplete Record Warning**:
```
Allergy: Peanuts
⚠️ Category and Type required

[Edit to complete]
```

**Rationale**:
- Preserves fast entry workflow
- Encourages users to complete critical safety fields later
- Red dot indicator can signal incomplete records

---

## 9. Display Rules (Three-View Architecture)

### 9.1 Patient View (UI[Pt])

**List Card Display**:
```
Peanuts  ⚠️
Food Allergy (Severe)
Anaphylaxis, Difficulty breathing
```

**View Screen (Collapsed)**:
```
Peanuts                    ⚠️

Category: Food
Type: Allergy
Severity: Severe
EpiPen Prescribed: Yes
```

**View Screen (Expanded)**:
```
Peanuts                    ⚠️

Category: Food
Type: Allergy
Severity: Severe
EpiPen Prescribed: Yes

Symptoms:
• Anaphylaxis
• Difficulty breathing
• Swelling of face/throat/tongue

Onset: Age 5 (March 1999)

Details:
First reaction occurred at age 5. Required
hospitalization. Now carries EpiPen at all times.

Documents:
• Allergy_Test_Results.pdf
```

---

### 9.2 Provider View (UI[Pr])

**Enhanced Display for Providers**:
```
Peanuts  ⚠️ SEVERE - EPIPEN REQUIRED

Category: Food Allergy
Severity: Severe (Anaphylaxis risk)
EpiPen Prescribed: Yes

ICD-10: Z88.0 (Allergy to peanuts)

Reactions:
• Anaphylaxis
• Difficulty breathing
• Swelling of face/throat/tongue

First Occurred: March 1999 (Age 5)

Clinical Notes:
First reaction occurred at age 5. Required
hospitalization. Now carries EpiPen at all times.

Attached Documents:
• Allergy_Test_Results.pdf (Uploaded 01/15/2024)
```

**Key Provider Enhancements**:
- Prominent warning banner for severe allergies
- ICD-10 code display (if mapped)
- Clinical terminology (vs patient-friendly terms)
- Timestamp on documents

---

### 9.3 Database (DB)

**Example Record**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Peanuts",
  "category": "food",
  "type": "allergy",
  "severity": "severe",
  "epiPenPrescribed": true,
  "symptoms": {
    "selectedSymptoms": [
      "anaphylaxis",
      "difficulty_breathing",
      "swelling_face_throat_tongue"
    ],
    "otherSymptomDescription": null
  },
  "onset": {
    "inputMode": "age",
    "ageInput": {
      "ageValue": 5,
      "referenceDate": "1994-06-15T00:00:00Z"
    },
    "computedDate": "1999-03-15T00:00:00Z"
  },
  "details": "First reaction occurred at age 5. Required hospitalization. Now carries EpiPen at all times.",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 10. Implementation Phases

### Phase 1: Core Fields (Minimum Viable Product)
- [ ] Add Category field (dropdown, 5 options)
- [ ] Add Type field (Allergy vs Sensitivity)
- [ ] Add Severity field (Severe vs Not Severe)
- [ ] Add EpiPen field (Yes/No, conditional visibility)
- [ ] Update database schema
- [ ] Update existing Figma screens to show new fields

**Estimated Effort**: Medium (new fields, conditional logic)

---

### Phase 2: Symptom Tracking (Enhanced)
- [ ] Create symptom vocabulary lists (5 categories)
- [ ] Build multi-select checkbox component
- [ ] Implement category-based symptom filtering
- [ ] Add "Other" free-text option
- [ ] Display symptoms in view/list cards

**Estimated Effort**: High (complex conditional UI, vocabulary management)

---

### Phase 3: Enhanced Display & Safety Features
- [ ] Add warning banners for severe allergies
- [ ] Implement incomplete record indicators
- [ ] Create provider-specific view enhancements
- [ ] Add ICD-10 code mapping (if applicable)
- [ ] Build EpiPen expiration tracking (optional)

**Estimated Effort**: Medium (UI polish, data mappings)

---

### Phase 4: Reporting & Analytics
- [ ] Generate allergy summary reports
- [ ] Track EpiPen prescription rates
- [ ] Analyze symptom patterns by category
- [ ] Create patient-facing allergy cards (printable)

**Estimated Effort**: Low-Medium (reporting features)

---

## 11. Critical Questions & Decisions

### 11.1 EpiPen Field Visibility

**Decision needed**: Should EpiPen field be:
- **Option A**: Always visible (all allergies)
- **Option B**: Conditional (only if Severity = "Severe")
- **Option C**: Conditional (only if Category = "Medication" OR "Food" AND Severity = "Severe")

**Recommendation**: **Option C** - Most clinically accurate
- EpiPens are prescribed for anaphylaxis risk (typically medication/food allergies)
- Reduces clutter for seasonal/environmental allergies
- Clear conditional logic

---

### 11.2 Symptom List Maintenance

**Decision needed**: How should symptom vocabularies be managed?
- **Option A**: Hardcoded in application (static lists)
- **Option B**: Database-driven (admin can add/edit symptoms)
- **Option C**: Hybrid (core symptoms hardcoded, custom symptoms allowed)

**Recommendation**: **Option C** - Hybrid approach
- Core medical symptoms standardized (hardcoded)
- "Other" option allows custom entries
- Maintains consistency while allowing flexibility

---

### 11.3 Type Field Requirement

**Decision needed**: Should "Type" (Allergy vs Sensitivity) be required?
- **Option A**: Required (forces user to classify)
- **Option B**: Optional (defaults to "Allergy" if not specified)
- **Option C**: Optional (null allowed, incomplete indicator shown)

**Recommendation**: **Option A** - Required field
- Important clinical distinction
- Affects treatment approach
- Users can make informed choice with tooltip/help text

---

### 11.4 Category Grouping in UI

**Decision needed**: Should categories be grouped in dropdown?
- **Option A**: Flat list (5 options, alphabetical)
- **Option B**: Grouped (Medication/Food | Seasonal/Environmental/Skin)

**Recommendation**: **Option A** - Flat list
- Only 5 options - grouping adds complexity without benefit
- Clear, simple selection

---

## 12. Migration from Existing Data

### 12.1 Existing Allergies Records

If existing allergy records exist with only `name` field:

**Migration Strategy**:
1. Add new columns with `NULL` defaults (category, type, severity, etc.)
2. Flag existing records as "incomplete" (need user review)
3. Show banner in UI: "⚠️ Please review your allergies and add category/severity information"
4. Provide bulk edit interface for users to complete records
5. Gradually require new fields for new entries

**SQL Migration**:
```sql
-- Add new columns
ALTER TABLE allergies
  ADD COLUMN category VARCHAR(50),
  ADD COLUMN type VARCHAR(20),
  ADD COLUMN severity VARCHAR(20),
  ADD COLUMN epipen_prescribed BOOLEAN,
  ADD COLUMN symptoms JSONB;

-- Flag existing records as needing review
UPDATE allergies
SET category = NULL, type = NULL
WHERE category IS NULL;

-- Count incomplete records
SELECT COUNT(*) FROM allergies WHERE category IS NULL OR type IS NULL;
```

---

## 13. Related Documentation

**Primary Spec**:
- [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) - Original 7-screen Figma extraction

**System-Wide Patterns**:
- [DUAL_MODE_DATE_INPUT_COMPONENT.md](DUAL_MODE_DATE_INPUT_COMPONENT.md) - Onset field uses this
- [QUICK_ADD_PATTERN.md](QUICK_ADD_PATTERN.md) - Name-only rapid entry
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Full project documentation

**Related Features**:
- [MEDICATIONS_SCREENS_SPECS.md](MEDICATIONS_SCREENS_SPECS.md) - Similar symptom tracking patterns
- [CONDITIONS_SCREENS_SPECS.md](CONDITIONS_SCREENS_SPECS.md) - Multi-condition linking model

---

## 14. Summary

This expansion transforms the basic allergy tracking feature into a **comprehensive allergy and sensitivity management system** that:

✅ **Distinguishes allergies from sensitivities** (clinical accuracy)
✅ **Classifies severity** (Severe vs Not Severe)
✅ **Tracks EpiPen prescriptions** (critical safety feature)
✅ **Captures detailed symptoms** (multi-select, category-specific)
✅ **Supports 5 allergy categories** (Medication, Food, Seasonal, Skin/Contact, Environmental)
✅ **Maintains Quick Add workflow** (name-only entry, complete details later)
✅ **Provides rich patient/provider views** (three-view architecture)

**Next Steps**:
1. Update [ALLERGIES_SCREENS_SPECS.md](ALLERGIES_SCREENS_SPECS.md) with new fields
2. Create Figma screen mockups showing new fields (or document as "beyond Figma")
3. Implement Phase 1 (Core Fields) for MVP
4. Build out symptom tracking in Phase 2

---

**Status**: ✅ Specification complete - ready for implementation planning
