# Previous Surgeries Screens - Complete Figma Extraction

**Extraction Date**: 2025-10-25
**Source**: Figma section `1374:8930` - Previous Surgeries
**Total Screens**: 9

---

## Screen Overview

| # | Screen Name | Node ID | State | Purpose |
|---|---|---|---|---|
| 1 | Previous Surgeries List | 1483:8451 | Default | List view of all surgeries |
| 2 | View Previous Surgery | 1483:8452 | Collapsed | View single surgery (collapsed) |
| 3 | View Previous Surgery | 1483:8453 | Expanded | View single surgery (expanded - ALL fields) |
| 4 | Edit Previous Surgery | 1483:8454 | Collapsed | Edit surgery (collapsed) |
| 5 | Edit Previous Surgery | 1483:8455 | Expanded with Date Selector | Edit surgery (expanded with date picker) |
| 6 | Edit Previous Surgery | 1755:42615 | Expanded with Age Selector | Edit surgery (expanded with age input) |
| 7 | Add Previous Surgery | 1483:8456 | Collapsed | Add new surgery (collapsed) |
| 8 | Add Previous Surgery | 1483:8457 | Expanded with Date Selector | Add new surgery (expanded with date picker) |
| 9 | Add Previous Surgery | 1776:52953 | Expanded with Age Selector | Add new surgery (expanded with age input) |

---

## 🚨 CRITICAL DISCOVERY: Dual "When" Field System

**This is THE MOST IMPORTANT finding in this extraction:**

The "When" field has **TWO DISTINCT MODES** with a toggle:

### Mode 1: Date Selector
- Label shows: "Date" with dropdown arrow
- Opens date picker with calendar icon
- Placeholder: "Select Date"

### Mode 2: Age Selector
- Label shows: "Age" with dropdown arrow
- Opens text input field
- Placeholder: "Enter Age"

**This dual-mode pattern could apply to:**
- Allergies Onset field
- Medications Prescribed/Start day field
- Any other date fields in the system

---

## 1. Previous Surgeries List (Node: 1483:8451)

### Layout
- **Screen Title**: "Previous Surgeries"
- **Top Action**: "Share Your Health Record" button (black, full-width)
- **Primary Action**: "+ Add Previous Surgery" button (outlined, light grey background)
- **Separator**: Horizontal line below actions

### Surgery Cards
- **Example Surgery Shown**: "Appendectomy"
- **Card Style**: Border, padding, clickable
- **Card Content**: Surgery name only (20px bold)

### Comparison to Allergies
**Differences**:
- No "Quick Add" inline input (Allergies has this)
- No category sections (Allergies has Medication/Environmental sections)
- Simpler, cleaner list view

**Similarities**:
- Same card styling
- Same "+ Add" button pattern
- Same "Share Your Health Record" top action

---

## 2. View Previous Surgery - Collapsed (Node: 1483:8452)

### Layout
- **Header**: Back arrow + Surgery name ("Appendectomy") + "Edit" button
- **Form Content**: Name field visible
- **Show More Toggle**: "Show more" link (blue text)
- **Documents Section**: List of associated documents
- **Bottom Action**: "Delete" button (with delete icon)

### Visible Fields (Collapsed State)

**Field 1: Name**
- Label: "Name" (grey, 14px)
- Value: "Appendectomy" (bold, 16px, 24px line-height)
- Type: Read-only display

### Hidden Fields
Revealed when "Show more" clicked:
- When
- Details
- Complications
- Attending Surgeon

---

## 3. View Previous Surgery - Expanded (Node: 1483:8453)

### All Visible Fields (Expanded State)

**Field 1: Name**
- Label: "Name" (grey, 14px)
- Value: "Appendectomy" (bold, 16px)

**Field 2: When** ⚠️ CRITICAL
- Label: "When" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: What are the display formats?
  - Date: "March 2020"?
  - Age: "I was 25 years old"?
  - Time period: "5 years ago"?

**Field 3: Details**
- Label: "Details" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: Free-form text for surgical notes?

**Field 4: Complications** ⚠️ NEW FIELD
- Label: "Complications" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: Free-form text or structured?
- **Possible values**: "None", specific complication descriptions

**Field 5: Attending Surgeon** ⚠️ NEW FIELD
- Label: "Attending Surgeon" (grey, 14px)
- Value: "N/a" (bold, 16px)
- **Question**: Free-form text or searchable provider?
- **Possible integration**: Link to doctor/provider database?

### Show Less Toggle
- **Text**: "Show less" (blue link)
- **Action**: Collapse to hide fields 2-5

---

## 4. Edit Previous Surgery - Collapsed (Node: 1483:8454)

