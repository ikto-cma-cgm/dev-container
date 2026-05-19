import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load rules from config ──────────────────────────────────────────────────

const rulesConfigPath = join(__dirname, 'lint-rules.yaml');
if (!existsSync(rulesConfigPath)) {
  console.error(`Rules config not found: ${rulesConfigPath}`);
  process.exit(1);
}
const config = yaml.load(readFileSync(rulesConfigPath, 'utf8'));

const VALID_TYPES = config.identity.validTypes;
const CATEGORY_TAGS = config.identity.categoryTags;
const FORBIDDEN_TAGS = config.identity.forbiddenTags;
const NAME_SUFFIX = config.identity.nameSuffix;
const MAX_DESC_LENGTH = config.identity.maxDescriptionLength;
const REQUIRED_PARAMS = config.parameters.requiredParams;
const OWNER_FIELD = config.parameters.ownerField;
const SKIP_PARAM_TYPES = config.parameters.skipParamRulesForTypes;
const REQUIRED_SKELETON_FILES = config.skeleton.requiredFiles;
const REQUIRED_ANNOTATIONS = config.skeleton.requiredAnnotations;
const EXPECTED_LIFECYCLE = config.skeleton.lifecycle;
const ALLOWED_EXPR_PREFIXES = config.skeleton.allowedExpressionPrefixes;
const SKELETON_DIR_PATTERNS = config.skeleton.directoryPatterns || ['skeleton'];

const KEBAB_CASE = /^[a-z][a-z0-9-]*[a-z0-9]$/;
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u;
const VERB_OBJECT = /^[a-z]+-[a-z]+(-[a-z]+)*$/;

// ─── Colors ──────────────────────────────────────────────────────────────────

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findProperty(parameters, propName) {
  if (!Array.isArray(parameters)) return null;
  for (const step of parameters) {
    if (step.properties && step.properties[propName]) {
      return step.properties[propName];
    }
  }
  return null;
}

function getAllProperties(parameters) {
  if (!Array.isArray(parameters)) return {};
  const all = {};
  for (const step of parameters) {
    if (step.properties) {
      Object.assign(all, step.properties);
    }
  }
  return all;
}

// ─── Skeleton directory discovery ────────────────────────────────────────────

// Simple glob matcher: '*' as wildcard, anchored to full name.
// Examples: matchesPattern('skeleton', 'skeleton') = true
//           matchesPattern('skeleton-app', 'skeleton-*') = true
//           matchesPattern('foo', 'skeleton-*') = false
function matchesPattern(name, pattern) {
  if (!pattern.includes('*')) return name === pattern;
  const regexSrc = '^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$';
  return new RegExp(regexSrc).test(name);
}

// Return all immediate subdirectories of templateDir that match any of the
// configured skeleton directory patterns (e.g., 'skeleton', 'skeleton-*').
// Returns an array of { name, path }.
function findSkeletonDirs(templateDir) {
  if (!existsSync(templateDir)) return [];
  const found = [];
  for (const entry of readdirSync(templateDir)) {
    const fullPath = join(templateDir, entry);
    let isDir;
    try { isDir = statSync(fullPath).isDirectory(); } catch { continue; }
    if (!isDir) continue;
    if (SKELETON_DIR_PATTERNS.some(p => matchesPattern(entry, p))) {
      found.push({ name: entry, path: fullPath });
    }
  }
  return found;
}

// ─── Rules ───────────────────────────────────────────────────────────────────

function r01_name(data) {
  const name = data?.metadata?.name;
  if (!name) return { status: 'FAIL', detail: 'metadata.name is missing' };
  if (!name.endsWith(NAME_SUFFIX)) return { status: 'FAIL', detail: `"${name}" does not end with ${NAME_SUFFIX}` };
  if (!KEBAB_CASE.test(name)) return { status: 'FAIL', detail: `"${name}" is not kebab-case` };
  return { status: 'PASS' };
}

function r02_title(data) {
  const title = data?.metadata?.title;
  if (!title) return { status: 'FAIL', detail: 'metadata.title is missing' };
  if (EMOJI_REGEX.test(title)) return { status: 'FAIL', detail: `"${title}" contains emojis` };
  return { status: 'PASS' };
}

function r03_description(data) {
  const desc = data?.metadata?.description;
  if (!desc) return { status: 'FAIL', detail: 'metadata.description is missing' };
  if (desc.length > MAX_DESC_LENGTH) return { status: 'FAIL', detail: `description is ${desc.length} chars (max ${MAX_DESC_LENGTH})` };
  return { status: 'PASS' };
}

function r04_owner(data) {
  const owner = data?.spec?.owner;
  if (!owner) return { status: 'FAIL', detail: 'spec.owner is missing' };
  return { status: 'PASS' };
}

