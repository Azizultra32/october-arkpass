# Session Timeline — Temporal Tracking for The Consigliere

> **Purpose**: Track session start/end timestamps to calculate temporal approval expirations.
> **48-Hour Rule**: Temporary approvals expire 48 hours after issuance OR at next session start, whichever comes first.
> **Update Protocol**: Append new sessions below. Update "End Timestamp" when session completes.

---

| Session ID | Agent | Start Timestamp | End Timestamp | Duration | Elapsed Since Previous |
|------------|-------|----------------|---------------|----------|----------------------|
| Session 1 | Claude | 2025-11-08T02:30Z | 2025-11-08T03:40Z | 1h10m | N/A |
| Session 2 | Claude | 2025-11-08T14:45Z | 2025-11-08T15:35Z | 50m | 11h05m |
| Session 3 | Codex | 2025-11-08T19:15Z | 2025-11-08T21:10Z | 1h55m | 3h40m |
| Session 4 | Codex | 2025-11-08T22:05Z | 2025-11-08T23:25Z | 1h20m | 55m |
| Session 5 | Claude Code | 2025-11-08T09:00Z | 2025-11-08T11:45Z | 2h45m | 9h35m |
| Session 6 | Claude Code | 2025-11-08T16:00Z | [In Progress] | TBD | 4h15m |

---

## Temporal Approval Calculation Rules

### Rule 1: 48-Hour Expiration
- Calculate from Issue Timestamp → Issue Timestamp + 48 hours
- Example: Issued 2025-11-08T14:00Z → Expires 2025-11-10T14:00Z

### Rule 2: Next Working Session Expiration
- Approval expires when NEXT session begins (Session N+1 Start Timestamp)
- Example: Issued during Session 5 → Expires at Session 6 Start (2025-11-08T16:00Z)

### Rule 3: Whichever Comes First
- If 48 hours passes BEFORE next session → Expires at 48-hour mark
- If next session starts BEFORE 48 hours → Expires at session start
- Example: Issued 2025-11-08T14:00Z, 48hr expires 2025-11-10T14:00Z, Session 7 starts 2025-11-15T09:00Z → Expires 2025-11-10T14:00Z (48hr came first)

---

## Usage by The Consigliere

1. **When issuing temporary approval**: Record Issue Timestamp + calculate both expiration scenarios
2. **At session start**: Check all active temporary approvals → mark expired if current timestamp > expiration
3. **At session end**: Update current session's End Timestamp
4. **In briefings to Ali**: Include all expired approvals requiring retroactive review

---

**Last Updated**: 2025-11-08 (Session 6)
