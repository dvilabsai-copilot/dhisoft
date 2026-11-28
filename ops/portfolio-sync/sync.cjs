// This copy is installed by the operator and runs under the CMS service account.
// Git releases supply JSON only, never executable code to this process.
const assert = require('node:assert/strict');
const { isDeepStrictEqual: equal } = require('node:util');
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { createRequire } = require('node:module');
const { mergePortfolio } = require('./merge.cjs');

const cms = '/srv/dhisoft-live/ci/current/cms';
const backupDir = '/srv/dhisoft-live/cms/portfolio-sync-backups';
const fromCms = createRequire(join(cms, 'package.json'));
fromCms('reflect-metadata');
const { PrismaClient } = fromCms('./dist/src/generated/prisma/client.js');
const { parseMariaDbUrl } = fromCms('./dist/src/prisma/database-url.js');
const { PrismaMariaDb } = fromCms('@prisma/adapter-mariadb');
const { PortfolioProjectDto, PortfolioSectionDto } = fromCms('./dist/src/modules/cms/dto/home-content.dto.js');
const { plainToInstance } = fromCms('class-transformer');
const { validateSync } = fromCms('class-validator');

function assertValidChanges(Dto, prior, updated, ignoredFields = []) {
  const errors = validateSync(plainToInstance(Dto, updated), { whitelist: true, forbidNonWhitelisted: true });
  const videoChanged = prior && ['videoSource', 'videoUrl'].some(field => !equal(prior[field], updated[field]));
  const invalid = errors.filter(({ property }) => !ignoredFields.includes(property) &&
    (!prior || !equal(prior[property], updated[property]) || (property === 'videoSource' && videoChanged)));
  assert(invalid.length === 0, 'CMS portfolio validation failed for: ' + invalid.map(error => error.property).join(', '));
}

function validatePortfolio(prior, updated) {
  assertValidChanges(PortfolioSectionDto, prior, updated, ['projects']);
  const saved = new Map(prior.projects.map(project => [project.key, project]));
  for (const project of updated.projects) {
    const previous = saved.get(project.key);
    if (!equal(previous, project)) assertValidChanges(PortfolioProjectDto, previous, project);
  }
}

async function synchronize({ previous, incoming, revision }, rehearse) {
  assert(/^[a-f0-9]{40}$/.test(revision), 'Expected a Git deployment revision.');
  const adapter = new PrismaMariaDb(parseMariaDbUrl(process.env.DATABASE_URL, 2));
  const prisma = new PrismaClient({ adapter });
  const rollback = new Error('Rollback the rehearsal.');
  let before;
  let report;
  try {
    try {
      await prisma.$transaction(async tx => {
        const page = await tx.cmsPage.findUniqueOrThrow({ where: { key: 'home' } });
        assert(page.publishedContent?.portfolio && page.draftContent?.portfolio, 'The CMS homepage must already have a draft and published portfolio.');
        before = page;
        const published = mergePortfolio(previous, incoming, page.publishedContent.portfolio);
        const draft = mergePortfolio(previous, incoming, page.draftContent.portfolio);
        const publish = published.portfolio !== page.publishedContent.portfolio;
        const saveDraft = draft.portfolio !== page.draftContent.portfolio;
        report = { revision, publish, saveDraft, preserved: { published: published.conflicts, draft: draft.conflicts } };
        if (!publish && !saveDraft) return;

        if (publish) validatePortfolio(page.publishedContent.portfolio, published.portfolio);
        if (saveDraft) validatePortfolio(page.draftContent.portfolio, draft.portfolio);
        const publishedContent = { ...page.publishedContent, portfolio: published.portfolio };
        const draftContent = { ...page.draftContent, portfolio: draft.portfolio };
        const version = Math.max(page.publishedVersion, page.draftVersion) + 1;
        const publishedVersion = publish ? version : page.publishedVersion;
        const draftVersion = publish && !equal(draftContent, publishedContent) ? version + 1 : version;
        const note = 'Portfolio sync from deployment ' + revision;
        if (!rehearse) {
          const backup = join(backupDir, 'home-' + version + '-' + Date.now() + '.json');
          writeFileSync(backup, JSON.stringify(page, null, 2), { flag: 'wx', mode: 0o600 });
        }
        const result = await tx.cmsPage.updateMany({
          where: { id: page.id, draftVersion: page.draftVersion, publishedVersion: page.publishedVersion },
          data: {
            draftContent, draftVersion,
            ...(publish ? { publishedContent, publishedVersion, publishedAt: new Date() } : {}),
          },
        });
        assert.equal(result.count, 1, 'The CMS changed during deployment. Retry against the latest version.');
        if (publish) {
          await tx.cmsRevision.create({ data: { pageId: page.id, version: publishedVersion, action: 'PUBLISHED', content: publishedContent, note } });
        }
        if (!publish || draftVersion !== publishedVersion) {
          await tx.cmsRevision.create({ data: { pageId: page.id, version: draftVersion, action: 'DRAFT_SAVED', content: draftContent, note } });
        }
        await tx.auditLog.create({ data: {
          action: 'CMS_PORTFOLIO_SYNC', entityType: 'CmsPage', entityId: page.id,
          metadata: { revision, publishedVersion, draftVersion, preserved: report.preserved },
        } });
        const saved = await tx.cmsPage.findUniqueOrThrow({ where: { id: page.id } });
        assert.deepEqual(saved.publishedContent, publishedContent);
        assert.deepEqual(saved.draftContent, draftContent);
        assert.equal(saved.publishedVersion, publishedVersion);
        assert.equal(saved.draftVersion, draftVersion);
        Object.assign(report, { publishedVersion, draftVersion, projectCount: published.portfolio.projects.length });
        if (rehearse) throw rollback;
      });
    } catch (error) {
      if (error !== rollback) throw error;
      const live = await prisma.cmsPage.findUniqueOrThrow({ where: { key: 'home' } });
      assert.deepEqual(live, before, 'The rehearsal did not leave the CMS row unchanged.');
    }
    console.log('CMS portfolio ' + (rehearse ? 'rehearsal' : 'sync') + ' ' + JSON.stringify(report));
  } finally {
    await prisma.$disconnect();
  }
}

const input = JSON.parse(readFileSync(0, 'utf8'));
synchronize(input, process.argv.includes('--rehearse')).catch(error => {
  console.error('CMS portfolio sync failed: ' + error.message);
  process.exitCode = 1;
});
