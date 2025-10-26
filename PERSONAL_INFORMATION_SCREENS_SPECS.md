# Personal Information Screens - Complete Figma Extraction

**Extracted from**: Figma file `october-arkpass` via MCP
**Total screens extracted**: 15 screens
**Pattern**: Main view → Individual edit screens per field

---

## Overview

Personal Information manages the patient's core demographic and contact data. Unlike other features (Conditions, Medications, etc.), this is a **single-record system** - there's only ONE personal information record per patient, with multiple editable fields.

**Key characteristics**:
- No list view (single record)
- No Add/Delete pattern (record always exists)
- Field-level editing (each field has dedicated edit screen)
- Validation indicators (red dots for incomplete/unconfirmed fields)
- Account deletion capability

---

## Screen Inventory

| # | Screen Name | Node ID | Purpose |
|---|---|---|---|
| 1 | Personal Information (Main) | 1483:8418 | View all fields with Edit buttons |
| 2 | Edit Name | 1483:8419 | Edit First/Middle/Last name |
| 3 | Edit Gender | 1483:8420 | Select gender (dropdown) |
| 4 | Edit Date of Birth | 1483:8421 | Calendar picker for DOB |
| 5 | Edit Height & Weight | 1483:8422 | Unit selectors + numeric inputs |
| 6 | Edit Mobile Phone | 1483:8423 | Phone number input |
| 7 | Edit Email | 1483:8428 | Email input with confirmation |
| 8 | Edit Legal Mailing Address | 1483:8429 | Multi-line address input |
| 9 | Edit Health Insurance # | 1483:8432 | Number + Jurisdiction dropdown |
| 10 | Edit Family Doctor | 1483:8433 | Name + Phone inputs |
| 11 | Edit Emergency Contact | 1483:8431 | Name + Relationship + Phone |
| 12 | Edit Photo | 1483:8434 | Upload profile photo |
| 13 | Edit Living Situation | 1483:8430 | Text or dropdown |
| 14 | Delete Account Confirmation | 1483:8435 | Confirmation dialog |
| 15 | Account Deleted Success | 1372:6350 | Success message |

---

## 1. Personal Information - Main View (Node: 1483:8418)

### Layout

```
┌─────────────────────────────────────────┐
│  [Share Your Health Record]            │  ← Header button (black)
├─────────────────────────────────────────┤
│           Primary Info                  │  ← Section title
│                                         │
│  ┌───┐  [Upload Photo •]               │  ← Profile photo + button
│  │JD │                                  │     (red dot = missing)
│  └───┘                                  │
│                                         │
│  Name                          [Edit]  │  ← Field + Edit button
│  John Doe                               │
│                                         │
│  Gender                        [Edit]  │
│  Male                                   │
│                                         │
│  Date of Birth                 [Edit]  │
│  Mar 30, 1977                          │
│                                         │
│  Height & Weight               [Edit]  │
│  173 cm, 75 kg                         │
│  Jan 23, 2023, Your BMI is 25.1...    │  ← Calculated BMI display
│                                         │
│  ─────────────────────────────────     │  ← Horizontal separator
│                                         │
│  Mobile Phone                  [Edit]  │
│  +1 (123) 456 - 7890                   │
│                                         │
│  Email                      • [Edit]   │  ← Red dot = unconfirmed
│  john.doe@domain.com                   │
│  Confirm your email                    │  ← Warning message (red)
│                                         │
│  Legal Mailing Address         [Edit]  │
│  4567 Lougheed Hwy., Burnaby, BC...   │
│                                         │
│  ─────────────────────────────────     │
│                                         │
│  Health Insurance #            [Edit]  │
│  0018-3978 (BC)                        │
│                                         │
│  Family Doctor              • [Edit]   │  ← Red dot = incomplete
│  Dr. Osler                             │
│  Phone missing                         │  ← Warning message (red)
│                                         │
│  ─────────────────────────────────     │
│                                         │
│  Emergency Contact          • [Edit]   │  ← Red dot = missing
│  N/A                                   │  ← Red text for missing
│                                         │
│  ─────────────────────────────────     │
│                                         │
│  Delete account and health record      │
│                                [Delete]│  ← Destructive action
└─────────────────────────────────────────┘
```

