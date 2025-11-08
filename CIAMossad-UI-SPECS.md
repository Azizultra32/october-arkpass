# CIAMossad UI/App Specifications

**Official Name:** CIAMossad (all one word)
**Purpose:** Real-time command and control dashboard for ArkPass agent hierarchy
**Location:** `/command-arena/` (current Phase 0 MVP)
**Mission Control ID:** 48707
**Status:** Phase 0 MVP complete, racing for "King" title

---

## Current Build Status

### Deployed Files
- **index.html** - Main dashboard HTML with neon styling
- **arena.js** - Client-side animation logic (cables, pulses, particles)
- **watcher.js** - Server-side state watcher (monitors git repo for state changes)
- **state.json** - Dynamic state file (flash messages, node statuses)
- **README.md** - Phase 0 documentation

### Running Server
- **Command:** `cd command-arena && python3 -m http.server 8000`
- **URL:** http://localhost:8000
- **Port:** 8000
- **Protocol:** Simple HTTP server (Python)

---

## Phase 0 MVP Features (CURRENT)

### Visual Hierarchy
```
         ⭐ PRIME (Ali)
            │
    ┌───────┼───────┐
    │       │       │
  📚 LIB  📚 LIB  📚 LIB
    │       │       │
  🔨 BLD  🔨 BLD  🔨 BLD
```

### Current Nodes
1. **Prime Node** (top center)
   - Size: 180px diameter
   - Color: #ff0000 (red)
   - Label: "PRIME"
   - Status: Displays clearance level (Ali)

2. **Librarian Nodes** (3 nodes, middle row)
   - Size: 120px diameter
   - Color: #0096ff (cyan)
   - Labels: "Librarian 1", "Librarian 2", "Librarian 3"
   - Status: Shows role

3. **Builder Nodes** (3 nodes, bottom row)
   - Size: 100px diameter
   - Color: #00ff00 (green)
   - Labels: "Builder 1", "Builder 2", "Builder 3"
   - Status: Shows role

### Animations (Current)
- **Breathing nodes**: Nodes pulse with glow effect (2s cycle)
- **Neon cables**: Animated connections between parent→child nodes
- **Pulse particles**: Dots travel along cables
- **Flash messages**: Scrolling ticker at bottom (reads from state.json)

