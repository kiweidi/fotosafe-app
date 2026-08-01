import {readFile, readdir, access} from 'node:fs/promises';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ANALYTICS_CONFIG} from '../assets/analytics-config.js';
import {isProviderConfigured} from '../assets/privacy-analytics.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = (await readdir(root, {recursive: true})).filter((name) => name.endsWith('.html')).sort();
const failures = [];
let checkedLinks = 0;

for (const name of files) {
  const path = resolve(root, name);
  const html = await readFile(path, 'utf8');
  const htmlWithoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const ids = [...htmlWithoutComments.matchAll(/(?:^|\s)id="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${name}: duplicate ids ${[...new Set(duplicates)].join(', ')}`);

  if (/<script[^>]+src="https:\/\//i.test(html)) failures.push(`${name}: third-party script is hard-coded`);

  for (const match of htmlWithoutComments.matchAll(/<(?!base\b)[^>]*\b(?:href|src)="([^"]+)"/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|data:|#)/i.test(target)) {
      if (target.startsWith('#') && !ids.includes(target.slice(1))) failures.push(`${name}: missing fragment ${target}`);
      continue;
    }
    checkedLinks += 1;
    const [filePart, fragment] = target.split('#', 2);
    const localPath = resolve(dirname(path), filePart || name.split('/').at(-1));
    try {
      await access(localPath);
    } catch {
      failures.push(`${name}: missing local target ${target}`);
      continue;
    }
    if (fragment && localPath.endsWith('.html')) {
      const targetHtml = await readFile(localPath, 'utf8');
      if (!new RegExp(`\\bid=["']${fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(targetHtml)) {
        failures.push(`${name}: missing fragment ${target} in ${relative(root, localPath)}`);
      }
    }
  }
}

if (process.env.REQUIRE_ANALYTICS_ID === '1' && !isProviderConfigured(ANALYTICS_CONFIG)) {
  failures.push('analytics provider is not fully configured');
}

if (failures.length) {
  console.error(`Site validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site validation passed: ${files.length} HTML files, ${checkedLinks} local references.`);
if (!isProviderConfigured(ANALYTICS_CONFIG)) console.log('Analytics provider intentionally remains unconfigured until a real Umami website ID is available.');
