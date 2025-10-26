# ARKPASS 6 Gap Analysis - Features We Might Be Missing

**Date**: 2025-10-25
**Purpose**: Extract good ideas from ARKPASS 6 that aren't in our Figma extraction

---

## ✅ What We Already Have (Figma Extraction)

### Patient Features Documented:
- ✅ Conditions (7 screens)
- ✅ Medications (8 screens)
- ✅ Allergies (7 screens + expansion with Category/Severity/EpiPen)
- ✅ Surgeries (9 screens)
- ✅ Supplements (7 screens)
- ✅ Immunizations (7 screens)
- ✅ Personal Information (15 screens)
- ✅ Social History (8 screens)
- ✅ Family History (3 screens)
- ✅ Documents (not extracted but referenced throughout)

### Patterns Documented:
- ✅ Dual-Mode Date Input (Date OR Age)
- ✅ Field-Level Editing
- ✅ Quick Add
- ✅ Repeatable Entry
- ✅ Conditional UI
- ✅ Multi-Select

---

## 🔍 What ARKPASS 6 Has That We DON'T

### 1. **Visit Notes / Clinical Notes**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE visit_notes (
  id uuid PRIMARY KEY,
  patient_id uuid,
  date date,
  provider_name text,
  notes text,
  attachments_url text,
  created_at timestamptz,
  updated_at timestamptz
);
```

**What it is**: Doctor's notes from appointments, clinic visits, hospital stays

**Do we need it?**
- **YES** - Critical for medical history
- Likely this is what "My Documents" feature was meant to be (12 screens we skipped)
- Should be its own feature: "Visit Notes" or "Doctor's Notes"

**Fields needed**:
- Date of visit
- Provider/Doctor name
- Type of visit (Office visit, ER, Hospital, Telehealth)
- Chief complaint (why patient went)
- Notes/Summary
- Diagnoses from visit
- Attachments (actual clinical notes PDF/images)

**Priority**: **HIGH** - Essential medical record component

---

### 2. **Lab Results / Test Results**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE lab_results (
  id uuid PRIMARY KEY,
  patient_id uuid,
  test_type text,        -- "Blood Test", "X-Ray", "MRI"
  result_value text,     -- "120", "Normal", "Positive"
  result_unit text,      -- "mg/dL", "mmol/L"
  date date,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
);
```

**What it is**: Blood work, imaging, diagnostic test results

**Do we need it?**
- **YES** - Patients need to track lab results
- Could be part of "My Documents" or separate feature

**Examples**:
- Blood test results (cholesterol, glucose, CBC)
- Imaging (X-ray, MRI, CT scan reports)
- Diagnostic tests (COVID test, pregnancy test, biopsy)

**Fields needed**:
- Test type/name
- Date performed
- Ordering provider
- Results (structured or free-text)
- Normal ranges (for comparison)
- Attachments (actual lab report PDF/images)

**Priority**: **MEDIUM-HIGH** - Common patient need

---

### 3. **Access Grants / Sharing System**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE access_grants (
  id uuid PRIMARY KEY,
  patient_id uuid,
  provider_id uuid,
  access_code text UNIQUE NOT NULL,  -- QR code / share link
  can_write boolean DEFAULT false,   -- Read vs. Write access
  expires_at timestamptz,             -- Time-limited sharing
  active boolean DEFAULT true,
  revoked_at timestamptz,
  redeemed_at timestamptz,
  consent_document text,
  created_at timestamptz
);
```

**What it is**: Patient generates code/link to share record with doctor/provider

**Do we need it?**
- **YES** - "Share Your Health Record" button is on every list screen
- We documented the button but not the underlying feature

**How it works**:
1. Patient taps "Share Your Health Record"
2. System generates unique code or QR code
3. Patient shows code to doctor
4. Doctor scans/enters code → Gets access to patient's record
5. Access can be time-limited (expires after X days)
6. Patient can revoke access anytime

**Fields needed**:
- Access code (alphanumeric or QR)
- Expiration date/time
- Scope (what data is shared - all or specific sections)
- Can write? (read-only vs. allow doctor to add notes)
- Active grants list (see who has access)
- Revoke button

**Priority**: **HIGH** - Button is already in UI, feature must exist

---

### 4. **Proxy / Family / Caregiver Access**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE proxy_access (
  id uuid PRIMARY KEY,
  patient_id uuid,
  proxy_user_id uuid,       -- Another user who can access this patient's record
  relationship text,         -- "Spouse", "Parent", "Child", "Caregiver"
  access_level text,         -- "Full", "View Only", "Emergency Only"
  consent_document text,
  created_at timestamptz,
  revoked_at timestamptz
);
```

