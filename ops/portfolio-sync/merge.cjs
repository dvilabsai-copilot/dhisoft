const { isDeepStrictEqual: equal } = require('node:util');

function indexProjects(projects) {
  if (!Array.isArray(projects)) throw new Error('Portfolio projects must be an array.');
  const byKey = new Map();
  const slugs = new Set();
  for (const project of projects) {
    if (typeof project?.key !== 'string' || !project.key || typeof project.slug !== 'string' || !project.slug) {
      throw new Error('Every portfolio project needs a key and slug.');
    }
    if (byKey.has(project.key) || slugs.has(project.slug)) {
      throw new Error('Duplicate portfolio project key or slug: ' + project.key);
    }
    byKey.set(project.key, project);
    slugs.add(project.slug);
  }
  return byKey;
}

function mergeFields(base, incoming, current, conflict) {
  const result = new Map(Object.entries(current));
  for (const field of new Set([...Object.keys(base), ...Object.keys(incoming)])) {
    if (equal(base[field], incoming[field])) continue;
    const value = result.get(field);
    if (equal(value, incoming[field])) continue;
    if (!equal(value, base[field])) {
      conflict(field);
    } else if (Object.hasOwn(incoming, field)) {
      result.set(field, incoming[field]);
    } else {
      result.delete(field);
    }
  }
  return Object.fromEntries(result);
}

function mergePortfolio(base, incoming, current) {
  const before = indexProjects(base.projects);
  const next = indexProjects(incoming.projects);
  const projects = indexProjects(current.projects);
  const conflicts = [];
  const { projects: _base, ...baseSection } = base;
  const { projects: _next, ...nextSection } = incoming;
  const { projects: _current, ...currentSection } = current;
  const section = mergeFields(baseSection, nextSection, currentSection,
    field => conflicts.push({ field, reason: 'CMS edit' }));

  for (const [key, oldProject] of before) {
    if (next.has(key) || !projects.has(key)) continue;
    if (equal(projects.get(key), oldProject)) projects.delete(key);
    else conflicts.push({ key, reason: 'CMS edit prevents removal' });
  }

  const slugOwners = new Map(Array.from(projects.values(), project => [project.slug, project.key]));
  for (const [key, incomingProject] of next) {
    const old = before.get(key);
    const saved = projects.get(key);
    if (equal(old, incomingProject)) continue;
    if (old && !saved) {
      conflicts.push({ key, reason: 'Project removed in CMS' });
      continue;
    }
    if (!old && saved) {
      if (!equal(saved, incomingProject)) conflicts.push({ key, reason: 'Project already exists in CMS' });
      continue;
    }
    const merged = saved
      ? mergeFields(old, incomingProject, saved, field => conflicts.push({ key, field, reason: 'CMS edit' }))
      : incomingProject;
    const owner = slugOwners.get(merged.slug);
    if (owner && owner !== key) {
      conflicts.push({ key, field: 'slug', reason: 'Slug already used in CMS' });
      if (!saved) continue;
      merged.slug = saved.slug;
    }
    if (saved && saved.slug !== merged.slug) slugOwners.delete(saved.slug);
    slugOwners.set(merged.slug, key);
    projects.set(key, merged);
  }

  const portfolio = { ...section, projects: [...projects.values()] };
  if (!portfolio.projects.length || portfolio.projects.length > 24) {
    throw new Error('The merged CMS portfolio must contain 1–24 projects.');
  }
  return { portfolio: equal(portfolio, current) ? current : portfolio, conflicts };
}

module.exports = { mergePortfolio };