---

### Fields Visible

**Section 1: Primary Info**

1. **Profile Photo** (Optional)
   - Display: Avatar with initials "JD" if no photo
   - Indicator: Red dot if missing
   - Action: "Upload Photo" button

2. **Name** (Required)
   - Display: "John Doe"
   - Format: Full name

3. **Gender** (Required)
   - Display: "Male"
   - Format: Single selection

4. **Date of Birth** (Required - CRITICAL for dual-mode age calculations!)
   - Display: "Mar 30, 1977"
   - Format: MMM DD, YYYY
   - **🚨 CRITICAL**: This field is used by dual-mode date input component to convert age to date

5. **Height & Weight** (Optional)
   - Display: "173 cm, 75 kg"
   - Format: Height unit, Weight unit
   - BMI calculation: "Jan 23, 2023, Your BMI is 25.1 (Overweight)"
   - Shows measurement date + calculated BMI + category

**Section 2: Contact Info** (separated by line)

6. **Mobile Phone** (Required for SMS verification)
   - Display: "+1 (123) 456 - 7890"
   - Format: International format with country code

7. **Email** (Optional but recommended)
   - Display: "john.doe@domain.com"
   - Indicator: Red dot + "Confirm your email" if unconfirmed
   - Status: Unverified state shown

8. **Legal Mailing Address** (Optional)
   - Display: "4567 Lougheed Hwy., Burnaby, BC V5C 3Z6, Canada"
   - Format: Street, City, Province/State, Postal/Zip, Country

**Section 3: Health System Info** (separated by line)

9. **Health Insurance #** (Optional)
   - Display: "0018-3978 (BC)"
   - Format: Number + Jurisdiction in parentheses

10. **Family Doctor** (Optional)
    - Display: "Dr. Osler"
    - Indicator: Red dot + "Phone missing" warning if incomplete

**Section 4: Emergency** (separated by line)

11. **Emergency Contact** (Optional but recommended)
    - Display: "N/A" in red if missing
    - Indicator: Red dot if missing

**Section 5: Account Management** (separated by line)

12. **Delete Account**
    - Action: "Delete" button (black background)
    - Consequence: Deletes entire account and health record

---

### Visual Indicators

**Red Dot (•)**:
- Appears next to field label or button
- Meaning: Field is incomplete, unconfirmed, or requires attention
- Seen on: Upload Photo, Email, Family Doctor, Emergency Contact

**Warning Messages (Red Text)**:
- "Confirm your email" - Email not verified
- "Phone missing" - Family Doctor incomplete
- "N/A" - Emergency Contact not provided

---

## 2. Edit Name (Node: 1483:8419)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Name                        [Save] │  ← Back + Title + Save
├─────────────────────────────────────────┤
│                                         │
│  First Name (Required)                  │
│  [John____________________________]    │  ← Text input with value
│                                         │
│  Middle Name                            │
│  [_________________________________]    │  ← Text input empty
│                                         │
│  Last Name (Required)                   │
│  [Doe_____________________________]    │  ← Text input with value
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **First Name*** (Required)
   - Type: Text input
   - Height: 58px (standard)
   - Validation: Required, min 1 character

2. **Middle Name** (Optional)
   - Type: Text input
   - Height: 58px

3. **Last Name*** (Required)
   - Type: Text input
   - Height: 58px
   - Validation: Required, min 1 character

---

## 3. Edit Gender (Node: 1483:8420)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Gender                      [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Gender (Required)                      │
│  [Male_________________________] ▼     │  ← Dropdown
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Gender*** (Required)
   - Type: Dropdown
   - Current value: "Male"
   - Options: ✅ **CONFIRMED** - User approved suggested options
     - Male
     - Female
     - Non-binary
     - Prefer not to say
     - Other (may include free-text field)