function r05_type(data) {
  const type = data?.spec?.type;
  if (!type) return { status: 'FAIL', detail: 'spec.type is missing' };
  if (!VALID_TYPES.includes(type)) return { status: 'FAIL', detail: `"${type}" is not a valid type. Allowed: ${VALID_TYPES.join(', ')}` };
  return { status: 'PASS' };
}

function r06_category_tag(data) {
  const tags = data?.metadata?.tags || [];
  const hasCategory = tags.some(t => CATEGORY_TAGS.includes(t));
  if (!hasCategory) return { status: 'FAIL', detail: `no category tag found. Add one of: ${CATEGORY_TAGS.join(', ')}` };
  return { status: 'PASS' };
}

function r07_forbidden_tags(data) {
  const tags = data?.metadata?.tags || [];
  const found = tags.filter(t => FORBIDDEN_TAGS.includes(t));
  if (found.length > 0) return { status: 'FAIL', detail: `forbidden tags: ${found.join(', ')}` };
  return { status: 'PASS' };
}

function shouldSkipParamRules(data) {
  return SKIP_PARAM_TYPES.includes(data?.spec?.type);
}

function r08_name_param(data) {
  if (shouldSkipParamRules(data)) return { status: 'SKIP', detail: 'action templates may use different parameter names' };
  const prop = findProperty(data?.spec?.parameters, 'name');
  if (!prop) return { status: 'FAIL', detail: '"name" parameter not found' };
  if (!prop.pattern) return { status: 'FAIL', detail: '"name" parameter has no pattern validation' };
  return { status: 'PASS' };
}

function r09_description_param(data) {
  if (shouldSkipParamRules(data)) return { status: 'SKIP', detail: 'action templates may use different parameter names' };
  const prop = findProperty(data?.spec?.parameters, 'description');
  if (!prop) return { status: 'FAIL', detail: '"description" parameter not found' };
  return { status: 'PASS' };
}

function r10_owner_param(data) {
  if (shouldSkipParamRules(data)) return { status: 'SKIP', detail: 'action templates may not require an owner' };
  const prop = findProperty(data?.spec?.parameters, 'owner');
  if (!prop) return { status: 'FAIL', detail: '"owner" parameter not found' };
  if (prop['ui:field'] !== OWNER_FIELD) return { status: 'FAIL', detail: `"owner" parameter should use ${OWNER_FIELD}` };
  return { status: 'PASS' };
}

function r11_ui_help(data) {
  const allProps = getAllProperties(data?.spec?.parameters);
  if (Object.keys(allProps).length === 0) return { status: 'SKIP', detail: 'no parameters found' };
  const missing = [];
  for (const [name, prop] of Object.entries(allProps)) {
    if (!prop['ui:help']) missing.push(name);
  }
  if (missing.length > 0) return { status: 'FAIL', detail: `missing ui:help on: ${missing.join(', ')}` };
  return { status: 'PASS' };
}

function r12_skeleton_catalog(dir) {
  const skeletons = findSkeletonDirs(dir);
  if (skeletons.length === 0) return { status: 'SKIP', detail: 'no skeleton/ or skeleton-*/ directory (may be intentional for action templates)' };
  const file = REQUIRED_SKELETON_FILES[0];
  const missing = skeletons.filter(s => !existsSync(join(s.path, file))).map(s => s.name);
  if (missing.length > 0) return { status: 'FAIL', detail: `missing ${file} in: ${missing.join(', ')}` };
  return { status: 'PASS', detail: `checked: ${skeletons.map(s => s.name).join(', ')}` };
}

function r13_techdocs_annotation(dir) {
  const skeletons = findSkeletonDirs(dir);
  if (skeletons.length === 0) return { status: 'SKIP', detail: 'no skeleton/ or skeleton-*/ directory' };
  const withCatalog = skeletons.filter(s => existsSync(join(s.path, 'catalog-info.yaml')));
  if (withCatalog.length === 0) return { status: 'SKIP', detail: 'no catalog-info.yaml in any skeleton dir' };
  const issues = [];
  for (const s of withCatalog) {
    const content = readFileSync(join(s.path, 'catalog-info.yaml'), 'utf8');
    const missing = REQUIRED_ANNOTATIONS.filter(a => !content.includes(a));
    if (missing.length > 0) issues.push(`${s.name}: missing ${missing.join(', ')}`);
  }
  if (issues.length > 0) return { status: 'FAIL', detail: issues.join('; ') };
  return { status: 'PASS' };
}

