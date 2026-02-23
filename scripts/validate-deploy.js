#!/usr/bin/env node
/**
 * Pre-deploy validation script
 * Verifies that the build will not break in production
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-deploy validation...\n');

let hasErrors = false;

// 1. Check TypeScript compilation
console.log('✓ Checking TypeScript files...');
const tsFiles = [
  'src/types/index.ts',
  'src/hooks/useLocalStorageWithMigration.ts',
  'src/components/TaskCard.tsx',
  'src/components/NewTaskModal.tsx',
  'pages/index.js'
];

tsFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${file}`);
    hasErrors = true;
  }
});

// 2. Validate imports
console.log('✓ Checking critical imports...');
const indexFile = fs.readFileSync(path.join(__dirname, '..', 'pages', 'index.js'), 'utf8');
if (!indexFile.includes('useLocalStorageWithMigration')) {
  console.error('❌ useLocalStorageWithMigration not imported');
  hasErrors = true;
}

// 3. Check for assignee field in types
console.log('✓ Checking Task type definition...');
const typesFile = fs.readFileSync(path.join(__dirname, '..', 'src', 'types', 'index.ts'), 'utf8');
if (!typesFile.includes('assignee')) {
  console.error('❌ assignee field not found in Task type');
  hasErrors = true;
}

// 4. Check for migration logic
const migrationFile = path.join(__dirname, '..', 'src', 'hooks', 'useLocalStorageWithMigration.ts');
if (fs.existsSync(migrationFile)) {
  const content = fs.readFileSync(migrationFile, 'utf8');
  if (!content.includes("assignee: task.assignee || 'none'")) {
    console.error('❌ Migration logic not found');
    hasErrors = true;
  }
} else {
  console.error('❌ useLocalStorageWithMigration.ts not found');
  hasErrors = true;
}

// 5. Check .gitignore
console.log('✓ Checking .gitignore...');
const gitignore = fs.readFileSync(path.join(__dirname, '..', '.gitignore'), 'utf8');
const requiredIgnores = ['node_modules/', '.next/', '.env.local'];
requiredIgnores.forEach(ignore => {
  if (!gitignore.includes(ignore)) {
    console.error(`❌ ${ignore} not in .gitignore`);
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log('\n❌ Validation failed. Fix errors before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All validations passed. Ready to deploy!');
  process.exit(0);
}