---

## 4. Edit Date of Birth (Node: 1483:8421)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Date of Birth               [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Date of Birth (Required)               │
│  [_________________________________] 📅│  ← Calendar picker
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Date of Birth*** (Required)
   - Type: Calendar date picker
   - Icon: Calendar icon (📅)
   - Validation:
     - Required
     - Must be in past
     - Reasonable age range (0-120 years old)
   - **🚨 CRITICAL**: This is the source of truth for dual-mode age calculations
   - **Format**: Full date (Year-Month-Day) - NO progressive disclosure, NO age mode

---

## 5. Edit Height & Weight (Node: 1483:8422)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Height and Weight           [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Unit               [cm__] ▼            │  ← Unit selector dropdown
│  [Centimetres____________________]     │  ← Numeric input
│                                         │
│  Unit               [kg__] ▼            │  ← Unit selector dropdown
│  [Kilograms______________________]     │  ← Numeric input
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Height**
   - Unit selector: Dropdown (cm / inches)
     - Options: "cm", "in"
   - Value input: Numeric
   - Validation: Positive number, reasonable range (50-300 cm or 20-120 inches)

2. **Weight**
   - Unit selector: Dropdown (kg / lbs)
     - Options: "kg", "lbs"
   - Value input: Numeric
   - Validation: Positive number, reasonable range (20-500 kg or 40-1100 lbs)

### BMI Calculation
- Formula: BMI = weight(kg) / (height(m))^2
- Displayed on main screen with:
  - Measurement date
  - BMI value (e.g., 25.1)
  - Category: Underweight, Normal, Overweight, Obese

---

## 6. Edit Mobile Phone (Node: 1483:8423)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Mobile Phone                [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Mobile Phone (Required)                │
│  [+1 (123) 456-7890______________]     │  ← Phone input
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Mobile Phone*** (Required)
   - Type: Phone number input
   - Format: International with country code
   - Validation:
     - Required (primary authentication method)
     - Valid phone number format
     - Must be unique (one account per phone)
   - SMS verification: Sends confirmation code

---

## 7. Edit Email (Node: 1483:8428)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Email                       [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Email (Required)                       │
│  [john.doe@domain.com___________]      │  ← Email input
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Email** (Optional but recommended)
   - Type: Email input
   - Validation:
     - Valid email format
     - Must be unique (one account per email)
   - Confirmation flow:
     - After save, sends confirmation email
     - "Confirm your email" warning shown until verified
     - Red dot indicator until verified

---

## 8. Edit Legal Mailing Address (Node: 1483:8429)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Legal Mailing Address       [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Legal Mailing Address                  │
│  [4567 Lougheed Hwy.,____________]     │  ← Multi-line textarea
│  [Burnaby, BC V5C 3Z6,___________]     │
│  [Canada_________________________]     │
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Legal Mailing Address** (Optional)
   - Type: Textarea (multi-line text input)
   - Height: 90px (3 lines visible)
   - Format: Free-form address
   - Validation: None (optional field)

---

