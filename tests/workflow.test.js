import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const workflow = await readFile(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');

test('Pages deployment runs the site checks before uploading', () => {
  const checkIndex = workflow.indexOf('npm run check');
  const uploadIndex = workflow.indexOf('actions/upload-pages-artifact');
  assert.ok(checkIndex >= 0, 'workflow does not run npm run check');
  assert.ok(uploadIndex > checkIndex, 'site is uploaded before checks run');
});

test('Pages deployment requires a configured analytics website id', () => {
  assert.match(workflow, /REQUIRE_ANALYTICS_ID:\s*['"]?1['"]?/);
});
