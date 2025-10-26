# Personal Information Management

## Purpose

Manage patient demographic data, contact information, health insurance details, and emergency contacts. This is the foundational profile data required for the health record system. Single-record system (one profile per patient) with field-level editing.

## Requirements

### Requirement: Profile Record Initialization

The system SHALL create a single personal information record for each patient account.

#### Scenario: New user registration
- **WHEN** user completes account signup
- **THEN** create personal_information record
- **AND** set required fields: First Name, Last Name, Gender, Date of Birth, Mobile Phone
- **AND** initialize optional fields as null
- **AND** link record to user account (one-to-one)

#### Scenario: Single record constraint
- **WHEN** accessing personal information
- **THEN** retrieve existing record for patient
- **AND** never create duplicate records
- **AND** use field-level editing (not full record replacement)

### Requirement: Required Demographic Fields

The system SHALL validate and require core demographic information.

#### Scenario: Required first name
- **WHEN** user attempts to save name changes
- **THEN** validate First Name field is not empty
- **AND** require minimum 1 character, maximum 255
- **AND** show error "First Name required" if empty

#### Scenario: Required last name
- **WHEN** user attempts to save name changes
- **THEN** validate Last Name field is not empty
- **AND** require minimum 1 character, maximum 255
- **AND** show error "Last Name required" if empty

#### Scenario: Optional middle name
- **WHEN** user enters middle name
- **THEN** accept text input (maximum 255 characters)
- **AND** allow save with empty middle name

#### Scenario: Required gender selection
- **WHEN** user selects gender
- **THEN** provide dropdown options:
  - Male
  - Female
  - Non-binary
  - Prefer not to say
  - Other
- **AND** require selection before save

#### Scenario: Required date of birth
- **WHEN** user enters date of birth
- **THEN** provide calendar date picker
- **AND** validate date is in past
- **AND** validate age between 0-120 years
- **AND** require date before account creation
- **CRITICAL** This is source of truth for dual-mode age calculations across entire system

### Requirement: Date of Birth as Age Computation Source

The system SHALL use date_of_birth as authoritative source for all age-based date calculations.

#### Scenario: Compute date from age (dual-mode component)
- **WHEN** user enters "Age 25" in surgery/immunization date field
- **THEN** retrieve patient date_of_birth from personal_information
- **AND** compute date = date_of_birth + age_value years
- **EXAMPLE** DOB March 15, 1974 + Age 25 = March 15, 1999

#### Scenario: Validate age computation
- **WHEN** dual-mode date component computes date from age
- **THEN** ensure date_of_birth exists and is valid
- **AND** use patient's birth month/day for computed date
- **AND** store both age value and computed date

#### Scenario: No dual-mode for DOB itself
- **WHEN** editing date of birth
- **THEN** use calendar picker only (no age mode option)
- **REASON** DOB must be precise year-month-day for age calculations

### Requirement: Contact Information Fields

The system SHALL manage patient contact information with verification.

#### Scenario: Required mobile phone
- **WHEN** user enters mobile phone
- **THEN** accept international format with country code
- **AND** validate format (e.g., +1 (123) 456-7890)
- **AND** require unique phone number (one account per phone)
- **AND** trigger SMS verification flow

#### Scenario: Mobile phone verification
- **WHEN** user saves new mobile phone number
- **THEN** send SMS verification code
- **AND** mark mobile_phone_verified = false
- **AND** show "Verify your phone" warning until verified
- **AND** set mobile_phone_verified = true after code confirmation

#### Scenario: Optional email with verification
- **WHEN** user enters email address
- **THEN** validate email format if provided
- **AND** require unique email (one account per email)
- **AND** send confirmation email after save
- **AND** show red dot + "Confirm your email" warning if unverified
- **AND** set email_verified = true after link click

#### Scenario: Optional mailing address
- **WHEN** user enters legal mailing address
- **THEN** accept multi-line text input (textarea, 90px height)
- **AND** support full address format: Street, City, Province/State, Postal/Zip, Country
- **AND** allow save with empty address

