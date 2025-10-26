#!/usr/bin/env node
/**
 * Extract Production Supabase Schema
 * Connects to production Supabase and extracts complete schema information
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://gqahazcatpgzzfujnidk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S8OZykoIt9RnHjqW8Kt4vg_1qOj_4w8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function extractSchema() {
  console.log('🔌 Connecting to Supabase...');
  console.log(`   URL: ${SUPABASE_URL}\n`);

  const schema = {
    tables: [],
    views: [],
    functions: [],
    policies: [],
    triggers: [],
    extractedAt: new Date().toISOString(),
    supabaseUrl: SUPABASE_URL
  };

  try {
    // Get all tables from information_schema
    console.log('📊 Fetching tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError);
      // Try RPC approach instead
      console.log('   Trying alternate approach via RPC...');
      return await extractSchemaViaRPC();
    }

    console.log(`   Found ${tables?.length || 0} tables\n`);

    if (!tables || tables.length === 0) {
      console.log('⚠️  No tables found or permission denied.');
      console.log('   This might be expected - the anon key has limited access.');
      console.log('   Schema extraction requires service_role key or database access.\n');
      return await createManualSchemaCheck();
    }

    // Get columns for each table
    for (const table of tables) {
      if (table.table_type !== 'BASE TABLE') continue;

      console.log(`   📋 Processing table: ${table.table_name}`);

      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');

      if (!columnsError && columns) {
        schema.tables.push({
          name: table.table_name,
          columns: columns
        });
      }
    }

    return schema;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return await createManualSchemaCheck();
  }
}

async function extractSchemaViaRPC() {
  console.log('🔧 Attempting schema extraction via SQL query...\n');

  // Try to get table list via raw SQL (if RPC function exists)
  const sqlQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sqlQuery });

    if (error) {
      console.log('   RPC not available:', error.message);
      return await createManualSchemaCheck();
    }

    console.log('✅ RPC query successful');
    return { tables: data, method: 'rpc' };

  } catch (error) {
    return await createManualSchemaCheck();
  }
}

async function createManualSchemaCheck() {
  console.log('\n📝 Creating manual schema check template...\n');

  const expectedTables = [
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

  const checkTemplate = {
    note: 'MANUAL VERIFICATION REQUIRED - Anon key has limited access to information_schema',
    instructions: [
      '1. Log in to Supabase Dashboard: https://app.supabase.com',
      '2. Navigate to: Database → Tables',
      '3. For each table below, verify existence and note columns',
      '4. Update SCHEMA_VALIDATION_CHECKLIST.md with findings'
    ],
    expectedTables: expectedTables.map(table => ({
      tableName: table,
      exists: null, // TODO: Verify in dashboard
      columns: [], // TODO: List columns from dashboard
      notes: ''
    })),
    alternativeMethod: 'Use Supabase CLI: `supabase db pull` to get schema',
    extractedAt: new Date().toISOString()
  };

  return checkTemplate;
}

// Run extraction
extractSchema().then(schema => {
  const outputPath = path.join(__dirname, '..', 'SUPABASE_PRODUCTION_SCHEMA.json');
  fs.writeFileSync(outputPath, JSON.stringify(schema, null, 2));

  console.log('\n✅ Schema extraction complete!');
  console.log(`   Output: ${outputPath}\n`);

  if (schema.tables && schema.tables.length > 0) {
    console.log('📊 Summary:');
    console.log(`   Tables found: ${schema.tables.length}`);
    schema.tables.forEach(table => {
      console.log(`   - ${table.name} (${table.columns?.length || 0} columns)`);
    });
  } else {
    console.log('⚠️  Manual verification required.');
    console.log('   See SUPABASE_PRODUCTION_SCHEMA.json for instructions.');
  }

  console.log('\n📋 Next steps:');
  console.log('   1. Review SUPABASE_PRODUCTION_SCHEMA.json');
  console.log('   2. If manual verification needed, check Supabase Dashboard');
  console.log('   3. Proceed with SCHEMA_VALIDATION_CHECKLIST.md\n');

  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
