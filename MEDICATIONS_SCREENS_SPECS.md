# Medications Screens - Complete Specifications

## Overview
Complete specifications for all medication-related screens in the Patient Health Record mobile application.

**Total Screens Extracted**: 8
- 2 List views (collapsed/expanded)
- 2 View screens (collapsed/expanded)
- 2 Edit screens (collapsed/expanded)
- 2 Add screens (collapsed/expanded)

**Figma Nodes**:
- 1483:8410 - Medications List (collapsed)
- 1483:8417 - Medications List (expanded)
- 1483:8411 - View Medication (collapsed)
- 1483:8412 - View Medication (expanded) ⚠️ **CRITICAL EXPANDED STATE**
- 1483:8413 - Edit Medication (collapsed)
- 1483:8414 - Edit Medication (expanded) ⚠️ **CRITICAL EXPANDED STATE**
- 1483:8415 - Add Medication (collapsed)
- 1483:8416 - Add Medication (expanded) ⚠️ **CRITICAL EXPANDED STATE**

---

## Key Findings from Expanded States

### Fields That Appear When "Show more" is Clicked

#### View Medication (Expanded) - Node 1483:8412
```
Visible fields (collapsed):
- Name: "Fluticasone"
- Dosage: "232mcg"
- Frequency: "2 times a day"
- [Show more] link

Additional fields when expanded:
- ORAL/SL/INJ/DROPS: "N/a"
- Prescribed / Start day: "N/a"
- Status: "N/a"
- [Show less] link
```

#### Edit Medication (Expanded) - Node 1483:8414
```
Visible fields (collapsed):
- Name (Required): Editable input with validation
- Dosage: Editable input
- Frequency: Dropdown with chevron icon
- [Show more] link

Additional fields when expanded:
- ORAL/SL/INJ/DROPS: Dropdown (placeholder: "Select")
- Prescribed / Start day: Date picker (calendar icon)
- Status: Dropdown (placeholder: "Select")
- [Show less] link
```

#### Add Medication (Expanded) - Node 1483:8416
```
Same expanded fields as Edit Medication (see above)
```

---

## Complete Field Specifications

### Field 1: Name
- **Type**: Text input
- **Label**: "Name (Required)" or "Name (Incomplete)" (with validation)
- **Validation**: Required field
- **Height**: 58px
- **States**:
  - Normal: Border #CCCCCC
  - Error: Border #DC3445 (red), label text #DC3445
- **Example Values**: "Fluticasone", "Benadryl"

### Field 2: Dosage
- **Type**: Text input
- **Label**: "Dosage"
- **Required**: No
- **Height**: 58px
- **Example Values**: "232mcg", "10mg"

