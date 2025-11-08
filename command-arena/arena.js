/**
 * Command Arena Dashboard - Client-Side Logic
 * Fetches state.json and animates neon cables + flash messages
 *
 * SOURCE: Door-01 | Command Arena Phase 0 MVP - King Competition Build
 */

const canvas = document.getElementById('cables-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Node connections (parent → children)
const connections = [
  // Prime → Librarians
  { from: 'prime-node', to: 'librarian-1', color: '#ff0000', pulseSpeed: 0.02 },
  { from: 'prime-node', to: 'librarian-2', color: '#ff0000', pulseSpeed: 0.02 },
  { from: 'prime-node', to: 'librarian-3', color: '#ff0000', pulseSpeed: 0.02 },

  // Librarians → Builders
  { from: 'librarian-1', to: 'builder-1', color: '#0096ff', pulseSpeed: 0.03 },
  { from: 'librarian-2', to: 'builder-2', color: '#0096ff', pulseSpeed: 0.03 },
  { from: 'librarian-3', to: 'builder-3', color: '#0096ff', pulseSpeed: 0.03 },
];

// Get node center coordinates
function getNodeCenter(nodeId) {
  const node = document.getElementById(nodeId);
  if (!node) return null;
  const rect = node.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

// Draw neon cable with pulse effect
function drawCable(from, to, color, pulseOffset) {
  const fromPos = getNodeCenter(from);
  const toPos = getNodeCenter(to);

  if (!fromPos || !toPos) return;

  // Pulsing glow effect
  const pulseIntensity = Math.sin(Date.now() * 0.001 + pulseOffset) * 0.5 + 0.5;
  const glowSize = 10 + pulseIntensity * 20;

  // Draw glowing cable
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.shadowBlur = glowSize;
  ctx.shadowColor = color;

  ctx.beginPath();
  ctx.moveTo(fromPos.x, fromPos.y);

  // Curved path for more organic look
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  const ctrlX = midX + (Math.random() - 0.5) * 20;
  const ctrlY = midY + (Math.random() - 0.5) * 20;

  ctx.quadraticCurveTo(ctrlX, ctrlY, toPos.x, toPos.y);
  ctx.stroke();

  // Draw pulse particles
  const particlePos = pulseIntensity;
  const particleX = fromPos.x + (toPos.x - fromPos.x) * particlePos;
  const particleY = fromPos.y + (toPos.y - fromPos.y) * particlePos;

  ctx.shadowBlur = 20;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(particleX, particleY, 4, 0, Math.PI * 2);
  ctx.fill();
}

// Animation loop for cables
function animateCables() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  connections.forEach((conn, index) => {
    drawCable(conn.from, conn.to, conn.color, index * Math.PI * 0.5);
  });

  requestAnimationFrame(animateCables);
}

// Start cable animation
animateCables();

// Fetch and update state from state.json
async function fetchState() {
  try {
    const response = await fetch('state.json?t=' + Date.now());
    const state = await response.json();

    // Update Mission Control status
    document.getElementById('mc-status').textContent = state.missionControl?.status || 'UNKNOWN';

    // Update mission count
    document.getElementById('mission-count').textContent = state.missions?.length || 0;

    // Update session count
    document.getElementById('session-count').textContent = state.sessions?.length || 0;

    // Update last update time
    const lastUpdate = state.lastUpdated || state.timestamp;
    if (lastUpdate) {
      const updateTime = new Date(lastUpdate);
      document.getElementById('last-update').textContent = updateTime.toLocaleTimeString();
    }

    // Update Prime status
    if (state.staffing?.supervisor) {
      document.getElementById('prime-status').textContent = state.staffing.supervisor;
    }

    // Update flash messages
    if (state.flashMessages && state.flashMessages.length > 0) {
      const latestFlash = state.flashMessages[state.flashMessages.length - 1];
      const flashBanner = document.getElementById('flash-banner');
      const flashContent = document.getElementById('flash-content');

      flashContent.textContent = latestFlash.message;
      flashBanner.classList.add('active');
    }

  } catch (error) {
    console.error('Failed to fetch state:', error);
    document.getElementById('mc-status').textContent = 'OFFLINE';
  }
}

// Initial fetch and periodic updates
fetchState();
setInterval(fetchState, 3000);

// Node click handlers (for future interactivity)
document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', () => {
    const label = node.querySelector('.node-label').textContent;
    console.log(`Clicked: ${label}`);
    // Future: Show node details modal
  });
});

// Door card click handlers
document.querySelectorAll('.door-card').forEach(card => {
  card.addEventListener('click', () => {
    console.log(`Clicked: ${card.id}`);
    // Future: Show door details modal
  });
});

// Emergency broadcast test (for development)
window.testFlash = function(message) {
  const flashBanner = document.getElementById('flash-banner');
  const flashContent = document.getElementById('flash-content');
  flashContent.textContent = message;
  flashBanner.classList.add('active');
  setTimeout(() => flashBanner.classList.remove('active'), 10000);
};

console.log('%c⚠️ COMMAND ARENA ONLINE ⚠️', 'color: #00ff00; font-size: 20px; font-weight: bold;');
console.log('%cMission Control 48707 | Majestic Clearance', 'color: #00ff00; font-size: 14px;');
console.log('%cTest flash message: testFlash("Your message here")', 'color: #0096ff; font-size: 12px;');