**What it is**: Parent accessing child's record, spouse managing elderly parent's health

**Do we need it?**
- **MAYBE** - Depends on target users
- If targeting elderly patients → YES (caregivers need access)
- If targeting young adults → LOWER priority

**Use cases**:
- Parent managing child's health records (under 18)
- Adult child managing elderly parent's health
- Spouse with medical power of attorney
- Caregiver for disabled person

**Priority**: **MEDIUM** - Important for certain user segments, can be Phase 2

---

### 5. **Audit Logs / Access History**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  actor_id uuid,              -- Who did the action
  actor_role text,            -- "Patient", "Provider", "Admin"
  action text,                -- "viewed", "created", "updated", "deleted"
  patient_id uuid,            -- Whose record was accessed
  entity_type text,           -- "medication", "allergy", etc.
  entity_id uuid,
  before_snapshot jsonb,      -- Data before change
  after_snapshot jsonb,       -- Data after change
  timestamp timestamptz,
  ip_address text,
  device_info text,
  reason text,                -- Why was record accessed
  source text                 -- "mobile_app", "web", etc.
);
```

**What it is**: Track every access and change to patient records

**Do we need it?**
- **YES for providers/compliance** (HIPAA requirement)
- **MAYBE for patients** - transparency feature

**Patient-facing features**:
- "Who viewed my record?" timeline
- "When was this medication added?" history
- Trust/transparency (see when doctors accessed record)

**Priority**:
- **HIGH** for backend (legal/compliance requirement)
- **MEDIUM** for patient UI (nice transparency feature)

---

### 6. **Appointments / Scheduling**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE appointments (
  id uuid PRIMARY KEY,
  patient_id uuid,
  provider_id uuid,
  datetime timestamptz,
  status text,              -- "Scheduled", "Completed", "Cancelled"
  reason text,              -- Chief complaint
  location text,            -- Clinic name/address
  notes text,
  created_at timestamptz,
  updated_at timestamptz,
  fhir_reference text
);
```

**What it is**: Track upcoming and past appointments

**Do we need it?**
- **MAYBE** - Nice to have but not core PHR
- Could live in separate calendar app
- If included, keep simple (no booking, just tracking)

**Basic version**:
- Add appointment (date, time, doctor, location)
- View upcoming appointments
- Mark as completed
- Link to visit note (after appointment)

**Priority**: **LOW-MEDIUM** - Useful but not essential for MVP

---