function r14_lifecycle(dir) {
  const skeletons = findSkeletonDirs(dir);
  if (skeletons.length === 0) return { status: 'SKIP', detail: 'no skeleton/ or skeleton-*/ directory' };
  const withCatalog = skeletons.filter(s => existsSync(join(s.path, 'catalog-info.yaml')));
  if (withCatalog.length === 0) return { status: 'SKIP', detail: 'no catalog-info.yaml in any skeleton dir' };
  const expected = EXPECTED_LIFECYCLE;
  const issues = [];
  for (const s of withCatalog) {
    const content = readFileSync(join(s.path, 'catalog-info.yaml'), 'utf8');
    // Multi-doc YAML support: catch every "lifecycle: X" occurrence
    // (composite Option C may have Component + Resource in one file).
    const matches = [...content.matchAll(/lifecycle:\s*(\S+)/g)];
    if (matches.length === 0) {
      issues.push(`${s.name}: lifecycle not set (expected "${expected}")`);
      continue;
    }
    for (const m of matches) {
      if (m[1] !== expected) issues.push(`${s.name}: lifecycle "${m[1]}", expected "${expected}"`);
    }
  }
  if (issues.length > 0) return { status: 'FAIL', detail: issues.join('; ') };
  return { status: 'PASS' };
}

function r15_skeleton_readme(dir) {
  const skeletons = findSkeletonDirs(dir);
  if (skeletons.length === 0) return { status: 'SKIP', detail: 'no skeleton/ or skeleton-*/ directory (may be intentional for action templates)' };
  const file = REQUIRED_SKELETON_FILES[1];
  const missing = skeletons.filter(s => !existsSync(join(s.path, file))).map(s => s.name);
  if (missing.length > 0) return { status: 'FAIL', detail: `missing ${file} in: ${missing.join(', ')}` };
  return { status: 'PASS' };
}

function r16_no_leftover_syntax(dir) {
  const skeletons = findSkeletonDirs(dir);
  if (skeletons.length === 0) return { status: 'SKIP', detail: 'no skeleton/ or skeleton-*/ directory' };

  const issues = [];
  function scanDir(d) {
    for (const entry of readdirSync(d)) {
      const fullPath = join(d, entry);
      if (statSync(fullPath).isDirectory()) { scanDir(fullPath); continue; }
      const content = readFileSync(fullPath, 'utf8');
      const allExprs = content.match(/\$\{\{[^}]*\}\}/g) || [];
      const badExprs = allExprs.filter(expr => {
        const inner = expr.replace(/^\$\{\{\s*/, '').replace(/\s*\}\}$/, '');
        return !ALLOWED_EXPR_PREFIXES.some(prefix => inner.startsWith(prefix));
      });
      if (badExprs.length > 0) {
        issues.push(`${relative(dir, fullPath)}: ${badExprs.join(', ')}`);
      }
    }
  }
  for (const s of skeletons) scanDir(s.path);

  if (issues.length > 0) return { status: 'FAIL', detail: `suspicious expressions: ${issues.join('; ')}` };
  return { status: 'PASS' };
}

function r17_step_ids(data) {
  const steps = data?.spec?.steps || [];
  const bad = [];
  for (const step of steps) {
    if (!step.id) { bad.push('(missing id)'); continue; }
    if (!VERB_OBJECT.test(step.id)) bad.push(step.id);
  }
  if (bad.length > 0) return { status: 'FAIL', detail: `step IDs not in verb-object pattern: ${bad.join(', ')}` };
  return { status: 'PASS' };
}

function r18_output_links(data) {
  const links = data?.spec?.output?.links;
  if (!links || links.length === 0) return { status: 'FAIL', detail: 'output has no links' };
  return { status: 'PASS' };
}

function r19_output_text(data) {
  const text = data?.spec?.output?.text;
  if (!text || text.length === 0) return { status: 'FAIL', detail: 'output has no text blocks' };
  return { status: 'PASS' };
}

// ─── Rule registry ───────────────────────────────────────────────────────────