### Layout
- **Header**: Back arrow + Surgery name + "Save" button (black)
- **Form Content**: Editable Name field
- **Show More Toggle**: "Show more" link
- **Documents Section**: List with delete icons
- **Bottom Actions**: "+ Add Documents" button + "Delete" button

### Editable Fields (Collapsed State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)" (grey, 14px)
- Value: "Appendectomy" (bold, 16px)
- Border: 1px solid #CCCCCC
- Height: 58px

### Documents Section (Edit Mode)
Same pattern as Allergies and Medications:
- Document name on left
- Delete icon (24px) on right
- "+ Add Documents" button at bottom

---

## 5. Edit Previous Surgery - Expanded with Date Selector (Node: 1483:8455)

### Layout
Same as collapsed Edit, but with all fields revealed

### All Editable Fields (Expanded State)

**Field 1: Name (Required)**
- Type: Text input
- Height: 58px

**Field 2: When - DUAL MODE SELECTOR** 🚨 CRITICAL

This field has TWO components side-by-side:

#### Component A: Mode Selector (Left, 106px width)
- **Type**: Dropdown toggle
- **Label**: "When" (grey, 14px)
- **Current Value**: "Date" (bold, 16px) ← Selected mode
- **Icon**: Dropdown chevron (24px)
- **Purpose**: Switch between "Date" and "Age" modes

#### Component B: Input Field (Right, grows to fill remaining width)
- **When Mode = "Date"**:
  - **Type**: Date picker input
  - **Label/Placeholder**: "Select Date" (grey, 16px)
  - **Icon**: Calendar icon (24px) on right
  - **Height**: 58px
  - **Border**: 1px solid #CCCCCC

**Field 3: Details**
- Type: Multi-line text input (textarea)
- Label: "Details" (grey placeholder)
- Height: 90px
- Border: 1px solid #CCCCCC

**Field 4: Complications**
- Type: Multi-line text input (textarea)
- Label: "Complications" (grey placeholder)
- Height: 90px
- Border: 1px solid #CCCCCC

**Field 5: Attending Surgeon**
- Type: Text input
- Label: "Attending Surgeon" (grey placeholder)
- Height: 58px
- Border: 1px solid #CCCCCC

---

## 6. Edit Previous Surgery - Expanded with Age Selector (Node: 1755:42615)

### When Field - Age Mode

**Component A: Mode Selector (Left, 106px width)**
- **Current Value**: "Age" (bold, 16px) ← Selected mode
- **Icon**: Dropdown chevron (24px)

**Component B: Input Field (Right, grows to fill)**
- **When Mode = "Age"**:
  - **Type**: Text input (number)
  - **Label/Placeholder**: "Enter Age" (grey, 16px)
  - **Height**: 58px
  - **Border**: 1px solid #CCCCCC
  - **No calendar icon** (distinguishes from Date mode)

**All other fields identical to Date mode screen**

---

## 7. Add Previous Surgery - Collapsed (Node: 1483:8456)

### Layout
- **Header**: Back arrow + "Add Previous Surgeries" title + "Save" button (black)
- **Form Content**: Empty Name field
- **Show More Toggle**: "Show more" link
- **Documents Section**: Empty state with add button

### Fields (Collapsed State)

**Field 1: Name (Required)**
- Type: Text input
- Label: "Name (Required)" (grey placeholder)
- Empty
- Height: 58px

### Documents Section (Empty State)
- **No Documents State**: "No Documents" centered text
- **Add Documents Button**: "+ Add Documents" (grey background)

---

## 8. Add Previous Surgery - Expanded with Date Selector (Node: 1483:8457)

### All Fields (Expanded State)

**Field 1: Name (Required)**
- Empty text input

**Field 2: When - Date Mode (Default)**
- Mode Selector: Shows "Date"
- Input Field: "Select Date" placeholder with calendar icon

**Field 3: Details**
- Empty textarea
- Height: 90px

**Field 4: Complications**
- Empty textarea
- Height: 90px

**Field 5: Attending Surgeon**
- Empty text input
- Height: 58px

---

## 9. Add Previous Surgery - Expanded with Age Selector (Node: 1776:52953)

### When Field - Age Mode

**Mode Selector**: Shows "Age"
**Input Field**: "Enter Age" placeholder (no calendar icon)

**All other fields identical to Date mode screen**

---

## Design Specifications

### Typography
(Same as Allergies/Medications - Public Sans family)

**Screen Title (H1)**:
- Font: Public Sans Bold
- Size: 24px
- Weight: 700
- Color: #000000

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

