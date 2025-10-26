#!/usr/bin/env node
/**
 * Probe Supabase Tables
 * Try to query each expected table to determine existence and accessible columns
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gqahazcatpgzzfujnidk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S8OZykoIt9RnHjqW8Kt4vg_1qOj_4w8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const EXPECTED_TABLES = [
  'roles',
  'user_profiles',
  'medications',
  'visit_notes',
  'allergies',
  'immunizations',
  'conditions',
  'surgeries',
  'family_history',
  'social_history',
  'lab_results',
  'documents',
  'access_grants',
  'proxy_access',
  'audit_logs',
  'notifications',
  'appointments',
  'data_exports',
  'supplements' // Expected: does not exist
];

async function probeTable(tableName) {
  console.log(`   Probing: ${tableName}...`);

  try {
    // Try to select 0 rows to test table existence and get column structure
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      // Check error code
      if (error.code === '42P01') {
        // Table does not exist
        return {
          tableName,
          exists: false,
          error: 'Table does not exist',
          errorCode: error.code
        };
      } else if (error.code === '42501') {
        // Permission denied (but table exists)
        return {
          tableName,
          exists: true,
          accessible: false,
          error: 'Permission denied (RLS blocking)',
          errorCode: error.code,
          note: 'Table exists but RLS prevents anonymous access'
        };
      } else {
        return {
          tableName,
          exists: 'unknown',
          error: error.message,
          errorCode: error.code
        };
      }
    }

    // Success - table exists and is accessible
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

    return {
      tableName,
      exists: true,
      accessible: true,
      rowCount: count,
      sampleColumns: columns,
      note: columns.length > 0 ? 'Columns extracted from sample row' : 'Table empty or no columns visible'
    };

  } catch (error) {
    return {
      tableName,
      exists: 'error',
      error: error.message
    };
  }
}

async function probeAllTables() {
  console.log('🔍 Probing Supabase tables...\n');

  const results = [];

  for (const tableName of EXPECTED_TABLES) {
    const result = await probeTable(tableName);
    results.push(result);

    // Pretty print result
    if (result.exists === true) {
      if (result.accessible) {
        console.log(`      ✅ EXISTS & ACCESSIBLE (${result.sampleColumns?.length || 0} columns visible, ${result.rowCount || 0} rows)`);
      } else {
        console.log(`      🔒 EXISTS but RLS BLOCKS ACCESS`);
      }
    } else if (result.exists === false) {
      console.log(`      ❌ DOES NOT EXIST`);
    } else {
      console.log(`      ⚠️  UNKNOWN (${result.error})`);
    }
  }

  return results;
}

// Run probing
probeAllTables().then(results => {
  const outputPath = path.join(__dirname, '..', 'SUPABASE_TABLE_PROBE_RESULTS.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    probedAt: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL,
    method: 'Direct table query with anon key',
    results: results
  }, null, 2));

  console.log(`\n✅ Probe complete! Results saved to:`);
  console.log(`   ${outputPath}\n`);

  // Summary
  const existsAndAccessible = results.filter(r => r.exists === true && r.accessible === true);
  const existsButBlocked = results.filter(r => r.exists === true && r.accessible === false);
  const doesNotExist = results.filter(r => r.exists === false);
  const unknown = results.filter(r => r.exists === 'unknown' || r.exists === 'error');

  console.log('📊 Summary:');
  console.log(`   ✅ Exists & Accessible: ${existsAndAccessible.length}`);
  existsAndAccessible.forEach(t => {
    console.log(`      - ${t.tableName} (${t.sampleColumns?.length || 0} columns)`);
  });

  console.log(`\n   🔒 Exists but RLS blocks: ${existsButBlocked.length}`);
  existsButBlocked.forEach(t => {
    console.log(`      - ${t.tableName}`);
  });

  console.log(`\n   ❌ Does not exist: ${doesNotExist.length}`);
  doesNotExist.forEach(t => {
    console.log(`      - ${t.tableName}`);
  });

  if (unknown.length > 0) {
    console.log(`\n   ⚠️  Unknown status: ${unknown.length}`);
    unknown.forEach(t => {
      console.log(`      - ${t.tableName}: ${t.error}`);
    });
  }

  console.log('\n📋 Next step: Review SUPABASE_TABLE_PROBE_RESULTS.json\n');

  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
