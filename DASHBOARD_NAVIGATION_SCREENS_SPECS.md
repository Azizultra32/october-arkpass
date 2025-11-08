# Dashboard & Navigation Screens Specification

**Last Updated**: 2025-11-08
**Figma File**: Salma's Test_Low-Fidelity Wireframes
**Total Screens Extracted**: 9

---

## Overview

This specification documents the core application navigation, authentication, dashboard, sharing/access code management, and pre-visit questionnaire features that form the foundation of the ArkPass patient health record application.

**Key Features:**
- Authentication (Google, Apple, Mobile Phone)
- Patient Dashboard with health record cards
- Visit Notes management with doctor access tracking
- Access Code sharing system (time-limited codes)
- Pre-Visit Questionnaire workflow
- Bottom navigation bar (5-icon navigation)

---

## 1. Authentication Screens

### 1.1 Sign In Screen (Node: 1534-33510)

**Purpose**: Primary authentication entry point

**UI Elements:**
- **Logo**: Gray placeholder box at top
- **App Name**: "ArmadaMD" (H1, bold, 24px)
- **Instructions**: "To get started, sign in with Google or enter your Mobile Phone." (16px medium)

**Authentication Methods:**
1. **Sign in with Google** button (outline style, gray border, Google icon)
2. **Sign in with Apple** button (outline style, gray border, Apple icon)
3. **"or"** separator text
4. **Mobile Phone Input** (Phone type input with country flag +1)
5. **Next** button (primary black button)

