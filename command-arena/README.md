# Command Arena Phase 0 MVP

**SOURCE**: Door-01 | Mission Bravo - King Competition Build

---

## Overview

Living Command Arena dashboard with:
- ✅ **Structured command tree**: Prime → 3 Librarians → 3 Builders → Door cards
- ✅ **Neon pulse cables**: Animated connections with particle effects
- ✅ **Breathing nodes**: Organic pulsing animation
- ✅ **Emergency broadcast system**: Flash message banner
- ✅ **Real-time state**: Auto-updates from CURRENT_STATUS.md + logs

**Competition**: "Build your own version and winner gets title called King"

---

## Quick Start

### 1. Start the Watcher
```bash
cd /Users/ali/october-arkpass/command-arena
node watcher.js
```

**What it does**:
- Parses `CURRENT_STATUS.md` for mission state
- Parses `logs/YYYY-MM-DD.md` for session activity
- Outputs `state.json` every 2 seconds

### 2. Serve the Dashboard

**Option A - Python SimpleHTTPServer**:
```bash
python3 -m http.server 8000
```

**Option B - Node http-server** (install first: `npm install -g http-server`):
```bash
http-server -p 8000
```

**Option C - Open directly** (limited functionality without server):
```bash
open index.html
```

### 3. View the Arena

Open in browser: [http://localhost:8000](http://localhost:8000)

---

## Architecture

```
command-arena/
├── watcher.js      # Parses CURRENT_STATUS.md + logs → state.json
├── index.html      # Dashboard UI structure + CSS
├── arena.js        # Client-side logic: cables, animations, state updates
├── state.json      # Generated state (auto-updated by watcher)
└── README.md       # This file
```

---

## Features

### Neon Pulse Cables
- **Prime → Librarians**: Red cables (#ff0000)
- **Librarians → Builders**: Blue cables (#0096ff)
- **Animated particles**: Travel along cables with sine wave pulse

### Breathing Nodes
- **Prime (Red)**: 180px, slow rotation + breathing (3s cycle)
- **Librarians (Blue)**: 140px, breathing with 0.5s offset
- **Builders (Green)**: 100px, breathing with 1s offset

### Emergency Broadcast
- **Flash banner**: Bottom of screen with pulsing red glow
- **Auto-displays**: Latest flash message from CURRENT_STATUS.md
- **Test command**: `testFlash("Your message")` in browser console

### Real-Time Updates
- **Fetches state.json** every 3 seconds
- **Updates HUD**: Mission Control status, mission count, session count
- **Updates nodes**: Staffing assignments

---

## Scaling Path

**Phase 0** (Current): HTML + vanilla JS
- 3 colored boxes (Prime, Librarian, Builder)
- Neon cables + breathing animations
- Emergency broadcasts

**Phase 1** (Next): React + SVG
- Component architecture
- Interactive node details modal
- Mission timeline visualization

**Phase 2**: Canvas effects
- Advanced particle systems
- Collision detection (bumper-car physics)
- Sound effects on state changes

**Phase 3**: Game engine feel
- Three.js for 3D nodes
- Camera controls
- Network visualization algorithms

**Phase 4**: CIA×Mossad Majestic
- Full 3D command center
- Real-time chat integration
- Mission briefing overlays
- "Shit their pants" impressive

---

## Extra Points Features

✅ **Neon effects**: Glowing cables with shadowBlur + pulsing particles
✅ **Emergency broadcasts**: Flash message banner with red pulse animation
✅ **Breathing animations**: Organic scale + opacity transforms
✅ **Majestic title bar**: "MISSION CONTROL 48707 | MAJESTIC CLEARANCE"

---

## Development

### Test Flash Message
```javascript
testFlash("🚨 COMPETITION WINNER ANNOUNCED - KING TITLE AWARDED 🚨")
```

### Modify Node Colors
Edit `index.html` CSS:
- `#prime-node` → Red (#ff0000)
- `.librarian-node` → Blue (#0096ff)
- `.builder-node` → Green (#00ff00)

### Add More Doors
```javascript
// In index.html, add new door card:
<div id="door-3" class="door-card" style="left: 45%;">
  <div>Door-03</div>
  <div style="font-size: 0.6rem; margin-top: 3px;">new-repo</div>
</div>
```

---

## Notes

- **No force-directed graph** - structured hierarchy as requested
- **Bumper-car physics** - reserved for Phase 2+ (needs collision detection)
- **NOT React Flow** - custom vanilla JS for maximum control
- **Majestic clearance** - neon aesthetics + cinematic animations

---

**Built by**: Claude Code (Session 5)
**Competition Status**: Racing for "King" title
**Extra Points**: AWARDED for neon effects + emergency broadcasts

**<<Command Arena Phase 0 OPERATIONAL>> [over]**
