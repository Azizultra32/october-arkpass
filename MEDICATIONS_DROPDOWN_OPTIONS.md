# Medication Form Dropdown Options (Needs Confirmation)

This sheet lists the option sets that must be locked down for the medication add/edit forms.  
Populate once clinical stakeholders confirm the vocabulary.

---

## Frequency

| Value ID | Patient Label | Provider Label | Notes |
|----------|---------------|----------------|-------|
| freq_once_daily | 1 time a day | Once daily | Morning default? |
| freq_twice_daily | 2 times a day | Twice daily (BID) | 12-hour spacing |
| freq_three_daily | 3 times a day | Three times daily (TID) | |
| freq_four_daily | 4 times a day | Four times daily (QID) | |
| freq_every_6_hours | Every 6 hours | q6h | |
| freq_every_8_hours | Every 8 hours | q8h | |
| freq_weekly | 1 time per week | Once weekly | |
| freq_prn | As needed | PRN | Requires reason |
| freq_other | Other… | Custom | Launches free-text |

> TODO: Validate with pharmacy team; confirm if BID/TID terms should be shown to patients.

---

## Route (ORAL/SL/INJ/DROPS field)

| Value ID | Patient Label | Provider Label | Notes |
|----------|---------------|----------------|-------|
| route_oral | By mouth | ORAL | Tablets/capsules |
| route_sublingual | Under the tongue | SL (sublingual) | e.g., nitroglycerin |
| route_buccal | Inside the cheek | Buccal | |
| route_injection_im | Injection (muscle) | IM | Intramuscular |
| route_injection_iv | Injection (vein) | IV | Intravenous |
| route_injection_sc | Injection (under skin) | SC | Subcutaneous |
| route_inhaled | Inhaled | Inhalation | Respiratory meds |
| route_topical | Applied to skin | Topical | |
| route_ophthalmic | Eye drops | Ophthalmic | |
| route_otologic | Ear drops | Otologic | |
| route_other | Other… | Other | Free-text capture |

> TODO: Determine if abbreviations (IM/IV/SC) should also surface for patients in parentheses.

---

## Status

| Value ID | Patient Label | Provider Label | Notes |
|----------|---------------|----------------|-------|
| status_active | Currently taking | Active | Default |
| status_inactive | No longer taking | Inactive | Completed course |
| status_discontinued | Stopped by provider | Discontinued | With reason |
| status_prn | As needed | PRN | Must capture indication |
| status_pending | Prescribed, not started yet | Pending start | Optional |
| status_future | Scheduled to start later | Future start | With date |

> TODO: Confirm if “Pending” and “Future” are separate states or merged.

---

## Implementation Checklist
- [ ] Replace placeholder notes once vocab is approved.
- [ ] Add these options to seed data / reference tables.
- [ ] Update API docs to expose `value_id`, `patient_label`, `provider_label`.
- [ ] Map to display columns (`*_display_pt`, `*_display_pr`) using the patient/provider labels above.