## 9. Edit Health Insurance # (Node: 1483:8432)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Health Insurance #          [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Health Insurance #        Jurisdiction │
│  [0018-3978_________]      [BC___] ▼   │  ← Number + Dropdown
│                                         │
└─────────────────────────────────────────┘
```

### Fields

1. **Health Insurance #** (Optional)
   - Type: Text input
   - Format: Alphanumeric (varies by jurisdiction)
   - Example: "0018-3978"

2. **Jurisdiction** (Optional)
   - Type: Dropdown
   - Current: "BC" (British Columbia)
   - Options: ✅ **CONFIRMED** - International jurisdictions supported
     - **Canada**: All provinces and territories (BC, AB, SK, MB, ON, QC, NB, NS, PE, NL, YT, NT, NU)
     - **United States**: All 50 states + DC
     - **Other countries**: International jurisdictions supported
     - User confirmed: "Yes, US is included and other countries as well"

---

## 10. Edit Family Doctor (Node: 1483:8433)

**NOT FULLY EXTRACTED** - Inferred from main screen

### Fields (Inferred)

1. **Doctor Name** (Optional)
   - Type: Text input
   - Example: "Dr. Osler"

2. **Doctor Phone** (Optional but recommended if name provided)
   - Type: Phone input
   - Warning: "Phone missing" shown on main screen if name provided but phone empty
   - Red dot indicator if incomplete

---

## 11. Edit Emergency Contact (Node: 1483:8431)

**NOT FULLY EXTRACTED** - Inferred from main screen

### Fields (Inferred)

1. **Contact Name** (Optional but recommended)
   - Type: Text input

2. **Relationship** (Optional)
   - Type: Dropdown or text
   - Examples: Spouse, Parent, Sibling, Friend, etc.

3. **Contact Phone** (Optional but recommended)
   - Type: Phone input

---

## 12. Edit Photo (Node: 1483:8434)

**NOT FULLY EXTRACTED** - Button shown on main screen

### Functionality (Inferred)

- **Upload Photo** button opens file picker or camera
- Accepts: Image files (JPG, PNG, etc.)
- Size limit: TBD
- Cropping: Circular crop for avatar
- Default: Initials (e.g., "JD") on gray background if no photo

---

## 13. Delete Account Confirmation (Node: 1483:8435)

### Layout
```
┌─────────────────────────────────────────┐
│  ←  Delete your Health Record?         │
├─────────────────────────────────────────┤
│                                         │
│  Lorem Ipsum is simply dummy text of   │  ← Warning text
│  the printing and typesetting industry.│
│  Lorem Ipsum has been the industry's   │
│  standard dummy text since the 1500s.  │
│                                         │
│  [No, don't delete]  [Yes, delete]     │  ← Cancel + Confirm
│                                         │
└─────────────────────────────────────────┘
```

### Functionality

- **Title**: "Delete your Health Record?"
- **Warning message**: Explains consequences (placeholder text in design)
- **Actions**:
  - "No, don't delete" (white button) - Cancel, return to main screen
  - "Yes, delete" (black button) - Proceed with deletion

**🚨 CRITICAL**: This is permanent and irreversible

---

## 14. Account Deleted Success (Node: 1372:6350)

### Layout
```
┌─────────────────────────────────────────┐
│                                         │
│           [Logo]                        │  ← App logo
│                                         │
│  Your Health Record Has Been           │  ← Success title
│  Successfully Deleted!                  │
│                                         │
│  Lorem Ipsum is simply dummy text...   │  ← Explanation text
│                                         │
│           [Continue]                    │  ← Action button (black)
│                                         │
└─────────────────────────────────────────┘
```

### Functionality

- **Title**: "Your Health Record Has Been Successfully Deleted!"
- **Message**: Confirmation and next steps (placeholder text in design)
- **Action**: "Continue" button
  - Likely redirects to: Login screen or Homepage (logged out)
  - Account and all associated data deleted

---

## Data Model

### TypeScript Interface

```typescript
interface PersonalInformation {
  id: string; // User/Patient ID

  // Primary Info (Section 1)
  firstName: string; // Required
  middleName?: string; // Optional
  lastName: string; // Required
  gender: Gender; // Required
  dateOfBirth: Date; // Required - CRITICAL for age calculations
  profilePhotoUrl?: string; // Optional

  // Height & Weight (with units)
  height?: {
    value: number; // e.g., 173
    unit: 'cm' | 'in'; // e.g., 'cm'
  };
  weight?: {
    value: number; // e.g., 75
    unit: 'kg' | 'lbs'; // e.g., 'kg'
  };

  // Calculated BMI (not stored, computed)
  bmi?: {
    value: number; // e.g., 25.1
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
    measuredAt: Date; // When height/weight last updated
  };

  // Contact Info (Section 2)
  mobilePhone: string; // Required (primary auth)
  mobilePhoneVerified: boolean; // SMS verification status
  email?: string; // Optional
  emailVerified: boolean; // Email confirmation status
  legalMailingAddress?: string; // Multi-line address

  // Health System Info (Section 3)
  healthInsurance?: {
    number: string; // e.g., "0018-3978"
    jurisdiction: string; // e.g., "BC"
  };
  familyDoctor?: {
    name: string; // e.g., "Dr. Osler"
    phone?: string; // Optional but recommended
  };

  // Emergency (Section 4)
  emergencyContact?: {
    name: string;
    relationship?: string; // e.g., "Spouse", "Parent"
    phone: string;
  };

  // Additional fields (inferred)
  livingS situation?: string; // e.g., "Living with family"
  occupation?: string; // e.g., "Self employed"

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

// Gender options (NEEDS VERIFICATION)
type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'other' | string;
```

---

### Database Schema

```sql
CREATE TABLE personal_information (
  id UUID PRIMARY KEY REFERENCES users(id), -- One-to-one with user account

  -- Primary Info
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL, -- CRITICAL for dual-mode age calculations
  profile_photo_url TEXT,

  -- Height & Weight (with units)
  height_value DECIMAL(5,2), -- e.g., 173.50
  height_unit VARCHAR(10), -- 'cm' or 'in'
  weight_value DECIMAL(5,2), -- e.g., 75.00
  weight_unit VARCHAR(10), -- 'kg' or 'lbs'
  height_weight_measured_at TIMESTAMP, -- Last update timestamp

  -- Contact Info
  mobile_phone VARCHAR(50) NOT NULL UNIQUE,
  mobile_phone_verified BOOLEAN DEFAULT FALSE,
  email VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  legal_mailing_address TEXT,

  -- Health System Info
  health_insurance_number VARCHAR(100),
  health_insurance_jurisdiction VARCHAR(50),
  family_doctor_name VARCHAR(255),
  family_doctor_phone VARCHAR(50),

  -- Emergency
  emergency_contact_name VARCHAR(255),
  emergency_contact_relationship VARCHAR(100),
  emergency_contact_phone VARCHAR(50),

  -- Additional
  living_situation TEXT,
  occupation VARCHAR(255),

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Computed BMI view (not stored)
CREATE VIEW personal_information_with_bmi AS
SELECT
  pi.*,
  CASE
    WHEN height_unit = 'cm' AND weight_unit = 'kg' THEN
      weight_value / POWER(height_value / 100, 2)
    WHEN height_unit = 'in' AND weight_unit = 'lbs' THEN
      (weight_value / POWER(height_value, 2)) * 703
    -- Add other unit combinations as needed
    ELSE NULL
  END AS bmi_value,
  CASE
    WHEN bmi_value < 18.5 THEN 'underweight'
    WHEN bmi_value >= 18.5 AND bmi_value < 25 THEN 'normal'
    WHEN bmi_value >= 25 AND bmi_value < 30 THEN 'overweight'
    WHEN bmi_value >= 30 THEN 'obese'
    ELSE NULL
  END AS bmi_category
FROM personal_information pi;
```

---

## Critical Questions & Missing Information

### 1. Gender Dropdown Options
**Question**: What are the complete gender options?

**Evidence**: Dropdown shown with "Male" selected

**Hypothesis**:
- Male
- Female
- Non-binary
- Prefer not to say
- Other (with text input?)

**Action needed**: Check Figma dropdown component or ask user

---

### 2. Health Insurance Jurisdiction Options
**Question**: What are the complete jurisdiction options?

**Evidence**: Dropdown shown with "BC" selected

**Hypothesis**:
- Canadian provinces: BC, AB, SK, MB, ON, QC, NB, NS, PE, NL, YT, NT, NU
- US states: CA, NY, TX, FL, etc.
- Other countries?

**Action needed**: Clarify scope (Canada-only? North America? Global?)

---

### 3. Date of Birth - Why No Dual-Mode?
**Question**: Why doesn't Date of Birth use dual-mode date input (Date OR Age)?

**Answer**: Date of Birth is the **source of truth** for age calculations. It must be precise (year-month-day). This field is used by the dual-mode component in OTHER features (Surgeries, Immunizations, etc.) to convert age entries to dates.

**Example**:
- Patient DOB: March 15, 1974
- User enters "Age 25" for surgery
- System calculates: March 15, 1999 (1974 + 25)

---

### 4. Family Doctor vs Family History
**Question**: How does "Family Doctor" field relate to "Family History" feature?

**Answer**: Separate concepts:
- **Family Doctor** (Personal Info): Patient's primary care physician
- **Family History** (separate feature): Medical conditions of relatives

**No relation** between these two fields.

---

### 5. Photo Upload - Specs?
**Question**: Photo upload specifications?

**Missing**:
- Accepted file types (JPG, PNG, GIF, etc.)
- Maximum file size (1MB? 5MB?)
- Image dimensions (minimum/maximum)
- Cropping interface (circular crop for avatar)
- Storage location (CDN? S3?)

**Action needed**: Clarify technical requirements

---

### 6. Incomplete Field Detection Logic
**Question**: When does red dot indicator appear?

**Observed rules**:
- **Upload Photo**: Always shown if no photo uploaded
- **Email**: Shown if email provided but not verified
- **Family Doctor**: Shown if name provided but phone missing
- **Emergency Contact**: Shown if no contact provided at all

**Pattern**: Red dot = field incomplete OR requires action (verification)

---

## Validation Rules

### Required Fields (Cannot be empty)

1. **First Name**: Min 1 character, max 255
2. **Last Name**: Min 1 character, max 255
3. **Gender**: Must select from dropdown
4. **Date of Birth**:
   - Must be valid date
   - Must be in past
   - Age range: 0-120 years (configurable)
5. **Mobile Phone**:
   - Valid phone format
   - Unique (one account per phone)
   - Must be verified via SMS

---

### Optional But Recommended

1. **Email**:
   - Valid email format if provided
   - Unique (one account per email)
   - Verification recommended

2. **Emergency Contact**:
   - All fields optional individually
   - But recommended for safety

3. **Family Doctor**:
   - Name optional
   - If name provided, phone recommended (warning shown if missing)

---

### Validation Messages

**Email**:
- "Confirm your email" (if unverified)
- "Invalid email format"
- "Email already in use"

**Mobile Phone**:
- "Invalid phone number"
- "Phone number already registered"
- "SMS verification code sent"

**Date of Birth**:
- "Date cannot be in the future"
- "Invalid date"
- "Age must be between 0 and 120 years"

**Height/Weight**:
- "Height must be between 50-300 cm"
- "Weight must be between 20-500 kg"
- "Please enter a valid number"

---

## UI/UX Patterns

### Field-Level Editing
- Each field has dedicated edit screen (not inline editing)
- Back button returns to main view
- Save button commits changes
- No explicit Cancel button (Back = cancel)

### Visual Hierarchy
- Sections separated by horizontal lines
- Field labels in gray (secondary text)
- Field values in black bold (primary text)
- Warnings in red (errors/missing data)

### Validation Indicators
- Red dot (•) next to field = incomplete/requires action
- Red text for missing required-ish fields ("N/A")
- Warning text below field (e.g., "Phone missing")

### Progressive Enhancement
- Basic info always visible
- Optional fields can remain empty (no forced completion)
- Warnings encourage completion but don't block usage

---

## Status**: ✅ Complete extraction (15 screens)
**Critical Discovery**: Date of Birth is source of truth for dual-mode age calculations across entire system
**Next**: Verify Gender options, Health Insurance jurisdictions, Photo upload specs
