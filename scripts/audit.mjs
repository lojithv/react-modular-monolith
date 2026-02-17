#!/usr/bin/env node

/**
 * Architecture Audit Script
 *
 * Run:  node scripts/audit.mjs
 * CI:   npm run audit:arch
 *
 * Checks this codebase for module boundary violations, MFE-readiness issues,
 * and structural inconsistencies. Returns exit code 1 if any FAIL is found.
 *
 * Designed to be run weekly (or in CI) by devs and AI agents.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MODULES_DIR = join(ROOT, 'modules');
const SHARED_DIR = join(ROOT, 'shared');
const STRICT = process.argv.includes('--strict');

let totalPass = 0;
let totalFail = 0;
let totalWarn = 0;

// ─── Helpers ──────────────────────────────────────────────

function pass(msg) {
  totalPass++;
  console.log(`  ✅ PASS  ${msg}`);
}
function fail(msg) {
  totalFail++;
  console.log(`  ❌ FAIL  ${msg}`);
}
function warn(msg) {
  totalWarn++;
  console.log(`  ⚠️  WARN  ${msg}`);
}
function section(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'─'.repeat(60)}`);
}

function getModuleDirs() {
  return readdirSync(MODULES_DIR)
    .filter((d) => d !== '_template' && d !== 'registry.ts')
    .filter((d) => statSync(join(MODULES_DIR, d)).isDirectory());
}

function readText(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function walkFiles(dir, ext = ['.ts', '.tsx']) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, ext));
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Check 1: Module Structure Completeness ───────────────

function checkModuleStructure() {
  section('1. Module Structure Completeness');

  const requiredFiles = ['index.ts', 'routes.ts', 'layout.tsx'];
  const optionalFiles = ['types.ts', 'vitest.config.ts'];
  const modules = getModuleDirs();

  for (const mod of modules) {
    const modDir = join(MODULES_DIR, mod);

    for (const file of requiredFiles) {
      if (existsSync(join(modDir, file))) {
        pass(`${mod}/${file} exists`);
      } else {
        fail(`${mod}/${file} is MISSING (required)`);
      }
    }

    for (const file of optionalFiles) {
      if (existsSync(join(modDir, file))) {
        pass(`${mod}/${file} exists`);
      } else {
        warn(`${mod}/${file} is missing (recommended)`);
      }
    }

    if (existsSync(join(modDir, 'pages'))) {
      pass(`${mod}/pages/ directory exists`);
    } else {
      fail(`${mod}/pages/ directory is MISSING`);
    }
  }
}

// ─── Check 2: Cross-Module Import Violations ──────────────

function checkCrossModuleImports() {
  section('2. Cross-Module Import Violations');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const modDir = join(MODULES_DIR, mod);
    const files = walkFiles(modDir);

    for (const file of files) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      const importLines = content.split('\n').filter(
        (line) => line.match(/^\s*(import|export)\s/) && line.includes('@modules/'),
      );

      for (const line of importLines) {
        const match = line.match(/@modules\/([^/']+)/);
        if (match) {
          const importedModule = match[1];
          if (importedModule !== mod && importedModule !== 'registry.ts' && importedModule !== 'registry') {
            fail(`${relPath} imports from @modules/${importedModule} (cross-module violation)`);
          }
        }
      }

      const rootImports = content.split('\n').filter(
        (line) => line.match(/^\s*(import|export)\s/) && line.includes('@root/'),
      );
      for (const line of rootImports) {
        if (!file.includes('routes.ts')) {
          warn(`${relPath} imports from @root/ — only routes.ts should do this`);
        }
      }
    }
  }

  pass('Cross-module import check completed');
}

// ─── Check 3: Service Layer Patterns ──────────────────────

function checkServicePatterns() {
  section('3. Service Layer Patterns');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const servicesDir = join(MODULES_DIR, mod, 'services');
    if (!existsSync(servicesDir)) continue;

    const serviceFiles = walkFiles(servicesDir).filter(
      (f) => f.endsWith('.service.ts'),
    );

    for (const file of serviceFiles) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      if (content.includes('apiClient') || content.includes('@shared/api')) {
        pass(`${relPath} uses apiClient from @shared/api`);
      } else if (content.includes('fetch(')) {
        fail(`${relPath} uses raw fetch() instead of apiClient`);
      }

      if (content.includes('useState') || content.includes('useEffect') || content.includes('from \'react\'')) {
        fail(`${relPath} imports React hooks — services must be framework-agnostic`);
      } else {
        pass(`${relPath} is framework-agnostic (no React imports)`);
      }
    }
  }
}

// ─── Check 4: Page Component Patterns ─────────────────────

function checkPagePatterns() {
  section('4. Page Component Patterns');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const pagesDir = join(MODULES_DIR, mod, 'pages');
    if (!existsSync(pagesDir)) continue;

    const pageFiles = walkFiles(pagesDir);

    for (const file of pageFiles) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      if (content.includes('export function Component')) {
        pass(`${relPath} exports named Component (lazy-loading compatible)`);
      } else if (content.includes('export default')) {
        warn(`${relPath} uses default export — prefer named "export function Component"`);
      } else {
        fail(`${relPath} missing Component export — won't work with lazy()`);
      }
    }
  }
}

// ─── Check 5: Route Lazy Loading ──────────────────────────

function checkLazyLoading() {
  section('5. Route Lazy Loading (MFE Readiness)');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const routesFile = join(MODULES_DIR, mod, 'routes.ts');
    const content = readText(routesFile);
    if (!content) continue;

    const hasStaticComponent = content.match(/\bComponent\s*:/);
    const hasStaticElement = content.match(/\belement\s*:/);

    if (hasStaticComponent || hasStaticElement) {
      fail(`${mod}/routes.ts has static Component/element imports — use lazy() for code-splitting`);
    } else if (content.includes('lazy:') || content.includes('lazy :')) {
      pass(`${mod}/routes.ts uses lazy loading for all routes`);
    } else {
      warn(`${mod}/routes.ts — could not confirm lazy loading pattern`);
    }
  }
}

// ─── Check 6: Module Registration ─────────────────────────

function checkRegistration() {
  section('6. Module Registration Completeness');

  const registryContent = readText(join(MODULES_DIR, 'registry.ts'));
  const mainContent = readText(join(ROOT, 'root', 'main.tsx'));
  const viteContent = readText(join(ROOT, 'vite.config.ts'));

  const modules = getModuleDirs();

  for (const mod of modules) {
    // Check registry.ts
    if (registryContent && registryContent.includes(`'./${mod}/index.ts'`)) {
      pass(`${mod} registered in modules/registry.ts`);
    } else if (registryContent && registryContent.includes(`'./${mod}'`)) {
      pass(`${mod} registered in modules/registry.ts`);
    } else {
      fail(`${mod} NOT registered in modules/registry.ts`);
    }

    // Check vitest project config
    if (viteContent && viteContent.includes(`modules/${mod}/vitest.config.ts`)) {
      pass(`${mod} test project registered in vite.config.ts`);
    } else {
      warn(`${mod} test project NOT in vite.config.ts — run "npm run test:${mod}" won't work`);
    }

    // Check mock registration (only for modules that have mocks)
    const mockDir = join(MODULES_DIR, mod, 'services', '__mocks__');
    if (existsSync(mockDir)) {
      const mockFiles = readdirSync(mockDir).filter((f) => f.endsWith('.ts'));
      if (mockFiles.length > 0) {
        if (mainContent && mainContent.includes(`@modules/${mod}/`)) {
          pass(`${mod} mock handlers registered in main.tsx`);
        } else {
          fail(`${mod} has mock files but is NOT registered in root/main.tsx`);
        }
      }
    }
  }
}

// ─── Check 7: Singleton Patterns (MFE Readiness) ─────────

function checkSingletons() {
  section('7. Singleton Patterns (MFE Readiness)');

  const sharedFiles = walkFiles(SHARED_DIR);

  const globalThisFiles = [];
  const windowFiles = [];

  for (const file of sharedFiles) {
    const content = readText(file);
    if (!content) continue;
    const relPath = relative(ROOT, file);

    if (content.includes('globalThis')) {
      globalThisFiles.push(relPath);
    }

    const windowStatePattern = content.match(/window\.\w+\s*=/);
    if (windowStatePattern) {
      windowFiles.push(relPath);
    }
  }

  if (globalThisFiles.length > 0) {
    pass(`globalThis singletons found in: ${globalThisFiles.join(', ')}`);
  }

  if (windowFiles.length > 0) {
    fail(`window.* state assignment found in: ${windowFiles.join(', ')} — use globalThis for MFE compat`);
  } else {
    pass('No window.* mutable state found (MFE-safe)');
  }

  // Check that shared services don't use React
  const sharedServiceFiles = walkFiles(SHARED_DIR).filter(
    (f) => f.endsWith('.service.ts') || f.endsWith('.service.tsx'),
  );

  for (const file of sharedServiceFiles) {
    const content = readText(file);
    if (!content) continue;
    const relPath = relative(ROOT, file);

    if (content.includes('from \'react\'') || content.includes('from "react"')) {
      fail(`${relPath} imports React — shared services must be framework-agnostic`);
    } else {
      pass(`${relPath} is framework-agnostic`);
    }
  }
}

// ─── Check 8: Type Isolation ──────────────────────────────

function checkTypeIsolation() {
  section('8. Type Isolation');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const modDir = join(MODULES_DIR, mod);
    const files = walkFiles(modDir);

    for (const file of files) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      // Check for type imports from other modules' types.ts
      const typeImports = content.split('\n').filter((line) => {
        return line.includes('import') && line.includes('type') && line.includes('@modules/');
      });

      for (const line of typeImports) {
        const match = line.match(/@modules\/([^/']+)/);
        if (match && match[1] !== mod && match[1] !== 'registry') {
          fail(`${relPath} imports types from @modules/${match[1]} — types should not leak across modules`);
        }
      }
    }
  }

  pass('Type isolation check completed');
}

// ─── Check 9: Direct DOM / Global State Access ────────────

function checkDomAccess() {
  section('9. Direct DOM / Global State Access');

  const modules = getModuleDirs();

  for (const mod of modules) {
    const files = walkFiles(join(MODULES_DIR, mod));

    for (const file of files) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      if (content.includes('document.getElementById') || content.includes('document.querySelector')) {
        warn(`${relPath} uses direct DOM access — prefer React refs for MFE isolation`);
      }

      if (content.match(/localStorage\.|sessionStorage\./)) {
        warn(`${relPath} accesses browser storage directly — consider abstracting via @shared/`);
      }
    }
  }

  pass('DOM/global state access check completed');
}

// ─── Check 10: Import Extension Consistency ───────────────

function checkImportExtensions() {
  section('10. Import Extension Consistency');

  const modules = getModuleDirs();
  let missingExtCount = 0;

  for (const mod of modules) {
    const files = walkFiles(join(MODULES_DIR, mod));

    for (const file of files) {
      const content = readText(file);
      if (!content) continue;
      const relPath = relative(ROOT, file);

      const localImports = content.split('\n').filter(
        (line) => line.match(/^\s*import\s/) && (line.includes('./') || line.includes('../')),
      );

      for (const line of localImports) {
        const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/);
        if (fromMatch) {
          const specifier = fromMatch[1];
          if (specifier.startsWith('.') && !specifier.match(/\.(ts|tsx|js|jsx|css|json)$/)) {
            missingExtCount++;
            if (missingExtCount <= 5) {
              warn(`${relPath} — missing file extension: ${specifier}`);
            }
          }
        }
      }
    }
  }

  if (missingExtCount > 5) {
    warn(`... and ${missingExtCount - 5} more missing extension imports`);
  }

  if (missingExtCount === 0) {
    pass('All local imports include file extensions');
  }
}

// ─── Run All Checks ───────────────────────────────────────

console.log('\n🔍 Architecture Audit — React Modular Monolith');
console.log(`   ${new Date().toISOString().slice(0, 10)}`);

checkModuleStructure();
checkCrossModuleImports();
checkServicePatterns();
checkPagePatterns();
checkLazyLoading();
checkRegistration();
checkSingletons();
checkTypeIsolation();
checkDomAccess();
checkImportExtensions();

// ─── Summary ──────────────────────────────────────────────

section('SUMMARY');
console.log(`  ✅ Passed:   ${totalPass}`);
console.log(`  ⚠️  Warnings: ${totalWarn}`);
console.log(`  ❌ Failed:   ${totalFail}`);
console.log();

if (totalFail > 0) {
  console.log('  🚫 Audit FAILED — fix the issues above before merging.\n');
  process.exit(1);
} else if (totalWarn > 0 && STRICT) {
  console.log('  🚫 Audit FAILED (strict mode) — warnings treated as errors.\n');
  process.exit(1);
} else if (totalWarn > 0) {
  console.log('  ⚡ Audit PASSED with warnings — review recommended.\n');
  console.log('  💡 Run with --strict to treat warnings as errors.\n');
  process.exit(0);
} else {
  console.log('  🎉 Audit PASSED — architecture is clean.\n');
  process.exit(0);
}