### Requirement: Health Measurements

The system SHALL track height, weight, and compute BMI with unit support.

#### Scenario: Height with unit selection
- **WHEN** user enters height
- **THEN** provide unit dropdown: cm, inches
- **AND** accept numeric value input
- **AND** validate range: 50-300 cm or 20-120 inches
- **AND** store height_value and height_unit separately

#### Scenario: Weight with unit selection
- **WHEN** user enters weight
- **THEN** provide unit dropdown: kg, lbs
- **AND** accept numeric value input
- **AND** validate range: 20-500 kg or 40-1100 lbs
- **AND** store weight_value and weight_unit separately

#### Scenario: BMI calculation and display
- **WHEN** both height and weight are entered
- **THEN** compute BMI = weight(kg) / (height(m))^2
- **AND** convert units as needed for calculation
- **AND** display on main view: "Jan 23, 2023, Your BMI is 25.1 (Overweight)"
- **AND** show measurement date + BMI value + category
- **AND** categorize as: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)

#### Scenario: BMI as computed field
- **WHEN** displaying or exporting BMI
- **THEN** compute BMI on-the-fly (not stored in database)
- **AND** use current height/weight values
- **AND** show last measurement timestamp

### Requirement: Health Insurance Information

The system SHALL capture health insurance details with jurisdiction support.

#### Scenario: Optional insurance number
- **WHEN** user enters health insurance number
- **THEN** accept alphanumeric input (format varies by jurisdiction)
- **AND** allow save with empty number

#### Scenario: Jurisdiction selection
- **WHEN** user selects jurisdiction for insurance
- **THEN** provide dropdown with comprehensive list:
  - **Canada**: All provinces/territories (BC, AB, SK, MB, ON, QC, NB, NS, PE, NL, YT, NT, NU)
  - **United States**: All 50 states + DC
  - **International**: Other countries
- **AND** display as "(BC)" next to insurance number in main view

#### Scenario: Display insurance with jurisdiction
- **WHEN** viewing personal information
- **THEN** show format: "0018-3978 (BC)"
- **AND** combine number + jurisdiction in single line

### Requirement: Emergency and Provider Information

The system SHALL capture emergency contact and family doctor details.

#### Scenario: Optional emergency contact
- **WHEN** user enters emergency contact
- **THEN** accept contact name, relationship, and phone number
- **AND** show red dot indicator if no contact provided
- **AND** display "N/A" in red if empty

#### Scenario: Emergency contact relationship
- **WHEN** user selects relationship
- **THEN** provide dropdown or text input:
  - Spouse
  - Parent
  - Sibling
  - Child
  - Friend
  - Other

#### Scenario: Optional family doctor
- **WHEN** user enters family doctor
- **THEN** accept doctor name and phone number
- **AND** show red dot + "Phone missing" warning if name provided but phone empty
- **AND** encourage phone completion without blocking save

### Requirement: Visual Validation Indicators

The system SHALL show red dot indicators for incomplete or unverified fields.

#### Scenario: Red dot for unverified email
- **WHEN** email is provided but not verified
- **THEN** show red dot (•) next to "Email" label
- **AND** show "Confirm your email" warning in red text below field

#### Scenario: Red dot for incomplete family doctor
- **WHEN** family doctor name provided but phone missing
- **THEN** show red dot next to "Family Doctor" label
- **AND** show "Phone missing" warning in red text

#### Scenario: Red dot for missing emergency contact
- **WHEN** emergency contact is not provided
- **THEN** show red dot next to "Emergency Contact" label
- **AND** show "N/A" in red text

#### Scenario: Red dot for missing profile photo
- **WHEN** no profile photo uploaded
- **THEN** show red dot on "Upload Photo" button
- **AND** display initials avatar (e.g., "JD") as placeholder

### Requirement: Field-Level Editing

The system SHALL edit individual fields rather than entire profile at once.

#### Scenario: Edit single field
- **WHEN** user taps "Edit" button next to field
- **THEN** open dedicated edit screen for that field only
- **AND** show field-specific inputs
- **AND** show "Save" button in header
- **AND** validate field-specific rules on save