**Links (Show more/less)**:
- Font: Public Sans Medium
- Size: 16px
- Color: #1A73E8

### Field Heights
- **Single-line input**: 58px
- **Multi-line textarea**: 90px
- **Button (primary)**: 58px
- **Button (secondary)**: 42px

### Dual "When" Field Layout

**Total Width**: 100% of container (356px typically)

**Component A (Mode Selector)**:
- Width: 106px (fixed)
- Height: 58px
- Border: 1px solid #CCCCCC
- Border-radius: 4px
- Background: White
- Content: Label + Current Mode + Dropdown Icon

**Component B (Input Field)**:
- Width: Flexible (grows to fill remaining space ~234px)
- Height: 58px
- Border: 1px solid #CCCCCC
- Border-radius: 4px
- Background: White
- Gap between A and B: 16px

---

## Critical Analysis: When Field Date/Time Framework

### The "When" Field Options

Based on the dual-mode selector, the "When" field supports:

#### Option 1: Date Mode
- User selects a specific date via calendar picker
- Likely uses progressive disclosure (year → month → day)
- **Framework**: Same as Conditions? Framework 1 (Within 1yr/5yr/Over 5yr/Age)?
- **Or**: Simple date picker without framework?

#### Option 2: Age Mode
- User enters their age at time of surgery
- **Example**: "I was 25 years old"
- **Storage**: Age value + calculated date based on current date and birthdate
- **Display**: "Age 25" or "I was 25 years old"

### Critical Questions

**Q1: Does Date mode use the same framework as Conditions?**
- If YES: Within 1yr/5yr/Over 5yr/Age options appear after clicking "Select Date"
- If NO: It's a simple calendar date picker

**Q2: How is Age mode stored?**
- **Option A**: Store age value only
- **Option B**: Store age value + calculated approximate date
- **Option C**: Store age value + reference to birthdate for recalculation

**Q3: Can user switch between Date and Age modes?**
- If user enters "Age 25", can they switch to Date and see calculated date?
- If user selects "March 2020", can they switch to Age and see calculated age?

**Q4: What happens if surgery date is unknown?**
- Can user leave When field empty?
- Is there an "Unknown" option?
- Default value: "N/a"?

---

## Data Model Implications

```typescript
interface Surgery {
  id: string;
  patientId: string;

  // Core fields
  name: string; // Required

  // When field - Dual mode
  when?: SurgeryWhenDate;

  // Additional fields
  details?: string; // Free-form text
  complications?: string; // Free-form text
  attendingSurgeon?: string; // Free-form text or provider ID?

  // Document associations
  documents?: SurgeryDocument[];

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

interface SurgeryWhenDate {
  // Input mode
  inputMode: 'date' | 'age';

  // For mode = 'date'
  dateSelection?: {
    // If using Conditions Framework 1
    frameworkType?: 'within_1yr' | 'within_5yr' | 'over_5yr' | 'age';

    // Progressive disclosure
    year?: number;
    month?: number;
    day?: number;
    precision?: 'year' | 'month' | 'day';

    // Or simple date
    selectedDate?: Date;
  };

  // For mode = 'age'
  ageValue?: number; // e.g., 25

  // Computed/stored date
  computedDate?: Date;
  computedDateMethod?: 'from_date_selection' | 'from_age_and_birthdate';
}
```

---

## Comparison: Surgeries vs Allergies vs Medications

| Feature | Surgeries | Allergies | Medications |
|---|---|---|---|
| **List View** | Simple | Categories | Simple |
| **Quick Add** | ❌ No | ✅ Yes | ❌ No |
| **Date/Time Field** | When (dual mode) | Onset | Prescribed/Start day |
| **Date Input Modes** | Date OR Age | Unknown | Unknown |
| **Additional Fields** | Complications, Attending Surgeon | None | Dosage, Frequency, Route, Status |
| **Free-form Text Fields** | Details, Complications | Details | Details (if exists) |
| **Complexity** | Medium | Low | High |

---

## Validation Rules (Inferred)

### On Save

**Name Field**:
- Required: Yes
- Min length: 1 character
- Validation message: "Name is required"

**When Field**:
- Required: No (can be N/a)
- Validation (Date mode): Date must be in past or "Unknown"
- Validation (Age mode): Age must be valid number (0-150?)

**Details Field**:
- Required: No
- Max length: TBD (500-1000 chars)
- Format: Free text

**Complications Field**:
- Required: No
- Max length: TBD (500-1000 chars)
- Format: Free text

**Attending Surgeon Field**:
- Required: No
- Max length: TBD (100 chars)
- Format: Free text (or provider lookup?)

---

## Navigation Flow