**Footer:**
- Legal text: "By continuing I accept the ArmadaMD Privacy Policy and Terms of Service"
- Links: "Privacy Policy" and "Terms of Service" (blue link color #1A73E8)

**Design Tokens:**
- Background: #FFFFFF (white)
- Primary button: #000000 (black) with white text
- Outline buttons: #666666 border
- Input border: #CCCCCC
- Logo background: #EEEEEE
- Link color: #1A73E8

**Navigation:**
- Google/Apple → External OAuth flow → Dashboard
- Mobile Phone + Next → Phone Confirmation Screen

---

### 1.2 Phone Confirmation Screen (Node: 1534-33509)

**Purpose**: Verify mobile phone with confirmation code

**UI Elements:**
- **Logo**: Gray placeholder box at top
- **Title**: "Please Confirm Your Mobile Phone" (H1, bold, 24px, multi-line)
- **Code Input**: Standard text input with "Enter Code" placeholder
- **Confirm Button**: Primary black button
- **Resend Link**: "Resend Confirmation Code" (blue link)
- **Back Link**: "Back" (blue link)

**Workflow:**
1. User receives SMS code
2. Enters code in input field
3. Clicks Confirm
4. On success → Dashboard
5. On failure → Error state (not shown in wireframe)

**Design Tokens:**
- Same as Sign In Screen
- Input: white background, #CCCCCC border

---

## 2. Patient Dashboard (Node: 1534-33518)

**Purpose**: Main hub for accessing all health record features

**Header Section:**
- **Share Button**: Yellow background (#FFFCBA), full-width, "Share Your Health Record"

**Current Sharings Section:**
- **Dr. D Card** (Active - Yellow #FFFCBA):
  - Doctor name: "Dr. D" (H2, bold, 20px)
  - Access code: "88932" (H1, bold, 24px, right-aligned)
  - Expiry: "Expires in 4 hours" (16px medium, right-aligned)
  - Actions: "Add Visit Notes", "Revoke Access" buttons

- **Dr. C Card** (Unused - Orange #FBBC05):
  - Timestamp: "March 10, 2023 10:30"
  - Access code: "98761"
  - Status: "Code has not yet been used. Share the code with a doctor to access your health record."
  - Action: "Revoke Access" button

- **Dr. A Card** (Pre-Visit - Gray #EEEEEE):
  - Doctor name: "Dr. A"
  - Status: "Pre-Visit Questionnaire incomplete" (purple text #9747FF)
  - Action: "Complete Pre-Visit Questionnaire" button

- **Dr. B Card** (No Code - Gray #EEEEEE):
  - Doctor name: "Dr. B"
  - Action: "Generate Access Code" button

**Your Health Record Section:**
- Grid of feature cards (2 columns)
- Each card shows:
  - Feature name (Visit Notes, Conditions, Medications, My Documents, Allergies, Primary Info)
  - Count badge (e.g., "1", "3", "2") - some with red dot indicator
  - "+Add" button
  - "View" button

**Bottom Navigation Bar:**
- 5 icons (32px regular, 48px for center):
  1. **Home** (house icon)
  2. **Calendar** (calendar icon)
  3. **Plus** (add icon, 48px, center/primary)
  4. **Key** (key icon, access sharing)
  5. **Account** (person icon)

---

## 3. Visit Notes Screen (Node: 1534-33511)

**Purpose**: View and manage doctor visit notes and access codes

**Header:**
- Yellow "Share Your Health Record" button
- "Visit Notes" title (H1, 24px bold, centered)

**Search/Filter:**
- Search input (placeholder text)
- "Filter by date" button with calendar icon

**Sections:**

### 3.1 ONGOING Section
- **Dr. D Active Card** (Yellow #FFFCBA):
  - Doctor: "Dr. D"
  - Access code: "88932"
  - Expiry: "Expires in 4 hours"
  - Action: "Add Visit Notes" button (outline)

### 3.2 COMPLETED Section
List of past visits (gray #666666 border):
- **Dr. Katie Beleznay** - Jan 12, 2023 - "Access Expired"
- **Dr. Barry Emara** - Nov 5, 2022 - "Access Expired"
- **Dr. Douglas D.** - Jul 13, 2022 - "Access Expired"
- **Dr. Osler** - Mar 7, 2022 - "Access Expired"
- (Multiple repeated entries showing history)

**Footer:**
- "Show more" link (blue #1A73E8)

**Bottom Navigation:** Same 5-icon bar

---

## 4. Sharing Screen (Node: 1534-33512)

**Purpose**: Manage access codes and doctor sharing permissions

**Header:**
- Yellow "Share Your Health Record" button
- "Sharing" title (H1, 24px bold, centered)

**Search/Filter:**
- Search input (placeholder text)
- "Filter by date" button with calendar icon

**Sections:**

### 4.1 ONGOING Section

**Active Sharing Cards:**

1. **Dr. D Card** (Yellow #FFFCBA, black border):
   - Doctor: "Dr. D"
   - Access code: "88932" (H1, 24px, right-aligned)
   - Expiry: "Expires in 4 hours"
   - Actions: "Add Visit Notes", "Revoke Access" (2 buttons side-by-side)

2. **Unused Code Card** (Orange #FBBC05, white text):
   - Timestamp: "March 10, 2023 10:30"
   - Access code: "98761" (H1, 24px)
   - Status: "Code has not yet been used. Share the code with a doctor to access your health record."
   - Action: "Revoke Access" button (white border)

3. **Dr. A Card** (Gray #EEEEEE, #666666 border):
   - Doctor: "Dr. A"
   - Status: "Pre-Visit Questionnaire incomplete" (purple #9747FF)
   - Action: "Complete Pre-Visit Questionnaire" button

4. **Dr. B Card** (Gray #EEEEEE, #666666 border):
   - Doctor: "Dr. B"
   - Action: "Generate Access Code" button

### 4.2 REVOKED & EXPIRED Section
List of past/expired access (same format as Visit Notes completed):
- Dr. Katie Beleznay - Jan 12, 2023
- Dr. Barry Emara - Nov 5, 2022
- Dr. Douglas D. - Jul 13, 2022
- Dr. Osler - Mar 7, 2022

**Footer:**
- "Show more" link (blue #1A73E8)

**Bottom Navigation:** Same 5-icon bar

---

## 5. Access Code Generation Screens

### 5.1 Generate Access Code - With Doctor Profile (Node: 1534-33513)

**Purpose**: Generate time-limited access code for specific doctor

**Header:**
- "Generate Doctor's Access Code" (H1, 24px bold, centered)
- Doctor name: "Dr. B" (H2, 20px bold)

**Doctor Profile Section:**
- Circular profile photo (placeholder image)
- Lorem ipsum description text (placeholder for doctor bio/specialty)

**Access Duration Options:**
- **Generate 48h Access Code** (primary black button)
- **Generate 1 week Access Code** (outline button)
- **Generate 1 month Access Code** (outline button)
- **Generate Custom Period Access Code** (outline button)

**Bottom Navigation:** Same 5-icon bar

---

### 5.2 Generate Access Code - With Label Input (Node: 1534-33517)

**Purpose**: Generate access code with custom label/reference

**Header:**
- "Generate Doctor's Access Code" (H1, 24px bold, centered)

**Input:**
- Text input: "Name or label for your reference" (placeholder)

**Access Duration Options:**
- **Generate 48h Access Code** (primary black button)
- **Generate 1 week Access Code** (outline button)
- **Generate 1 month Access Code** (outline button)
- **Generate Custom Period Access Code** (outline button)

**Bottom Navigation:** Same 5-icon bar

**Note:** This variant allows patients to create codes without pre-selecting a doctor profile.

---

## 6. Pre-Visit Questionnaire Screens

### 6.1 Text Response Question (Node: 1677-45917)

**Purpose**: Open-ended text response for pre-visit questions

**Header:**
- "Pre-visit Question N of XY" (purple "Pre-visit" #9747FF, black "Question N of XY")

**Question:**
- "What is the main reason you are here today?" (H1, 24px bold, centered)

**Input:**
- Large text area (multi-line input)
- Placeholder: "Answer here"

**Actions:**
- **Next** button (primary black button)
- "Skip this question" link (blue #1A73E8)

**No bottom navigation** (questionnaire flow is isolated)

---

### 6.2 Yes/No Question (Node: 1677-45918)

**Purpose**: Binary choice question format

**Header:**
- "Pre-visit Question N of XY" (purple "Pre-visit" #9747FF, black "Question N of XY")

**Question:**
- "Is there another unrelated issue or request on your mind?" (H1, 24px bold, centered)

**Options:**
- **Yes** button (outline, full-width)
- **No** button (outline, full-width)
- **Previous question** button (outline, full-width)
- "Skip this question" link (blue #1A73E8)

**No bottom navigation** (questionnaire flow is isolated)

---

## 7. Bottom Navigation Bar Specification

**Container:**
- Background: #FFFFFF (white)
- Border top: 1px solid #000000 (black)
- Height: 58px
- Padding: 16px horizontal
- Gap: 42px between icons

**Icons (Left to Right):**

1. **Home** (32px)
   - SVG icon: house/home
   - Color: Black #000000
   - Route: `/` or `/dashboard`
   - State: Active on dashboard

2. **Calendar** (32px)
   - SVG icon: calendar
   - Color: Black #000000
   - Route: `/calendar` (not yet implemented in wireframes)

3. **Plus/Add** (48px - larger, center position)
   - SVG icon: plus in circle
   - Color: Black #000000
   - Route: Quick add menu or modal
   - Primary action button

4. **Key/Sharing** (32px)
   - SVG icon: key
   - Color: Black #000000
   - Route: `/sharing`
   - State: Active on Sharing screen

5. **Account/Profile** (32px)
   - SVG icon: person/account
   - Color: Black #000000
   - Route: `/account` or `/profile`

**Interaction States:**
- Active/selected: (To be defined - likely filled icon or color change)
- Inactive: Default black
- Hover: (Mobile - no hover state)
- Pressed: (To be defined - likely scale/opacity change)

---

## 8. Access Code Card States

**Visual States:**

1. **Active/Ongoing** (Yellow #FFFCBA):
   - Border: 1px solid #000000 (black)
   - Background: #FFFCBA (yellow)
   - Text: Black
   - Shows: Doctor name, code, expiry countdown
   - Actions: "Add Visit Notes", "Revoke Access"

2. **Unused/Generated** (Orange #FBBC05):
   - Border: 1px solid #FFFFFF (white)
   - Background: #FBBC05 (orange)
   - Text: White
   - Shows: Timestamp, code, unused status message
   - Action: "Revoke Access"

3. **Pre-Visit Pending** (Gray #EEEEEE):
   - Border: 1px solid #666666 (gray)
   - Background: #EEEEEE (light gray)
   - Text: Black
   - Shows: Doctor name, questionnaire incomplete status (purple #9747FF)
   - Action: "Complete Pre-Visit Questionnaire"

4. **No Code** (Gray #EEEEEE):
   - Border: 1px solid #666666 (gray)
   - Background: #EEEEEE (light gray)
   - Text: Black
   - Shows: Doctor name only
   - Action: "Generate Access Code"

5. **Expired/Revoked** (White with gray border):
   - Border: 1px solid #666666 (gray)
   - Background: #FFFFFF (white)
   - Text: Black
   - Shows: Doctor name, date, "Access Expired"
   - Actions: None (read-only)

---

## 9. Design System Tokens

### Colors
- **Primary Black**: #000000 (buttons, borders, text)
- **White**: #FFFFFF (backgrounds, text on dark)
- **Gray 666**: #666666 (secondary text, borders)
- **Gray EEE**: #EEEEEE (inactive backgrounds)
- **Gray CCC**: #CCCCCC (input borders, separators)
- **Yellow**: #FFFCBA (active sharing highlight)
- **Orange**: #FBBC05 (unused code highlight)
- **Link Blue**: #1A73E8 (links, interactive text)
- **Purple**: #9747FF (pre-visit status)
- **Red Dot**: (Indicator for items needing attention)

### Typography
- **H1**: Public Sans Bold, 24px, line-height 100%, tracking -0.3333px
- **H2**: Public Sans Bold, 20px, line-height 100%, tracking -0.3333px
- **Body/Text**: Public Sans Medium, 16px, line-height 100%, tracking -0.3333px
- **Small Text**: Public Sans Medium, 14px, tracking -0.3333px
- **Button Text**: Public Sans ExtraBold, 16px, tracking -0.3333px

### Spacing
- **Page padding**: 16px
- **Section gap**: 24px
- **Card gap**: 16px
- **Internal card gap**: 8px
- **Bottom nav gap**: 42px

### Buttons
- **Primary**: Black background, white text, 58px height
- **Outline**: White/transparent background, black border, black text, 58px height
- **Small Primary Icon**: Black background, white text, 42px height, with icon
- **Link**: No background, link blue color, 16px text

### Inputs
- **Standard**: White background, #CCCCCC border, 58px height, 16px padding
- **Text Area**: White background, #CCCCCC border, auto height, 16px padding
- **Phone**: Split with flag dropdown + phone input

### Cards
- **Padding**: 16px
- **Border radius**: 4px
- **Border**: 1px solid (color varies by state)
- **Gap between elements**: 8px

---

## 10. Navigation Flow

```
Sign In Screen (1534-33510)
  ├─ Google OAuth → Dashboard
  ├─ Apple OAuth → Dashboard
  └─ Mobile Phone → Phone Confirmation (1534-33509) → Dashboard

Dashboard (1534-33518)
  ├─ Share Button → Sharing Screen (1534-33512)
  ├─ Health Record Cards → Feature screens (Medications, Conditions, etc.)
  ├─ "Add Visit Notes" → Visit Notes Screen (1534-33511)
  ├─ "Revoke Access" → Confirmation modal (not shown)
  ├─ "Complete Pre-Visit Questionnaire" → Pre-Visit Flow (1677-45917...)
  ├─ "Generate Access Code" → Generate Code (1534-33513 or 1534-33517)
  └─ Bottom Nav → Home/Calendar/Add/Sharing/Account

Visit Notes Screen (1534-33511)
  ├─ Filter by date → Date picker modal
  ├─ Search → Search results
  ├─ "Add Visit Notes" → Note entry screen (not shown)
  └─ Bottom Nav → Home/Calendar/Add/Sharing/Account

Sharing Screen (1534-33512)
  ├─ Filter by date → Date picker modal
  ├─ Search → Search results
  ├─ "Add Visit Notes" → Note entry screen
  ├─ "Revoke Access" → Confirmation modal
  ├─ "Complete Pre-Visit Questionnaire" → Pre-Visit Flow
  ├─ "Generate Access Code" → Generate Code Screen
  └─ Bottom Nav → Home/Calendar/Add/Sharing/Account

Generate Access Code (1534-33513 / 1534-33517)
  ├─ 48h/1 week/1 month → Generate code → Sharing Screen
  ├─ Custom Period → Date picker modal → Generate → Sharing Screen
  └─ Bottom Nav → Home/Calendar/Add/Sharing/Account

Pre-Visit Questionnaire Flow (1677-45917, 1677-45918, ...)
  ├─ Next → Next question
  ├─ Previous question → Previous question
  ├─ Skip → Next question
  └─ Last question → Dashboard (questionnaire complete)
```

---

## 11. Implementation Notes

### Database Tables Required

**access_codes** table:
- `id` (UUID primary key)
- `patient_id` (UUID, foreign key to patients)
- `doctor_id` (UUID, foreign key to providers, nullable)
- `doctor_label` (TEXT, for custom labels when doctor_id is null)
- `code` (TEXT, 5-digit access code)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `duration` (TEXT: '48h', '1week', '1month', 'custom')
- `status` (TEXT: 'active', 'used', 'expired', 'revoked')
- `used_at` (TIMESTAMP, nullable)
- `revoked_at` (TIMESTAMP, nullable)

**pre_visit_questionnaires** table:
- `id` (UUID primary key)
- `patient_id` (UUID, foreign key to patients)
- `doctor_id` (UUID, foreign key to providers, nullable)
- `access_code_id` (UUID, foreign key to access_codes, nullable)
- `status` (TEXT: 'incomplete', 'complete')
- `created_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP, nullable)
- `responses` (JSONB, array of Q&A pairs)

**visit_notes** table:
- `id` (UUID primary key)
- `patient_id` (UUID, foreign key to patients)
- `provider_id` (UUID, foreign key to providers)
- `access_code_id` (UUID, foreign key to access_codes)
- `visit_date` (DATE)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### API Endpoints Required

**Authentication:**
- `POST /auth/google` - Google OAuth callback
- `POST /auth/apple` - Apple OAuth callback
- `POST /auth/phone/send` - Send SMS code
- `POST /auth/phone/verify` - Verify SMS code

**Access Codes:**
- `POST /access-codes` - Generate new access code
- `GET /access-codes` - List patient's access codes
- `PATCH /access-codes/:id/revoke` - Revoke access code
- `GET /access-codes/stats` - Get counts for dashboard

**Visit Notes:**
- `GET /visit-notes` - List visit notes
- `POST /visit-notes` - Add visit note (provider only)

**Pre-Visit Questionnaire:**
- `GET /questionnaires/:id` - Get questionnaire questions
- `POST /questionnaires/:id/responses` - Submit response
- `PATCH /questionnaires/:id/complete` - Mark complete

**Dashboard:**
- `GET /dashboard` - Get dashboard data (sharings + health record counts)

### Frontend Components Required

**Screens:**
- `SignInScreen.tsx`
- `PhoneConfirmationScreen.tsx`
- `DashboardScreen.tsx`
- `VisitNotesScreen.tsx`
- `SharingScreen.tsx`
- `GenerateAccessCodeScreen.tsx`
- `PreVisitQuestionnaireScreen.tsx`

**Shared Components:**
- `BottomNavigation.tsx` - 5-icon nav bar
- `AccessCodeCard.tsx` - Reusable card with 5 state variants
- `DoctorVisitCard.tsx` - Visit history card
- `HealthRecordCard.tsx` - Feature cards on dashboard
- `FormsButton.tsx` - Button variants (primary, outline, small, etc.)
- `FormsInput.tsx` - Input variants (standard, phone, text area, etc.)

### State Management

**Global State (Context/Redux):**
- `authState` - Current user, tokens
- `accessCodesState` - Active/expired codes, counts
- `dashboardState` - Health record feature counts, red dot indicators

**Screen-Level State:**
- Search/filter values
- Modal visibility
- Form inputs
- Loading states

---

## 12. Missing/Future Screens

Based on wireframe extraction, the following screens are **referenced but not yet extracted**:

1. **Calendar Screen** - Bottom nav icon exists but screen not in wireframes
2. **Account/Profile Screen** - Bottom nav icon exists but screen not in wireframes
3. **Add/Quick Action Menu** - Center plus button destination unknown
4. **Note Entry Screen** - "Add Visit Notes" action destination
5. **Revoke Access Confirmation Modal** - Confirmation before revoking
6. **Custom Period Date Picker** - For custom access code duration
7. **Filter by Date Modal** - Date range picker for visit notes/sharing
8. **Pre-Visit Questionnaire Remaining Screens** - Only 2 question types shown

---

## 13. Red Dot Notification System

**Purpose**: Visual indicator for items requiring patient attention

**Observed Locations:**
- Dashboard health record cards: Conditions (3), Medications (2), Allergies (2), Primary Info
- Indicates incomplete data, pending updates, or items flagged for review

**Implementation:**
- Red circular badge on top-right of card
- Shows count when >1
- Logic: Database flag `needs_attention` or `incomplete` on records
- Clear on: View + acknowledge, or complete missing data

---

## 14. Access Code Expiry Logic

**Duration Options:**
- **48 hours**: Default/recommended
- **1 week**: 7 days from generation
- **1 month**: 30 days from generation
- **Custom**: User-defined date range

**Expiry Countdown:**
- Active cards show: "Expires in X hours" or "Expires in X days"
- Background job checks expiry every hour
- On expiry: Status → 'expired', move to "Revoked & Expired" section
- Email/push notification to patient when code expires

**Code Generation:**
- 5-digit numeric code (10000-99999)
- Unique constraint on active codes
- Regenerate if collision

---

## 15. Pre-Visit Questionnaire Question Types

Based on extracted screens:

1. **Text Response** (1677-45917):
   - Open-ended text area
   - Skippable
   - Example: "What is the main reason you are here today?"

2. **Yes/No** (1677-45918):
   - Binary choice buttons
   - Skippable
   - Has "Previous question" navigation
   - Example: "Is there another unrelated issue or request on your mind?"

**Expected Additional Types** (not yet in wireframes):
- Multiple choice (radio buttons)
- Checkboxes (multi-select)
- Scale/rating (1-10)
- Date picker
- Conditional branching (if Yes → ask follow-up)

---

## 16. Success Criteria

**Authentication:**
- ✅ Users can sign in with Google, Apple, or mobile phone
- ✅ SMS verification code works and redirects to dashboard
- ✅ Privacy policy and terms links functional

**Dashboard:**
- ✅ Shows all active/pending access codes with correct state colors
- ✅ Health record cards show accurate counts and red dot indicators
- ✅ "Share Your Health Record" prominently displayed
- ✅ Bottom navigation functional on all screens

**Access Code Management:**
- ✅ Patients can generate codes with 4 duration options
- ✅ Codes expire automatically based on duration
- ✅ Patients can revoke active codes
- ✅ Unused codes are visually distinct (orange)
- ✅ Expired codes move to archive section

**Visit Notes:**
- ✅ Patients see history of all doctor visits
- ✅ Active visits show expiry countdown
- ✅ Search and date filtering works
- ✅ "Show more" pagination loads additional visits

**Pre-Visit Questionnaire:**
- ✅ Questionnaire is skippable
- ✅ Progress indicator shows "Question N of XY"
- ✅ Previous/Next navigation works
- ✅ Responses saved on each step
- ✅ Completion triggers access code activation

---

**End of Specification**

Total screens documented: 9 core navigation screens
Related to: 10 PHR feature screens (separate specs)