#### Scenario: Edit name fields
- **WHEN** user taps "Edit" on Name field
- **THEN** open Edit Name screen with 3 inputs:
  - First Name (required)
  - Middle Name (optional)
  - Last Name (required)
- **AND** preserve current values
- **AND** validate required fields on save

#### Scenario: Edit height and weight
- **WHEN** user taps "Edit" on Height & Weight field
- **THEN** open Edit Height and Weight screen
- **AND** show unit dropdowns + numeric inputs
- **AND** update BMI calculation after save

#### Scenario: Save field changes
- **WHEN** user taps "Save" after editing field
- **THEN** validate field-specific rules
- **AND** update only changed field(s)
- **AND** update updated_at timestamp
- **AND** return to main personal information view

### Requirement: Profile Photo Management

The system SHALL support profile photo upload with fallback to initials avatar.

#### Scenario: Upload profile photo
- **WHEN** user taps "Upload Photo" button
- **THEN** open file picker or camera
- **AND** accept image files (JPG, PNG)
- **AND** crop to circular avatar
- **AND** upload to storage and save URL

#### Scenario: Display profile photo
- **WHEN** viewing personal information
- **THEN** show circular profile photo if uploaded
- **AND** show initials avatar (e.g., "JD") if no photo
- **AND** use gray background for initials avatar

### Requirement: Account Deletion

The system SHALL allow permanent account deletion with confirmation.

#### Scenario: Initiate account deletion
- **WHEN** user taps "Delete account and health record" button
- **THEN** show confirmation dialog "Delete your Health Record?"
- **AND** display warning about permanent data loss
- **AND** show two buttons: "No, don't delete" (white), "Yes, delete" (black)

#### Scenario: Confirm account deletion
- **WHEN** user confirms deletion
- **THEN** permanently delete user account
- **AND** cascade delete all PHR records (medications, allergies, conditions, etc.)
- **AND** delete all documents and associations
- **AND** show success screen "Your Health Record Has Been Successfully Deleted!"
- **AND** redirect to login/home screen

#### Scenario: Cancel account deletion
- **WHEN** user cancels deletion
- **THEN** close confirmation dialog
- **AND** return to personal information view
- **AND** preserve all data

### Requirement: Share Health Record Integration

The system SHALL include personal information in health record exports.

#### Scenario: Export demographics in health record
- **WHEN** user taps "Share Your Health Record"
- **THEN** include personal information in export
- **AND** format as FHIR Patient resource
- **AND** include: Name, Gender, DOB, Contact info
- **AND** omit: Password, verification status, internal IDs

## Data Model

### Database Schema

```sql
CREATE TABLE personal_information (
  id UUID PRIMARY KEY REFERENCES user_profiles(user_id), -- One-to-one with user account

  -- Primary Info (required)
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL, -- 'male', 'female', 'non_binary', 'prefer_not_to_say', 'other'
  date_of_birth DATE NOT NULL, -- CRITICAL: Source of truth for age calculations
  profile_photo_url TEXT,

  -- Height & Weight (with units)
  height_value DECIMAL(5,2), -- e.g., 173.50
  height_unit TEXT, -- 'cm' or 'in'
  weight_value DECIMAL(5,2), -- e.g., 75.00
  weight_unit TEXT, -- 'kg' or 'lbs'
  height_weight_measured_at TIMESTAMP, -- Last measurement date

  -- Contact Info (mobile required, email optional)
  mobile_phone TEXT NOT NULL UNIQUE,
  mobile_phone_verified BOOLEAN DEFAULT FALSE,
  email TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  legal_mailing_address TEXT,

  -- Health Insurance
  health_insurance_number TEXT,
  health_insurance_jurisdiction TEXT, -- Province/state/country code

  -- Family Doctor
  family_doctor_name TEXT,
  family_doctor_phone TEXT,

  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,

  -- Additional Fields
  living_situation TEXT,
  occupation TEXT,

  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Computed BMI view (not stored, calculated on-the-fly)
CREATE VIEW personal_information_with_bmi AS
SELECT
  pi.*,
  CASE
    WHEN height_unit = 'cm' AND weight_unit = 'kg' THEN
      weight_value / POWER(height_value / 100, 2)
    WHEN height_unit = 'in' AND weight_unit = 'lbs' THEN
      (weight_value / POWER(height_value, 2)) * 703
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

-- Unique constraints
CREATE UNIQUE INDEX idx_personal_info_user ON personal_information(id);
CREATE UNIQUE INDEX idx_personal_info_mobile ON personal_information(mobile_phone);
CREATE UNIQUE INDEX idx_personal_info_email ON personal_information(email) WHERE email IS NOT NULL;
```

