# Conditions Screens - Detailed Specifications

## Overview
This document contains detailed specifications for all Condition-related screens in the Patient Health Record mobile application.

---

## Design System

### Typography
- **Font Family**: Public Sans
- **H1 (Page Titles)**: Bold, 24px, line-height 100%, tracking -0.3333px
- **H2 (Section Headers)**: Bold, 20px, line-height 100%, tracking -0.3333px
- **Body Text**: Medium, 16px, line-height 100%, tracking -0.3333px
- **Label Text**: Medium, 14px, line-height 100%, tracking -0.3333px
- **Button Text (Primary)**: ExtraBold, 16px, line-height 24px, tracking -0.3333px
- **Button Text (Secondary)**: ExtraBold, 14px, line-height normal, tracking -0.3333px

### Color Palette
- **Primary Black**: #000000
- **Text Primary**: #000000
- **Text Secondary**: #666666
- **White/Background**: #FFFFFF
- **Border Gray**: #CCCCCC
- **Button Background (Secondary)**: #EEEEEE
- **Radio Button Fill**: #999999
- **Link Blue**: #1A73E8
- **Danger Red**: #E8344F

### Spacing & Layout
- **Mobile Width**: 390px
- **Standard Padding**: 16px
- **Element Gaps**: 8px, 16px, 24px
- **Border Radius**: 4px (buttons, inputs)
- **Border Radius (Radio)**: 50px
- **Button Heights**:
  - Primary: 58px
  - Secondary: 42px

---

## Screen 1: Conditions List

**Figma Node ID**: `1534-33530`

### Purpose
Display all patient conditions organized by type (Chronic/Transient) with quick-add functionality.

### Layout Structure

