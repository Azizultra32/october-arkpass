# Temporary Approvals Directory

This directory contains all temporary approvals issued by The Consigliere when Grandmaster Ali is unavailable.

## File Naming Convention

`TEMP-YYYY-MM-DD-NN.md` where:
- `YYYY-MM-DD` = Date issued
- `NN` = Sequential number (01, 02, etc.)

## Status Workflow

1. **Active** — Approval in effect (within 48hrs + no next session yet)
2. **Expired** — Approval expired (awaiting Ali retroactive review)
3. **Ali Approved** — Ali retroactively approved (converted to permanent)
4. **Ali Denied** — Ali retroactively denied (rolled back)

## Directory Structure

```
temporary-approvals/
├── README.md (this file)
├── active/ (approvals currently in effect)
├── expired/ (awaiting Ali review)
├── approved/ (Ali retroactively approved — archive)
└── denied/ (Ali retroactively denied — archive)
```

## The Consigliere's Duties

- Issue temporary approvals when time-sensitive decisions required + Ali unavailable
- Track expiration using SESSION_TIMELINE.md timestamps
- Move files between directories as status changes
- Include all expired approvals in next Royal Briefing for Ali retroactive review

---

**Last Updated**: 2025-11-08 (Session 6)