### 7. **Notifications System**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE notifications (
  id uuid PRIMARY KEY,
  user_id uuid,
  type text,                -- "medication_reminder", "appointment_reminder", "access_granted"
  message text,
  read boolean DEFAULT false,
  created_at timestamptz,
  fhir_reference text
);
```

**What it is**: In-app notifications, reminders, alerts

**Do we need it?**
- **YES** - For medication reminders, appointment reminders
- Enhances user engagement

**Notification types**:
- Medication reminder ("Time to take Lisinopril")
- Appointment reminder ("Doctor visit tomorrow at 2pm")
- Access granted ("Dr. Smith accessed your record")
- Access expiring ("Share code expires in 2 days")
- Incomplete record ("Complete your allergy information")

**Priority**: **MEDIUM** - Valuable for engagement, not blocking initial launch

---

### 8. **Data Export / FHIR Export**
**ARKPASS 6 Schema:**
```sql
CREATE TABLE data_exports (
  id uuid PRIMARY KEY,
  user_id uuid,
  type text,                -- "fhir_bundle", "pdf", "csv"
  file_url text,
  requested_at timestamptz,
  completed_at timestamptz,
  status text               -- "pending", "ready", "failed"
);
```

**What it is**: Export entire health record to standard formats

**Do we need it?**
- **YES** - "Share Your Health Record" implies export capability
- Legal right to data portability

**Export formats**:
1. **PDF** - Human-readable, printable (take to doctor)
2. **FHIR Bundle** - Standard medical data format (import to other systems)
3. **CSV** - Spreadsheet format (medications list, etc.)

**Priority**: **HIGH** - Share button already in UI, must have export

---

## 🎯 Priority Additions to Our Scope

### MUST ADD (Blocking Launch):

1. **Share/Export Feature** ✅ CRITICAL
   - "Share Your Health Record" button exists in Figma
   - Need: Access grant system OR simple export (PDF/FHIR)
   - **Decision needed**: Share via code vs. simple export?

2. **Visit Notes / Clinical Notes** ✅ CRITICAL
   - Essential medical record component
   - Likely what "My Documents" (12 screens) was meant to be
   - **Action**: Extract "My Documents" screens from Figma

### SHOULD ADD (Important but not blocking):

3. **Lab Results** ⭐ HIGH VALUE
   - Common patient need (track blood work, imaging)
   - Could be part of "My Documents" or separate feature

4. **Audit Logs (backend)** ⭐ COMPLIANCE
   - HIPAA requirement (track all access)
   - Patient-facing timeline is optional

### CAN DEFER (Phase 2):

5. **Notifications** - Engagement feature, not core PHR
6. **Appointments** - Nice to have, not essential
7. **Proxy/Caregiver Access** - Important for some users, not all

---

## 🚨 Immediate Actions Needed

### 1. Extract "My Documents" Screens from Figma
We skipped this (12 screens). It likely contains:
- Visit notes
- Lab results
- Medical documents/images
- Clinical records

**Action**: Go back to Figma and extract these screens

### 2. Design Share/Export Feature
**Decision needed**: Which approach?

**Option A: Simple Export** (easier to build)
- Button → Generate PDF of entire record
- User saves/prints/emails PDF
- No access codes, no database tables

**Option B: Access Grant System** (more powerful)
- Button → Generate unique code
- Doctor enters code → Gets temporary access
- Requires access_grants table, code generation, expiration

**Recommendation**: Start with **Option A (Simple Export)**, add Option B later

### 3. Add Visit Notes Feature
Either:
- Rename "My Documents" → "Visit Notes"
- Or keep both (Documents = files, Visit Notes = structured records)

---

## 📋 Updated Feature List

### Core Features (Must Build):
1. Conditions ✅
2. Medications ✅
3. Allergies ✅ (with Category/Severity/EpiPen)
4. Surgeries ✅
5. Supplements ✅
6. Immunizations ✅
7. Personal Information ✅
8. Social History ✅
9. Family History ✅
10. **Visit Notes / Clinical Notes** 🆕 MUST ADD
11. **Export Health Record** 🆕 MUST ADD (PDF/FHIR)

### Important Additions (Phase 1.5):
12. **Lab Results** 🆕 HIGH VALUE
13. **Access History** (patient transparency) 🆕 NICE TO HAVE

### Future Features (Phase 2):
14. Access Grant System (sharing via codes)
15. Proxy/Caregiver Access
16. Appointments Tracking
17. Notifications/Reminders

---

## Database Schema Updates Needed

### Add These Tables:

```sql
-- Visit Notes (CRITICAL - ADD NOW)
CREATE TABLE visit_notes (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  visit_date DATE NOT NULL,
  provider_name TEXT,
  visit_type TEXT, -- "Office Visit", "ER", "Hospital", "Telehealth"
  chief_complaint TEXT,
  diagnosis TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lab Results (HIGH PRIORITY - ADD SOON)
CREATE TABLE lab_results (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  test_name TEXT NOT NULL,
  test_date DATE NOT NULL,
  ordering_provider TEXT,
  result_value TEXT,
  result_unit TEXT,
  normal_range TEXT, -- "70-100 mg/dL"
  status TEXT, -- "Normal", "Abnormal", "Critical"
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document Attachments (for visit notes, lab results, etc.)
CREATE TABLE document_attachments (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES patients(id),
  entity_type TEXT, -- "visit_note", "lab_result", "allergy", etc.
  entity_id UUID, -- Links to specific record
  file_name TEXT,
  file_url TEXT, -- Storage URL (S3, Supabase Storage, etc.)
  file_type TEXT, -- "pdf", "image", "dicom"
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs (BACKEND ONLY - COMPLIANCE)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  actor_id UUID, -- Who did the action
  action TEXT, -- "viewed", "created", "updated", "deleted"
  patient_id UUID,
  entity_type TEXT,
  entity_id UUID,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,
  device_info TEXT
);
```

---

## Summary: What We Were Missing

### Critical Gaps Found:
1. ✅ **Visit Notes** - Essential medical record component (likely = "My Documents")
2. ✅ **Export Feature** - "Share Your Health Record" button needs functionality
3. ⭐ **Lab Results** - Common patient need
4. ⭐ **Audit Logs** - Compliance requirement (backend)

### Not Missing (already handled):
- Patient data model ✅ (we have more detail than ARKPASS 6)
- UI patterns ✅ (we documented 6 reusable patterns)
- Safety features ✅ (EpiPen, severity - we have MORE than ARKPASS 6)

### Next Steps:
1. Extract "My Documents" screens from Figma (12 screens)
2. Design simple PDF export for "Share Your Health Record" button
3. Add Visit Notes and Lab Results to database schema
4. Implement audit logging (backend only, not user-facing yet)