#### Header Section
- **"Share Your Health Record" Button**
  - Background: Black (#000000)
  - Text: White, ExtraBold, 16px
  - Height: 58px
  - Full width with 16px horizontal padding

#### Title
- **Text**: "Conditions"
  - Font: Bold, 24px
  - Color: Black
  - Alignment: Center

#### Quick Add Section
- **Input Field**:
  - Placeholder: "Quick Add"
  - Border: 1px solid #CCCCCC
  - Height: 58px
  - Rounded left corners (4px)
  - Flexible width
- **Add Button**:
  - Background: Black
  - Text: "Add" (White, ExtraBold, 16px)
  - Height: 58px
  - Rounded right corners (4px)

#### Add with Details Button
- Border: 1px solid #666666
- Text: "+ Add with details" (ExtraBold, 14px, Black)
- Height: 42px
- Full width

#### Conditions Lists

**Chronic Section**:
- **Header**: "CHRONIC" (Bold, 16px, uppercase, Black)
- **Condition Cards**:
  - Border: 1px solid #666666
  - Padding: 16px
  - Rounded: 4px
  - Content:
    - Condition name (Bold, 20px, Black)
    - Optional status indicator (10px oval, varies by state)
  - Examples shown:
    - Asthma (with indicator)
    - Allergic rhinitis (no indicator)
    - Bronchitis (with indicator)

**Transient Section**:
- **Header**: "TRANSIENT" (Bold, 16px, uppercase, Black)
- **Empty State**:
  - Text: "No Transient Conditions" (Medium, 16px, Black, centered)
  - Padding: 16px vertical

#### Bottom Navigation Bar
- **Height**: 58px
- **Border Top**: 1px solid Black
- **Background**: White
- **Icons** (32px each, except Plus which is 48px):
  1. Home
  2. Calendar
  3. Plus (center, larger)
  4. Key
  5. Account
- **Spacing**: 42px gap between icons

---

## Screen 2: View Condition (Collapsed)

**Figma Node ID**: `1534-33532`

### Purpose
Display basic details of a selected condition with expandable sections.

### Layout Structure

#### Header
- **Back Button**: Left arrow icon (24px)
- **Condition Name**: "Asthma" (Bold, 24px, Black)
- **Edit Button**:
  - Border: 1px solid #666666
  - Text: "Edit" (ExtraBold, 14px, Black)
  - Size: 42px × 77px
  - Rounded: 4px

#### Form Section

**Name Field** (Read-only):
- Label: "Name (Diagnosis)" (Medium, 14px, #666666)
- Value: "Asthma" (Bold, 16px, Black, line-height 24px)

**Type Field**:
- Value: "Chronic" (Bold, 16px, Black, line-height 24px)

**Show More Link**:
- Text: "Show more" (Medium, 16px, #1A73E8, centered)

**Medications Section**:
- Header: "MEDICATIONS" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- Medication entries (Medium, 16px, Black):
  - "Fluticasone, 232mcg, 2 times a day"
  - "for Asthma"
  - "Benadryl, 10mg, 1 time a day"
  - "for Allergic rhinitis"

**Documents Section**:
- Header: "DOCUMENTS" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- Document entries (Medium, 16px, Black):
  - "Document 1"
  - "Document 2"

#### Delete Button
- Icon: Delete icon (24px)
- Text: "Delete" (Bold, 16px, #666666)
- Height: 58px
- Padding: 16px horizontal

---

## Screen 3: View Condition (Expanded)

**Figma Node ID**: `1534-33533`

### Purpose
Display complete details of a selected condition.

### Additional Fields (vs Collapsed View)

**Diagnosis Date**:
- Label: "Diagnosis Date" (Medium, 14px, #666666)
- Value: "N/a" (Bold, 16px, Black, line-height 24px)

**Details**:
- Label: "Details" (Medium, 14px, #666666)
- Value: "N/a" (Bold, 16px, Black, line-height 24px)

**Show Less Link**:
- Text: "Show less" (Medium, 16px, #1A73E8, centered)

---

## Screen 4: Edit Condition - Chronic

**Figma Node ID**: `1534-33534`

### Purpose
Edit an existing chronic condition with ability to manage medications and documents.

### Layout Structure

#### Header
- **Back Button**: Left arrow icon (24px)
- **Condition Name**: "Asthma" (Bold, 24px, Black)
- **Save Button**:
  - Background: Black (#000000)
  - Text: "Save" (ExtraBold, 14px, White)
  - Size: 42px × 86px
  - Rounded: 4px

#### Form Section

**Name Input**:
- Label: "Name / Diagnosis (Required)" (Medium, 14px, #666666)
- Value: "Asthma" (Bold, 16px, Black, line-height 24px)
- Border: 1px solid #CCCCCC
- Height: 58px
- Padding: 8px vertical, 16px horizontal
- Rounded: 4px

**Condition Type Radio Buttons**:
- Two options side-by-side:
  - **Chronic** (selected):
    - Circle: 24px diameter, border #CCCCCC
    - Fill: 14px diameter, #999999
    - Label: "Chronic" (Medium, 16px, Black)
  - **Transient** (unselected):
    - Circle: 24px diameter, border #CCCCCC
    - Label: "Transient" (Medium, 16px, Black)
- Height: 58px
- Padding: 16px

**Show More Link**:
- Text: "Show more" (Medium, 16px, #1A73E8, centered)

**Medications Section**:
- Header: "MEDICATIONS" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- **Medication Entries**:
  - Text: Medication details (Medium, 16px, Black)
  - Delete icon: 24px
  - Layout: Flexbox with space-between
- **Add Button**:
  - Background: #EEEEEE
  - Border: 1px solid #666666
  - Text: "+ Add Medications" (ExtraBold, 16px, Black, line-height 24px)
  - Height: 58px
  - Full width
  - Rounded: 4px

**Documents Section**:
- Header: "DOCUMENTS" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- **Document Entries**:
  - Text: Document name (Medium, 16px, Black)
  - Delete icon: 24px
  - Layout: Flexbox with space-between
- **Add Button**:
  - Background: #EEEEEE
  - Border: 1px solid #666666
  - Text: "+ Add Documents" (ExtraBold, 16px, Black, line-height 24px)
  - Height: 58px
  - Full width
  - Rounded: 4px

#### Delete Button
- Icon: Delete icon (24px)
- Text: "Delete" (Bold, 16px, #666666)
- Height: 58px
- Padding: 16px horizontal

---

## Screen 5: Add Condition - Chronic

**Figma Node ID**: `1534-33536`

### Purpose
Add a new chronic condition to the patient's health record.

### Layout Structure

#### Header
- **Back Button**: Left arrow icon (24px)
- **Title**: "Add Condition" (Bold, 24px, Black)
- **Save Button**:
  - Background: Black (#000000)
  - Text: "Save" (ExtraBold, 14px, White)
  - Size: 42px × 86px
  - Rounded: 4px

#### Form Section

**Name Input**:
- Placeholder: "Name / Diagnosis (Required)" (Medium, 16px, #666666)
- Border: 1px solid #CCCCCC
- Height: 58px
- Padding: 20px vertical, 16px horizontal
- Rounded: 4px

**Condition Type Radio Buttons**:
- Same as Edit screen
- Chronic selected by default

**Show More Link**:
- Text: "Show more" (Medium, 16px, #1A73E8, centered)

**Medications Section**:
- Header: "MEDICATIONS FOR THIS CONDITION" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- **Empty State**:
  - Text: "No Medications" (Medium, 16px, Black, centered)
  - Padding: 16px vertical
- **Add Button**: Same styling as Edit screen

**Documents Section**:
- Header: "DOCUMENTS" (Bold, 16px, uppercase, Black)
- Separator: 2px height, #CCCCCC
- **Empty State**:
  - Text: "No Documents" (Medium, 16px, Black, centered)
  - Padding: 16px vertical
- **Add Button**: Same styling as Edit screen

---

## Screen 6: Add Condition - Transient - Recurrent

**Figma Node ID**: `1534-33538`

### Purpose
Add a new transient recurrent condition.

### Additional Fields (vs Chronic)

**Condition Type Radio Buttons**:
- Row 1:
  - Chronic (unselected)
  - Transient (selected)
- Row 2:
  - **Recurrent** (selected):
    - Circle: 24px diameter, border #CCCCCC
    - Fill: 14px diameter, #999999
    - Label: "Recurrent" (Medium, 16px, Black)
  - **Resolved** (unselected):
    - Circle: 24px diameter, border #CCCCCC
    - Label: "Resolved" (Medium, 16px, Black)
- Each row height: 58px
- Padding: 16px

**Medications Section Header**:
- Text: "MEDICATIONS" (Bold, 16px, uppercase, Black)
  - Note: Different from "MEDICATIONS FOR THIS CONDITION" in chronic

---

## Screen 7: Add Condition - Transient - Resolved

**Figma Node ID**: `1534-33540`

### Purpose
Add a new transient resolved condition.

### Differences from Recurrent
- **Resolved** radio button is selected instead of Recurrent
- All other elements identical to Transient - Recurrent screen

---

## Interaction Patterns

### Radio Buttons
- **Selected State**:
  - Outer circle: 24px, white background, 1px border #CCCCCC
  - Inner fill: 14px, #999999 background, positioned 5px from edges
- **Unselected State**:
  - Circle: 24px, white background, 1px border #CCCCCC
- **Label**: Medium, 16px, Black, 8px spacing from circle

### Buttons

**Primary Button**:
- Background: Black (#000000)
- Text: White, ExtraBold
- Border radius: 4px
- Height: 42px or 58px (depending on context)
- Padding: 16px horizontal

**Secondary Button**:
- Background: #EEEEEE
- Border: 1px solid #666666
- Text: Black, ExtraBold
- Border radius: 4px
- Height: 42px or 58px
- Padding: 16px horizontal

**Tertiary Button**:
- Background: Transparent
- Border: 1px solid #666666
- Text: Black, ExtraBold
- Border radius: 4px
- Height: 42px
- Padding: 16px horizontal

### Input Fields

**Standard Input**:
- Border: 1px solid #CCCCCC
- Background: White (#FFFFFF)
- Border radius: 4px
- Height: 58px
- Padding: 20px vertical, 16px horizontal (for placeholder)
- Padding: 8px vertical, 16px horizontal (with label + value)

**Input with Value**:
- Label: Medium, 14px, #666666
- Value: Bold, 16px, Black, line-height 24px
- Gap between label and value: 10px

### Separators
- Height: 2px
- Color: #CCCCCC
- Full width: 357px

### Expandable Sections
- **Show more** link: Medium, 16px, #1A73E8, centered
- **Show less** link: Medium, 16px, #1A73E8, centered

---

## Content Guidelines

### Condition Names
- Should be medical diagnoses
- Capitalized appropriately
- Examples: "Asthma", "Allergic rhinitis", "Bronchitis"

### Medication Format
- Format: "[Name], [Dosage], [Frequency]"
- Second line: "for [Condition]"
- Example:
  - "Fluticasone, 232mcg, 2 times a day"
  - "for Asthma"

### Document Names
- Simple naming: "Document 1", "Document 2", etc.
- Or descriptive names based on content

### Empty States
- Use consistent messaging:
  - "No [Category]" for empty lists
  - "No Transient Conditions" for condition types
- Centered alignment
- Medium weight, 16px, Black

---

## Accessibility Notes

1. **Touch Targets**: All interactive elements meet minimum 42px height
2. **Contrast**: All text meets WCAG AA standards
3. **Label Association**: All inputs have visible labels
4. **Icon Labels**: Icons should have accessible labels (not visible in specs)
5. **Navigation**: Back button always in top-left, consistent positioning

---

## Assets

All icons and visual assets are served from:
`http://localhost:3845/assets/[hash].svg`

### Icon List
- Arrow Left with tail
- Delete icon
- Status indicator oval
- Home icon
- Calendar icon
- Plus icon
- Key icon
- Account icon

---

## Implementation Notes

1. **React Components Generated**: Figma MCP server has generated React + Tailwind components for each screen
2. **Data Attributes**: All elements include `data-node-id` for traceability
3. **Responsive**: Designs are mobile-first (390px width)
4. **Image Assets**: SVG icons are referenced via localhost URLs during development
5. **Font Loading**: Ensure Public Sans font is loaded with weights: Medium (500), Bold (700), ExtraBold (800)

---

## Screen Flow

```
Conditions List
├─→ Add Condition - Chronic
├─→ Add Condition - Transient - Recurrent
├─→ Add Condition - Transient - Resolved
└─→ View Condition (Collapsed)
    ├─→ View Condition (Expanded)
    └─→ Edit Condition - Chronic
```

---

**Document Generated**: 2025-10-24
**Source**: Figma MCP Server
**File**: Salma's Test_Low Fidelity Wireframes--Copy
**Node IDs**: 1534-33530 through 1534-33540