### From Surgeries List

**Tap Surgery Card** → View Surgery (Collapsed)

**Tap "+ Add Previous Surgery"** → Add Surgery (Collapsed by default)

### From View Surgery

**Tap "Edit"** → Edit Surgery (same state - collapsed or expanded)

**Tap "Show more"** → View Surgery (Expanded)

**Tap "Show less"** → View Surgery (Collapsed)

**Tap "Delete"** → Confirmation dialog? → Delete → Back to Surgeries List

**Tap Document** → View Document

**Tap Back Arrow** → Surgeries List

### From Edit/Add Surgery

**Tap "Save"** → Validate → Save → View Surgery (same state)

**Tap "Show more"** → Edit/Add Surgery (Expanded)

**Tap "Show less"** → Edit/Add Surgery (Collapsed)

**Tap "When" Mode Selector** → Dropdown showing "Date" and "Age" options

**Select "Date"** → Show date picker input with calendar icon

**Select "Age"** → Show text input for age value

**Tap "+ Add Documents"** → Document picker/selector

**Tap "Delete" (bottom)** → Confirmation → Delete → Back to Surgeries List

**Tap Back Arrow** → Discard changes confirmation? → Surgeries List or View Surgery

---

## Critical Questions & Gaps

### 1. When Field Framework

**Question**: Does the Date mode use the same date/time framework as Conditions?

**Possibilities**:
- **Option A**: Uses Conditions Framework 1 (Within 1yr/5yr/Over 5yr/Age)
  - Clicking "Select Date" opens framework selector
  - Progressive disclosure year → month → day
- **Option B**: Simple calendar date picker
  - Clicking "Select Date" opens standard calendar
  - User picks exact date directly
- **Option C**: Hybrid approach
  - Offers both framework and direct date selection

**Why Important**: Determines UI implementation and database schema

**Recommendation**: Since surgeries are typically one-time past events with known dates (unlike chronic conditions with uncertain onset), **likely uses Option B (simple date picker)** rather than framework. But Age mode suggests framework might still be relevant for older/uncertain surgeries.

---

### 2. Age Mode Storage & Display

**Question**: How is age value stored and displayed?

**Storage Options**:
- **Option A**: Store age value only
  - Pro: Simple, doesn't change over time
  - Con: Doesn't give actual surgery date
- **Option B**: Store age + calculate approximate date
  - Based on patient birthdate
  - Pro: Can display as date or age
  - Con: Approximate date might be inaccurate
- **Option C**: Store age + exact calculation timestamp
  - Pro: Can recalculate if birthdate changes
  - Con: More complex

**Display Options**:
- "Age 25" (simple)
- "I was 25 years old" (narrative)
- "Age 25 (approx. 1998)" (with calculated year)
- "~1998 (Age 25)" (emphasis on calculated date)

**Recommendation**: **Option B** - Store age value, calculate approximate surgery date based on birthdate, display as "Age 25" in patient view with optional calculated year in provider view.

---

### 3. Mode Switching Behavior

**Question**: What happens when user switches between Date and Age modes?

**Scenario 1: Date → Age**
- User selected "March 15, 2010" (Date mode)
- User switches to Age mode
- **Expected**: Calculate age based on birthdate and selected date
- **Display**: "Age 25" (if patient born 1985)
- **Data**: Preserve original date selection + show calculated age

**Scenario 2: Age → Date**
- User entered "25" (Age mode)
- User switches to Date mode
- **Expected**: Calculate approximate date based on age and birthdate
- **Display**: Show calculated year (maybe month)
- **Data**: Preserve age value + show calculated date

**Recommendation**: **Bidirectional sync** - Store both age and date, calculate one from the other, allow switching, preserve both values.

---

### 4. Attending Surgeon Field

**Question**: Is Attending Surgeon a free-text field or provider lookup?

**Option A: Free-text**
- Simplest implementation
- User types surgeon name
- No validation, no linking
- **Pros**: Fast, works for any surgeon
- **Cons**: Typos, duplicates, no provider data

**Option B: Provider Lookup**
- Autocomplete from provider database
- Links to Provider entity
- **Pros**: Clean data, can show surgeon details
- **Cons**: Complex, requires provider database

**Option C: Hybrid**
- Autocomplete suggestions
- Allow free-text if not in database
- Store as text but optionally link to provider
- **Pros**: Best of both worlds
- **Cons**: Most complex implementation

**Recommendation**: Start with **Option A (free-text)**, evolve to **Option C** when provider database exists.

---

### 5. Complications Field Format

**Question**: Is Complications structured or free-text?

**Observed**: Multi-line text input (90px height) suggests free-text