### TypeScript Interfaces

```typescript
interface PersonalInformation {
  id: string; // User/Patient ID (one-to-one)

  // Primary Info (required)
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date; // CRITICAL: Source of truth for age calculations
  profilePhotoUrl?: string;

  // Height & Weight (with units)
  height?: {
    value: number; // e.g., 173
    unit: 'cm' | 'in';
  };
  weight?: {
    value: number; // e.g., 75
    unit: 'kg' | 'lbs';
  };
  heightWeightMeasuredAt?: Date; // Last measurement timestamp

  // Calculated BMI (computed, not stored)
  bmi?: {
    value: number; // e.g., 25.1
    category: 'underweight' | 'normal' | 'overweight' | 'obese';
    measuredAt: Date;
  };

  // Contact Info
  mobilePhone: string; // Required, unique
  mobilePhoneVerified: boolean;
  email?: string; // Optional, unique if provided
  emailVerified: boolean;
  legalMailingAddress?: string;

  // Health Insurance
  healthInsurance?: {
    number: string;
    jurisdiction: string; // Province/state/country
  };

  // Family Doctor
  familyDoctor?: {
    name: string;
    phone?: string; // Optional but recommended
  };

  // Emergency Contact
  emergencyContact?: {
    name: string;
    relationship?: string;
    phone: string;
  };

  // Additional
  livingSituation?: string;
  occupation?: string;

  // Audit
  createdAt: Date;
  updatedAt: Date;
}

type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | 'other';
```

## UI Patterns

### Single-Record View
- Main view shows all sections with field labels + values
- "Edit" button next to each field (not global edit mode)
- No list view (only one personal information record)

### Section Separators
- Horizontal lines divide sections:
  1. Primary Info (photo, name, gender, DOB, height/weight)
  2. Contact Info (phone, email, address)
  3. Health System Info (insurance, family doctor)
  4. Emergency Contact
  5. Account Management (delete account)

### Visual Indicators
- Red dot (•) for incomplete/unverified fields
- Red text for warnings ("Confirm your email", "Phone missing", "N/A")
- Gray text for field labels (secondary)
- Black bold text for field values (primary)

### Field Heights
- Single-line inputs: 58px
- Textareas: 90px (multi-line)
- Dropdowns: 58px
- Date pickers: 58px

## FHIR Mapping

ArkPass is PRIMARY. FHIR export is SECONDARY for interoperability.

### Export to FHIR (Share Health Record)

```typescript
// Map PersonalInformation to FHIR Patient resource
function toFHIRPatient(profile: PersonalInformation): FHIRPatient {
  return {
    resourceType: 'Patient',
    id: profile.id,
    name: [{
      family: profile.lastName,
      given: [profile.firstName, profile.middleName].filter(Boolean),
      use: 'official'
    }],
    gender: mapGenderToFHIR(profile.gender),
    birthDate: profile.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD
    telecom: [
      {
        system: 'phone',
        value: profile.mobilePhone,
        use: 'mobile'
      },
      profile.email ? {
        system: 'email',
        value: profile.email,
        use: 'home'
      } : null
    ].filter(Boolean),
    address: profile.legalMailingAddress ? [{
      text: profile.legalMailingAddress,
      use: 'home'
    }] : undefined
  };
}

function mapGenderToFHIR(gender: Gender): 'male' | 'female' | 'other' | 'unknown' {
  const mapping = {
    'male': 'male',
    'female': 'female',
    'non_binary': 'other',
    'prefer_not_to_say': 'unknown',
    'other': 'other'
  };
  return mapping[gender] || 'unknown';
}
```

