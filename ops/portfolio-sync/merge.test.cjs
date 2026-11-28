const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mergePortfolio } = require('./merge.cjs');

const project = (key, fields = {}) => ({ key, slug: key, title: key, isActive: true, ...fields });
const portfolio = (projects, fields = {}) => ({ heading: 'Work', projects, ...fields });

test('adds a new project to the CMS once and keeps CMS-only projects', () => {
  const before = portfolio([project('existing')]);
  const next = portfolio([project('existing'), project('new')]);
  const saved = portfolio([project('existing'), project('editor')]);
  const first = mergePortfolio(before, next, saved);
  assert.deepEqual(first.portfolio.projects.map(({ key }) => key), ['existing', 'editor', 'new']);
  assert.deepEqual(first.conflicts, []);
  assert.equal(mergePortfolio(before, next, first.portfolio).portfolio, first.portfolio);
});

test('updates untouched fields while retaining published and pending draft edits', () => {
  const before = portfolio([project('existing', { videoUrl: '/old.mp4' })]);
  const next = portfolio([project('existing', { title: 'Git title', videoUrl: '/new.mp4' })], { heading: 'Git heading' });
  const published = portfolio([project('existing', { title: 'CMS title', videoUrl: '/old.mp4' })]);
  const draft = portfolio(published.projects.map(item => ({ ...item, isActive: false })), { heading: 'Draft heading' });
  const publishedResult = mergePortfolio(before, next, published);
  const draftResult = mergePortfolio(before, next, draft);
  assert.equal(publishedResult.portfolio.heading, 'Git heading');
  assert.equal(draftResult.portfolio.heading, 'Draft heading');
  assert.equal(publishedResult.portfolio.projects[0].title, 'CMS title');
  assert.equal(publishedResult.portfolio.projects[0].isActive, true);
  assert.equal(draftResult.portfolio.projects[0].isActive, false);
  assert.equal(draftResult.portfolio.projects[0].videoUrl, '/new.mp4');
  assert.deepEqual(publishedResult.conflicts.map(({ field }) => field), ['title']);
});

test('preserves projects intentionally removed or edited in the CMS', () => {
  const before = portfolio([project('retained'), project('untouched'), project('edited'), project('removed-in-cms')]);
  const next = portfolio([project('retained'), project('removed-in-cms', { title: 'New Git title' })]);
  const saved = portfolio([project('retained'), project('untouched'), project('edited', { title: 'CMS edit' })]);
  const result = mergePortfolio(before, next, saved);
  assert.deepEqual(result.portfolio.projects.map(({ key }) => key), ['retained', 'edited']);
  assert.deepEqual(result.conflicts.map(({ key }) => key), ['edited', 'removed-in-cms']);
});

test('keeps an existing CMS project with a conflicting key or slug', () => {
  const before = portfolio([project('base')]);
  const next = portfolio([project('base'), project('collision'), project('new', { slug: 'same-slug' })]);
  const saved = portfolio([
    project('base'), project('collision', { title: 'CMS edit' }), project('editor', { slug: 'same-slug' }),
  ]);
  const result = mergePortfolio(before, next, saved);
  assert.equal(result.portfolio, saved);
  assert.equal(result.conflicts.length, 2);
});

test('protects a CMS slug while applying other safe fields', () => {
  const before = portfolio([project('existing')]);
  const next = portfolio([project('existing', { slug: 'target', title: 'Git title' })]);
  const saved = portfolio([project('existing'), project('editor', { slug: 'target' })]);
  const result = mergePortfolio(before, next, saved);
  assert.deepEqual(result.portfolio.projects[0], project('existing', { title: 'Git title' }));
  assert.equal(result.conflicts[0].field, 'slug');
});

test('unchanged Git content preserves a deliberate CMS deletion', () => {
  const before = portfolio([project('one'), project('deleted')]);
  const saved = portfolio([project('one')]);
  assert.equal(mergePortfolio(before, before, saved).portfolio, saved);
});