### Color Scheme (Phase 0)
- Background: Radial gradient black (#000) to dark green (#001a00)
- Prime: Red (#ff0000)
- Librarians: Cyan (#0096ff)
- Builders: Green (#00ff00)
- Text: Matrix green (#0f0, #00cc00)

---

## Phase 1 Upgrade: Agent Integration

### New Requirements

#### 1. Two-Panel Layout
```
┌─── LEFT: ACTIVE HIERARCHY ───┐  ┌─── RIGHT: STANDBY ROSTER ───┐
│                               │  │                              │
│  Current tree structure       │  │  🟡 AGENT-00001             │
│  (Prime → Libs → Builders)    │  │     "Themis" HOMESLICE       │
│                               │  │     Adjudicator              │
│  Shows ACTIVE agents only     │  │     ★★★★☆ 4.2               │
│                               │  │     [SUMMON]                 │
│                               │  │                              │
│                               │  │  🟡 AGENT-00002             │
│                               │  │     "Codex" BROSKI           │
│                               │  │     Builder                  │
│                               │  │     ★★★★☆ 4.2               │
│                               │  │     [SUMMON]                 │
└───────────────────────────────┘  └──────────────────────────────┘
```

#### 2. Agent Card Design
**Standby Agent Card:**
```html
<div class="agent-card standby">
  <div class="status-indicator">🟡</div>
  <div class="agent-id">AGENT-00001</div>
  <div class="agent-name">"Themis"</div>
  <div class="agent-gender">HOMESLICE</div>
  <div class="agent-role">⚖️ Adjudicator</div>
  <div class="rating">★★★★☆ 4.2</div>
  <div class="last-active">Last: 2 hrs ago</div>
  <div class="sessions">Sessions: 3</div>
  <button class="summon-btn">SUMMON</button>
  <button class="view-btn">VIEW MOJO</button>
</div>
```

#### 3. Data Source
**File to poll:** `agents/registry/REGISTRY.yaml`

**Polling logic:**
```javascript
// In arena.js
setInterval(async () => {
  const response = await fetch('/agents/registry/REGISTRY.yaml');
  const yaml = await response.text();
  const registry = parseYAML(yaml); // Need YAML parser

  updateStandbyRoster(registry.agents);
  updateActiveTree(registry.by_status.active);
}, 2000); // Poll every 2 seconds
```

#### 4. Status Colors & Animations

**Status States:**
- 🟢 **ACTIVE** - `#00ff00` - Fast pulse (1s), glowing, in left panel
- 🟡 **STANDBY** - `#ffaa00` - Slow breathing (4s), dim, in right panel
- 🔴 **SUSPENDED** - `#ff3333` - Static glow, no animation, right panel
- ⚫ **RETIRED** - `#555555` - 50% opacity, faded, right panel

**CSS Animations:**
```css
@keyframes active-pulse {
  0%, 100% {
    box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px #00ff00, 0 0 80px #00ff00;
    transform: scale(1.05);
  }
}

@keyframes standby-breathe {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.agent-card.active { animation: active-pulse 1s infinite; }
.agent-card.standby { animation: standby-breathe 4s infinite; }
.agent-card.suspended { animation: none; opacity: 0.8; }
.agent-card.retired { animation: none; opacity: 0.5; filter: grayscale(1); }
```

#### 5. Role Icons
```javascript
const ROLE_ICONS = {
  builder: '🔨',
  librarian: '📚',
  adjudicator: '⚖️',
  consigliere: '👔',
  constitution_keeper: '📜',
  twin_a: '🎨',
  twin_b: '🎨',
  bp_demolition_man: '💥'
};
```

#### 6. Rating Display
```javascript
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return '★'.repeat(full) +
         (half ? '☆' : '') +
         '☆'.repeat(empty) +
         ` ${rating.toFixed(1)}`;
}
```

---

## File Structure

```
command-arena/
├── index.html          # Main dashboard (Phase 0 complete)
├── arena.js            # Animation logic (needs agent integration)
├── watcher.js          # Server-side state monitor
├── state.json          # Flash messages + dynamic state
├── README.md           # Phase 0 docs
└── assets/             # (Future: images, sounds)

agents/
├── genomes/            # Agent class DNA
├── mojos/              # Individual agent files
├── registry/
│   └── REGISTRY.yaml   # ← CIAMossad polls this file
└── procreation/
    └── requests/

scripts/
├── agent-summon.sh     # CLI summoning
└── agent-create.sh     # (To be built)
```

---

## Integration Points

### 1. Arena.js Modifications Needed
```javascript
// Add to arena.js

// Fetch agent registry
async function fetchAgentRegistry() {
  const response = await fetch('/agents/registry/REGISTRY.yaml');
  const text = await response.text();
  return parseYAML(text); // Need js-yaml library
}

// Update standby roster panel
function updateStandbyRoster(agents) {
  const rosterPanel = document.getElementById('standby-roster');
  rosterPanel.innerHTML = '';

  Object.entries(agents).forEach(([id, agent]) => {
    if (agent.status === 'standby') {
      const card = createAgentCard(id, agent);
      rosterPanel.appendChild(card);
    }
  });
}

// Create agent card element
function createAgentCard(id, agent) {
  const card = document.createElement('div');
  card.className = `agent-card ${agent.status}`;
  card.innerHTML = `
    <div class="status-indicator">${getStatusIcon(agent.status)}</div>
    <div class="agent-id">${id}</div>
    <div class="agent-name">"${agent.name}"</div>
    <div class="agent-gender">${agent.gender.toUpperCase()}</div>
    <div class="agent-role">${ROLE_ICONS[agent.role]} ${capitalize(agent.role)}</div>
    <div class="rating">${renderStars(agent.rating)}</div>
    <div class="last-active">Last: ${formatTimestamp(agent.last_seen)}</div>
    <button class="summon-btn" onclick="summonAgent('${id}')">SUMMON</button>
    <button class="view-btn" onclick="viewMojo('${id}')">VIEW MOJO</button>
  `;
  return card;
}

// Summon agent (triggers script)
function summonAgent(agentId) {
  // Call backend endpoint or trigger CLI script
  console.log(`Summoning ${agentId}...`);
  // TODO: Implement actual summoning logic
}
```

### 2. Dependencies Needed
```html
<!-- Add to index.html <head> -->
<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
```

### 3. State.json Enhancement
```json
{
  "flash_messages": [
    "🟢 AGENT-00005 'Codex' BROSKI activated - Session 7 started",
    "⚠️ Builder:Librarian ratio: 3:4 - Within limits",
    "🟡 AGENT-00001 'Themis' HOMESLICE returned to standby"
  ],
  "active_sessions": {
    "AGENT-00005": {
      "session_id": "Session 7",
      "context_usage": 72,
      "elapsed_minutes": 45
    }
  }
}
```

---

## Deployment Workflow

### Current (Phase 0)
```bash
cd command-arena
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Future (Phase 1)
```bash
# Terminal 1: Start HTTP server
cd /Users/ali/october-arkpass
python3 -m http.server 8000

# Terminal 2: Watch for agent changes
./command-arena/watcher.js

# Terminal 3: Summon agents
./scripts/agent-summon.sh adjudicator AGENT-00001
```

---

## Testing Checklist

### Phase 0 (Current - ✅ Complete)
- [✅] Neon nodes render with breathing animation
- [✅] Cables connect Prime → Librarians → Builders
- [✅] Pulse particles flow along cables
- [✅] Flash messages scroll at bottom
- [✅] Hover effects on nodes
- [✅] Runs on http://localhost:8000

### Phase 1 (Agent Integration - 🚧 Pending)
- [ ] Two-panel layout (left: active, right: standby)
- [ ] Poll agents/registry/REGISTRY.yaml every 2s
- [ ] Render standby agent cards with correct status colors
- [ ] SUMMON button triggers agent-summon.sh
- [ ] VIEW MOJO button opens agent MOJO file
- [ ] Active agents show in left panel with session info
- [ ] Status transitions animate smoothly
- [ ] Rating stars render correctly
- [ ] Role icons display properly
- [ ] Last active timestamps update

---

## Known Limitations (Phase 0)

1. **Static hierarchy** - Nodes are hardcoded positions
2. **No agent data** - Just placeholder roles
3. **No interactivity** - Nodes don't do anything when clicked
4. **No persistence** - state.json manually edited
5. **No authentication** - Anyone can view dashboard

---

## Future Enhancements (Post-Phase 1)

1. **WebSocket integration** - Real-time updates instead of polling
2. **Agent performance graphs** - Rating history over time
3. **Session replay** - View past session logs
4. **Procreation UI** - Submit procreation requests from dashboard
5. **Sound effects** - Neon hum, pulse sounds, agent activation chimes
6. **Mobile responsive** - Works on tablets/phones
7. **Dark/light themes** - Toggle Matrix green vs CIA blue
8. **Search/filter agents** - Find agents by role, rating, status
9. **Export reports** - Download agent performance PDFs

---

## Technical Stack

**Current:**
- HTML5 + CSS3 (no frameworks)
- Vanilla JavaScript (ES6+)
- Canvas API (for cable animations)
- Python HTTP server (static file serving)
- Git-based state management

**Future:**
- Add: js-yaml (YAML parsing)
- Consider: Vue.js or React (if complexity grows)
- Consider: WebSocket server (for real-time)
- Consider: Node.js/Express (for API endpoints)

---

## ChatGPT Export Note

This spec is designed to be copy-pasted into ChatGPT for:
- Generating additional UI components
- Creating agent card variations
- Building SUMMON/VIEW MOJO functionality
- Designing mobile-responsive layouts
- Adding new animation effects

**Prompt template for ChatGPT:**
```
I'm building CIAMossad, a real-time agent dashboard for ArkPass.
Here are the current specs: [paste this file]

I need you to [specific request]:
- Generate the two-panel layout HTML/CSS
- Create the agent card component with animations
- Build the YAML polling logic in arena.js
- Design the SUMMON button click handler
- etc.
```

---

**Version:** 1.0.0
**Last Updated:** 2025-11-08
**Phase:** 0 MVP → 1 Agent Integration (in progress)