**Key Mappings**:
- `PersonalInformation.firstName/lastName` → `Patient.name[0].given/family`
- `PersonalInformation.gender` → `Patient.gender`
- `PersonalInformation.dateOfBirth` → `Patient.birthDate`
- `PersonalInformation.mobilePhone` → `Patient.telecom[system=phone]`
- `PersonalInformation.email` → `Patient.telecom[system=email]`

**Import Limitation**:
- ArkPass does NOT import FHIR Patient data
- Export-only for sharing with providers/EHRs

## Figma References

**Source**: Figma file `october-arkpass`

| Screen | Node ID | Purpose |
|--------|---------|---------|
| Main View | 1483:8418 | All fields with edit buttons |
| Edit Name | 1483:8419 | First/Middle/Last name inputs |
| Edit Gender | 1483:8420 | Gender dropdown |
| Edit Date of Birth | 1483:8421 | Calendar picker |
| Edit Height & Weight | 1483:8422 | Unit selectors + numeric inputs |
| Edit Mobile Phone | 1483:8423 | Phone input |
| Edit Email | 1483:8428 | Email input |
| Edit Address | 1483:8429 | Multi-line address textarea |
| Edit Insurance | 1483:8432 | Number + jurisdiction dropdown |
| Edit Family Doctor | 1483:8433 | Name + phone inputs |
| Edit Emergency Contact | 1483:8431 | Name + relationship + phone |
| Edit Photo | 1483:8434 | Photo upload |
| Delete Confirmation | 1483:8435 | Deletion warning dialog |
| Account Deleted | 1372:6350 | Success message |

**Critical Screen**: Main View (1483:8418)
- Shows all sections with visual indicators
- Demonstrates red dot pattern for incomplete fields
- BMI calculation display

## Dependencies

### Required Components
- ✅ Calendar date picker (for DOB)
- ✅ Phone number input (with international format)
- ✅ Email input (with validation)
- ✅ Unit dropdown component (for height/weight)
- ✅ File picker (for profile photo)

### Database Dependencies
- `user_profiles` table (one-to-one relationship)
- SMS verification service (for phone)
- Email verification service (for email)

### Feature Dependencies
- Share Health Record feature (exports demographics as FHIR Patient)
- Dual-mode date input component (uses date_of_birth for age calculations)
- Account authentication (mobile phone is primary auth method)

## Compliance

### HIPAA
- All personal information is PHI
- Mobile phone/email are identifiers
- Audit trail via updated_at timestamp
- Soft delete not used (account deletion is permanent)

### Authentication
- Mobile phone is primary authentication method
- SMS verification required for account security
- Email verification recommended but optional

### Data Minimization
- Only collect necessary demographic data
- Optional fields allow users to control data sharing
- Privacy-conscious field design

## Open Questions

1. **Gender Options - Confirmed**: Dropdown includes Male, Female, Non-binary, Prefer not to say, Other
   - User confirmed: "Yes, these options are appropriate"

2. **Jurisdiction List - Confirmed**: International support
   - Canada: All provinces/territories
   - United States: All 50 states + DC
   - Other countries: Supported
   - User confirmed: "Yes, US is included and other countries as well"

3. **Photo Specifications**: Technical requirements TBD
   - Accepted formats: JPG, PNG
   - Size limit: TBD (recommend 5MB)
   - Cropping: Circular for avatar
   - Storage: CDN or Supabase Storage

4. **Living Situation**: Text or dropdown?
   - Current: Text input inferred
   - Alternative: Dropdown (Living alone, With family, Assisted living, etc.)
   - Need edit screen extraction to confirm

5. **Account Deletion**: Hard delete or soft delete?
   - Current implementation: Hard delete (permanent)
   - Alternative: Soft delete with retention period
   - Compliance consideration: Right to be forgotten vs. audit trail