const RULES = [
  { id: 'R01', name: 'metadata.name pattern', fn: (d, _dir) => r01_name(d), category: 'Identity' },
  { id: 'R02', name: 'metadata.title (no emoji)', fn: (d, _dir) => r02_title(d), category: 'Identity' },
  { id: 'R03', name: 'metadata.description (max 200)', fn: (d, _dir) => r03_description(d), category: 'Identity' },
  { id: 'R04', name: 'spec.owner is set', fn: (d, _dir) => r04_owner(d), category: 'Identity' },
  { id: 'R05', name: 'spec.type is valid', fn: (d, _dir) => r05_type(d), category: 'Identity' },
  { id: 'R06', name: 'has category tag', fn: (d, _dir) => r06_category_tag(d), category: 'Identity' },
  { id: 'R07', name: 'no forbidden tags', fn: (d, _dir) => r07_forbidden_tags(d), category: 'Identity' },
  { id: 'R08', name: 'name param with pattern', fn: (d, _dir) => r08_name_param(d), category: 'Parameters' },
  { id: 'R09', name: 'description param exists', fn: (d, _dir) => r09_description_param(d), category: 'Parameters' },
  { id: 'R10', name: 'owner param with EntityPicker', fn: (d, _dir) => r10_owner_param(d), category: 'Parameters' },
  { id: 'R11', name: 'all fields have ui:help', fn: (d, _dir) => r11_ui_help(d), category: 'Parameters' },
  { id: 'R12', name: 'skeleton/catalog-info.yaml exists', fn: (_d, dir) => r12_skeleton_catalog(dir), category: 'Skeleton' },
  { id: 'R13', name: 'techdocs-ref annotation', fn: (_d, dir) => r13_techdocs_annotation(dir), category: 'Skeleton' },
  { id: 'R14', name: 'lifecycle is experimental', fn: (_d, dir) => r14_lifecycle(dir), category: 'Skeleton' },
  { id: 'R15', name: 'skeleton/README.md exists', fn: (_d, dir) => r15_skeleton_readme(dir), category: 'Skeleton' },
  { id: 'R16', name: 'no leftover syntax errors', fn: (_d, dir) => r16_no_leftover_syntax(dir), category: 'Skeleton' },
  { id: 'R17', name: 'step IDs verb-object pattern', fn: (d, _dir) => r17_step_ids(d), category: 'Steps' },
  { id: 'R18', name: 'output has links', fn: (d, _dir) => r18_output_links(d), category: 'Steps' },
  { id: 'R19', name: 'output has text', fn: (d, _dir) => r19_output_text(d), category: 'Steps' },
];

// ─── Discovery ───────────────────────────────────────────────────────────────

function findAllTemplateDirs(root) {
  const dirs = [];
  const templatesRoot = join(root, 'templates');
  if (!existsSync(templatesRoot)) return dirs;

  for (const category of readdirSync(templatesRoot)) {
    const categoryPath = join(templatesRoot, category);
    if (!statSync(categoryPath).isDirectory()) continue;

    for (const template of readdirSync(categoryPath)) {
      const templatePath = join(categoryPath, template);
      if (!statSync(templatePath).isDirectory()) continue;
      if (existsSync(join(templatePath, 'template.yaml'))) {
        dirs.push(templatePath);
      }
    }
  }
  return dirs;
}

// ─── Runner ──────────────────────────────────────────────────────────────────

function lintTemplate(dir) {
  const templatePath = join(dir, 'template.yaml');
  let data;
  try {
    data = yaml.load(readFileSync(templatePath, 'utf8'));
  } catch (e) {
    return [{ id: 'PARSE', name: 'YAML parsing', status: 'FAIL', detail: e.message, category: 'Parse' }];
  }

  return RULES.map(rule => {
    try {
      const result = rule.fn(data, dir);
      return { ...rule, ...result };
    } catch (e) {
      return { ...rule, status: 'FAIL', detail: `rule error: ${e.message}` };
    }
  });
}

// ─── Output ──────────────────────────────────────────────────────────────────

function printResults(templateDir, results, root) {
  const name = relative(root, templateDir);
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;
  const total = results.length;

  const statusIcon = failed > 0 ? red('✗') : green('✓');
  console.log(`\n${statusIcon} ${bold(name)} — ${passed}/${total} passed${skipped > 0 ? `, ${skipped} skipped` : ''}`);

  let currentCategory = '';
  for (const r of results) {
    if (r.category !== currentCategory) {
      currentCategory = r.category;
      console.log(`  ${dim(currentCategory)}`);
    }

    const icon = r.status === 'PASS' ? green('✓') : r.status === 'FAIL' ? red('✗') : yellow('○');
    const detail = r.detail ? dim(` — ${r.detail}`) : '';
    console.log(`    ${icon} ${r.id} ${r.name}${detail}`);
  }

  return failed === 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const root = process.cwd();
const target = process.argv[2];

let dirs;
if (target) {
  const resolved = join(root, target);
  if (!existsSync(join(resolved, 'template.yaml'))) {
    console.error(red(`No template.yaml found in ${target}`));
    process.exit(1);
  }
  dirs = [resolved];
} else {
  dirs = findAllTemplateDirs(root);
}

if (dirs.length === 0) {
  console.error(red('No templates found. Pass a path: ./scripts/lint.sh example-template/'));
  process.exit(1);
}

console.log(bold(`\nLinting ${dirs.length} template(s) against Service Standards\n`));

let allPassed = true;
for (const dir of dirs) {
  const results = lintTemplate(dir);
  const passed = printResults(dir, results, root);
  if (!passed) allPassed = false;
}

const summary = allPassed ? green('\n✓ All templates passed.') : red('\n✗ Some templates have issues.');
console.log(`\n${summary}\n`);

process.exit(allPassed ? 0 : 1);
