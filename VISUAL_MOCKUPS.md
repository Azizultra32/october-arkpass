# Visual Mockups - Exact Screen Layouts

**Purpose**: Show pixel-perfect visual representation of what users will see
**Date**: 2025-10-25

---

## Screen 1: Allergies List (Main View)

This is what the user sees when they open Allergies:

```
╔═══════════════════════════════════════════════╗
║                                               ║
║  ┌───────────────────────────────────────┐   ║
║  │  Share Your Health Record             │   ║ ← Black button
║  └───────────────────────────────────────┘   ║   58px tall
║                                               ║
║                                               ║
║              Allergies                        ║ ← Title, big & bold
║                                               ║
║  ┌─────────────────────────┬──────────────┐  ║
║  │ Quick Add               │     Add      │  ║ ← Type here + tap Add
║  └─────────────────────────┴──────────────┘  ║   for quick entry
║                                               ║
║  ┌───────────────────────────────────────┐   ║
║  │       + Add with details              │   ║ ← Opens full form
║  └───────────────────────────────────────┘   ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  MEDICATION ALLERGIES                         ║ ← Section header
║                                               ║
║  ┌───────────────────────────────────────┐   ║
║  │  Penicillins                     ●    │   ║ ← Tap to view/edit
║  │                                       │   ║   Red dot = incomplete
║  │  ⚠️ SEVERE - EPIPEN REQUIRED           │   ║   Warning banner
║  └───────────────────────────────────────┘   ║
║                                               ║
║  ┌───────────────────────────────────────┐   ║
║  │  Erythromycin                    ●    │   ║
║  └───────────────────────────────────────┘   ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  ENVIRONMENTAL/SEASONAL/SKIN/OTHER            ║
║                                               ║
║  No environmental/seasonal/skin/other         ║ ← Empty state
║  allergies                                    ║   (gray text)
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  [Home]  [Records]  [Profile]  [Settings]    ║ ← Bottom nav
║                                               ║
╚═══════════════════════════════════════════════╝
```

### What Each Part Does:

**Share Button** → Exports/shares entire health record
**Quick Add** → Type "Peanuts" and tap Add → Creates minimal entry (you complete details later)
**+ Add with details** → Opens full form to enter everything at once
**Penicillins card** → Shows warning banner because it's marked as SEVERE with EpiPen
**Red dot (●)** → Means important info is missing (category, severity, or EpiPen status)
**Empty state** → Shows when no allergies in that category

---

## Screen 2: Edit Allergy (Collapsed State)

User taps on "Penicillins" card → This screen opens:

```
╔═══════════════════════════════════════════════╗
║  ← Penicillins                        [Save] ║ ← Back arrow, name, Save button
║                                               ║
║  Name (Required)                              ║
║  ┌───────────────────────────────────────┐   ║
║  │ Penicillins                           │   ║ ← Can edit the name
║  └───────────────────────────────────────┘   ║
║                                               ║
║  Category (Required)                          ║
║  ┌───────────────────────────────────────┐   ║
║  │ Medication                         ▼  │   ║ ← Dropdown: tap to select
║  └───────────────────────────────────────┘   ║
║                                               ║
║  Severity (Required)                          ║
║                                               ║
║     ●  Severe        ○  Not Severe            ║ ← Radio buttons: tap one
║                                               ║
║                                               ║
║  EpiPen Prescribed? (Required)                ║
║                                               ║
║     ●  Yes           ○  No                    ║ ← Only shows if Severe selected
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║              Show more  ▼                     ║ ← Tap to expand
║                                               ║
╚═══════════════════════════════════════════════╝
```

### What User Sees:

**Category dropdown** → Options: Medication, Food, Seasonal, Skin/Contact, Environmental
**Severity radio buttons** → User taps either "Severe" or "Not Severe"
**EpiPen question** → **Only appears** if user selected "Severe"
**Show more** → Tap to see additional optional fields below

---

## Screen 3: Edit Allergy (Expanded State)

User taps "Show more ▼" → Screen expands to show all fields:

```
╔═══════════════════════════════════════════════╗
║  ← Penicillins                        [Save] ║
║                                               ║
║  Name (Required)                              ║
║  ┌───────────────────────────────────────┐   ║
║  │ Penicillins                           │   ║
║  └───────────────────────────────────────┘   ║
║                                               ║
║  Category (Required)                          ║
║  ┌───────────────────────────────────────┐   ║
║  │ Medication                         ▼  │   ║
║  └───────────────────────────────────────┘   ║
║                                               ║
║  Severity (Required)                          ║
║     ●  Severe        ○  Not Severe            ║
║                                               ║
║  EpiPen Prescribed? (Required)                ║
║     ●  Yes           ○  No                    ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  Onset                                        ║ ← When allergy started
║  ┌──────┬────────────────────────────────┐   ║
║  │ Age ▼│ Enter Age                      │   ║ ← Can choose Date or Age
║  └──────┴────────────────────────────────┘   ║
║                                               ║
║  Details                                      ║
║  ┌───────────────────────────────────────┐   ║
║  │ First reaction at age 5. Required     │   ║ ← Free text area
║  │ hospitalization. Now carries EpiPen   │   ║   for notes
║  │ at all times.                         │   ║
║  └───────────────────────────────────────┘   ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  DOCUMENTS                                    ║
║  Document 1                             🗑️    ║ ← Can attach files
║  Document 2                             🗑️    ║
║  + Add Documents                              ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║              Show less  ▲                     ║ ← Tap to collapse
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║  🗑️  Delete Allergy                           ║ ← Red text, deletes entry
║                                               ║
╚═══════════════════════════════════════════════╝
```

### What Each Field Does:

**Onset field** → User can choose:
- "Date" mode: Pick from calendar (March 15, 1999)
- "Age" mode: Type age (e.g., "5") and system calculates date

**Details** → Free text for any notes (why it happened, how severe it was, etc.)

**Documents** → Attach test results, doctor's notes, photos

**Delete** → Removes this allergy entirely

---

## Screen 4: Category Dropdown (When Tapped)

User taps the Category field → This picker appears:

```
╔═══════════════════════════════════════════════╗
║                                               ║
║           Select Category                     ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║     Medication                         ✓      ║ ← Currently selected
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║     Food                                      ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║     Seasonal                                  ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║     Skin/Contact                              ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║     Environmental                             ║
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║                              [Cancel]         ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

User taps any option → Picker closes, category updates

---

## Screen 5: Validation Error State

User tries to save without completing required fields → Errors appear:

```
╔═══════════════════════════════════════════════╗
║  ← Penicillins                        [Save] ║
║                                               ║
║  Name (Required)                              ║
║  ┌───────────────────────────────────────┐   ║
║  │                                       │   ║ ← Empty! Red border
║  └───────────────────────────────────────┘   ║
║  ⚠️ Name is required                          ║ ← Error message in red
║                                               ║
║  Category (Required)                          ║
║  ┌───────────────────────────────────────┐   ║
║  │ Select category                    ▼  │   ║ ← Not selected! Red border
║  └───────────────────────────────────────┘   ║
║  ⚠️ Category is required                      ║
║                                               ║
║  Severity (Required)                          ║
║     ○  Severe        ○  Not Severe            ║ ← Neither selected!
║  ⚠️ Severity is required                      ║
║                                               ║
║                                               ║
║  ┌─────────────────────────────────────┐     ║
║  │  ⚠️  Please complete all required   │     ║ ← Alert popup
║  │      fields before saving            │     ║
║  │                                      │     ║
║  │                   [OK]               │     ║
║  └─────────────────────────────────────┘     ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

Red borders + error messages show what's missing

User must fill those fields before Save button works

---

## Screen 6: Conditional Logic Demo

### Scenario A: User Selects "Not Severe"

```
╔═══════════════════════════════════════════════╗
║  Severity (Required)                          ║
║                                               ║
║     ○  Severe        ●  Not Severe            ║ ← "Not Severe" selected
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║              Show more  ▼                     ║ ← EpiPen field does NOT appear
║                                               ║
╚═══════════════════════════════════════════════╝
```

**EpiPen question hidden** because allergy is not severe

---

### Scenario B: User Changes to "Severe"

```
╔═══════════════════════════════════════════════╗
║  Severity (Required)                          ║
║                                               ║
║     ●  Severe        ○  Not Severe            ║ ← "Severe" selected
║                                               ║
║                                               ║
║  EpiPen Prescribed? (Required)                ║ ← Field appears!
║                                               ║
║     ○  Yes           ○  No                    ║ ← User must answer
║                                               ║
║  ─────────────────────────────────────────    ║
║                                               ║
║              Show more  ▼                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

**EpiPen question appears** as soon as user selects "Severe"

---

## Screen 7: Warning Banner in List (Severe + EpiPen = Yes)

When user has completed a severe allergy with EpiPen:

```
╔═══════════════════════════════════════════════╗
║  MEDICATION ALLERGIES                         ║
║                                               ║
║  ┌───────────────────────────────────────┐   ║
║  │  ╔═══════════════════════════════════╗│   ║
║  │  ║  ⚠️  SEVERE - EPIPEN REQUIRED     ║│   ║ ← Red/orange banner
║  │  ╚═══════════════════════════════════╝│   ║   stands out visually
║  │                                       │   ║
║  │  Penicillins                          │   ║
║  │                                       │   ║
║  │  Category: Medication                 │   ║
║  │  Severity: Severe                     │   ║
║  │  EpiPen: Yes                          │   ║
║  └───────────────────────────────────────┘   ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