**Structured Alternative** (not in UI):
- Checkbox list of common complications
- Free-text "Other" field
- **Examples**: "Infection", "Bleeding", "Delayed healing", "None", "Other"

**Recommendation**: Keep as **free-text** for maximum flexibility, add structured options later if patterns emerge.

---

### 6. Unknown/Uncertain Surgery Date

**Question**: How to handle surgeries with unknown dates?

**Options**:
- Leave When field empty → displays "N/a"
- Add "Unknown" option to Date/Age selector
- Use Age mode with approximation: "Childhood", "Adolescence", "Adulthood"
- Use Conditions Framework for uncertain timing

**Recommendation**:
- Allow empty When field (displays "N/a")
- In Age mode, allow text values like "Childhood" (0-12), "Teenage" (13-19), "Young Adult" (20-30), etc.
- Or stick to numeric age only and let free-form Details capture uncertainty

---

## System-Wide Pattern: Date/Time Input Dual Mode

### Hypothesis: Universal Pattern

The dual-mode When field (Date | Age) discovered in Surgeries **might be a universal pattern** for all date/time inputs across the system.

**Could apply to**:
1. ✅ **Surgeries**: When field (confirmed - extracted)
2. ⚠️ **Allergies**: Onset field (has calendar icon - needs confirmation)
3. ⚠️ **Medications**: Prescribed/Start day (has special logic but might use dual mode)
4. ⚠️ **Conditions**: Diagnosis date (uses Framework 1/2 but might also support Age mode)

**Testing This Hypothesis**:
Need to verify if Allergies Onset and Medications Prescribed/Start day also have:
- Mode selector dropdown
- Date picker option
- Age input option

**If TRUE**: This is a **critical system-wide UI pattern** that must be:
- Documented in design system
- Implemented as reusable component
- Consistently applied across all date inputs

---

## Next Steps

### Immediate Questions for User/Stakeholder

1. **Does the Date mode use Conditions Framework 1 or simple date picker?**
2. **How is Age mode stored?** (Age only, or age + calculated date?)
3. **Can users switch between Date and Age modes?** (Bidirectional sync?)
4. **Is Attending Surgeon free-text or provider lookup?**
5. **Does this dual-mode pattern apply to Allergies Onset and Medications dates?**
6. **How are unknown/uncertain surgery dates handled?**

### Documentation to Create

1. **SURGERIES_WHEN_FIELD_LOGIC.md** - Complete specification of dual-mode date/age input
2. **DUAL_MODE_DATE_INPUT_COMPONENT.md** - Reusable component specification
3. **SURGERIES_VALIDATION_RULES.md** - Complete validation specification
4. **SURGERIES_FLOW_DIAGRAM.md** - ASCII flow diagrams

### Implementation Tasks

1. Build dual-mode When field component (Date | Age selector)
2. Implement mode switching logic
3. Create date picker (simple or framework-based - TBD)
4. Create age input with validation
5. Implement bidirectional date ↔ age calculation
6. Build Attending Surgeon field (free-text or autocomplete - TBD)
7. Implement Complications and Details text areas
8. Create validation rules
9. Design loading/error/success states

---

## Summary

### What We Know ✅

- **9 screens extracted** (List, View collapsed/expanded, Edit collapsed/expanded x2, Add collapsed/expanded x2)
- **5 core fields**: Name (required), When (dual mode), Details, Complications, Attending Surgeon
- **🚨 CRITICAL DISCOVERY**: When field has DUAL MODE (Date | Age) with mode selector
- **Progressive disclosure pattern**: "Show more" / "Show less" toggle (same as Allergies/Medications)
- **Document association**: Same pattern as other features
- **Design specs**: Complete typography, colors, spacing extracted

### What We Don't Know ❓

- **When field Date mode**: Uses Conditions Framework 1 or simple date picker?
- **Age mode storage**: Age only or age + calculated date?
- **Mode switching**: Can users switch between Date and Age? How does data sync?
- **Dual-mode pattern scope**: Does this apply to Allergies and Medications too?
- **Attending Surgeon**: Free-text or provider database lookup?
- **Unknown dates**: How handled? Empty field? "Unknown" option?

### Status

✅ **Complete Figma extraction** - All 9 screens documented including dual-mode discovery
⚠️ **Partial specification** - Missing framework details and mode switching logic
🚨 **Critical finding**: Dual-mode date input could be system-wide pattern
📋 **Next**: Verify if dual-mode applies to Allergies/Medications, then document logic

---

**Extraction complete. The dual-mode When field (Date | Age) is a significant architectural finding that may impact all date inputs system-wide.**
