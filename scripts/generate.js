/**
 * Wrapper around lex-cli gen-server that handles:
 * 1. File discovery (pnpm doesn't expand globs in scripts)
 * 2. Excluding lexicons with types lex-cli can't process (permission-set)
 * 3. Auto-confirming the lex-cli prompt
 * 4. Running the fixup script afterward
 *
 * Usage: node scripts/generate.js
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const LEXICONS_DIR = join(ROOT, 'lexicons')
const OUTPUT_DIR = join(ROOT, 'src', 'generated')

// Lexicons that use types lex-cli cannot process (e.g. permission-set).
// These are manually maintained in lexicons.ts instead.
const EXCLUDED_FILES = ['authForumAccess.json']

function findJsonFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(fullPath))
    } else if (entry.name.endsWith('.json') && !EXCLUDED_FILES.includes(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

const files = findJsonFiles(LEXICONS_DIR)
if (files.length === 0) {
  console.error('No lexicon files found in', LEXICONS_DIR)
  process.exit(1)
}

console.log(`Found ${files.length} lexicon files (excluded: ${EXCLUDED_FILES.join(', ')})`)

const cmd = `echo y | pnpm exec lex gen-server ${OUTPUT_DIR} ${files.join(' ')}`
execSync(cmd, { cwd: ROOT, stdio: 'inherit' })

console.log('Running fixup script...')
execSync('node scripts/fixup-generated.js', { cwd: ROOT, stdio: 'inherit' })