**Warning banner** immediately visible to user and providers

Shows critical safety information at a glance

---

## Screen 8: Provider View (Enhanced Detail)

When a provider views the same allergy record:

```
╔═══════════════════════════════════════════════╗
║  ← Patient: John Doe                 [Close] ║
║                                               ║
║  ╔═══════════════════════════════════════╗   ║
║  ║  ⚠️  SEVERE ALLERGY - ANAPHYLAXIS     ║   ║ ← Prominent warning
║  ║     EPIPEN PRESCRIBED                 ║   ║
║  ╚═══════════════════════════════════════╝   ║
║                                               ║
║  Allergen: Penicillins                        ║
║  ICD-10: Z88.0                                ║ ← Medical code
║                                               ║
║  Category: Medication Allergy                 ║
║  Severity: Severe (Anaphylaxis Risk)          ║ ← Clinical language
║  EpiPen Prescribed: YES ⚠️                    ║
║                                               ║
║  First Occurred: March 1999 (Age 5)           ║
║                                               ║
║  Clinical Notes:                              ║
║  First reaction at age 5. Required            ║
║  hospitalization. Patient now carries         ║
║  EpiPen at all times.                         ║
║                                               ║
║  Cross-Sensitivities:                         ║
║  • Other penicillin-class antibiotics         ║ ← Auto-suggested
║  • Cephalosporins (possible)                  ║
║                                               ║
║  Attached Documents:                          ║
║  • Allergy_Test_Results.pdf                   ║
║  • Hospital_Discharge_Summary.pdf             ║
║                                               ║
╚═══════════════════════════════════════════════╝
```

**Provider sees**:
- Prominent warning banner
- ICD-10 code for billing/records
- Clinical terminology
- Cross-sensitivities (future feature)
- Full documentation

---

## Color & Typography Specifications

### Colors Used:

```
Black text:        #000000  (main text)
Gray text:         #666666  (labels, secondary)
Light gray:        #999999  (placeholders, empty states)
Border gray:       #CCCCCC  (input borders)
Divider gray:      #E0E0E0  (section dividers)

Black buttons:     #000000  (primary actions)
White text:        #FFFFFF  (on black buttons)

Error red:         #DC3445  (validation errors, warnings)
Warning orange:    #FF9800  (severe allergy banners)
Success green:     #4CAF50  (completed status)
Link blue:         #0066CC  (Show more, links)
```

### Typography:

```
Screen title:      24px, bold (700), black
Section headers:   12px, bold (700), gray, UPPERCASE
Field labels:      14px, regular (400), gray
Field values:      16px, regular (400), black
Input text:        16px, regular (400), black
Button text:       16px, medium (500), white or black
Error text:        12px, regular (400), red
```

### Spacing:

```
Screen margins:    16px left/right
Field spacing:     16px between fields
Section spacing:   24px between sections
Input height:      58px (single line)
Textarea height:   90px minimum (multi-line)
Button height:     42px (secondary), 58px (primary)
```

---

## User Flow Example

**Complete user journey for adding a severe allergy:**

1. User opens app → Taps "Allergies" in nav
2. Sees list screen → Taps "+ Add with details"
3. Edit screen opens → User fills:
   - Name: "Peanuts"
   - Category: Selects "Food"
   - Severity: Taps "Severe"
   - **EpiPen field appears automatically**
   - EpiPen: Taps "Yes"
   - Taps "Show more"
   - Onset: Selects "Age" mode, enters "5"
   - Details: Types "First reaction at birthday party. Face swelled. ER visit."
4. User taps "Save"
5. Returns to list → Sees new card with **warning banner**:
   ```
   ╔═══════════════════════════════════╗
   ║  ⚠️  SEVERE - EPIPEN REQUIRED     ║
   ╚═══════════════════════════════════╝
   Peanuts
   ```

The warning banner ensures this critical info is **impossible to miss**.

---

## Mobile Responsive Design

All screens designed for **mobile-first**:

- Touch targets: Minimum 44px × 44px (Apple guidelines)
- Tap zones: Extended beyond visual element
- Scroll areas: Smooth scrolling, momentum
- Keyboard: Pushes content up, doesn't obscure fields
- Safe areas: Respects iPhone notch/home indicator

### Landscape Mode:
Fields become wider, but same vertical layout (no multi-column for simplicity)

---

This shows you **exactly** what every screen will look like, how fields appear/disappear, and how the critical EpiPen safety feature works.