### Field 3: Frequency
- **Type**: Dropdown selector
- **Label**: "Frequency"
- **Icon**: Chevron down (dropdown indicator)
- **Height**: 58px
- **Placeholder**: "Select"
- **Example Values**: "2 times a day", "1 time a day"
- **Display Format**: Two-line layout:
  - Line 1: Label in gray (#666666)
  - Line 2: Selected value in black (#000000)

### Field 4: ORAL/SL/INJ/DROPS (Route of Administration)
- **Type**: Dropdown selector
- **Label**: "ORAL/SL/INJ/DROPS"
- **Icon**: Chevron down (dropdown indicator)
- **Height**: 58px
- **Placeholder**: "Select"
- **Visibility**: Hidden by default, shown when "Show more" clicked
- **Values**: Unknown (dropdown options not visible in Figma)
- **Possible values**: Oral, Sublingual (SL), Injection (INJ), Drops

### Field 5: Prescribed / Start Day
- **Type**: Date picker
- **Label**: "Prescribed / Start day"
- **Icon**: Calendar icon (24px)
- **Height**: 58px
- **Placeholder**: None (empty by default)
- **Visibility**: Hidden by default, shown when "Show more" clicked
- **⚠️ CRITICAL QUESTION**: Does this use the same date/time selection framework as conditions?
  - Framework 1 (Within 1yr/5yr/Over 5yr/Age)?
  - Framework 2 (Within 1mo/6mo/2yr/More 2yr)?
  - A different medication-specific framework?
  - Simple calendar picker only?

### Field 6: Status
- **Type**: Dropdown selector
- **Label**: "Status"
- **Icon**: Chevron down (dropdown indicator)
- **Height**: 58px
- **Placeholder**: "Select"
- **Visibility**: Hidden by default, shown when "Show more" clicked
- **⚠️ CRITICAL QUESTION**: What are the status options?
  - Possible values: Active, Inactive, Discontinued, Completed, As Needed?

---

## Dropdown Details Needed

### Frequency Dropdown
**Current Status**: Not visible in Figma static frames

**Questions**:
1. What are ALL the frequency options?
   - 1 time a day, 2 times a day, 3 times a day, 4 times a day?
   - Once daily, Twice daily, Three times daily, Four times daily?
   - Every X hours?
   - As needed (PRN)?
   - Custom frequency input?

2. Is there a custom/other option?

3. Is this a simple dropdown or a complex schedule builder?

### ORAL/SL/INJ/DROPS Dropdown
**Current Status**: Label visible, options unknown

**Questions**:
1. What are ALL the route options?
   - Oral
   - Sublingual (SL)
   - Injection (INJ)
   - Drops (eye/ear?)
   - Topical?
   - Inhaler?
   - Patch?
   - Other?

2. Is "ORAL/SL/INJ/DROPS" the actual label text, or should it be "Route" or "Administration Method"?

### Status Dropdown
**Current Status**: Placeholder shows "Select", options unknown

**Questions**:
1. What are ALL the status options?
   - Active
   - Inactive
   - Discontinued
   - Completed
   - As Needed (PRN)
   - Temporary
   - Long-term
   - Other?

2. How does status relate to the medication lifecycle?

---

## Date/Time Selection Framework Analysis

### Field: "Prescribed / Start day"

**What I observed in Figma**:
- Calendar icon (24px)
- Single-line field
- No visible dropdown or framework UI

**Critical Questions**:

1. **Does this use the same framework as conditions?**
   - Conditions have Framework 1 (Within 1yr/5yr/Over 5yr/Age)
   - Conditions have Framework 2 (Within 1mo/6mo/2yr/More 2yr)
   - Should medications use one of these?

2. **Or is this a simple date picker?**
   - Just a calendar popup?
   - No progressive disclosure?
   - No voice input + LLM?
   - No certainty toggle?

3. **What's the expected precision?**
   - Exact date required?
   - Month/year acceptable?
   - Approximate date acceptable?

4. **Is "Prescribed / Start day" actually TWO separate fields?**
   - Prescribed date: When doctor prescribed it
   - Start day: When patient started taking it
   - Or is it one field with dual purpose?

5. **Are there other date fields not visible?**
   - End date (for completed medications)?
   - Last taken date?
   - Refill date?

---

## Associated Entities

### Conditions Association
- Field visible: "CONDITION" section
- Empty state: "No Conditions"
- Add button: "+ Add Condition"
- Display format: "Asthma (Chronic)" - shows condition name + type
- Can associate multiple conditions (seen in examples)
- Delete icon available for each associated condition

### Documents Association
- Field visible: "DOCUMENTS" section
- Empty state: "No Documents"
- Add button: "+ Add Documents"
- Display format: "Document 1", "Document 2" (simple names)
- Can associate multiple documents
- Delete icon available for each associated document

---

## Screen-by-Screen Breakdown

### Screen 1: Medications List (Collapsed) - Node 1483:8410

**Purpose**: Display all medications with quick add

**Layout**:
```
┌────────────────────────────────────┐
│ [Share Your Health Record]  (58px)│
│                                    │
│         Medications                │
│                                    │
│ [Quick Add        ] [Add]          │
│                                    │
│ [+ Add with details] [Take Photo]  │
│                                    │
│ ─────────────────────────────      │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Fluticasone             ●    │  │
│ │ 232mcg, 2 times a day        │  │
│ │ for Asthma                   │  │
│ └──────────────────────────────┘  │
│                                    │
│ ┌──────────────────────────────┐  │
│ │ Benadryl                ●    │  │
│ │ 10mg, 1 time a day           │  │
│ │ for Allergic rhinitis        │  │
│ └──────────────────────────────┘  │
│                                    │
│ [Nav Bar]                          │
└────────────────────────────────────┘
```

**Key Elements**:
- Black "Share Your Health Record" button (58px height)
- Title: "Medications" (centered, bold, 24px)
- Quick Add: Input + "Add" button combo
- Two action buttons: "+ Add with details" and "Take a Photo"
- Medication cards showing:
  - Name (bold, 20px)
  - Dosage + frequency + linked condition
  - Status indicator dot (10px)
- Bottom navigation bar

### Screen 2: Medications List (Expanded/Add Mode) - Node 1483:8417

**Purpose**: List view when adding medications to other records

**Differences from collapsed**:
- Top bar: Back arrow + "Add Medications" title + "Done" button
- No "Share Your Health Record" button
- Same Quick Add functionality
- Medication cards have **Plus icon** instead of status dot
- "Show more" link at bottom of list
- No bottom navigation bar

### Screen 3: View Medication (Collapsed) - Node 1483:8411

**Purpose**: View single medication details (minimal view)

**Layout**:
```
┌────────────────────────────────────┐
│ ← Fluticasone           [Edit]     │
│                                    │
│ Name                          ●    │
│ Fluticasone                        │
│ Incomplete Name (red warning)      │
│                                    │
│ Dosage                             │
│ 232mcg                             │
│                                    │
│ Frequency                          │
│ 2 times a day                      │
│                                    │
│ Show more                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Asthma                             │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Document 1                         │
│ Document 2                         │
│                                    │
│ ────────────────────────────       │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

**Fields Visible**:
- Name (with incomplete warning in red)
- Dosage
- Frequency
- Show more link
- Conditions section
- Documents section
- Delete button

### Screen 4: View Medication (Expanded) - Node 1483:8412

**Purpose**: View single medication details (full view)

**Additional Fields When Expanded**:
```
┌────────────────────────────────────┐
│ ← Fluticasone           [Edit]     │
│                                    │
│ Name                          ●    │
│ Fluticasone                        │
│ Incomplete Name (red warning)      │
│                                    │
│ Dosage                             │
│ 232mcg                             │
│                                    │
│ Frequency                          │
│ 2 times a day                      │
│                                    │
│ ORAL/SL/INJ/DROPS                  │
│ N/a                                │
│                                    │
│ Prescribed / Start day             │
│ N/a                                │
│                                    │
│ Status                             │
│ N/a                                │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Asthma (Chronic)                   │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Document 1                         │
│ Document 2                         │
│                                    │
│ ────────────────────────────       │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

**New Fields**:
- ORAL/SL/INJ/DROPS: "N/a"
- Prescribed / Start day: "N/a"
- Status: "N/a"
- Show less link

### Screen 5: Edit Medication (Collapsed) - Node 1483:8413

**Purpose**: Edit medication (minimal fields)

**Editable Fields**:
- Name (Required) - red border if incomplete
- Dosage
- Frequency (dropdown with chevron)
- Show more link
- Conditions (with delete icons)
- + Add Condition button
- Documents (with delete icons)
- + Add Documents button
- Delete button

### Screen 6: Edit Medication (Expanded) - Node 1483:8414

**Purpose**: Edit medication (all fields)

**Additional Editable Fields When Expanded**:
```
┌────────────────────────────────────┐
│ ← Fluticasone           [Save]     │
│                                    │
│ Name (Incomplete) ⚠️               │
│ Fluticasone                        │
│                                    │
│ Dosage                             │
│ 232mcg                             │
│                                    │
│ Frequency                    ▼     │
│ 2 times a day                      │
│                                    │
│ ORAL/SL/INJ/DROPS            ▼     │
│ Select                             │
│                                    │
│ Prescribed / Start day       📅    │
│                                    │
│                                    │
│ Status                       ▼     │
│ Select                             │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ Asthma (Chronic)            🗑️     │
│ [+ Add Condition]                  │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ Document 1                  🗑️     │
│ Document 2                  🗑️     │
│ [+ Add Documents]                  │
│                                    │
│ 🗑️ Delete                          │
└────────────────────────────────────┘
```

**Interactive Elements**:
- Frequency: Dropdown (▼ icon)
- ORAL/SL/INJ/DROPS: Dropdown (▼ icon)
- Prescribed / Start day: Date picker (📅 icon)
- Status: Dropdown (▼ icon)
- Conditions: Delete icon for each
- Documents: Delete icon for each

### Screen 7: Add Medication (Collapsed) - Node 1483:8415

**Purpose**: Add new medication (minimal fields)

**Fields**:
- Name (Required) - placeholder
- Dosage - placeholder
- Frequency (dropdown)
- Show more link
- Conditions section (empty state: "No Conditions")
- + Add Condition button
- Documents section (empty state: "No Documents")
- + Add Documents button

### Screen 8: Add Medication (Expanded) - Node 1483:8416

**Purpose**: Add new medication (all fields)

**All Fields Visible**:
```
┌────────────────────────────────────┐
│ ← Add Medication        [Save]     │
│                                    │
│ Name (Required)                    │
│                                    │
│ Dosage                             │
│                                    │
│ Frequency                    ▼     │
│ Select                             │
│                                    │
│ ORAL/SL/INJ/DROPS            ▼     │
│ Select                             │
│                                    │
│ Prescribed / Start day       📅    │
│                                    │
│                                    │
│ Status                       ▼     │
│ Select                             │
│                                    │
│ Show less                          │
│                                    │
│ ────────────────────────────       │
│                                    │
│ CONDITIONS                         │
│ No Conditions                      │
│ [+ Add Condition]                  │
│                                    │
│ ────────────────────────────       │
│                                    │
│ DOCUMENTS                          │
│ No Documents                       │
│ [+ Add Documents]                  │
└────────────────────────────────────┘
```

---

## Critical Questions for User

### 1. Dropdown Options - What Are They?
- **Frequency**: What are ALL the options? (1x/day, 2x/day, 3x/day, 4x/day, PRN, custom?)
- **ORAL/SL/INJ/DROPS**: What are ALL the route options? (Oral, Sublingual, Injection, Drops, Topical, Inhaler, Patch, Other?)
- **Status**: What are ALL the status options? (Active, Inactive, Discontinued, Completed, As Needed, Temporary, Long-term?)

### 2. Date Selection Framework
- Does "Prescribed / Start day" use the same framework as conditions (Framework 1 or 2)?
- Or is it a simple calendar picker?
- Does it support voice input + LLM?
- Does it support certainty levels?
- Does it support progressive disclosure (year → month → date)?

### 3. Field Interpretation
- Is "Prescribed / Start day" ONE field or TWO separate fields?
- Are there hidden date fields (end date, last taken, refill date)?

### 4. Route Label
- Is "ORAL/SL/INJ/DROPS" the actual label, or should it be "Route" or "Administration Method"?

### 5. Frequency Framework
- Is Frequency a simple dropdown or a complex schedule builder?
- Does it support custom schedules (e.g., "every 6 hours", "Monday/Wednesday/Friday")?

---

## Next Steps

1. **User must answer the critical questions above**
2. Extract frequency dropdown options (if in Figma)
3. Extract ORAL/SL/INJ/DROPS dropdown options (if in Figma)
4. Extract Status dropdown options (if in Figma)
5. Extract date picker framework details (if in Figma)
6. Document complete medication specification
7. Create OpenSpec proposal for medications feature

---

**Status**: ⚠️ **Partial extraction complete - awaiting user input on dropdown options and date framework**
