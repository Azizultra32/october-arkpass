#!/usr/bin/env node

/**
 * Command Arena Watcher Script
 * Parses CURRENT_STATUS.md + logs → state.json for dashboard
 *
 * SOURCE: Door-01 | Command Arena Phase 0 MVP - King Competition Build
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CURRENT_STATUS = path.join(ROOT, 'CURRENT_STATUS.md');
const LOGS_DIR = path.join(ROOT, 'logs');
const OUTPUT = path.join(__dirname, 'state.json');

/**
 * Parse CURRENT_STATUS.md for mission state
 */
function parseCurrentStatus() {
  if (!fs.existsSync(CURRENT_STATUS)) {
    console.warn('CURRENT_STATUS.md not found');
    return null;
  }

  const content = fs.readFileSync(CURRENT_STATUS, 'utf8');
  const state = {
    missionControl: { id: '48707', status: 'UNKNOWN' },
    doors: [],
    missions: [],
    staffing: {},
    flashMessages: [],
    lastUpdated: null,
  };

  // Extract Mission Control status
  const mcMatch = content.match(/## Mission Control Console.*?\*\*Status\*\*:\s*(\w+\s*✅?)/s);
  if (mcMatch) {
    state.missionControl.status = mcMatch[1].trim();
  }

  // Extract Door Registry
  const doorSection = content.match(/## Door Registry.*?\n\n([\s\S]*?)\n\n/);
  if (doorSection) {
    const doorRows = doorSection[1].match(/\|\s*Door-\d+.*?\|/g);
    if (doorRows) {
      doorRows.forEach(row => {
        const parts = row.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length >= 4 && !parts[0].includes('Door ID')) {
          state.doors.push({
            id: parts[0],
            name: parts[1],
            status: parts[2],
            agent: parts[3],
            lastActive: parts[4] || 'unknown',
          });
        }
      });
    }
  }

  // Extract Active Missions
  const missionMatches = content.matchAll(/### Mission (\w+) — (.*?)\n- \*\*Status\*\*:\s*(.*?)\n/g);
  for (const match of missionMatches) {
    state.missions.push({
      id: match[1],
      name: match[2],
      status: match[3],
    });
  }

  // Extract Staffing
  const staffMatch = content.match(/\*\*Supervisor \(Prime\)\*\*:\s*(.*?)\n/);
  if (staffMatch) state.staffing.supervisor = staffMatch[1].trim();

  const libMatch = content.match(/\*\*Librarians\*\*:\s*(.*?)\n/);
  if (libMatch) state.staffing.librarians = libMatch[1].trim();

  const buildMatch = content.match(/\*\*Builders\*\*:\s*(.*?)\n/);
  if (buildMatch) state.staffing.builders = buildMatch[1].trim();

  // Extract Flash Messages
  const flashSection = content.match(/## Flash Messages[\s\S]*?- \*\*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\*\*:\s*(.*?)$/gm);
  if (flashSection) {
    flashSection.forEach(msg => {
      const match = msg.match(/- \*\*(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\*\*:\s*(.*)/);
      if (match) {
        state.flashMessages.push({
          timestamp: match[1],
          message: match[2].replace(/\[Session.*?\]/, '').trim(),
        });
      }
    });
  }

  // Extract last updated timestamp
  const updateMatch = content.match(/\*\*Last Updated\*\*:\s*(.*?)\n/);
  if (updateMatch) state.lastUpdated = updateMatch[1].trim();

  return state;
}

/**
 * Parse today's log for session activity
 */
function parseTodayLog() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const logFile = path.join(LOGS_DIR, `${today}.md`);

  if (!fs.existsSync(logFile)) {
    console.warn(`Log file ${today}.md not found`);
    return [];
  }

  const content = fs.readFileSync(logFile, 'utf8');
  const sessions = [];

  // Extract sessions with checkpoint summaries
  const sessionMatches = content.matchAll(/## Session (\d+) — Agent (.*?) — (.*?) → (.*?) — (.*?)\n/g);
  for (const match of sessionMatches) {
    sessions.push({
      id: parseInt(match[1]),
      agent: match[2],
      startTime: match[3],
      endTime: match[4],
      role: match[5],
    });
  }

  return sessions;
}

/**
 * Main watcher loop
 */
function watch() {
  const state = parseCurrentStatus();
  const sessions = parseTodayLog();

  const output = {
    timestamp: new Date().toISOString(),
    missionControl: state?.missionControl || {},
    doors: state?.doors || [],
    missions: state?.missions || [],
    staffing: state?.staffing || {},
    flashMessages: state?.flashMessages || [],
    sessions: sessions,
    lastUpdated: state?.lastUpdated || null,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`[${new Date().toISOString()}] State updated: ${OUTPUT}`);
}

// Run watcher
if (require.main === module) {
  console.log('Command Arena Watcher - Monitoring CURRENT_STATUS.md + logs/');
  console.log('Press Ctrl+C to stop\n');

  // Initial run
  watch();

  // Watch for changes every 2 seconds
  setInterval(watch, 2000);
}

module.exports = { parseCurrentStatus, parseTodayLog };
