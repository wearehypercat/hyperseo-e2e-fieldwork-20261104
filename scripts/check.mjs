import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
const source = new URL('../content/', import.meta.url);
for (const file of (await readdir(source)).filter(file => file.endsWith('.json'))) {
  const page = JSON.parse(await readFile(new URL(file, source), 'utf8'));
  assert.equal(typeof page.title, 'string');
  assert.equal(typeof page.description, 'string');
  assert(page.sections.length >= 3);
  const html = await readFile(new URL(`../docs/${page.path}index.html`, import.meta.url), 'utf8');
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert(html.includes('Fictional business'));
  assert(html.includes('<link rel="canonical"'));
  if (page.description) assert(html.includes('<meta name="description"'));
}
console.log('Fictional-site source and generated-page checks passed.');
